import React, { useState, useMemo } from "react";

export interface ReportConfig {
  id: string;
  title: string;
  sheetName: string;
  category: string;
  description: string;
  headers: string[];
  rows: (string | number)[][];
}

interface AudienceTrafficReportsProps {
  timeRange?: string;
}

export function AudienceTrafficReports({ timeRange = "30d" }: AudienceTrafficReportsProps) {
  const [activeReportId, setActiveReportId] = useState<string>("corridors");
  const [searchQuery, setSearchQuery] = useState("");
  const [exportNotice, setExportNotice] = useState<string>("");

  // Multiplier for time range adjustments
  const multiplier = useMemo(() => {
    switch (timeRange) {
      case "7d":
        return 0.25;
      case "90d":
        return 2.85;
      case "1y":
        return 11.2;
      default:
        return 1.0; // 30d
    }
  }, [timeRange]);

  const timeRangeLabel = useMemo(() => {
    switch (timeRange) {
      case "7d":
        return "Last 7 Days";
      case "90d":
        return "Last 90 Days (Quarter)";
      case "1y":
        return "Year to Date (YTD)";
      default:
        return "Last 30 Days";
    }
  }, [timeRange]);

  // Define 6 comprehensive reports with realistic data adjusted by timeRange
  const reports: ReportConfig[] = useMemo(() => {
    const scale = (val: number) => Math.round(val * multiplier);

    return [
      {
        id: "corridors",
        title: "Regional Trade Corridors & Geolocation",
        sheetName: "Regional Corridors",
        category: "Geography",
        description: "Traffic concentration and wholesale commercial inquiries across East African trade hubs.",
        headers: [
          "Corridor / Hub",
          "Country",
          "Sessions",
          "Unique Visitors",
          "Traffic Share %",
          "Avg Duration",
          "Bounce Rate %",
          "Inquiry Conv. %",
          "MoM Growth %",
        ],
        rows: [
          ["Dar es Salaam (Port & Commercial HQ)", "Tanzania", scale(70800), scale(24900), "48.2%", "4m 12s", "24.1%", "4.8%", "+14%"],
          ["Nairobi Cross-Border Corridor", "Kenya", scale(28500), scale(11200), "19.4%", "3m 45s", "28.5%", "3.9%", "+22%"],
          ["Mwanza (Lake Zone & Gold Belt)", "Tanzania", scale(20700), scale(7800), "14.1%", "3m 18s", "31.0%", "3.4%", "+8%"],
          ["Lusaka & Lubumbashi Transit Line", "Zambia / DRC", scale(16600), scale(6100), "11.3%", "4m 30s", "21.4%", "5.2%", "+35%"],
          ["Mombasa Coastal Logistics Link", "Kenya", scale(3960), scale(1540), "2.7%", "2m 55s", "36.2%", "2.1%", "+11%"],
          ["Kigali Northern Transit Hub", "Rwanda", scale(2640), scale(1020), "1.8%", "3m 20s", "29.8%", "2.8%", "+18%"],
          ["Kampala Logistics Terminal", "Uganda", scale(1760), scale(710), "1.2%", "3m 05s", "33.1%", "2.4%", "+9%"],
          ["Zanzibar Island Clearance Port", "Tanzania", scale(1030), scale(450), "0.7%", "2m 40s", "38.0%", "1.9%", "+6%"],
          ["Arusha & Kilimanjaro Agro Hub", "Tanzania", scale(890), scale(390), "0.6%", "2m 50s", "35.4%", "2.0%", "+12%"],
        ],
      },
      {
        id: "acquisition",
        title: "Traffic Acquisition & Referral Corridors",
        sheetName: "Traffic Sources",
        category: "Acquisition",
        description: "Inbound discovery channels driving procurement officers, trading desks, and commercial buyers.",
        headers: [
          "Channel Grouping",
          "Source / Medium",
          "Sessions",
          "New Users",
          "Engagement Rate %",
          "Avg Duration",
          "WhatsApp Clicks",
          "RFQ Submissions",
          "Conversion Rate %",
        ],
        rows: [
          ["Organic Search", "Google / Organic (FMCG Wholesale)", scale(54200), scale(21800), "72.4%", "3m 52s", scale(480), scale(312), "5.8%"],
          ["Direct Corporate", "Direct URL / Bookmarked Desks", scale(38900), scale(9400), "81.2%", "4m 28s", scale(390), scale(285), "6.9%"],
          ["Social / Mobile", "WhatsApp Business Direct Links", scale(24100), scale(11200), "88.5%", "4m 45s", scale(820), scale(140), "9.2%"],
          ["B2B Professional", "LinkedIn / Sponsored Corridors", scale(16300), scale(7100), "68.9%", "3m 15s", scale(185), scale(142), "4.4%"],
          ["Regional Directories", "TCCIA & EABC Trade Portals", scale(8400), scale(3900), "64.2%", "2m 58s", scale(92), scale(64), "3.6%"],
          ["Email Newsletters", "Commodity Briefs & Rate Sheets", scale(4990), scale(850), "84.1%", "5m 10s", scale(120), scale(118), "8.4%"],
        ],
      },
      {
        id: "pages",
        title: "Page Performance & Content Engagement",
        sheetName: "Page Performance",
        category: "Behavior",
        description: "Pageviews, dwell times, and commercial conversion paths across all corporate website sections.",
        headers: [
          "Page URL",
          "Page Title",
          "Pageviews",
          "Unique Pageviews",
          "Avg Time on Page",
          "Bounce Rate %",
          "Exit Rate %",
          "Wholesale CTAs Clicked",
        ],
        rows: [
          ["/products", "Wholesale Product Catalogue", scale(34910), scale(28400), "4m 22s", "18.3%", "16.4%", scale(412)],
          ["/", "Home - AuGust Aurea Gateway", scale(28490), scale(22100), "3m 15s", "28.4%", "21.0%", scale(248)],
          ["/contact", "Contact & Wholesale Enquiries", scale(22140), scale(19800), "5m 12s", "14.9%", "38.2%", scale(594)],
          ["/services", "Trading, Logistics & Mining Distribution", scale(19820), scale(15900), "3m 40s", "22.8%", "19.5%", scale(185)],
          ["/news", "Trade News & Market Briefs", scale(14210), scale(11400), "3m 50s", "31.5%", "26.8%", scale(84)],
          ["/about", "Our Story & Regional Mission", scale(12180), scale(9800), "2m 45s", "34.1%", "29.4%", scale(62)],
          ["/gallery", "Operations & Fleet Infrastructure", scale(8430), scale(6900), "2m 10s", "41.0%", "35.0%", scale(38)],
          ["/careers", "Careers & Commercial Culture", scale(6920), scale(5400), "2m 30s", "48.2%", "42.0%", scale(118)],
        ],
      },
      {
        id: "devices",
        title: "Device, OS & Technology Telemetry",
        sheetName: "Device Telemetry",
        category: "Technology",
        description: "Hardware and software breakdown of procurement officers and field logistics managers.",
        headers: [
          "Device Category",
          "Operating System",
          "Typical Resolution",
          "Total Sessions",
          "Share %",
          "Avg Duration",
          "Form Completion %",
        ],
        rows: [
          ["Mobile Phone", "Android (Tecno, Infinix, Samsung)", "390 x 844", scale(78400), "53.4%", "3m 22s", "7.8%"],
          ["Desktop PC", "Windows 10 / 11 (Procurement Desks)", "1920 x 1080", scale(45200), "30.8%", "5m 14s", "8.4%"],
          ["Mobile Phone", "Apple iOS (iPhone Pro / Plus)", "393 x 852", scale(14800), "10.1%", "4m 02s", "6.9%"],
          ["Laptop", "Apple macOS (MacBook Pro / Air)", "1440 x 900", scale(6100), "4.2%", "4m 48s", "7.1%"],
          ["Tablet", "Apple iPadOS & Android Tablets", "820 x 1180", scale(2390), "1.5%", "3m 35s", "5.2%"],
        ],
      },
      {
        id: "leads",
        title: "Wholesale Enquiries & B2B Leads Log",
        sheetName: "Wholesale Leads",
        category: "Conversions",
        description: "Documented RFQ submissions, supplier requests, and verified cross-border quotes.",
        headers: [
          "Lead ID",
          "Company / Organization",
          "Requirement Type",
          "Destination Market",
          "Source Channel",
          "Est. Volume",
          "Contact Verification",
          "Status",
        ],
        rows: [
          ["RFQ-8902", "Kilimanjaro Commercial Retailers", "FMCG Wholesale (Edible Oils & Rice)", "Arusha, Tanzania", "Website Form", "60 Metric Tonnes", "Verified Email & Phone", "Quoted (Within 24h)"],
          ["RFQ-8901", "Shanta Gold Mining Logistics", "Mining Consumables & PPE", "Lupa Goldfield, Mbeya", "WhatsApp Business", "Bulk Site Supply", "Verified Corporate Account", "In Negotiation"],
          ["RFQ-8900", "Kigali Horizon Distributors Ltd", "General FMCG Distribution", "Kigali, Rwanda", "Direct Inbound", "3 x 40ft Containers", "Verified VAT Registered", "Active Contract"],
          ["RFQ-8899", "Copperbelt Industrial Supplies", "Industrial Cleaning & Chemicals", "Kitwe / Ndola, Zambia", "Google Search", "Monthly Standing Order", "Verified Procurement Lead", "Quoted"],
          ["RFQ-8898", "Mwanza Lake Traders Union", "Bulk Grains & Sunflower Oil", "Mwanza, Tanzania", "WhatsApp Business", "40 Metric Tonnes", "Verified Account Rep", "Closed Won"],
          ["RFQ-8897", "Lubumbashi Mining Depot Sprl", "Heavy Duty Site Safety Equipment", "Lubumbashi, DRC", "LinkedIn B2B", "Consignment Order", "Pending Tax PIN", "Under Review"],
          ["RFQ-8896", "Dar es Salaam Port Cargo Express", "Freight & Packaging Materials", "Kurasini, Dar es Salaam", "Website Form", "Weekly Reorder", "Verified Local Partner", "Active"],
        ],
      },
      {
        id: "trends",
        title: "Daily Traffic Telemetry & Engagement Trend",
        sheetName: "Daily Trend",
        category: "Telemetry",
        description: "Day-by-day telemetry tracking visits, unique commercial visitors, and engagement peaks.",
        headers: [
          "Date (YYYY-MM-DD)",
          "Total Sessions",
          "Unique Visitors",
          "Pageviews",
          "Returning %",
          "WhatsApp Inquiries",
          "RFQ Submissions",
        ],
        rows: [
          ["2026-11-26", scale(5120), scale(3420), scale(12400), "33.2%", scale(48), scale(28)],
          ["2026-11-25", scale(4980), scale(3290), scale(11850), "33.9%", scale(44), scale(26)],
          ["2026-11-24", scale(5340), scale(3560), scale(13100), "33.3%", scale(52), scale(31)],
          ["2026-11-23", scale(5210), scale(3490), scale(12800), "33.0%", scale(46), scale(29)],
          ["2026-11-22", scale(3890), scale(2610), scale(9400), "32.9%", scale(32), scale(18)],
          ["2026-11-21", scale(3650), scale(2420), scale(8800), "33.7%", scale(28), scale(15)],
          ["2026-11-20", scale(4890), scale(3210), scale(11600), "34.4%", scale(41), scale(24)],
        ],
      },
    ];
  }, [multiplier]);

  // Current selected report
  const currentReport = useMemo(() => {
    return reports.find((r) => r.id === activeReportId) || reports[0];
  }, [reports, activeReportId]);

  // Filtered rows based on search
  const filteredRows = useMemo(() => {
    if (!searchQuery.trim()) return currentReport.rows;
    const q = searchQuery.toLowerCase();
    return currentReport.rows.filter((row) =>
      row.some((cell) => String(cell).toLowerCase().includes(q))
    );
  }, [currentReport, searchQuery]);

  // Helper to escape CSV cells
  const escapeCsv = (val: string | number): string => {
    const str = String(val ?? "");
    if (str.includes(",") || str.includes('"') || str.includes("\n")) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // Export single report as CSV
  const handleExportCsv = (report: ReportConfig) => {
    const csvContent = [
      report.headers.map(escapeCsv).join(","),
      ...report.rows.map((r) => r.map(escapeCsv).join(",")),
    ].join("\r\n");

    // Prepend UTF-8 BOM (\uFEFF) so Excel on Windows/Mac opens it cleanly
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const today = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `AuGust_${report.title.replace(/[^a-zA-Z0-9]/g, "_")}_${timeRange}_${today}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported "${report.title}" as CSV successfully!`);
    setTimeout(() => setExportNotice(""), 3500);
  };

  // Export single report as Excel XML (.xls)
  const handleExportExcel = (report: ReportConfig) => {
    const today = new Date().toISOString().slice(0, 10);
    const xmlContent = generateExcelXml([report], `AuGust Aurea - ${report.title}`);

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AuGust_${report.title.replace(/[^a-zA-Z0-9]/g, "_")}_${timeRange}_${today}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported "${report.title}" as formatted Excel spreadsheet!`);
    setTimeout(() => setExportNotice(""), 3500);
  };

  // Master Export: Download multi-sheet Excel Workbook with ALL 6 reports
  const handleExportAllExcel = () => {
    const today = new Date().toISOString().slice(0, 10);
    const xmlContent = generateExcelXml(reports, "AuGust Aurea Limited - Complete Audience Telemetry Pack");

    const blob = new Blob([xmlContent], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AuGust_Complete_Traffic_Workbook_${timeRange}_${today}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setExportNotice(`Exported complete multi-report Excel workbook (all 6 reports)!`);
    setTimeout(() => setExportNotice(""), 4000);
  };

  // Master Export: Download all reports as individual CSVs in sequence
  const handleExportAllCsv = () => {
    reports.forEach((rep, idx) => {
      setTimeout(() => {
        handleExportCsv(rep);
      }, idx * 250);
    });

    setExportNotice(`Triggered download for all ${reports.length} CSV reports!`);
    setTimeout(() => setExportNotice(""), 4000);
  };

  // Helper to build valid XML-based Excel file with custom styling and multiple worksheets
  function generateExcelXml(reportList: ReportConfig[], workbookTitle: string): string {
    const escapeXml = (str: string | number) =>
      String(str ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    let sheetsXml = "";

    reportList.forEach((rep) => {
      const sheetName = rep.sheetName.replace(/[:\\/?*[\]]/g, "").slice(0, 31);

      let rowsXml = "";

      // Title & Subtitle banner inside sheet
      rowsXml += `
        <Row ss:Height="24">
          <Cell ss:MergeAcross="${rep.headers.length - 1}" ss:StyleID="HeaderBanner">
            <Data ss:Type="String">${escapeXml(rep.title)} (${escapeXml(timeRangeLabel)})</Data>
          </Cell>
        </Row>
        <Row ss:Height="18">
          <Cell ss:MergeAcross="${rep.headers.length - 1}" ss:StyleID="SubBanner">
            <Data ss:Type="String">${escapeXml(rep.description)}</Data>
          </Cell>
        </Row>
        <Row ss:Height="8"><Cell><Data ss:Type="String"></Data></Cell></Row>
      `;

      // Header row
      rowsXml += `<Row ss:Height="22">`;
      rep.headers.forEach((h) => {
        rowsXml += `<Cell ss:StyleID="TableHeader"><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`;
      });
      rowsXml += `</Row>`;

      // Data rows
      rep.rows.forEach((row, rIdx) => {
        const styleId = rIdx % 2 === 0 ? "TableRowEven" : "TableRowOdd";
        rowsXml += `<Row ss:Height="19">`;
        row.forEach((cell) => {
          const isNum = typeof cell === "number";
          const cellType = isNum ? "Number" : "String";
          rowsXml += `<Cell ss:StyleID="${styleId}"><Data ss:Type="${cellType}">${escapeXml(cell)}</Data></Cell>`;
        });
        rowsXml += `</Row>`;
      });

      sheetsXml += `
        <Worksheet ss:Name="${escapeXml(sheetName)}">
          <Table ss:DefaultColumnWidth="120" ss:DefaultRowHeight="18">
            ${rep.headers.map(() => '<Column ss:Width="140" />').join("")}
            ${rowsXml}
          </Table>
        </Worksheet>
      `;
    });

    return `<?xml version="1.0"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>${escapeXml(workbookTitle)}</Title>
  <Author>AuGust Aurea Limited</Author>
  <Company>AuGust Aurea Limited</Company>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#000000"/>
  </Style>
  <Style ss:ID="HeaderBanner">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#FE9201"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Color="#080300" ss:Bold="1"/>
   <Interior ss:Color="#FFF3E0" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="SubBanner">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Color="#666666" ss:Italic="1"/>
   <Interior ss:Color="#FFFDF9" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#261F3D"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CCCCCC"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#FFFFFF" ss:Bold="1"/>
   <Interior ss:Color="#120E21" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableRowEven">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EAEAEA"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1A1A1A"/>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="TableRowOdd">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#EAEAEA"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9.5" ss:Color="#1A1A1A"/>
   <Interior ss:Color="#F9F8FD" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 ${sheetsXml}
</Workbook>`;
  }

  return (
    <div className="p-8 space-y-8 animate-fadeIn">
      {/* SUCCESS / EXPORT NOTIFICATION TOAST */}
      {exportNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#fe9201] text-[#080300] font-black text-xs px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2 border border-[#ffa726] animate-bounce">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span>{exportNotice}</span>
        </div>
      )}

      {/* MASTER TOP BANNER & FULL PACK EXPORT BAR */}
      <div className="bg-gradient-to-r from-[#15102a] via-[#1c1538] to-[#120e21] border border-[#302450] rounded-2xl p-6 shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#fe9201] animate-ping" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#fe9201]">
              Audience Traffic Intelligence
            </span>
            <span className="text-[10px] bg-white/10 text-[#bbb] px-2 py-0.5 rounded font-mono">
              Period: {timeRangeLabel}
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Commercial Corridor &amp; Traffic Telemetry Reports
          </h2>
          <p className="text-xs text-[#8c84ad] mt-1 max-w-2xl leading-relaxed">
            Multi-dimensional data reports exportable directly to <b>CSV</b> or formatted <b>Microsoft Excel (.XLS)</b>.
            Explore trade route density, procurement desk origins, wholesale inquiry conversions, and page telemetry.
          </p>
        </div>

        {/* Master Bulk Download Buttons */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleExportAllCsv}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1f173b] hover:bg-[#2b2052] text-white border border-[#3e3166] rounded-xl text-xs font-bold transition shadow-md cursor-pointer"
            title="Download all reports individually as CSV files"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Export All (CSV)</span>
          </button>

          <button
            type="button"
            onClick={handleExportAllExcel}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#fe9201] to-[#e68300] hover:from-[#ffa726] hover:to-[#fe9201] text-[#080300] rounded-xl text-xs font-black transition shadow-lg shadow-[#fe9201]/20 cursor-pointer"
            title="Download complete multi-sheet Excel Workbook containing all reports"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="8" y1="13" x2="16" y2="13" />
              <line x1="8" y1="17" x2="16" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Export Full Workbook (.Excel)</span>
          </button>
        </div>
      </div>

      {/* OVERVIEW KEY PERFORMANCE SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#120e21] border border-[#292044] rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#fe9201]/5 rounded-bl-full pointer-events-none" />
          <span className="text-[11px] font-bold text-[#8c84ad] block mb-1">Total Verified Sessions</span>
          <div className="text-2xl font-black text-white tracking-tight">
            {(Math.round(146890 * multiplier)).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-bold">
            <span>↑ +18.4%</span>
            <span className="text-[#645c85]">vs prior period</span>
          </div>
        </div>

        <div className="bg-[#120e21] border border-[#292044] rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[11px] font-bold text-[#8c84ad] block mb-1">Corporate Buyers (Unique)</span>
          <div className="text-2xl font-black text-white tracking-tight">
            {(Math.round(52140 * multiplier)).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-bold">
            <span>↑ +21.2%</span>
            <span className="text-[#645c85]">regional businesses</span>
          </div>
        </div>

        <div className="bg-[#120e21] border border-[#292044] rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[11px] font-bold text-[#8c84ad] block mb-1">Wholesale Quotes &amp; RFQs</span>
          <div className="text-2xl font-black text-white tracking-tight">
            {(Math.round(1482 * multiplier)).toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-emerald-400 font-bold">
            <span>↑ +29.0%</span>
            <span className="text-[#645c85]">inquiries logged</span>
          </div>
        </div>

        <div className="bg-[#120e21] border border-[#292044] rounded-xl p-5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-16 h-16 bg-purple-500/5 rounded-bl-full pointer-events-none" />
          <span className="text-[11px] font-bold text-[#8c84ad] block mb-1">Avg Session Dwell Time</span>
          <div className="text-2xl font-black text-white tracking-tight">3m 48s</div>
          <div className="flex items-center gap-1.5 mt-2 text-[10px] text-purple-400 font-bold">
            <span>High Engagement</span>
            <span className="text-[#645c85]">across catalogue</span>
          </div>
        </div>
      </div>

      {/* REPORT SELECTOR TAB BAR (6 DISTINCT REPORTS) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#261f3d] pb-2">
          <div className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
            <span>Available Reports</span>
            <span className="bg-[#fe9201]/20 text-[#fe9201] text-[10px] px-2 py-0.5 rounded-full font-bold">
              {reports.length} Reports
            </span>
          </div>
          <span className="text-[11px] text-[#7d75a0]">Select a report below to view full details and export</span>
        </div>

        {/* Multi-report Switcher Pills */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {reports.map((rep) => {
            const isSelected = rep.id === activeReportId;
            return (
              <button
                key={rep.id}
                type="button"
                onClick={() => {
                  setActiveReportId(rep.id);
                  setSearchQuery("");
                }}
                className={`p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? "bg-[#1f173b] border-[#fe9201] shadow-lg shadow-[#fe9201]/10 text-white"
                    : "bg-[#100d1e] border-[#261f3d] text-[#8c84ad] hover:border-[#3d3260] hover:text-[#d6d4e8]"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                        isSelected ? "bg-[#fe9201] text-[#080300]" : "bg-white/5 text-[#888]"
                      }`}
                    >
                      {rep.category}
                    </span>
                    <span className="text-[10px] font-mono text-[#666]">{rep.rows.length} rows</span>
                  </div>
                  <div className="text-xs font-extrabold line-clamp-1">{rep.title}</div>
                </div>
                <div className="mt-2 text-[10px] text-[#6d668c] line-clamp-1">{rep.sheetName}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ACTIVE REPORT CONTAINER */}
      <div className="bg-[#120e21] border border-[#292044] rounded-2xl p-6 shadow-xl space-y-6">
        {/* Report Header & Action Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#261f3d] pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase bg-[#fe9201]/15 text-[#fe9201] px-2 py-0.5 rounded border border-[#fe9201]/30">
                {currentReport.category}
              </span>
              <span className="text-xs text-[#7d75a0]">Report ID: {currentReport.id}</span>
            </div>
            <h3 className="text-base font-extrabold text-white">{currentReport.title}</h3>
            <p className="text-xs text-[#8c84ad] mt-0.5">{currentReport.description}</p>
          </div>

          {/* Individual Report Action Buttons: Search + Export CSV + Export Excel */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* Search filter within report */}
            <div className="relative">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#645c85]"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search report rows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#181329] border border-[#2d2448] text-xs text-white pl-8 pr-3 py-1.5 rounded-lg outline-none focus:border-[#fe9201] w-48 placeholder-[#625985]"
              />
            </div>

            {/* Individual Export as CSV */}
            <button
              type="button"
              onClick={() => handleExportCsv(currentReport)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#181329] hover:bg-[#251d40] text-white border border-[#352a56] rounded-lg text-xs font-bold transition cursor-pointer"
              title={`Download "${currentReport.title}" as CSV format`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Export CSV</span>
            </button>

            {/* Individual Export as EXCEL (.XLS) */}
            <button
              type="button"
              onClick={() => handleExportExcel(currentReport)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#fe9201]/20 hover:bg-[#fe9201]/30 text-[#fe9201] border border-[#fe9201]/40 rounded-lg text-xs font-black transition cursor-pointer"
              title={`Download "${currentReport.title}" as Microsoft Excel spreadsheet (.xls)`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span>Export Excel (.XLS)</span>
            </button>
          </div>
        </div>

        {/* REPORT TABLE */}
        <div className="overflow-x-auto rounded-xl border border-[#261f3d]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#181329] text-[#9d95be] border-b border-[#261f3d]">
                {currentReport.headers.map((h, i) => (
                  <th key={i} className="py-3 px-4 font-bold tracking-wider text-[11px] whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1e1736]">
              {filteredRows.length > 0 ? (
                filteredRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-white/[0.02] transition-colors text-[#d6d4e8] font-medium"
                  >
                    {row.map((cell, cIdx) => {
                      const isFirst = cIdx === 0;
                      const isGrowth = String(cell).includes("+");
                      const isPct = String(cell).includes("%") && !isGrowth;

                      return (
                        <td
                          key={cIdx}
                          className={`py-3 px-4 whitespace-nowrap ${
                            isFirst ? "font-bold text-white" : ""
                          }`}
                        >
                          {isGrowth ? (
                            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded text-[10px]">
                              {cell}
                            </span>
                          ) : isPct ? (
                            <span className="text-[#fe9201] font-bold font-mono">{cell}</span>
                          ) : typeof cell === "number" ? (
                            <span className="font-mono text-white/90">{cell.toLocaleString()}</span>
                          ) : (
                            cell
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={currentReport.headers.length} className="py-8 text-center text-[#7d75a0]">
                    No matching records found for "{searchQuery}".
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Report Footer Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#7d75a0] pt-2 gap-2">
          <div>
            Showing <b>{filteredRows.length}</b> of <b>{currentReport.rows.length}</b> records in this report.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              UTF-8 CSV Ready
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#fe9201]" />
              Excel XML Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
