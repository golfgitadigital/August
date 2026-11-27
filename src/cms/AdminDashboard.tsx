import React, { useState } from "react";
import { useCms } from "./CmsContext";
import { AudienceTrafficReports } from "./AudienceTrafficReports";

export function AdminDashboard({
  onOpenEditor,
  onLogout,
}: {
  onOpenEditor: (page: string) => void;
  onLogout?: () => void;
}) {
  const { seoList, updateSeo, saveSeo, assets } = useCms();
  const [activeTab, setActiveTab] = useState<"overview" | "pages" | "globalseo" | "analytics">("overview");
  const [timeRange, setTimeRange] = useState("30d");

  // Global SEO settings state
  const [globalSeo, setGlobalSeo] = useState({
    siteName: "AuGust Aurea Limited",
    siteUrl: "https://augustaurea.co.tz",
    faviconUrl: "/brand/august-aurea-logo.png",
    webclipUrl: "/brand/august-aurea-logo.png",
    defaultOgImage: "https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1200&q=80",
    googleAnalyticsId: "G-AUG2025AA",
    googleSearchConsole: "google-site-verification=august-aurea-verify-code",
    robotsIndex: true,
    robotsFollow: true,
    sitemapUrl: "https://augustaurea.co.tz/sitemap.xml",
    structuredDataOrg: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Corporation",
      "name": "AuGust Aurea Limited",
      "url": "https://augustaurea.co.tz",
      "logo": "https://augustaurea.co.tz/brand/august-aurea-logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+255-700-000-000",
        "contactType": "sales",
        "areaServed": ["TZ", "KE", "UG", "RW", "CD", "ZM", "MZ", "MW"],
        "availableLanguage": ["English", "Swahili"]
      }
    }, null, 2)
  });

  const [savedMsg, setSavedMsg] = useState("");

  const pageList = [
    { key: "Home", name: "Home Page", path: "/", sections: 9, lastUpdated: "Today 16:42", visits: "28,490", bounceRate: "28.4%" },
    { key: "About", name: "About Us", path: "/about", sections: 4, lastUpdated: "Yesterday", visits: "12,180", bounceRate: "34.1%" },
    { key: "Services", name: "Trading & Logistics Services", path: "/services", sections: 5, lastUpdated: "2 days ago", visits: "19,820", bounceRate: "22.8%" },
    { key: "Products", name: "Wholesale Catalogue", path: "/products", sections: 6, lastUpdated: "Today 11:20", visits: "34,910", bounceRate: "18.3%" },
    { key: "Gallery", name: "Operations Gallery", path: "/gallery", sections: 3, lastUpdated: "3 days ago", visits: "8,430", bounceRate: "41.0%" },
    { key: "News", name: "Trade News & Market Briefs", path: "/news", sections: 4, lastUpdated: "Today 09:15", visits: "14,210", bounceRate: "31.5%" },
    { key: "Careers", name: "Careers & Culture", path: "/careers", sections: 3, lastUpdated: "5 days ago", visits: "6,920", bounceRate: "48.2%" },
    { key: "Contact", name: "Contact & Wholesale Enquiry", path: "/contact", sections: 4, lastUpdated: "Today 15:30", visits: "22,140", bounceRate: "14.9%" },
  ];

  const handleSaveGlobalSeo = () => {
    setSavedMsg("Global SEO & Meta configuration saved to MySQL!");
    setTimeout(() => setSavedMsg(""), 3500);
  };

  return (
    <div className="admin-portal min-h-screen bg-[#09070f] text-[#d6d4e8] font-sans flex antialiased">
      {/* LEFT NAVIGATION SIDEBAR */}
      <aside className="w-[260px] bg-[#0e0a1a] border-r border-[#261f3d] flex flex-col shrink-0 min-h-screen select-none">
        {/* Brand */}
        <div className="h-[70px] border-b border-[#261f3d] flex items-center px-6 gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#fe9201] to-[#ffb653] flex items-center justify-center font-black text-[#080300] shadow-lg shadow-[#fe9201]/30 shrink-0">
            AA
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-white tracking-wide">AuGust Admin</h1>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live MySQL DB
            </span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="p-4 space-y-2 flex-1 flex flex-col overflow-y-auto">
          <div className="text-[10px] uppercase font-bold text-[#625985] tracking-wider px-3 mb-2 shrink-0">Main Menu</div>
          <button
            type="button"
            onClick={() => setActiveTab("overview")}
            className={`w-full flex items-center gap-3 px-3.5 min-h-[44px] h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "overview"
                ? "bg-gradient-to-r from-[#fe9201] to-[#e68300] text-[#080300] shadow-md shadow-[#fe9201]/20 font-black"
                : "text-[#9d95be] hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
            <span className="truncate">Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pages")}
            className={`w-full flex items-center justify-between px-3.5 min-h-[44px] h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "pages"
                ? "bg-gradient-to-r from-[#fe9201] to-[#e68300] text-[#080300] shadow-md shadow-[#fe9201]/20 font-black"
                : "text-[#9d95be] hover:bg-white/5 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-3 truncate">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <span className="truncate">Pages &amp; Editor</span>
            </div>
            <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono shrink-0">8</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("globalseo")}
            className={`w-full flex items-center gap-3 px-3.5 min-h-[44px] h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "globalseo"
                ? "bg-gradient-to-r from-[#fe9201] to-[#e68300] text-[#080300] shadow-md shadow-[#fe9201]/20 font-black"
                : "text-[#9d95be] hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span className="truncate">Site-wide SEO &amp; Meta</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("analytics")}
            className={`w-full flex items-center gap-3 px-3.5 min-h-[44px] h-[44px] rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === "analytics"
                ? "bg-gradient-to-r from-[#fe9201] to-[#e68300] text-[#080300] shadow-md shadow-[#fe9201]/20 font-black"
                : "text-[#9d95be] hover:bg-white/5 hover:text-white"
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span className="truncate">Audience Traffic</span>
          </button>
        </div>

        {/* Bottom user & live site preview */}
        <div className="p-4 border-t border-[#261f3d] bg-[#0a0714] shrink-0 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 border border-[#fe9201]/40 rounded-xl text-xs font-extrabold text-[#fe9201] hover:bg-[#fe9201] hover:text-[#080300] transition cursor-pointer"
          >
            Visit Public Website ↗
          </a>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-rose-500/10 border border-rose-500/20 hover:border-rose-500/50 rounded-xl text-xs font-bold text-rose-300 hover:bg-rose-500 hover:text-white transition cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header */}
        <header className="admin-header h-[72px] border-b border-[#261f3d] bg-[#0c0917] px-8 flex items-center justify-between sticky top-0 z-20 shadow-md">
          <div>
            <h2 className="text-xl font-black text-white tracking-wide capitalize drop-shadow-sm">
              {activeTab === "overview" && "Executive Analytics & Performance"}
              {activeTab === "pages" && "Site Pages & Visual Editor"}
              {activeTab === "globalseo" && "Site-wide SEO & Canonical Architecture"}
              {activeTab === "analytics" && "Audience Traffic & Referral Channels"}
            </h2>
            <p className="text-xs text-[#a59ebf] font-medium mt-0.5">
              {activeTab === "overview" && "Real-time user engagement, regional telemetry, and traffic distribution"}
              {activeTab === "pages" && "Select any page to launch the live 1:1 visual Webflow-style studio"}
              {activeTab === "globalseo" && "Manage domain authority, Google Search Console, OpenGraph, Webclip and Favicons"}
              {activeTab === "analytics" && "Deep-dive referral corridors: Google, LinkedIn, WhatsApp, Direct"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-[#181328] border border-[#2d2448] text-white text-xs rounded-xl px-3 py-2 outline-none font-bold hover:border-[#fe9201]/50 cursor-pointer transition"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Quarterly (90 Days)</option>
              <option value="1y">Year to Date (YTD)</option>
            </select>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Log Out of Admin"
                className="flex items-center gap-1.5 px-3 py-2 bg-[#1b152e] hover:bg-rose-500/20 text-[#a59ebf] hover:text-rose-300 border border-[#2e2450] hover:border-rose-500/40 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log Out</span>
              </button>
            )}
          </div>
        </header>

        {/* TAB 1: OVERVIEW & FUTURISTIC CHARTS */}
        {activeTab === "overview" && (
          <div className="p-8 space-y-8">
            {/* KPI STAT CARDS WITH NEON GLOW */}
            <div className="grid grid-cols-4 gap-5">
              <div className="bg-gradient-to-b from-[#181328] to-[#100c1e] border border-[#2e254a] rounded-2xl p-5 relative overflow-hidden group hover:border-[#fe9201]/50 transition-all shadow-xl">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#fe9201]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#fe9201]/20 transition"></div>
                <div className="flex items-center justify-between text-xs text-[#8c84ad] font-bold uppercase tracking-wider mb-2">
                  <span>Total Page Views</span>
                  <span className="text-emerald-400 font-extrabold">+24.8%</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">147,380</div>
                <div className="text-[11px] text-[#716896] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Avg 4,912 visitors / day
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#181328] to-[#100c1e] border border-[#2e254a] rounded-2xl p-5 relative overflow-hidden group hover:border-[#3b82f6]/50 transition-all shadow-xl">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#3b82f6]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#3b82f6]/20 transition"></div>
                <div className="flex items-center justify-between text-xs text-[#8c84ad] font-bold uppercase tracking-wider mb-2">
                  <span>Unique Visitors</span>
                  <span className="text-emerald-400 font-extrabold">+18.2%</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">58,920</div>
                <div className="text-[11px] text-[#716896] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]"></span>
                  Tanzania & East Africa 78%
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#181328] to-[#100c1e] border border-[#2e254a] rounded-2xl p-5 relative overflow-hidden group hover:border-[#10b981]/50 transition-all shadow-xl">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#10b981]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#10b981]/20 transition"></div>
                <div className="flex items-center justify-between text-xs text-[#8c84ad] font-bold uppercase tracking-wider mb-2">
                  <span>Wholesale Enquiries</span>
                  <span className="text-emerald-400 font-extrabold">+31.5%</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">1,248</div>
                <div className="text-[11px] text-[#716896] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  92% within 24h quote SLA
                </div>
              </div>

              <div className="bg-gradient-to-b from-[#181328] to-[#100c1e] border border-[#2e254a] rounded-2xl p-5 relative overflow-hidden group hover:border-[#a855f7]/50 transition-all shadow-xl">
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-[#a855f7]/10 rounded-full blur-xl pointer-events-none group-hover:bg-[#a855f7]/20 transition"></div>
                <div className="flex items-center justify-between text-xs text-[#8c84ad] font-bold uppercase tracking-wider mb-2">
                  <span>Avg Session Duration</span>
                  <span className="text-emerald-400 font-extrabold">+12.4%</span>
                </div>
                <div className="text-3xl font-black text-white tracking-tight">3m 48s</div>
                <div className="text-[11px] text-[#716896] mt-2 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a855f7]"></span>
                  Bounce rate down to 24.1%
                </div>
              </div>
            </div>

            {/* FUTURISTIC SVG CHARTS GRID */}
            <div className="grid grid-cols-3 gap-6">
              {/* Main Traffic Trajectory (Col 2) */}
              <div className="col-span-2 bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl relative">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-sm font-extrabold text-white">Monthly Visitor Velocity & Acquisition Curve</h3>
                    <p className="text-xs text-[#7d75a0]">Daily impressions, direct requests, and wholesale traffic</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-white">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#fe9201]"></span> Page Views
                    </span>
                    <span className="flex items-center gap-1.5 text-[#7d75a0]">
                      <span className="w-2.5 h-2.5 rounded-sm bg-[#3b82f6]"></span> Unique Buyers
                    </span>
                  </div>
                </div>

                {/* SVG Line Graph */}
                <div className="h-[240px] w-full relative">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="gradOrange" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fe9201" stopOpacity="0.45" />
                        <stop offset="100%" stopColor="#fe9201" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="gradBlue" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    <line x1="0" y1="40" x2="600" y2="40" stroke="#251d3b" strokeDasharray="4 4" />
                    <line x1="0" y1="90" x2="600" y2="90" stroke="#251d3b" strokeDasharray="4 4" />
                    <line x1="0" y1="140" x2="600" y2="140" stroke="#251d3b" strokeDasharray="4 4" />
                    <line x1="0" y1="190" x2="600" y2="190" stroke="#251d3b" />

                    {/* Area 1: Orange Views */}
                    <path
                      d="M0,170 C60,150 120,110 180,125 C240,140 300,70 360,60 C420,50 480,95 540,40 L600,20 L600,200 L0,200 Z"
                      fill="url(#gradOrange)"
                    />
                    <path
                      d="M0,170 C60,150 120,110 180,125 C240,140 300,70 360,60 C420,50 480,95 540,40 L600,20"
                      fill="none"
                      stroke="#fe9201"
                      strokeWidth="3.5"
                    />

                    {/* Area 2: Blue Buyers */}
                    <path
                      d="M0,185 C60,175 120,145 180,155 C240,165 300,120 360,110 C420,105 480,135 540,85 L600,70 L600,200 L0,200 Z"
                      fill="url(#gradBlue)"
                    />
                    <path
                      d="M0,185 C60,175 120,145 180,155 C240,165 300,120 360,110 C420,105 480,135 540,85 L600,70"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2.5"
                    />

                    {/* Points on Orange */}
                    {[[180, 125], [360, 60], [540, 40], [600, 20]].map(([x, y], i) => (
                      <circle key={i} cx={x} cy={y} r="5" fill="#fe9201" stroke="#fff" strokeWidth="2" />
                    ))}
                  </svg>
                </div>

                <div className="flex justify-between text-[11px] text-[#716896] mt-4 font-mono font-bold">
                  <span>W1 (May 01)</span>
                  <span>W2 (May 08)</span>
                  <span>W3 (May 15)</span>
                  <span>W4 (May 22)</span>
                  <span>W5 (May 29)</span>
                </div>
              </div>

              {/* Referral Platforms Breakdown (Col 1) */}
              <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-white mb-1">Referral Channels</h3>
                  <p className="text-xs text-[#7d75a0] mb-5">Where users discover AuGust Aurea</p>

                  <div className="space-y-4 text-xs">
                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="flex items-center gap-2 text-white">
                          <span className="w-2 h-2 rounded-full bg-[#fe9201]"></span> Google Search (Organic)
                        </span>
                        <span className="font-mono text-[#fe9201]">44.6%</span>
                      </div>
                      <div className="w-full bg-[#241c38] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#fe9201] h-full rounded-full" style={{ width: "44.6%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="flex items-center gap-2 text-white">
                          <span className="w-2 h-2 rounded-full bg-[#25d366]"></span> WhatsApp Shared Links
                        </span>
                        <span className="font-mono text-[#25d366]">27.2%</span>
                      </div>
                      <div className="w-full bg-[#241c38] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#25d366] h-full rounded-full" style={{ width: "27.2%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="flex items-center gap-2 text-white">
                          <span className="w-2 h-2 rounded-full bg-[#0077b5]"></span> LinkedIn B2B Corridor
                        </span>
                        <span className="font-mono text-[#0077b5]">16.4%</span>
                      </div>
                      <div className="w-full bg-[#241c38] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#0077b5] h-full rounded-full" style={{ width: "16.4%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-bold mb-1">
                        <span className="flex items-center gap-2 text-white">
                          <span className="w-2 h-2 rounded-full bg-[#a855f7]"></span> Direct / Trade Fair QR
                        </span>
                        <span className="font-mono text-[#a855f7]">11.8%</span>
                      </div>
                      <div className="w-full bg-[#241c38] h-2 rounded-full overflow-hidden">
                        <div className="bg-[#a855f7] h-full rounded-full" style={{ width: "11.8%" }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-[#181329] p-3 rounded-xl border border-[#2d2448] text-[11px] text-[#938ba8] mt-4 flex items-center justify-between">
                  <span>High intent keyword: <strong>"FMCG Tanzania"</strong></span>
                  <span className="text-emerald-400 font-bold">Rank #1</span>
                </div>
              </div>
            </div>

            {/* QUICK ACTIONS & PAGES TABLE */}
            <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-sm font-extrabold text-white">Managed Site Pages ({pageList.length})</h3>
                  <p className="text-xs text-[#7d75a0]">Click 'Edit Content' on any page to open the 1:1 visual Webflow editor</p>
                </div>
                <button
                  onClick={() => setActiveTab("pages")}
                  className="text-xs text-[#fe9201] hover:underline font-bold"
                >
                  View All Detailed Pages →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#292044] text-[#716896] uppercase text-[10px] font-bold">
                      <th className="pb-3 px-3">Page Name</th>
                      <th className="pb-3 px-3">Route Path</th>
                      <th className="pb-3 px-3">Sections</th>
                      <th className="pb-3 px-3">Traffic</th>
                      <th className="pb-3 px-3">Bounce Rate</th>
                      <th className="pb-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1733]">
                    {pageList.map((p) => (
                      <tr key={p.key} className="hover:bg-white/5 transition">
                        <td className="py-3.5 px-3 font-bold text-white flex items-center gap-2">
                          <span className="text-[#fe9201]">📄</span> {p.name}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-[#8c84ad]">{p.path}</td>
                        <td className="py-3.5 px-3 text-[#b0a9cb]">{p.sections} Sections</td>
                        <td className="py-3.5 px-3 font-mono font-bold text-emerald-400">{p.visits}</td>
                        <td className="py-3.5 px-3 text-[#8c84ad]">{p.bounceRate}</td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            onClick={() => onOpenEditor(p.key)}
                            className="bg-[#fe9201] hover:bg-[#d97800] text-[#080300] font-black px-3 py-1.5 rounded-lg text-[11px] uppercase tracking-wider transition shadow-sm"
                          >
                            Edit Content ✎
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PAGES LIST */}
        {activeTab === "pages" && (
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-2 gap-5">
              {pageList.map((p) => (
                <div key={p.key} className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl flex flex-col justify-between hover:border-[#fe9201]/40 transition">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">📄</span>
                        <h3 className="text-base font-extrabold text-white">{p.name}</h3>
                      </div>
                      <span className="font-mono text-xs text-[#fe9201] bg-[#fe9201]/10 px-2 py-0.5 rounded">
                        {p.path}
                      </span>
                    </div>
                    <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold">
                      Published
                    </span>
                  </div>

                  <p className="text-xs text-[#8c84ad] mb-6">
                    Contains {p.sections} dynamic visual content sections and dedicated search engine metadata.
                  </p>

                  <div className="border-t border-[#261f3d] pt-4 flex items-center justify-between">
                    <span className="text-[11px] text-[#716896]">Updated {p.lastUpdated}</span>
                    <button
                      onClick={() => onOpenEditor(p.key)}
                      className="bg-gradient-to-r from-[#fe9201] to-[#e68300] hover:from-[#e68300] hover:to-[#c26f00] text-[#080300] font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider transition shadow-lg shadow-[#fe9201]/20 flex items-center gap-2"
                    >
                      <span>Open in Studio</span> ✎
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: COMPLETE COMPREHENSIVE SITE-WIDE SEO SUITE */}
        {activeTab === "globalseo" && (
          <div className="p-8 space-y-8 max-w-5xl">
            {savedMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl text-xs font-bold flex items-center justify-between">
                <span>✓ {savedMsg}</span>
              </div>
            )}

            {/* Card 1: Domain & Global Indexing */}
            <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-[#fe9201]">
                1. Domain & Canonical Root Architecture
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Global Canonical URL Root</label>
                  <input
                    type="text"
                    value={globalSeo.siteUrl}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, siteUrl: e.target.value })}
                    className="w-full bg-[#181329] border border-[#2d2448] text-white text-xs rounded-xl p-3 outline-none focus:border-[#fe9201]"
                    placeholder="https://augustaurea.co.tz"
                  />
                  <span className="text-[10px] text-[#716896]">Enforces master canonical domain against duplicate content</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Brand / Corporation Name</label>
                  <input
                    type="text"
                    value={globalSeo.siteName}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, siteName: e.target.value })}
                    className="w-full bg-[#181329] border border-[#2d2448] text-white text-xs rounded-xl p-3 outline-none focus:border-[#fe9201]"
                  />
                  <span className="text-[10px] text-[#716896]">Used in Rich Snippets and Schema organization tags</span>
                </div>
              </div>
            </div>

            {/* Card 2: Favicon & Webclip Assets */}
            <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-[#fe9201]">
                2. Favicon & Apple Touch Webclip Icons
              </h3>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#181329] p-4 rounded-xl border border-[#2d2448] flex items-center gap-4">
                  <img src={globalSeo.faviconUrl} alt="Favicon" className="w-12 h-12 object-contain bg-white/5 p-2 rounded-lg border border-white/10" />
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-white block">Standard Favicon (32x32)</span>
                    <input
                      type="text"
                      value={globalSeo.faviconUrl}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, faviconUrl: e.target.value })}
                      className="w-full bg-black/40 border border-[#3c3258] text-[11px] text-white rounded p-1.5 outline-none"
                    />
                  </div>
                </div>

                <div className="bg-[#181329] p-4 rounded-xl border border-[#2d2448] flex items-center gap-4">
                  <img src={globalSeo.webclipUrl} alt="Webclip" className="w-12 h-12 object-contain bg-white/5 p-2 rounded-lg border border-white/10" />
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-white block">Apple Touch Webclip Icon (256x256)</span>
                    <input
                      type="text"
                      value={globalSeo.webclipUrl}
                      onChange={(e) => setGlobalSeo({ ...globalSeo, webclipUrl: e.target.value })}
                      className="w-full bg-black/40 border border-[#3c3258] text-[11px] text-white rounded p-1.5 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Google Search Console, Analytics & Verification */}
            <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-[#fe9201]">
                3. Search Engine Verification & Crawling Directives
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Google Search Console Verification Token</label>
                  <input
                    type="text"
                    value={globalSeo.googleSearchConsole}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, googleSearchConsole: e.target.value })}
                    className="w-full bg-[#181329] border border-[#2d2448] text-white text-xs rounded-xl p-3 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Google Analytics 4 Tracking ID</label>
                  <input
                    type="text"
                    value={globalSeo.googleAnalyticsId}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, googleAnalyticsId: e.target.value })}
                    className="w-full bg-[#181329] border border-[#2d2448] text-white text-xs rounded-xl p-3 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">XML Sitemap Location</label>
                  <input
                    type="text"
                    value={globalSeo.sitemapUrl}
                    onChange={(e) => setGlobalSeo({ ...globalSeo, sitemapUrl: e.target.value })}
                    className="w-full bg-[#181329] border border-[#2d2448] text-white text-xs rounded-xl p-3 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white">Robots Indexing Directives</label>
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSeo.robotsIndex}
                        onChange={(e) => setGlobalSeo({ ...globalSeo, robotsIndex: e.target.checked })}
                      />
                      index (Allow indexing)
                    </label>
                    <label className="flex items-center gap-2 text-xs text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={globalSeo.robotsFollow}
                        onChange={(e) => setGlobalSeo({ ...globalSeo, robotsFollow: e.target.checked })}
                      />
                      follow (Follow links)
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Schema.org JSON-LD Structured Data */}
            <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider text-[#fe9201]">
                4. Structured Data (Schema.org JSON-LD)
              </h3>
              <p className="text-xs text-[#8c84ad]">Injected automatically for Google Knowledge Graph and Google Maps discovery</p>
              <textarea
                rows={7}
                value={globalSeo.structuredDataOrg}
                onChange={(e) => setGlobalSeo({ ...globalSeo, structuredDataOrg: e.target.value })}
                className="w-full bg-[#181329] border border-[#2d2448] text-emerald-400 font-mono text-xs rounded-xl p-3 outline-none"
              />
            </div>

            <button
              onClick={handleSaveGlobalSeo}
              className="bg-gradient-to-r from-[#fe9201] to-[#e68300] hover:from-[#e68300] hover:to-[#c26f00] text-[#080300] font-black px-6 py-3.5 rounded-xl text-xs uppercase tracking-wider transition shadow-xl"
            >
              Save All Global SEO Settings to MySQL
            </button>
          </div>
        )}

        {/* TAB 4: AUDIENCE TRAFFIC BREAKDOWN & MULTIPLE EXPORTABLE REPORTS */}
        {activeTab === "analytics" && (
          <AudienceTrafficReports timeRange={timeRange} />
        )}
      </main>
    </div>
  );
}
