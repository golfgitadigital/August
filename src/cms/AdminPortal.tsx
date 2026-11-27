import React, { useState } from "react";
import { useCms, API_BASE } from "./CmsContext";

export function AdminPortal({ currentPage }: { currentPage: string }) {
  const {
    isAdminMode,
    setIsAdminMode,
    content,
    updateSectionField,
    saveAllSections,
    hasUnsavedChanges,
    seoList,
    updateSeo,
    saveSeo,
    assets,
    uploadAssets,
    deleteAsset,
    activeAssetPicker,
    closeAssetPicker,
  } = useCms();

  const [activeTab, setActiveTab] = useState<"sections" | "seo" | "assets">("sections");
  const [isOpen, setIsOpen] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const currentPageSections = content[currentPage] || {};

  const handleSaveAll = async () => {
    setSaveStatus("Saving to MySQL...");
    const ok = await saveAllSections();
    if (ok) {
      setSaveStatus("Saved to MySQL successfully!");
      setTimeout(() => setSaveStatus(""), 3000);
    } else {
      setSaveStatus("Error saving to database.");
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    await uploadAssets(e.target.files);
    setUploading(false);
  };

  const currentSeo = seoList[currentPage] || {
    page_key: currentPage,
    title: "",
    description: "",
    canonical_path: "",
    keywords: "",
  };

  return (
    <>
      {/* Top Floating Admin Bar */}
      <div className="fixed top-0 left-0 right-0 z-[100] bg-[#080300] border-b border-[#fe9201]/40 text-white px-4 py-2 flex items-center justify-between text-xs shadow-xl">
        <div className="flex items-center gap-3">
          <span className="font-extrabold text-[#fe9201] tracking-wider uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fe9201] animate-pulse" />
            AuGust Aurea CMS
          </span>
          <span className="text-white/60">|</span>
          <span className="text-white/80">Page: <strong className="text-white">{currentPage}</strong></span>
          <span className="text-white/60">|</span>
          <span className="text-white/80">Database: <strong className="text-emerald-400">MySQL (Connected)</strong></span>
        </div>

        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-xs font-bold text-[#fe9201]">{saveStatus}</span>
          )}
          {hasUnsavedChanges && !saveStatus && (
            <span className="text-xs text-amber-400 font-semibold">• Unsaved Edits</span>
          )}
          <button
            onClick={handleSaveAll}
            className="bg-[#fe9201] hover:bg-[#d97800] text-[#080300] font-extrabold px-3 py-1.5 rounded transition uppercase text-[11px]"
          >
            Save All Changes
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="border border-white/30 hover:border-white px-3 py-1.5 rounded text-white font-bold transition"
          >
            {isOpen ? "Close Panel ✕" : "Open CMS Panel ⚙"}
          </button>
          <button
            onClick={() => setIsAdminMode(!isAdminMode)}
            className="bg-white/10 hover:bg-white/20 px-2.5 py-1.5 rounded text-white/80"
            title="Toggle Visual Editable Mode"
          >
            {isAdminMode ? "Exit Edit Mode" : "Enter Edit Mode"}
          </button>
        </div>
      </div>

      {/* Right Drawer / Sidebar Panel */}
      {isOpen && (
        <aside className="fixed top-[45px] right-0 bottom-0 w-[420px] bg-[#111013] border-l border-white/15 text-white z-[99] shadow-2xl flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-white/15 bg-black/40">
            <button
              onClick={() => setActiveTab("sections")}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "sections" ? "text-[#fe9201] border-b-2 border-[#fe9201] bg-white/5" : "text-white/60 hover:text-white"
              }`}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab("seo")}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "seo" ? "text-[#fe9201] border-b-2 border-[#fe9201] bg-white/5" : "text-white/60 hover:text-white"
              }`}
            >
              Page SEO
            </button>
            <button
              onClick={() => setActiveTab("assets")}
              className={`flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider transition ${
                activeTab === "assets" ? "text-[#fe9201] border-b-2 border-[#fe9201] bg-white/5" : "text-white/60 hover:text-white"
              }`}
            >
              Media Assets
            </button>
          </div>

          {/* Panel Content Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {/* Tab: Sections */}
            {activeTab === "sections" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-[#fe9201] tracking-wide mb-1">
                    {currentPage} Page Sections
                  </h3>
                  <p className="text-xs text-white/60 mb-4">
                    Any new sections added to the front will automatically register and appear here with direct field controls.
                  </p>
                </div>

                {Object.keys(currentPageSections).map((sectionKey) => {
                  const sec = currentPageSections[sectionKey];
                  return (
                    <div key={sectionKey} className="bg-white/5 border border-white/10 rounded p-4 space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <span className="font-extrabold text-xs uppercase text-white/90">
                          {sectionKey} Section
                        </span>
                        <span className="text-[10px] bg-[#fe9201]/20 text-[#fe9201] px-2 py-0.5 rounded font-mono">
                          Auto-Discovered
                        </span>
                      </div>

                      {Object.keys(sec).map((fieldKey) => {
                        const val = sec[fieldKey];
                        const isImg = fieldKey.includes("image") || fieldKey.includes("bg_") || (typeof val === "string" && (val.startsWith("http") || val.startsWith("/")));

                        return (
                          <div key={fieldKey} className="space-y-1">
                            <label className="text-[11px] font-bold text-white/70 uppercase">
                              {fieldKey.replace(/_/g, " ")}
                            </label>
                            {isImg ? (
                              <div className="flex items-center gap-2">
                                <img src={val} alt="" className="w-10 h-10 object-cover rounded border border-white/20" />
                                <input
                                  type="text"
                                  value={val}
                                  onChange={(e) => updateSectionField(currentPage, sectionKey, fieldKey, e.target.value)}
                                  className="flex-1 bg-black/40 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#fe9201]"
                                />
                              </div>
                            ) : typeof val === "string" && val.length > 60 ? (
                              <textarea
                                rows={3}
                                value={val}
                                onChange={(e) => updateSectionField(currentPage, sectionKey, fieldKey, e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#fe9201]"
                              />
                            ) : (
                              <input
                                type="text"
                                value={val}
                                onChange={(e) => updateSectionField(currentPage, sectionKey, fieldKey, e.target.value)}
                                className="w-full bg-black/40 border border-white/20 rounded px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#fe9201]"
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Tab: Page SEO Settings */}
            {activeTab === "seo" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-extrabold uppercase text-[#fe9201] tracking-wide mb-1">
                    SEO & Meta for {currentPage}
                  </h3>
                  <p className="text-xs text-white/60 mb-4">
                    Stored directly in MySQL `pages_seo` table and injected into HTML headers.
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-white/80 uppercase">Page Title</label>
                  <input
                    type="text"
                    value={currentSeo.title}
                    onChange={(e) => updateSeo(currentPage, { title: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="Page Title Tag"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-white/80 uppercase">Meta Description</label>
                  <textarea
                    rows={4}
                    value={currentSeo.description}
                    onChange={(e) => updateSeo(currentPage, { description: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="Search engine description snippet"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-white/80 uppercase">Canonical URL Path</label>
                  <input
                    type="text"
                    value={currentSeo.canonical_path}
                    onChange={(e) => updateSeo(currentPage, { canonical_path: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="/about"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-white/80 uppercase">Target Keywords</label>
                  <input
                    type="text"
                    value={currentSeo.keywords || ""}
                    onChange={(e) => updateSeo(currentPage, { keywords: e.target.value })}
                    className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="FMCG, Tanzania trade, wholesale supply"
                  />
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const ok = await saveSeo(currentPage);
                    setSaveStatus(ok ? "SEO updated in MySQL!" : "Failed to update SEO.");
                    setTimeout(() => setSaveStatus(""), 3000);
                  }}
                  className="w-full bg-[#fe9201] hover:bg-[#d97800] text-[#080300] font-extrabold py-2.5 rounded transition uppercase text-xs mt-3"
                >
                  Save SEO Settings
                </button>
              </div>
            )}

            {/* Tab: Media Assets */}
            {activeTab === "assets" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-extrabold uppercase text-[#fe9201] tracking-wide">
                    Media Library
                  </h3>
                  <label className="bg-[#fe9201] hover:bg-[#d97800] text-[#080300] text-xs font-extrabold uppercase px-3 py-1.5 rounded cursor-pointer transition">
                    {uploading ? "Uploading..." : "+ Upload Assets"}
                    <input type="file" multiple accept="image/*" onChange={handleFileUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-white/60">
                  Upload images, replace section pictures, or remove unused assets directly from MySQL storage.
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  {assets.map((asset) => (
                    <div key={asset.id} className="relative group bg-white/5 border border-white/10 rounded overflow-hidden">
                      <img src={asset.url} alt={asset.original_name} className="w-full h-24 object-cover" />
                      <div className="p-2 text-[10px] text-white/80 truncate">
                        {asset.original_name}
                      </div>
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition">
                        <button
                          onClick={() => navigator.clipboard.writeText(asset.url)}
                          className="bg-white/20 hover:bg-white text-white hover:text-black text-[10px] font-bold px-2 py-1 rounded"
                        >
                          Copy URL
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="bg-red-500/80 hover:bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Asset Picker Modal when clicking an image in Visual Editor */}
      {activeAssetPicker.isOpen && (
        <div className="fixed inset-0 bg-black/80 z-[200] flex items-center justify-center p-6">
          <div className="bg-[#111013] border border-white/20 rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col p-6 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
              <h3 className="text-base font-extrabold text-[#fe9201] uppercase">Select or Upload Image Asset</h3>
              <button onClick={closeAssetPicker} className="text-white/60 hover:text-white text-lg">✕</button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <label className="bg-[#fe9201] hover:bg-[#d97800] text-[#080300] font-extrabold uppercase text-xs px-4 py-2 rounded cursor-pointer transition">
                + Upload New Image
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
              <span className="text-xs text-white/60">Upload from computer or pick an existing asset below:</span>
            </div>

            <div className="grid grid-cols-3 gap-3 overflow-y-auto flex-1 p-1">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  onClick={() => {
                    activeAssetPicker.onSelect(asset.url);
                    closeAssetPicker();
                  }}
                  className="cursor-pointer border border-white/15 hover:border-[#fe9201] rounded overflow-hidden group transition relative"
                >
                  <img src={asset.url} alt="" className="w-full h-28 object-cover group-hover:scale-105 transition" />
                  <div className="p-1.5 text-[10px] truncate text-white/80 bg-black/40">
                    {asset.original_name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
