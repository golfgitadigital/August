import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { defaultSections } from "./defaultContent";

type DeviceMode = "desktop" | "tablet" | "mobile";

export function WebflowStudio({
  page: initialPage = "Home",
  onBackToDashboard,
}: {
  page?: string;
  onBackToDashboard: () => void;
}) {
  const {
    content,
    updateSectionField,
    saveAllSections,
    hasUnsavedChanges,
    seoList,
    updateSeo,
    saveSeo,
    assets,
    uploadAssets,
  } = useCms();

  const [activePage, setActivePage] = useState<string>(initialPage);
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [rightTab, setRightTab] = useState<"style" | "settings" | "seo">("style");
  const [leftTab, setLeftTab] = useState<"navigator" | "assets">("navigator");

  const [selectedElement, setSelectedElement] = useState<{
    sectionKey: string;
    fieldKey: string;
    type: "text" | "image";
    tag: string;
  }>({
    sectionKey: "hero",
    fieldKey: "title_1",
    type: "text",
    tag: "H1",
  });

  const [imagePopup, setImagePopup] = useState<{
    sectionKey: string;
    fieldKey: string;
    currentSrc: string;
    x?: number;
    y?: number;
  } | null>(null);

  const [saveStatus, setSaveStatus] = useState<string>("");

  const pages = ["Home", "About", "Services", "Products", "Gallery", "News", "Careers", "Contact"];
  const currentSections = content[activePage] || defaultSections[activePage] || {};

  const handleSave = async () => {
    setSaveStatus("Saving changes to database...");
    const ok = await saveAllSections();
    if (ok) {
      setSaveStatus("Published & Saved to Database!");
      setTimeout(() => setSaveStatus(""), 3500);
    } else {
      setSaveStatus("Failed to save.");
    }
  };

  const currentSeo = seoList[activePage] || {
    page_key: activePage,
    title: `${activePage} | AuGust Aurea Limited`,
    description: `AuGust Aurea Limited ${activePage} page - Reliable trade and distribution across Tanzania.`,
    canonical_path: activePage === "Home" ? "/" : `/${activePage.toLowerCase()}`,
    keywords: "Tanzania wholesale, East Africa corridor, FMCG supply",
    og_image: "https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1200&q=80",
  };

  const containerWidth =
    device === "desktop" ? "100%" : device === "tablet" ? "820px" : "400px";

  // Helper for selecting elements
  const selectElem = (sectionKey: string, fieldKey: string, type: "text" | "image", tag: string) => {
    setSelectedElement({ sectionKey, fieldKey, type, tag });
  };

  return (
    <div className="admin-portal fixed inset-0 bg-[#121212] text-[#d1d1d1] flex flex-col font-sans select-none overflow-hidden z-[999999]">
      {/* 1. TOP WEBFLOW STUDIO HEADER */}
      <header className="h-[48px] bg-[#1f1f1f] border-b border-[#2e2e2e] flex items-center justify-between px-3 shrink-0 text-xs shadow-lg z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="flex items-center gap-2 bg-[#2d273a] hover:bg-[#3d3352] text-[#fe9201] border border-[#fe9201]/40 font-bold px-3 py-1.5 rounded-lg transition text-xs shadow"
          >
            <span>←</span> Admin Dashboard
          </button>

          <div className="h-4 w-px bg-[#353535]"></div>

          <div className="flex items-center gap-2">
            <span className="text-[#888] font-bold text-[11px] uppercase">Page:</span>
            <select
              value={activePage}
              onChange={(e) => {
                setActivePage(e.target.value);
                const firstSec = Object.keys(content[e.target.value] || defaultSections[e.target.value] || {})[0] || "hero";
                setSelectedElement({
                  sectionKey: firstSec,
                  fieldKey: "title_1",
                  type: "text",
                  tag: "H1",
                });
                setImagePopup(null);
              }}
              className="bg-[#2a2a2a] border border-[#3e3e3e] text-white font-extrabold px-3 py-1 rounded-md outline-none cursor-pointer hover:border-[#fe9201] transition text-xs"
            >
              {pages.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="text-[11px] text-[#777] hidden md:flex items-center gap-1 font-mono">
            <span>body</span> &gt; <span className="text-[#fe9201]">{selectedElement.sectionKey}</span> &gt;{" "}
            <span className="text-white">{selectedElement.fieldKey}</span>
          </div>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-[#181818] border border-[#333] rounded-lg p-0.5">
          <button
            onClick={() => setDevice("desktop")}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              device === "desktop" ? "bg-[#333] text-white shadow-sm" : "text-[#777] hover:text-white"
            }`}
          >
            <span>🖥</span> Desktop
          </button>
          <button
            onClick={() => setDevice("tablet")}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              device === "tablet" ? "bg-[#333] text-white shadow-sm" : "text-[#777] hover:text-white"
            }`}
          >
            <span>📱</span> Tablet
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`px-3 py-1 rounded text-xs font-bold transition flex items-center gap-1.5 ${
              device === "mobile" ? "bg-[#333] text-white shadow-sm" : "text-[#777] hover:text-white"
            }`}
          >
            <span>📲</span> Mobile
          </button>
        </div>

        {/* Publish & Status */}
        <div className="flex items-center gap-3">
          {saveStatus && (
            <span className="text-emerald-400 font-extrabold text-[11px] animate-pulse">
              {saveStatus}
            </span>
          )}

          <a
            href={activePage === "Home" ? "/" : `/${activePage.toLowerCase()}`}
            target="_blank"
            rel="noreferrer"
            className="text-xs text-[#888] hover:text-white font-bold flex items-center gap-1 transition"
          >
            View Live Site ↗
          </a>

          <button
            onClick={handleSave}
            className={`px-4 py-1.5 rounded-lg font-black text-xs uppercase tracking-wider transition shadow-md flex items-center gap-1.5 ${
              hasUnsavedChanges
                ? "bg-[#fe9201] hover:bg-[#e08200] text-[#080300] ring-2 ring-[#fe9201]/50"
                : "bg-[#2d2d2d] hover:bg-[#383838] text-white"
            }`}
          >
            <span>🚀</span> Publish & Save
          </button>
        </div>
      </header>

      {/* 2. MAIN STUDIO WORKSPACE */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: NAVIGATOR & ASSETS */}
        <aside className="w-[260px] bg-[#1a1a1a] border-r border-[#2b2b2b] flex flex-col shrink-0">
          <div className="flex border-b border-[#2b2b2b] bg-[#222]">
            <button
              onClick={() => setLeftTab("navigator")}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                leftTab === "navigator"
                  ? "text-white border-b-2 border-[#fe9201] bg-[#1a1a1a]"
                  : "text-[#777] hover:text-white"
              }`}
            >
              Navigator
            </button>
            <button
              onClick={() => setLeftTab("assets")}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                leftTab === "assets"
                  ? "text-white border-b-2 border-[#fe9201] bg-[#1a1a1a]"
                  : "text-[#777] hover:text-white"
              }`}
            >
              Assets
            </button>
          </div>

          {/* Navigator Tree */}
          {leftTab === "navigator" && (
            <div className="flex-1 overflow-y-auto p-2 space-y-1 text-xs">
              <div className="text-[10px] text-[#666] font-bold uppercase px-2 py-1 tracking-wider">
                Page Hierarchy ({activePage})
              </div>

              {Object.keys(currentSections).map((secKey) => {
                const sec = currentSections[secKey];
                const isSecActive = selectedElement.sectionKey === secKey;

                return (
                  <div key={secKey} className="space-y-0.5">
                    <div
                      onClick={() => {
                        const firstField = Object.keys(sec)[0] || "";
                        selectElem(secKey, firstField, firstField.includes("image") ? "image" : "text", "DIV");
                      }}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition ${
                        isSecActive ? "bg-[#2a2a2a] text-white font-bold" : "hover:bg-[#222] text-[#888]"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[#fe9201]">📁</span>
                        <span className="capitalize">{secKey}</span>
                      </div>
                      <span className="text-[9px] bg-black/40 text-[#888] px-1.5 rounded uppercase font-mono">
                        Sec
                      </span>
                    </div>

                    <div className="pl-4 space-y-0.5">
                      {Object.keys(sec).map((fieldKey) => {
                        const isSelected =
                          selectedElement.sectionKey === secKey && selectedElement.fieldKey === fieldKey;
                        const isImg = fieldKey.includes("image") || fieldKey.includes("bg_") || fieldKey.includes("truck_image");

                        return (
                          <div
                            key={fieldKey}
                            onClick={() => {
                              selectElem(secKey, fieldKey, isImg ? "image" : "text", isImg ? "IMG" : "TEXT");
                              if (isImg) {
                                setImagePopup({
                                  sectionKey: secKey,
                                  fieldKey,
                                  currentSrc: sec[fieldKey],
                                });
                              }
                            }}
                            className={`flex items-center justify-between px-2 py-1 rounded text-[11px] cursor-pointer transition ${
                              isSelected
                                ? "bg-[#fe9201] text-[#080300] font-black"
                                : "hover:bg-[#252525] text-[#888] hover:text-white"
                            }`}
                          >
                            <span className="truncate">{fieldKey.replace(/_/g, " ")}</span>
                            <span className="text-[9px] opacity-75">{isImg ? "IMG" : "TXT"}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Assets Tab */}
          {leftTab === "assets" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              <label className="block text-center bg-[#fe9201] text-[#080300] font-black uppercase text-[11px] py-2 rounded-lg cursor-pointer hover:bg-white transition shadow">
                + Upload New Asset
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => e.target.files && uploadAssets(e.target.files)}
                  className="hidden"
                />
              </label>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {assets.map((asset) => (
                  <div
                    key={asset.id}
                    onClick={() => {
                      if (selectedElement.type === "image") {
                        updateSectionField(activePage, selectedElement.sectionKey, selectedElement.fieldKey, asset.url);
                        if (imagePopup) {
                          setImagePopup({ ...imagePopup, currentSrc: asset.url });
                        }
                      }
                    }}
                    className="border border-[#333] hover:border-[#fe9201] rounded-lg overflow-hidden cursor-pointer group relative bg-black/40"
                  >
                    <img src={asset.url} alt="" className="w-full h-16 object-cover" />
                    <div className="p-1 text-[9px] truncate text-[#aaa]">{asset.original_name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* CENTER CANVAS: 1:1 AUTHENTIC LIVE DESIGN RENDERING */}
        <main className="flex-1 bg-[#0b0b0b] flex flex-col items-center justify-start p-6 overflow-auto relative">
          <div
            style={{ width: containerWidth, maxWidth: device === "desktop" ? "1280px" : undefined }}
            className="bg-[#080300] text-white min-h-full rounded-lg shadow-2xl overflow-y-auto relative border border-[#2b2b2b] transition-all duration-300 antialiased font-['Manrope',sans-serif]"
          >
            {/* === PAGE: HOME CANVAS === */}
            {activePage === "Home" && (
              <div className="space-y-0">
                {/* 1. Hero Section */}
                {currentSections.hero && (
                  <div
                    onClick={() => selectElem("hero", "title_1", "text", "H1")}
                    className="relative overflow-hidden bg-[#080300] text-white py-24 px-12 group cursor-pointer border-2 border-transparent hover:border-[#fe9201]/40"
                  >
                    <img
                      src={currentSections.hero.bg_image || "https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1800&q=85"}
                      alt=""
                      onClick={(e) => {
                        e.stopPropagation();
                        selectElem("hero", "bg_image", "image", "IMG");
                        setImagePopup({ sectionKey: "hero", fieldKey: "bg_image", currentSrc: currentSections.hero.bg_image });
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 hover:opacity-40 transition cursor-pointer"
                    />
                    <div className="relative z-10 max-w-3xl space-y-4">
                      <div className="flex items-center gap-3.5 text-xs font-extrabold uppercase tracking-[1.38px] text-white">
                        <span className="w-9 h-0.5 bg-[#fe9201] inline-block shrink-0"></span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField("Home", "hero", "eyebrow", e.currentTarget.innerText)}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectElem("hero", "eyebrow", "text", "SPAN");
                          }}
                          className="outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                        >
                          {currentSections.hero.eyebrow}
                        </span>
                      </div>

                      <h1 className="text-5xl md:text-6xl font-extrabold tracking-[-3.5px] leading-tight text-white">
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField("Home", "hero", "title_1", e.currentTarget.innerText)}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectElem("hero", "title_1", "text", "H1");
                          }}
                          className="outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                        >
                          {currentSections.hero.title_1}
                        </span>
                        <br />
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField("Home", "hero", "title_2", e.currentTarget.innerText)}
                          onClick={(e) => {
                            e.stopPropagation();
                            selectElem("hero", "title_2", "text", "H1");
                          }}
                          className="outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                        >
                          {currentSections.hero.title_2}
                        </span>
                        <span className="text-[#fe9201]">.</span>
                      </h1>

                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSectionField("Home", "hero", "copy", e.currentTarget.innerText)}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectElem("hero", "copy", "text", "P");
                        }}
                        className="text-base text-[#cfcfcf] max-w-xl leading-relaxed outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                      >
                        {currentSections.hero.copy}
                      </p>

                      <div className="flex items-center gap-3 pt-4">
                        <button
                          type="button"
                          className="h-12 px-6 bg-[#fe9201] text-[#080300] font-extrabold text-[11px] tracking-[0.14em] uppercase rounded flex items-center gap-3 border border-[#fe9201] cursor-pointer"
                        >
                          <span>{currentSections.hero.btn_primary || "Enquire Now"}</span>
                          <span className="text-base font-bold">→</span>
                        </button>
                        <button
                          type="button"
                          className="h-12 px-6 bg-transparent text-white font-extrabold text-[11px] tracking-[0.14em] uppercase rounded flex items-center gap-3 border border-white cursor-pointer hover:bg-white hover:text-[#080300] transition-colors"
                        >
                          <span>{currentSections.hero.btn_secondary || "View Products"}</span>
                          <span className="text-base font-bold">→</span>
                        </button>
                      </div>
                    </div>

                    {/* Hero Right Map Watermark */}
                    <div className="absolute right-4 top-[15%] h-[68%] opacity-20 pointer-events-none hidden md:block">
                      <svg
                        className="h-full w-auto"
                        viewBox="0 0 150 190"
                        role="img"
                        aria-label="Tanzania trade network map"
                      >
                        <path
                          fill="rgba(255, 255, 255, 0.05)"
                          stroke="white"
                          strokeWidth="1.2"
                          d="M31 8 55 18 72 15 92 24 115 22 126 39 119 57 128 76 117 94 111 123 92 138 81 166 64 180 47 164 31 158 23 136 28 117 16 97 20 75 11 57 20 39 17 21Z"
                        />
                        <path
                          fill="none"
                          stroke="#fe9201"
                          strokeWidth="1"
                          strokeDasharray="2 2"
                          d="M95 57 66 81 45 42M95 57 86 25M66 81 48 130M66 81 19 73M95 57l24-5"
                        />
                        {[[95, 57], [66, 81], [45, 42], [86, 25], [48, 130], [19, 73], [119, 52]].map((d, i) => (
                          <circle key={i} cx={d[0]} cy={d[1]} r="3" fill="#fe9201" />
                        ))}
                      </svg>
                    </div>

                    {/* Hero Bottom Index */}
                    <div className="absolute right-8 bottom-6 text-xs font-bold tracking-[1.41px] items-center gap-3 text-white hidden md:flex">
                      DAR ES SALAAM <span className="w-10 h-px bg-[#fe9201] inline-block"></span> 06.7924° S
                    </div>
                  </div>
                )}

                {/* 2. Credentials Bar */}
                {currentSections.credentials && (
                  <div className="bg-white border-b border-[#e3e2e8] py-6 px-12 grid grid-cols-2 md:grid-cols-4 text-[#080300]">
                    {Object.keys(currentSections.credentials).map((k, idx) => (
                      <div
                        key={k}
                        onClick={() => selectElem("credentials", k, "text", "SPAN")}
                        className={`flex items-center justify-center gap-3 py-2 cursor-pointer hover:text-[#fe9201] transition-colors ${
                          idx < 3 ? "md:border-r md:border-[#ddd]" : ""
                        } ${idx % 2 === 0 ? "border-r border-[#ddd] md:border-r" : ""}`}
                      >
                        <span className="text-[#fe9201] text-base font-bold">✦</span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField("Home", "credentials", k, e.currentTarget.innerText)}
                          className="outline-none font-bold text-xs uppercase tracking-[0.52px]"
                        >
                          {currentSections.credentials[k]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 3. Who We Are Section */}
                {currentSections.who && (
                  <div className="py-20 px-12 bg-[#f5f4f8] text-[#1a1a2e]">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1.25fr] gap-12 items-center">
                      <div className="space-y-6">
                        <div className="grid grid-cols-[auto_1fr] gap-6 items-start">
                          <span
                            className="text-[69px] font-extrabold text-transparent select-none leading-[0.85] tracking-[-5px]"
                            style={{ WebkitTextStroke: "1px #08030033" }}
                          >
                            01
                          </span>
                          <div>
                            <div className="flex items-center gap-3.5 text-xs font-extrabold uppercase tracking-[1.38px] text-[#080300] mb-6">
                              <span className="w-9 h-0.5 bg-[#fe9201] inline-block shrink-0"></span>
                              <span>{currentSections.who.eyebrow}</span>
                            </div>

                            <h2 className="text-4xl md:text-5xl font-extrabold text-[#080300] tracking-[-2px] leading-[1.08] m-0">
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateSectionField("Home", "who", "title_1", e.currentTarget.innerText)}
                                onClick={() => selectElem("who", "title_1", "text", "H2")}
                                className="outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                              >
                                {currentSections.who.title_1}
                              </span>
                              <br />
                              <span
                                contentEditable
                                suppressContentEditableWarning
                                onBlur={(e) => updateSectionField("Home", "who", "title_2", e.currentTarget.innerText)}
                                onClick={() => selectElem("who", "title_2", "text", "H2")}
                                className="outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                              >
                                {currentSections.who.title_2}
                              </span>
                            </h2>
                          </div>
                        </div>

                        <p
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField("Home", "who", "copy", e.currentTarget.innerText)}
                          onClick={() => selectElem("who", "copy", "text", "P")}
                          className="text-base text-[#555365] leading-relaxed max-w-md outline-none hover:ring-1 hover:ring-[#fe9201] rounded px-1"
                        >
                          {currentSections.who.copy}
                        </p>

                        <div className="inline-flex items-center gap-3 text-base font-extrabold text-[#080300] cursor-pointer hover:text-[#fe9201] transition-colors">
                          <span>{currentSections.who.link_text}</span>
                          <span className="text-lg">→</span>
                        </div>
                      </div>

                      <div className="relative">
                        <img
                          src={currentSections.who.image || "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80"}
                          alt=""
                          onClick={(e) => {
                            e.stopPropagation();
                            selectElem("who", "image", "image", "IMG");
                            setImagePopup({ sectionKey: "who", fieldKey: "image", currentSrc: currentSections.who.image });
                          }}
                          className="w-full h-96 object-cover rounded shadow-lg border-2 border-transparent hover:border-[#fe9201] cursor-pointer"
                        />
                        <div className="absolute -bottom-4 -left-4 bg-white p-5 border-t-2 border-[#fe9201] shadow-lg">
                          <b className="block text-base text-[#080300] font-extrabold">{currentSections.who.badge_bold}</b>
                          <span className="text-xs text-[#777]">{currentSections.who.badge_sub}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Services Intro */}
                {currentSections.services_intro && (
                  <div className="py-20 px-12 bg-[#faf9f8] text-[#1a1a2e] text-center border-t border-[#e8e6e3]">
                    <div className="max-w-3xl mx-auto space-y-3">
                      <div className="flex items-center justify-center gap-3 text-xs font-extrabold uppercase tracking-[1.38px] text-[#080300]">
                        <span className="w-9 h-0.5 bg-[#fe9201] inline-block"></span>
                        <span>{currentSections.services_intro.eyebrow}</span>
                      </div>
                      <h2
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSectionField("Home", "services_intro", "title", e.currentTarget.innerText)}
                        onClick={() => selectElem("services_intro", "title", "text", "H2")}
                        className="text-4xl font-extrabold text-[#080300] tracking-tight outline-none"
                      >
                        {currentSections.services_intro.title}
                      </h2>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSectionField("Home", "services_intro", "copy", e.currentTarget.innerText)}
                        onClick={() => selectElem("services_intro", "copy", "text", "P")}
                        className="text-sm text-[#626071] outline-none"
                      >
                        {currentSections.services_intro.copy}
                      </p>
                    </div>
                  </div>
                )}

                {/* 5. Commitments Dark Section */}
                {currentSections.commitments && (
                  <div className="py-20 px-12 bg-[#080300] text-white border-t border-white/10 relative overflow-hidden">
                    <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 text-xs font-extrabold uppercase tracking-[1.38px] text-[#fe9201]">
                          <span className="w-9 h-0.5 bg-[#fe9201] inline-block"></span>
                          <span>{currentSections.commitments.eyebrow}</span>
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight">
                          <span>{currentSections.commitments.title_1}</span>
                          <br />
                          <span>{currentSections.commitments.title_2}</span>
                        </h2>
                        <div className="grid grid-cols-2 gap-3 pt-4 text-xs font-bold text-[#cfcfcf]">
                          {["commit_1", "commit_2", "commit_3", "commit_4"].map((k) => (
                            <div key={k} className="flex items-center gap-2">
                              <span className="text-[#fe9201]">✓</span>
                              <span>{currentSections.commitments[k]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="relative">
                        <img
                          src={currentSections.commitments.truck_image || "https://images.unsplash.com/photo-1657725099160-53c81f45e4df?auto=format&fit=crop&w=1400&q=80"}
                          alt=""
                          onClick={(e) => {
                            e.stopPropagation();
                            selectElem("commitments", "truck_image", "image", "IMG");
                            setImagePopup({ sectionKey: "commitments", fieldKey: "truck_image", currentSrc: currentSections.commitments.truck_image });
                          }}
                          className="w-full h-72 object-cover rounded shadow-lg border-2 border-transparent hover:border-[#fe9201] cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* === PAGE: OTHER PAGES (About, Services, Products, Contact, etc.) === */}
            {activePage !== "Home" && (
              <div className="space-y-0">
                {/* Hero section of selected page */}
                {currentSections.hero && (
                  <div className="relative bg-[#080300] text-white py-20 px-12 border-b border-white/10 overflow-hidden">
                    <img
                      src={currentSections.hero.image || currentSections.hero.bg_image || "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80"}
                      alt=""
                      onClick={() => {
                        const imgField = currentSections.hero.image ? "image" : "bg_image";
                        selectElem("hero", imgField, "image", "IMG");
                        setImagePopup({ sectionKey: "hero", fieldKey: imgField, currentSrc: currentSections.hero[imgField] });
                      }}
                      className="absolute inset-0 w-full h-full object-cover opacity-20 hover:opacity-35 transition cursor-pointer"
                    />
                    <div className="relative z-10 max-w-3xl space-y-3">
                      <div className="flex items-center gap-3.5 text-xs font-extrabold uppercase tracking-[1.38px] text-white">
                        <span className="w-9 h-0.5 bg-[#fe9201] inline-block shrink-0"></span>
                        <span
                          contentEditable
                          suppressContentEditableWarning
                          onBlur={(e) => updateSectionField(activePage, "hero", "eyebrow", e.currentTarget.innerText)}
                          onClick={() => selectElem("hero", "eyebrow", "text", "SPAN")}
                          className="outline-none"
                        >
                          {currentSections.hero.eyebrow}
                        </span>
                      </div>
                      <h1
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSectionField(activePage, "hero", "title", e.currentTarget.innerText)}
                        onClick={() => selectElem("hero", "title", "text", "H1")}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight outline-none"
                      >
                        {currentSections.hero.title}
                      </h1>
                      <p
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => updateSectionField(activePage, "hero", "copy", e.currentTarget.innerText)}
                        onClick={() => selectElem("hero", "copy", "text", "P")}
                        className="text-base text-[#bbb] leading-relaxed outline-none"
                      >
                        {currentSections.hero.copy}
                      </p>
                    </div>
                  </div>
                )}

                {/* Render remaining sections of active page */}
                <div className="py-12 px-12 bg-white text-[#1a1a2e] space-y-12">
                  {Object.keys(currentSections)
                    .filter((k) => k !== "hero")
                    .map((secKey) => {
                      const sec = currentSections[secKey];

                      return (
                        <div
                          key={secKey}
                          onClick={() => selectElem(secKey, "title", "text", "SECTION")}
                          className="p-6 bg-[#faf9f8] border border-[#e8e6e3] rounded-xl hover:border-[#fe9201]/50 transition group cursor-pointer"
                        >
                          <div className="flex items-center justify-between mb-4 border-b border-[#e8e6e3] pb-2">
                            <span className="text-xs font-bold uppercase tracking-wider text-[#fe9201] flex items-center gap-1.5">
                              <span>📁</span> Section: {secKey}
                            </span>
                            <span className="text-[10px] text-[#888] font-mono">1:1 Editable Block</span>
                          </div>

                          <div className="space-y-4">
                            {Object.keys(sec).map((fieldKey) => {
                              const val = sec[fieldKey];
                              const isImg = fieldKey.includes("image") || fieldKey.includes("bg_");

                              if (isImg) {
                                return (
                                  <div key={fieldKey} className="space-y-1">
                                    <label className="text-[10px] text-[#777] uppercase font-bold">{fieldKey}</label>
                                    <img
                                      src={val}
                                      alt=""
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        selectElem(secKey, fieldKey, "image", "IMG");
                                        setImagePopup({ sectionKey: secKey, fieldKey, currentSrc: val });
                                      }}
                                      className="w-full max-h-56 object-cover rounded-lg border-2 border-transparent hover:border-[#fe9201] cursor-pointer"
                                    />
                                  </div>
                                );
                              }

                              return (
                                <div key={fieldKey} className="space-y-1">
                                  <label className="text-[10px] text-[#777] uppercase font-bold">{fieldKey}</label>
                                  <div
                                    contentEditable
                                    suppressContentEditableWarning
                                    onBlur={(e) => updateSectionField(activePage, secKey, fieldKey, e.currentTarget.innerText)}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      selectElem(secKey, fieldKey, "text", "FIELD");
                                    }}
                                    className="p-2.5 bg-white border border-[#d8d6d3] rounded text-sm text-[#080300] outline-none hover:border-[#fe9201] transition"
                                  >
                                    {val}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </div>

          {/* Webflow Image Settings Floating Dialog (Matches User's Reference Screenshot) */}
          {imagePopup && (
            <div className="absolute top-16 right-8 bg-[#252525] text-white border border-[#444] rounded-xl shadow-2xl p-4 w-[340px] z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-[#3c3c3c] pb-2 mb-3">
                <span className="font-extrabold text-xs flex items-center gap-1.5 text-white">
                  <span className="text-[#fe9201]">🖼</span> Image settings
                </span>
                <button onClick={() => setImagePopup(null)} className="text-[#888] hover:text-white text-sm">
                  ✕
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex items-center gap-3 bg-[#181818] p-2.5 rounded-lg border border-[#3c3c3c] mb-2">
                    <img src={imagePopup.currentSrc} alt="" className="w-14 h-14 object-cover rounded-md" />
                    <div className="flex-1 truncate text-[11px] text-[#aaa]">
                      <b className="text-white block truncate">{imagePopup.currentSrc.split("/").pop()}</b>
                      <span>1361 × 1156px • 2.18 MB</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setLeftTab("assets")}
                    className="w-full bg-[#383838] hover:bg-[#484848] text-white font-bold py-2 rounded-lg text-xs transition border border-[#555]"
                  >
                    Replace Image...
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888] uppercase font-bold">Image URL / Path</label>
                  <input
                    type="text"
                    value={imagePopup.currentSrc}
                    onChange={(e) => {
                      updateSectionField(activePage, imagePopup.sectionKey, imagePopup.fieldKey, e.target.value);
                      setImagePopup({ ...imagePopup, currentSrc: e.target.value });
                    }}
                    className="w-full bg-[#181818] border border-[#3c3c3c] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-[#888] uppercase font-bold">Alt Text (Accessibility & SEO)</label>
                  <input
                    type="text"
                    placeholder="Describe image for Google image search..."
                    className="w-full bg-[#181818] border border-[#3c3c3c] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                </div>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT INSPECTOR (STYLE | SETTINGS | FULL COMPREHENSIVE SEO) */}
        <aside className="w-[330px] bg-[#1a1a1a] border-l border-[#2b2b2b] flex flex-col shrink-0">
          <div className="flex border-b border-[#2b2b2b] bg-[#222]">
            <button
              onClick={() => setRightTab("style")}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                rightTab === "style"
                  ? "text-white border-b-2 border-[#fe9201] bg-[#1a1a1a]"
                  : "text-[#777] hover:text-white"
              }`}
            >
              Style
            </button>
            <button
              onClick={() => setRightTab("settings")}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                rightTab === "settings"
                  ? "text-white border-b-2 border-[#fe9201] bg-[#1a1a1a]"
                  : "text-[#777] hover:text-white"
              }`}
            >
              Settings
            </button>
            <button
              onClick={() => setRightTab("seo")}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider ${
                rightTab === "seo"
                  ? "text-white border-b-2 border-[#fe9201] bg-[#1a1a1a]"
                  : "text-[#777] hover:text-white"
              }`}
            >
              Page SEO
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
            {/* 1. TAB: STYLE */}
            {rightTab === "style" && (
              <div className="space-y-4">
                <div className="border-b border-[#2b2b2b] pb-3">
                  <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-1">
                    Active Element Selector
                  </div>
                  <div className="bg-[#fe9201]/10 text-[#fe9201] border border-[#fe9201]/30 rounded-lg px-3 py-1.5 font-bold text-xs flex items-center justify-between">
                    <span>{selectedElement.fieldKey}</span>
                    <span className="text-[9px] bg-black/40 px-1.5 rounded uppercase font-mono">
                      {selectedElement.tag}
                    </span>
                  </div>
                </div>

                {/* Box Model visual diagram */}
                <div>
                  <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider mb-2">
                    Box Model (Margin / Padding)
                  </div>
                  <div className="border border-[#333] bg-[#222] p-3 rounded-lg text-center text-[10px] text-[#888]">
                    <span>MARGIN (20px)</span>
                    <div className="border border-[#444] bg-[#282828] p-3 mt-1 rounded text-white font-mono">
                      <span>PADDING (16px)</span>
                      <div className="bg-[#fe9201]/20 text-[#fe9201] py-1 mt-1 rounded font-bold">
                        {selectedElement.fieldKey}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 border-t border-[#2b2b2b] pt-3">
                  <label className="text-[11px] text-white font-bold uppercase">
                    Element Text / Value
                  </label>
                  <textarea
                    rows={4}
                    value={currentSections[selectedElement.sectionKey]?.[selectedElement.fieldKey] || ""}
                    onChange={(e) =>
                      updateSectionField(activePage, selectedElement.sectionKey, selectedElement.fieldKey, e.target.value)
                    }
                    className="w-full bg-[#121212] border border-[#333] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                </div>
              </div>
            )}

            {/* 2. TAB: SETTINGS */}
            {rightTab === "settings" && (
              <div className="space-y-4">
                <div className="text-[10px] text-[#888] font-bold uppercase tracking-wider">
                  Element Attributes & Behavior
                </div>
                {selectedElement.type === "image" ? (
                  <button
                    onClick={() =>
                      setImagePopup({
                        sectionKey: selectedElement.sectionKey,
                        fieldKey: selectedElement.fieldKey,
                        currentSrc: currentSections[selectedElement.sectionKey]?.[selectedElement.fieldKey] || "",
                      })
                    }
                    className="w-full bg-[#fe9201] text-[#080300] font-black uppercase text-xs py-2 rounded-lg"
                  >
                    Open Image Settings Modal
                  </button>
                ) : (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[10px] text-[#888] uppercase font-bold">HTML Tag Type</label>
                      <select className="w-full bg-[#141414] border border-[#333] rounded px-2.5 py-1.5 text-xs text-white">
                        <option>Heading 1 (H1)</option>
                        <option>Heading 2 (H2)</option>
                        <option>Heading 3 (H3)</option>
                        <option>Paragraph (P)</option>
                        <option>Text Span</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] text-[#888] uppercase font-bold">Visibility & Display</label>
                      <select className="w-full bg-[#141414] border border-[#333] rounded px-2.5 py-1.5 text-xs text-white">
                        <option>Visible on All Devices</option>
                        <option>Hide on Mobile</option>
                        <option>Hide on Desktop</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. TAB: COMPREHENSIVE FULL-SPECTRUM PAGE SEO */}
            {rightTab === "seo" && (
              <div className="space-y-4">
                <div className="bg-[#fe9201]/10 border border-[#fe9201]/30 p-2.5 rounded-lg flex items-center justify-between">
                  <span className="text-[11px] font-black text-[#fe9201] uppercase">
                    Page SEO Suite: {activePage}
                  </span>
                  <span className="text-[9px] bg-emerald-500/20 text-emerald-400 font-bold px-2 py-0.5 rounded-full">
                    Health: 98%
                  </span>
                </div>

                {/* Primary Focus Keyword */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="text-white font-bold uppercase">Primary Focus Keyword</label>
                    <span className="text-[#fe9201] font-bold">Target #1</span>
                  </div>
                  <input
                    type="text"
                    value={currentSeo.keywords || ""}
                    onChange={(e) => updateSeo(activePage, { keywords: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded-lg p-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="e.g. FMCG distribution Tanzania"
                  />
                </div>

                {/* Meta Title with Character Counter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="text-white font-bold uppercase">SEO Meta Title Tag</label>
                    <span
                      className={`font-mono font-bold ${
                        currentSeo.title.length > 60 ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {currentSeo.title.length}/60 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentSeo.title}
                    onChange={(e) => updateSeo(activePage, { title: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded-lg p-2 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                  <div className="w-full bg-[#252525] h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        currentSeo.title.length <= 60 ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${Math.min(100, (currentSeo.title.length / 60) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Meta Description with Character Counter */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[10px]">
                    <label className="text-white font-bold uppercase">Meta Description Tag</label>
                    <span
                      className={`font-mono font-bold ${
                        currentSeo.description.length > 160 ? "text-amber-400" : "text-emerald-400"
                      }`}
                    >
                      {currentSeo.description.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={currentSeo.description}
                    onChange={(e) => updateSeo(activePage, { description: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded-lg p-2 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                  <div className="w-full bg-[#252525] h-1 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        currentSeo.description.length <= 160 ? "bg-emerald-400" : "bg-amber-400"
                      }`}
                      style={{ width: `${Math.min(100, (currentSeo.description.length / 160) * 100)}%` }}
                    ></div>
                  </div>
                </div>

                {/* Canonical URL Path */}
                <div className="space-y-1">
                  <label className="text-[10px] text-white font-bold uppercase">Canonical URL Path</label>
                  <input
                    type="text"
                    value={currentSeo.canonical_path}
                    onChange={(e) => updateSeo(activePage, { canonical_path: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded-lg p-2 text-xs text-white outline-none focus:border-[#fe9201]"
                    placeholder="/services"
                  />
                </div>

                {/* OpenGraph Image for WhatsApp / LinkedIn / Facebook */}
                <div className="space-y-1">
                  <label className="text-[10px] text-white font-bold uppercase">
                    Social Preview Image (OG Image)
                  </label>
                  <input
                    type="text"
                    value={currentSeo.og_image || ""}
                    onChange={(e) => updateSeo(activePage, { og_image: e.target.value })}
                    className="w-full bg-[#141414] border border-[#333] rounded-lg p-2 text-xs text-white outline-none focus:border-[#fe9201]"
                  />
                  {currentSeo.og_image && (
                    <img
                      src={currentSeo.og_image}
                      alt=""
                      className="w-full h-24 object-cover rounded-lg border border-[#333] mt-1.5"
                    />
                  )}
                </div>

                {/* Live Google Search Preview Snippet */}
                <div className="border border-[#2d2d2d] bg-[#121212] p-3 rounded-lg space-y-1">
                  <div className="text-[10px] text-[#777] font-bold uppercase">Google SERP Snippet Preview</div>
                  <div className="text-[11px] text-[#1a0dab] dark:text-[#8ab4f8] font-medium truncate cursor-pointer hover:underline">
                    {currentSeo.title}
                  </div>
                  <div className="text-[9px] text-[#006621] dark:text-[#34a853] truncate">
                    https://augustaurea.co.tz{currentSeo.canonical_path}
                  </div>
                  <div className="text-[10px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2">
                    {currentSeo.description}
                  </div>
                </div>

                {/* Save SEO Button */}
                <button
                  onClick={async () => {
                    const ok = await saveSeo(activePage);
                    setSaveStatus(ok ? "SEO Metadata Saved to MySQL!" : "Failed to save SEO.");
                    setTimeout(() => setSaveStatus(""), 3000);
                  }}
                  className="w-full bg-[#fe9201] text-[#080300] font-black uppercase text-xs py-2.5 rounded-lg transition shadow-md hover:bg-white"
                >
                  Save Full Page SEO
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
