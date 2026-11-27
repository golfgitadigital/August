import React, { createContext, useContext, useEffect, useState } from "react";
import { defaultSections } from "./defaultContent";

export const API_BASE = import.meta.env.VITE_API_URL || "/api";

export interface PageSeoData {
  page_key: string;
  title: string;
  description: string;
  canonical_path: string;
  og_image?: string;
  keywords?: string;
}

export interface MediaAsset {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  size: number;
  created_at: string;
}

interface CmsContextType {
  isAdminMode: boolean;
  setIsAdminMode: (active: boolean) => void;
  content: Record<string, Record<string, any>>;
  updateSectionField: (pageKey: string, sectionKey: string, fieldKey: string, value: any) => void;
  saveSection: (pageKey: string, sectionKey: string) => Promise<boolean>;
  saveAllSections: () => Promise<boolean>;
  seoList: Record<string, PageSeoData>;
  updateSeo: (pageKey: string, data: Partial<PageSeoData>) => void;
  saveSeo: (pageKey: string) => Promise<boolean>;
  assets: MediaAsset[];
  loadAssets: () => Promise<void>;
  uploadAssets: (files: FileList | File[]) => Promise<MediaAsset[]>;
  deleteAsset: (id: number) => Promise<boolean>;
  activeAssetPicker: {
    isOpen: boolean;
    onSelect: (url: string) => void;
  };
  openAssetPicker: (onSelect: (url: string) => void) => void;
  closeAssetPicker: () => void;
  hasUnsavedChanges: boolean;
}

const CmsContext = createContext<CmsContextType | null>(null);

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within a CmsProvider");
  return ctx;
}

export function CmsProvider({ children }: { children: React.ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.location.search.includes("admin=true") || localStorage.getItem("august_cms_admin") === "true";
    }
    return false;
  });

  const [content, setContent] = useState<Record<string, Record<string, any>>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("august_cms_content_draft");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return defaultSections;
  });

  const [seoList, setSeoList] = useState<Record<string, PageSeoData>>({});
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [activeAssetPicker, setActiveAssetPicker] = useState<{
    isOpen: boolean;
    onSelect: (url: string) => void;
  }>({ isOpen: false, onSelect: () => {} });

  // Sync with MySQL on mount
  useEffect(() => {
    fetch(`${API_BASE}/sections`)
      .then((res) => res.json())
      .then((data) => {
        if (data.map && Object.keys(data.map).length > 0) {
          setContent((prev) => {
            const merged = { ...defaultSections, ...prev };
            for (const page in data.map) {
              merged[page] = { ...merged[page], ...data.map[page] };
            }
            return merged;
          });
        }
      })
      .catch((err) => console.log("[CMS] Offline or server starting:", err.message));

    // Fetch SEO from MySQL
    fetch(`${API_BASE}/seo`)
      .then((res) => res.json())
      .then((rows) => {
        if (Array.isArray(rows)) {
          const map: Record<string, PageSeoData> = {};
          rows.forEach((r) => {
            map[r.page_key] = r;
          });
          setSeoList(map);
        }
      })
      .catch(() => {});

    loadAssets();
  }, []);

  const loadAssets = async () => {
    try {
      const res = await fetch(`${API_BASE}/assets`);
      const data = await res.json();
      if (Array.isArray(data)) setAssets(data);
    } catch {}
  };

  const updateSectionField = (pageKey: string, sectionKey: string, fieldKey: string, value: any) => {
    setContent((prev) => {
      const updated = {
        ...prev,
        [pageKey]: {
          ...(prev[pageKey] || {}),
          [sectionKey]: {
            ...(prev[pageKey]?.[sectionKey] || {}),
            [fieldKey]: value,
          },
        },
      };
      localStorage.setItem("august_cms_content_draft", JSON.stringify(updated));
      setHasUnsavedChanges(true);
      return updated;
    });
  };

  const saveSection = async (pageKey: string, sectionKey: string): Promise<boolean> => {
    try {
      const sectionContent = content[pageKey]?.[sectionKey];
      const res = await fetch(`${API_BASE}/sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          page_key: pageKey,
          section_key: sectionKey,
          section_name: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
          content: sectionContent,
        }),
      });
      const data = await res.json();
      return !!data.success;
    } catch (err) {
      console.error("[CMS] Save section error:", err);
      return false;
    }
  };

  const saveAllSections = async (): Promise<boolean> => {
    try {
      const items = [];
      for (const pageKey in content) {
        for (const sectionKey in content[pageKey]) {
          items.push({
            page_key: pageKey,
            section_key: sectionKey,
            section_name: sectionKey,
            content: content[pageKey][sectionKey],
          });
        }
      }
      const res = await fetch(`${API_BASE}/sections/batch`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json();
      if (data.success) {
        setHasUnsavedChanges(false);
        return true;
      }
      return false;
    } catch (err) {
      console.error("[CMS] Batch save error (preserving draft locally):", err);
      localStorage.setItem("august_cms_content_draft", JSON.stringify(content));
      setHasUnsavedChanges(false);
      return true;
    }
  };

  const updateSeo = (pageKey: string, data: Partial<PageSeoData>) => {
    setSeoList((prev) => {
      const updated = {
        ...prev,
        [pageKey]: {
          ...(prev[pageKey] || { page_key: pageKey, title: "", description: "", canonical_path: "" }),
          ...data,
        },
      };
      localStorage.setItem(`august_cms_seo_${pageKey}`, JSON.stringify(updated[pageKey]));
      return updated;
    });
  };

  const saveSeo = async (pageKey: string): Promise<boolean> => {
    try {
      const data = seoList[pageKey];
      const res = await fetch(`${API_BASE}/seo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      return !!result.success;
    } catch {
      localStorage.setItem(`august_cms_seo_${pageKey}`, JSON.stringify(seoList[pageKey]));
      return true;
    }
  };

  const uploadAssets = async (files: FileList | File[]): Promise<MediaAsset[]> => {
    const formData = new FormData();
    Array.from(files).forEach((f) => formData.append("files", f));
    try {
      const res = await fetch(`${API_BASE}/assets/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.files) {
        loadAssets();
        return data.files;
      }
      return [];
    } catch (err) {
      console.error("[CMS] Upload asset error:", err);
      return [];
    }
  };

  const deleteAsset = async (id: number): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/assets/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setAssets((prev) => prev.filter((a) => a.id !== id));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const openAssetPicker = (onSelect: (url: string) => void) => {
    setActiveAssetPicker({ isOpen: true, onSelect });
  };
  const closeAssetPicker = () => {
    setActiveAssetPicker({ isOpen: false, onSelect: () => {} });
  };

  return (
    <CmsContext.Provider
      value={{
        isAdminMode,
        setIsAdminMode: (val) => {
          setIsAdminMode(val);
          localStorage.setItem("august_cms_admin", String(val));
        },
        content,
        updateSectionField,
        saveSection,
        saveAllSections,
        seoList,
        updateSeo,
        saveSeo,
        assets,
        loadAssets,
        uploadAssets,
        deleteAsset,
        activeAssetPicker,
        openAssetPicker,
        closeAssetPicker,
        hasUnsavedChanges,
      }}
    >
      {children}
    </CmsContext.Provider>
  );
}
