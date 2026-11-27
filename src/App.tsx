import { createContext, FormEvent, useContext, useEffect, useState } from "react";
import { Lang, translations } from "./i18n";
import { CmsProvider } from "./cms/CmsContext";
import { WebflowStudio } from "./cms/WebflowStudio";
import { AdminDashboard } from "./cms/AdminDashboard";
import { AdminLogin, ADMIN_AUTH_KEY } from "./cms/AdminLogin";
import { EditableText, EditableImage } from "./cms/VisualEditor";

const LangContext = createContext<{
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (typeof translations)["EN"];
}>({
  lang: "EN",
  setLang: () => {},
  t: translations.EN,
});

function useLang() {
  return useContext(LangContext);
}

const IMG = {
  port: "https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1800&q=85",
  port2:
    "https://images.unsplash.com/photo-1769752803898-e7e9a843a120?auto=format&fit=crop&w=1200&q=80",
  warehouse:
    "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80",
  warehouse2:
    "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80",
  shelves:
    "https://images.unsplash.com/photo-1627309366653-2dedc084cdf1?auto=format&fit=crop&w=1400&q=80",
  mining:
    "https://images.unsplash.com/photo-1523848309072-c199db53f137?auto=format&fit=crop&w=1400&q=80",
  mining2:
    "https://images.unsplash.com/photo-1711012604128-8339024a3e12?auto=format&fit=crop&w=1200&q=80",
  truck:
    "https://images.unsplash.com/photo-1657725099160-53c81f45e4df?auto=format&fit=crop&w=1400&q=80",
  products:
    "https://images.unsplash.com/photo-1757802868665-60b771aa399b?auto=format&fit=crop&w=1000&q=80",
  p1: "https://images.unsplash.com/photo-1584940120505-117038d90b05?auto=format&fit=crop&w=800&q=80",
  p2: "https://images.unsplash.com/photo-1666867540898-aaa1993ffabc?auto=format&fit=crop&w=800&q=80",
  p3: "https://images.unsplash.com/photo-1642257859842-c95f9fa8121d?auto=format&fit=crop&w=800&q=80",
};

type Page = "Home" | "About" | "Services" | "Products" | "Gallery" | "News" | "Careers" | "Contact";

const nav: Page[] = [
  "Home",
  "About",
  "Services",
  "Products",
  "Gallery",
  "News",
  "Careers",
  "Contact",
];

const pageToPath: Record<Page, string> = {
  Home: "/",
  About: "/about",
  Services: "/services",
  Products: "/products",
  Gallery: "/gallery",
  News: "/news",
  Careers: "/careers",
  Contact: "/contact",
};

const pathToPage: Record<string, Page> = {
  "/": "Home",
  "/about": "About",
  "/services": "Services",
  "/products": "Products",
  "/gallery": "Gallery",
  "/news": "News",
  "/careers": "Careers",
  "/contact": "Contact",
};

interface PageMeta {
  title: string;
  description: string;
  canonical: string;
}

const pageMetadata: Record<Page, PageMeta> = {
  Home: {
    title: "AuGust Aurea Limited | Connecting & Creating Markets in East Africa",
    description: "Reliable sourcing, distribution and FMCG supply for businesses trading across Tanzania and the East African corridor.",
    canonical: "/",
  },
  About: {
    title: "About Us | AuGust Aurea Limited - Tanzanian Trading Partner",
    description: "Learn about AuGust Aurea's story, mission, and values as a disciplined sourcing and distribution partner in East Africa.",
    canonical: "/about",
  },
  Services: {
    title: "Trading & Logistics Services | AuGust Aurea Limited",
    description: "FMCG distribution, general trading, mining supplies, logistics coordination, and strategic sourcing across Tanzania.",
    canonical: "/services",
  },
  Products: {
    title: "Wholesale Product Catalogue | AuGust Aurea Limited",
    description: "Explore our wholesale supply of edible oils, grains, cleaning essentials, safety gear, and industrial consumables.",
    canonical: "/products",
  },
  Gallery: {
    title: "Operations & Corridor Gallery | AuGust Aurea Limited",
    description: "Visual documentation of our port operations, warehouse distribution, logistics fleet, and field teams across Tanzania.",
    canonical: "/gallery",
  },
  News: {
    title: "Trade News & Market Briefs | AuGust Aurea Limited",
    description: "Market updates, trade corridor insights, supply chain analysis, and news from Tanzania and East Africa.",
    canonical: "/news",
  },
  Careers: {
    title: "Careers at AuGust Aurea | Join Our Trade & Logistics Team",
    description: "Explore career opportunities in procurement, operations, logistics, and sales across Tanzania.",
    canonical: "/careers",
  },
  Contact: {
    title: "Contact Us & Wholesale Enquiries | AuGust Aurea Limited",
    description: "Get in touch with our team in Dar es Salaam for wholesale pricing, supplier partnerships, or supply quotes within 24 hours.",
    canonical: "/contact",
  },
};

function getPageFromUrl(): Page | "Admin" {
  if (typeof window === "undefined") return "Home";
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  const lowerPath = path.toLowerCase();

  // Route to Admin Studio on /Studio or /studio (and redirect /admin to /Studio)
  if (lowerPath === "/studio" || lowerPath === "/admin") {
    if (path !== "/Studio") {
      try {
        window.history.replaceState({ page: "Admin" }, "", "/Studio");
      } catch {}
    }
    return "Admin";
  }

  if (pathToPage[path]) return pathToPage[path];

  // Also support hash fallback (e.g., #/about or #about) for static servers
  const hash = window.location.hash.replace(/^#\/?/, "").toLowerCase();
  if (hash === "studio" || hash === "admin") return "Admin";
  const matched = nav.find((p) => p.toLowerCase() === hash);
  if (matched) return matched;

  return "Home";
}

function updateSeoMeta(page: Page) {
  if (typeof document === "undefined") return;
  const meta = pageMetadata[page] || pageMetadata.Home;

  document.title = meta.title;

  let descEl = document.querySelector('meta[name="description"]');
  if (!descEl) {
    descEl = document.createElement("meta");
    descEl.setAttribute("name", "description");
    document.head.appendChild(descEl);
  }
  descEl.setAttribute("content", meta.description);

  let ogTitleEl = document.querySelector('meta[property="og:title"]');
  if (!ogTitleEl) {
    ogTitleEl = document.createElement("meta");
    ogTitleEl.setAttribute("property", "og:title");
    document.head.appendChild(ogTitleEl);
  }
  ogTitleEl.setAttribute("content", meta.title);

  let ogDescEl = document.querySelector('meta[property="og:description"]');
  if (!ogDescEl) {
    ogDescEl = document.createElement("meta");
    ogDescEl.setAttribute("property", "og:description");
    document.head.appendChild(ogDescEl);
  }
  ogDescEl.setAttribute("content", meta.description);

  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", `${window.location.origin}${meta.canonical}`);
}

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    check: (
      <>
        <path d="m7 12 3 3 7-7" />
      </>
    ),
    pin: (
      <>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2" />
      </>
    ),
    phone: (
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2.1Z" />
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="1" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="m6 6 12 12M18 6 6 18" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
      </>
    ),
    box: (
      <>
        <path d="m4 7 8-4 8 4-8 4-8-4Z" />
        <path d="M4 7v10l8 4 8-4V7M12 11v10" />
      </>
    ),
    route: (
      <>
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="6" r="2" />
        <path d="M8 18h3a3 3 0 0 0 3-3v-6a3 3 0 0 1 3-3" />
      </>
    ),
    shield: (
      <>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
        <path d="m9 12 2 2 4-4" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12M7 10l5 5 5-5M4 21h16" />
      </>
    ),
    expand: (
      <>
        <path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5" />
      </>
    ),
    whatsapp: (
      <path
        fill="currentColor"
        stroke="none"
        d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.978-.276-.1-.477-.15-.678.15-.2.301-.778.978-.953 1.179-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.134.301-.351.451-.527.151-.175.2-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.634-.928-2.238-.244-.588-.492-.508-.677-.518-.175-.008-.376-.01-.577-.01-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.48 1.078 2.909 1.228 3.109.15.2 2.122 3.24 5.141 4.544.718.31 1.279.496 1.716.635.721.23 1.377.197 1.895.12.578-.087 1.78-.727 2.03-1.43.251-.702.251-1.304.176-1.43-.076-.125-.276-.201-.577-.351zM12.04 2C6.51 2 2.024 6.486 2.024 12.016c0 1.954.561 3.86 1.624 5.512L2 22l4.636-1.61c1.597.971 3.447 1.506 5.404 1.506 5.53 0 10.016-4.486 10.016-10.016C22.056 6.486 17.57 2 12.04 2z"
      />
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}

function Logo({ light = false }: { light?: boolean }) {
  return (
    <a
      href={pageToPath.Home}
      className={`logo ${light ? "light" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        go("Home");
      }}
      aria-label="AuGust Aurea home"
    >
      <img
        src={light ? "/brand/august-aurea-logo-light.png" : "/brand/august-aurea-logo.png"}
        alt="AuGust Aurea"
      />
    </a>
  );
}

let globalNavigate: (p: Page | "Admin") => void = () => {};
function go(p: Page | "Admin") {
  globalNavigate(p);
}

function NavLink({
  page,
  active,
  children,
  onClick,
}: {
  page: Page;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <a
      href={pageToPath[page]}
      className={`nav-link ${active ? "active" : ""}`}
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
    >
      {children}
    </a>
  );
}

function Button({
  children,
  outline = false,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  outline?: boolean;
  onClick?: () => void;
  type?: "button" | "submit";
}) {
  return (
    <button type={type} onClick={onClick} className={`btn ${outline ? "btn-outline" : ""}`}>
      {children}
      <Icon name="arrow" size={17} />
    </button>
  );
}

function Eyebrow({
  children,
  light = false,
  className = "",
}: {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}) {
  return (
    <div className={`eyebrow ${light ? "light" : ""} ${className}`.trim()}>
      <span className="eyebrow-line" aria-hidden="true" />
      <span className="eyebrow-text">{children}</span>
    </div>
  );
}

function SectionTitle({
  number,
  eyebrow,
  title,
  copy,
  light = false,
}: {
  number?: string;
  eyebrow: React.ReactNode;
  title: React.ReactNode;
  copy?: string;
  light?: boolean;
}) {
  return (
    <div className={`section-title ${number ? "has-num" : "no-num"} ${light ? "light" : ""}`}>
      {number && <span className="section-num" aria-hidden="true">{number}</span>}
      <div className="section-title-content">
        <Eyebrow light={light}>{eyebrow}</Eyebrow>
        <h2>{title}</h2>
        {copy && <p>{copy}</p>}
      </div>
    </div>
  );
}

function TanzaniaMap({ dark = false, watermark = false }: { dark?: boolean; watermark?: boolean }) {
  const dots = [
    [95, 57],
    [66, 81],
    [45, 42],
    [86, 25],
    [48, 130],
    [19, 73],
    [119, 52],
  ];
  return (
    <svg
      className={`tz-map ${watermark ? "watermark" : ""}`}
      viewBox="0 0 150 190"
      role="img"
      aria-label="Tanzania trade network map"
    >
      <path
        className="map-fill"
        d="M31 8 55 18 72 15 92 24 115 22 126 39 119 57 128 76 117 94 111 123 92 138 81 166 64 180 47 164 31 158 23 136 28 117 16 97 20 75 11 57 20 39 17 21Z"
      />
      <path
        className="map-outline"
        d="M31 8 55 18 72 15 92 24 115 22 126 39 119 57 128 76 117 94 111 123 92 138 81 166 64 180 47 164 31 158 23 136 28 117 16 97 20 75 11 57 20 39 17 21Z"
      />
      <path
        className="routes"
        d="M95 57 66 81 45 42M95 57 86 25M66 81 48 130M66 81 19 73M95 57l24-5"
      />
      {dots.map((d, i) => (
        <circle key={i} className="map-dot" cx={d[0]} cy={d[1]} r="3.3" />
      ))}
      <path className="island" d="m132 38 4-13M137 57l5-10" />
    </svg>
  );
}

function Header({ page }: { page: Page }) {
  const { lang, setLang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const navLabels: Record<Page, string> = {
    Home: t.nav_home,
    About: t.nav_about,
    Services: t.nav_services,
    Products: t.nav_products,
    Gallery: t.nav_gallery,
    News: t.nav_news,
    Careers: t.nav_careers,
    Contact: t.nav_contact,
  };

  return (
    <header className={scrolled ? "scrolled" : ""}>
      <div className="header-inner">
        <Logo />
        <nav className={open ? "open" : ""}>
          {nav.map((n) => (
            <NavLink
              key={n}
              page={n}
              active={page === n}
              onClick={() => {
                go(n);
                setOpen(false);
              }}
            >
              {navLabels[n]}
            </NavLink>
          ))}
          <div className="mobile-actions">
            <Button onClick={() => go("Contact")}>{t.btn_wholesale_order}</Button>
          </div>
        </nav>
        <div className="header-actions">
          <label className="language">
            <Icon name="globe" size={16} />
            <select
              aria-label="Language"
              value={lang}
              onChange={(e) => setLang(e.target.value as Lang)}
            >
              <option value="EN">EN</option>
              <option value="SW">SW</option>
            </select>
          </label>
          <Button onClick={() => go("Contact")}>{t.btn_wholesale_order}</Button>
        </div>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen(!open)}>
          <Icon name={open ? "close" : "menu"} size={25} />
        </button>
      </div>
    </header>
  );
}

function InnerHero({
  eyebrow,
  title,
  copy,
  image,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
}) {
  return (
    <section className="inner-hero">
      <img src={image} alt="" />
      <div className="inner-hero-overlay" />
      <div className="container inner-hero-content">
        <Eyebrow light>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{copy}</p>
      </div>
      <TanzaniaMap dark watermark />
    </section>
  );
}

const services = [
  {
    n: "01",
    title: "FMCG Distribution",
    image: IMG.warehouse,
    copy: "Reliable movement of fast-moving consumer goods from manufacturers to wholesalers, retailers and institutional buyers.",
  },
  {
    n: "02",
    title: "General Trading",
    image: IMG.port2,
    copy: "Responsive sourcing and cross-border trade support for businesses that need quality goods, clear documentation and dependable delivery.",
  },
  {
    n: "03",
    title: "Mining Supply",
    image: IMG.mining,
    copy: "Practical procurement support for mining operations, from site consumables and safety equipment to industrial materials.",
  },
];

const homeServices = [
  ...services,
  {
    n: "04",
    title: "Logistics Coordination",
    image: IMG.truck,
    copy: "Practical route planning and delivery coordination for goods moving between ports, warehouses and regional markets.",
  },
  {
    n: "05",
    title: "Strategic Sourcing",
    image: IMG.shelves,
    copy: "Structured supplier identification and product verification for businesses with specific volume, quality and timing requirements.",
  },
];

const products = [
  { name: "Edible Oils", cat: "Food & Beverage", image: IMG.products },
  {
    name: "Rice & Grains",
    cat: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Cleaning Essentials",
    cat: "Household",
    image:
      "https://images.unsplash.com/photo-1583947581924-860bda6a26df?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Site Safety Supplies",
    cat: "Mining Supply",
    image:
      "https://images.unsplash.com/photo-1578116922645-3976907a7671?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Packaged Beverages",
    cat: "Food & Beverage",
    image:
      "https://images.unsplash.com/photo-1582106245687-cbb466a9f07f?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Personal Care",
    cat: "Household",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=800&q=80",
  },
  { name: "Industrial Consumables", cat: "Mining Supply", image: IMG.mining2 },
  { name: "Bulk Packaging", cat: "Trade Goods", image: IMG.shelves },
];

function Home() {
  const { t } = useLang();
  const [serviceSlide, setServiceSlide] = useState(1);
  const credentials = [
    ["shield", t.cred_licensed],
    ["box", t.cred_registered],
    ["route", t.cred_network],
    ["globe", t.cred_multilingual],
  ];
  const visibleServices = Array.from(
    { length: 3 },
    (_, index) => homeServices[(serviceSlide + index) % homeServices.length],
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const interval = window.setInterval(
      () => setServiceSlide((current) => (current + 1) % homeServices.length),
      5000,
    );
    return () => window.clearInterval(interval);
  }, []);

  const renderServicePanel = (
    service: (typeof homeServices)[number],
    index: number,
    animated: boolean,
  ) => (
    <article
      className={`service-panel p${index} ${animated ? "carousel-card" : "reveal"}`}
      key={`${animated ? serviceSlide : "mobile"}-${service.n}`}
      style={animated ? { animationDelay: `${index * 80}ms` } : undefined}
    >
      <div className="service-image">
        <img src={service.image} alt={service.title} />
        <span>{service.n}</span>
      </div>
      <div className="service-body">
        <small>{service.n} / Service</small>
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        <button onClick={() => go("Services")} aria-label={`View ${service.title}`}>
          <Icon name="arrow" />
        </button>
      </div>
    </article>
  );

  return (
    <>
      <section className="hero">
        <EditableImage
          page="Home"
          section="hero"
          field="bg_image"
          alt="Cargo port supporting regional trade"
          fallbackSrc={IMG.port}
        />
        <div className="hero-overlay" />
        <div className="container hero-content">
          <Eyebrow light>
            <EditableText page="Home" section="hero" field="eyebrow">
              {t.hero_eyebrow}
            </EditableText>
          </Eyebrow>
          <h1>
            <EditableText page="Home" section="hero" field="title_1">
              {t.hero_title_1}
            </EditableText>
            <br />
            <EditableText page="Home" section="hero" field="title_2">
              {t.hero_title_2}
            </EditableText>
            <span className="hero-dot">.</span>
          </h1>
          <p>
            <EditableText page="Home" section="hero" field="copy">
              {t.hero_copy}
            </EditableText>
          </p>
          <div className="hero-buttons">
            <Button onClick={() => go("Contact")}>
              <EditableText page="Home" section="hero" field="btn_primary">
                {t.btn_enquire_now}
              </EditableText>
            </Button>
            <Button outline onClick={() => go("Products")}>
              <EditableText page="Home" section="hero" field="btn_secondary">
                {t.btn_view_products}
              </EditableText>
            </Button>
          </div>
        </div>
        <div className="hero-map">
          <svg
            className="tz-map"
            viewBox="0 0 584 586"
            role="img"
            aria-label="Tanzania trade network map"
          >
            <path
              className="map-outline"
              style={{ strokeWidth: 4 }}
              d="M127.763 4.128c3.485-.189 6.833-.12 10.319-.081.926 5.04-.424 20.498-2.313 25.417-3.048 7.935-3.082 15.711-3.307 24.088-.282 10.485 5.631 20.418 3.544 31.041 1.604 3.787 4.195 6.95 5.514 10.946 8.183-4.336 9.278-3.8 13.142-11.857 1.987-.196 4.474-.154 6.514-.172-.667-2.45-1.682-7.021-1.817-9.467 1.199-1.552 2.233-2.546 3.62-3.927 4.199 2.372 7.294 7.52 10.878 10.937 2.661 2.537 4.679 3.75 7.736 5.692 2.081-1.274 5.2-3.893 7.527-3.66 1.243 1.89 4.109 16.144 4.452 18.923 4.85-8.034 7.323-12.52 9.891-21.392 5.305-.957 7.551-.023 12.395-.216 8.411-.336 17.414-5.419 23.009-11.525l.355-.392c1.459-1.597 1.958-2.762 2.959-4.693-7.599-3.551-14.476-1.676-23.123-1.764l-1.059-4.031c2.41-2.893 8.377-6.42 11.785-8.39-1.173-1.138-2.557-2.727-3.689-3.965 2.633-.221 6.19-.14 8.894-.155-.384-2.792-.451-4.579-.528-7.389 2.194-1.208 4.353-2.475 6.476-3.802.062-5.046 3.795-9.882 7.096-13.64 2.521-.714 4.906-1.133 7.521-1.211-1.23-2.493-2.59-5.109-3.611-7.679.832-2.151 1.062-2.579 2.329-4.477 2.627-1.246 5.56-2.315 8.311-3.243 5.379 3.484 12.017 7.077 17.682 10.336l29.027 16.756 88.344 50.94 27.898 16.093c4.343 2.512 10.295 5.671 14.249 8.368 4.166 12.433 7.56 26.558 11.752 38.784 3.202 2.169 6.753 4.254 10.1 6.2 20.579 11.971 40.812 24.731 61.419 36.638-1.86 5.106-3.84 10.166-5.943 15.177-1.448 3.424-3.164 7.044-4.378 10.533-1.445 3.65-1.619 9.732-3.505 13.026-4.366 7.625-9.909 14.265-12.587 22.885-.546 1.763-1.568 4.998-1.164 6.817 1.27 5.745 3.605 10.801 4.403 16.794.481 3.533 6.973 7.177 9.016 10.097 2.304 3.296 4.043 7.228 7.045 9.952 5.196 4.586 13.145 6.366 16.464 12.936.607 1.224.836 2.057.395 3.282-2.538 2.575-10.993 1.636-12.79 7.265-2.023 6.343-.484 17.328 1.244 23.723 1.214 4.489 5.156 7.725 9.16 9.557-.879 5.934-3.889 8.695-4.81 14.075-.853 4.955 3.582 8.526 4.005 13.983.521 6.67-2.935 12.942-2.043 19.368 1.019 7.36 4.461 18.922 8.273 25.386 1.43 2.423 5.15 5.559 6.151 8.303 1.368 3.752.716 8.23 1.898 12.015.48 2.678 6.249 7.44 6.292 9.763.2 10.647 2.24 10.601 11.25 14.619 1.239.552 5.194 5.734 7.308 6.975 3.703 2.166 7.531 3.795 11.14 6.553-.527 2.664-.699 4.641-1.474 7.359-2.246 1.276-4.389 3.265-6.424 4.902-5.262 4.237-10.552 8.987-15.943 12.99-2.143 1.591-7.377 3.334-10.061 4.341l-16.81 6.2c-8.06 3.191-17.552 6.742-25.798 9.463-3.182 1.05-15.002 1.599-18.084.352-2.941-1.194-7.914-4.029-11.268-5.543-4.438.435-18.046 2.841-22.04 4.301-2.518.918-13.678 10.667-15.615 12.896-8.109-.315-16.092-.673-24.212-.57-3.737.049-8.988-.555-12.507.229-7.62 1.697-16.41 5.832-23.795 7.6l-.43.1c-6.97-4.217-13.92-8.132-20.842-12.455-21.259 7.433-42.868 14.435-64.062 22.132-5.347 1.943-15.389 4.859-19.911 7.162-3.443 1.754-12.687 9.153-16.435 11.949l6.469-14.956c1.253-2.864 3.98-8.742 4.624-11.551.454-4.023-.345-8.745-.547-12.768-.553-11.001-1.084-21.485-.716-32.507.247-7.377.088-14.561.5-22.007-4.881-7.004-14.673-16.324-19.033-23.568-.001-7.039-.265-8.067 1.977-14.708-2.469-2.154-4.776-4.709-7.461-7.039-4.182 1.325-10.454 2.65-14.883 3.812-10.38-4.252-19.728-9.543-30.748-13.723l-35.988-13.374c-4.07-1.502-15.524-5.356-19.012-7.211-5.948-3.158-15.919-15.783-22.169-18.916-1.331-.666-11.365-1.024-13.689-1.173-2.132 3.588-4.856 7.929-6.634 11.617-5.133-3.359-12.615-7.133-18.204-10.218-.465-6.741-8.39-48.056-10.984-52.17-1.494-2.372-4.968-4.438-7.177-6.201l-14.867-11.871c-4.794-3.826-8.301-6.067-11.744-11.3-5.57-8.464-12.484-16.584-17.768-25.211.625-5.229 1.143-10.788 1.365-16.05.191-5.549-.781-11.208-.837-16.721-.05-4.912-1.63-7.544-3.244-11.953-2.899-7.916-6.374-15.665-9.165-23.605 1.814-3.283 24.989-33.878 26.637-34.755 2.253-1.199 4.88-1.865 7.306-2.647 5.991-1.931 12.273-3.526 18.118-5.835 1.667-2.069 3.52-5.317 4.952-7.654l7.857-12.787 13.259-21.417c2.461-3.983 5.513-8.678 7.689-12.753-.511-2.924-1.175-12.602-2.765-14.574-2.252-2.794-8.387-7.949-11.476-10.16.917-2.791 4.546-12.85 5.733-15.042 4.041-7.464 9.022-15.656 13.363-22.975-7.328-14.489-14.262-30.218-21.353-44.959 4.175-.368 9.224-.18 13.544-.317l22.899-.789c6.148-.166 11.516-.141 17.769-.487Z"
            />
            <g className="routes" style={{ strokeWidth: 2.5 }}>
              <path d="M492 338 337 302 187 116" />
              <path d="M337 302 395 117" />
              <path d="M337 302 166 438" />
              <path d="M337 302 55 272" />
              <path d="M492 338 544 292" />
            </g>
            {[
              [492, 338],
              [337, 302],
              [187, 116],
              [395, 117],
              [166, 438],
              [55, 272],
              [544, 292],
            ].map(([cx, cy], index) => (
              <circle key={index} className="map-dot" cx={cx} cy={cy} r="8" />
            ))}
          </svg>
        </div>
        <div className="hero-index">
          DAR ES SALAAM <span /> 06.7924° S
        </div>
      </section>

      <section className="credentials">
        <div className="container credentials-grid">
          {credentials.map(([icon, text]) => (
            <div key={text}>
              <Icon name={icon} size={25} />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="who section-pad">
        <div className="container who-grid">
          <div className="who-copy reveal">
            <SectionTitle
              number="01"
              eyebrow={
                <EditableText page="Home" section="who" field="eyebrow">
                  {t.who_eyebrow}
                </EditableText>
              }
              title={
                <>
                  <EditableText page="Home" section="who" field="title_1">
                    {t.who_title_1}
                  </EditableText>
                  <br />
                  <EditableText page="Home" section="who" field="title_2">
                    {t.who_title_2}
                  </EditableText>
                </>
              }
            />
            <p>
              <EditableText page="Home" section="who" field="copy">
                {t.who_copy}
              </EditableText>
            </p>
            <button className="text-link" onClick={() => go("About")}>
              <EditableText page="Home" section="who" field="link_text">
                {t.who_link}
              </EditableText>{" "}
              <Icon name="arrow" size={18} />
            </button>
          </div>
          <div className="who-image reveal">
            <EditableImage
              page="Home"
              section="who"
              field="image"
              alt="Distribution team in a warehouse"
              fallbackSrc={IMG.warehouse2}
            />
            <div className="image-note">
              <b>
                <EditableText page="Home" section="who" field="badge_bold">
                  {t.who_badge_top}
                </EditableText>
              </b>
              <span>
                <EditableText page="Home" section="who" field="badge_sub">
                  {t.who_badge_bottom}
                </EditableText>
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="services section-pad">
        <div className="container">
          <SectionTitle
            number="02"
            eyebrow={t.services_eyebrow}
            title={t.services_title}
            copy={t.services_copy}
          />
          <div className="service-carousel">
            <div className="service-panels service-panels-desktop" aria-live="polite">
              {visibleServices.map((service, index) => renderServicePanel(service, index, true))}
            </div>
            <div className="service-panels service-panels-mobile">
              {homeServices.map((service, index) => renderServicePanel(service, index, false))}
            </div>
            <div className="service-carousel-controls">
              <div className="service-progress" aria-label="Service carousel progress">
                {homeServices.map((service, index) => (
                  <button
                    key={service.n}
                    className={index === serviceSlide ? "active" : ""}
                    onClick={() => setServiceSlide(index)}
                    aria-label={`Show services starting with ${service.title}`}
                    aria-current={index === serviceSlide ? "true" : undefined}
                  />
                ))}
              </div>
              <div className="service-arrows">
                <button
                  onClick={() =>
                    setServiceSlide(
                      (current) => (current - 1 + homeServices.length) % homeServices.length,
                    )
                  }
                  aria-label="Previous services"
                >
                  <span>
                    <Icon name="arrow" size={18} />
                  </span>
                </button>
                <span>
                  {String(serviceSlide + 1).padStart(2, "0")} /{" "}
                  {String(homeServices.length).padStart(2, "0")}
                </span>
                <button
                  onClick={() => setServiceSlide((current) => (current + 1) % homeServices.length)}
                  aria-label="Next services"
                >
                  <Icon name="arrow" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="operate section-pad">
        <div className="container">
          <SectionTitle
            number="03"
            eyebrow={t.operate_eyebrow}
            title={
              <>
                {t.operate_title_1}
                <br />
                {t.operate_title_2}
              </>
            }
            light
          />
          <div className="operate-grid">
            <div className="location-list">
              <p>{t.operate_copy}</p>
              {[
                t.loc_1,
                t.loc_2,
                t.loc_3,
                t.loc_4,
              ].map((x) => (
                <div key={x}>
                  <span className="check">
                    <Icon name="check" size={14} />
                  </span>
                  {x}
                </div>
              ))}
            </div>
            <div className="map-large">
              <svg
                className="tz-map"
                viewBox="0 0 584 586"
                role="img"
                aria-label="Tanzania trade network map"
              >
                <path
                  className="map-outline"
                  style={{ strokeWidth: 4 }}
                  d="M127.763 4.128c3.485-.189 6.833-.12 10.319-.081.926 5.04-.424 20.498-2.313 25.417-3.048 7.935-3.082 15.711-3.307 24.088-.282 10.485 5.631 20.418 3.544 31.041 1.604 3.787 4.195 6.95 5.514 10.946 8.183-4.336 9.278-3.8 13.142-11.857 1.987-.196 4.474-.154 6.514-.172-.667-2.45-1.682-7.021-1.817-9.467 1.199-1.552 2.233-2.546 3.62-3.927 4.199 2.372 7.294 7.52 10.878 10.937 2.661 2.537 4.679 3.75 7.736 5.692 2.081-1.274 5.2-3.893 7.527-3.66 1.243 1.89 4.109 16.144 4.452 18.923 4.85-8.034 7.323-12.52 9.891-21.392 5.305-.957 7.551-.023 12.395-.216 8.411-.336 17.414-5.419 23.009-11.525l.355-.392c1.459-1.597 1.958-2.762 2.959-4.693-7.599-3.551-14.476-1.676-23.123-1.764l-1.059-4.031c2.41-2.893 8.377-6.42 11.785-8.39-1.173-1.138-2.557-2.727-3.689-3.965 2.633-.221 6.19-.14 8.894-.155-.384-2.792-.451-4.579-.528-7.389 2.194-1.208 4.353-2.475 6.476-3.802.062-5.046 3.795-9.882 7.096-13.64 2.521-.714 4.906-1.133 7.521-1.211-1.23-2.493-2.59-5.109-3.611-7.679.832-2.151 1.062-2.579 2.329-4.477 2.627-1.246 5.56-2.315 8.311-3.243 5.379 3.484 12.017 7.077 17.682 10.336l29.027 16.756 88.344 50.94 27.898 16.093c4.343 2.512 10.295 5.671 14.249 8.368 4.166 12.433 7.56 26.558 11.752 38.784 3.202 2.169 6.753 4.254 10.1 6.2 20.579 11.971 40.812 24.731 61.419 36.638-1.86 5.106-3.84 10.166-5.943 15.177-1.448 3.424-3.164 7.044-4.378 10.533-1.445 3.65-1.619 9.732-3.505 13.026-4.366 7.625-9.909 14.265-12.587 22.885-.546 1.763-1.568 4.998-1.164 6.817 1.27 5.745 3.605 10.801 4.403 16.794.481 3.533 6.973 7.177 9.016 10.097 2.304 3.296 4.043 7.228 7.045 9.952 5.196 4.586 13.145 6.366 16.464 12.936.607 1.224.836 2.057.395 3.282-2.538 2.575-10.993 1.636-12.79 7.265-2.023 6.343-.484 17.328 1.244 23.723 1.214 4.489 5.156 7.725 9.16 9.557-.879 5.934-3.889 8.695-4.81 14.075-.853 4.955 3.582 8.526 4.005 13.983.521 6.67-2.935 12.942-2.043 19.368 1.019 7.36 4.461 18.922 8.273 25.386 1.43 2.423 5.15 5.559 6.151 8.303 1.368 3.752.716 8.23 1.898 12.015.48 2.678 6.249 7.44 6.292 9.763.2 10.647 2.24 10.601 11.25 14.619 1.239.552 5.194 5.734 7.308 6.975 3.703 2.166 7.531 3.795 11.14 6.553-.527 2.664-.699 4.641-1.474 7.359-2.246 1.276-4.389 3.265-6.424 4.902-5.262 4.237-10.552 8.987-15.943 12.99-2.143 1.591-7.377 3.334-10.061 4.341l-16.81 6.2c-8.06 3.191-17.552 6.742-25.798 9.463-3.182 1.05-15.002 1.599-18.084.352-2.941-1.194-7.914-4.029-11.268-5.543-4.438.435-18.046 2.841-22.04 4.301-2.518.918-13.678 10.667-15.615 12.896-8.109-.315-16.092-.673-24.212-.57-3.737.049-8.988-.555-12.507.229-7.62 1.697-16.41 5.832-23.795 7.6l-.43.1c-6.97-4.217-13.92-8.132-20.842-12.455-21.259 7.433-42.868 14.435-64.062 22.132-5.347 1.943-15.389 4.859-19.911 7.162-3.443 1.754-12.687 9.153-16.435 11.949l6.469-14.956c1.253-2.864 3.98-8.742 4.624-11.551.454-4.023-.345-8.745-.547-12.768-.553-11.001-1.084-21.485-.716-32.507.247-7.377.088-14.561.5-22.007-4.881-7.004-14.673-16.324-19.033-23.568-.001-7.039-.265-8.067 1.977-14.708-2.469-2.154-4.776-4.709-7.461-7.039-4.182 1.325-10.454 2.65-14.883 3.812-10.38-4.252-19.728-9.543-30.748-13.723l-35.988-13.374c-4.07-1.502-15.524-5.356-19.012-7.211-5.948-3.158-15.919-15.783-22.169-18.916-1.331-.666-11.365-1.024-13.689-1.173-2.132 3.588-4.856 7.929-6.634 11.617-5.133-3.359-12.615-7.133-18.204-10.218-.465-6.741-8.39-48.056-10.984-52.17-1.494-2.372-4.968-4.438-7.177-6.201l-14.867-11.871c-4.794-3.826-8.301-6.067-11.744-11.3-5.57-8.464-12.484-16.584-17.768-25.211.625-5.229 1.143-10.788 1.365-16.05.191-5.549-.781-11.208-.837-16.721-.05-4.912-1.63-7.544-3.244-11.953-2.899-7.916-6.374-15.665-9.165-23.605 1.814-3.283 24.989-33.878 26.637-34.755 2.253-1.199 4.88-1.865 7.306-2.647 5.991-1.931 12.273-3.526 18.118-5.835 1.667-2.069 3.52-5.317 4.952-7.654l7.857-12.787 13.259-21.417c2.461-3.983 5.513-8.678 7.689-12.753-.511-2.924-1.175-12.602-2.765-14.574-2.252-2.794-8.387-7.949-11.476-10.16.917-2.791 4.546-12.85 5.733-15.042 4.041-7.464 9.022-15.656 13.363-22.975-7.328-14.489-14.262-30.218-21.353-44.959 4.175-.368 9.224-.18 13.544-.317l22.899-.789c6.148-.166 11.516-.141 17.769-.487Z"
                />
                <g className="routes" style={{ strokeWidth: 2.5 }}>
                  <path d="M492 338 337 302 187 116" />
                  <path d="M337 302 395 117" />
                  <path d="M337 302 166 438" />
                  <path d="M337 302 55 272" />
                  <path d="M492 338 544 292" />
                </g>
                {[
                  [492, 338],
                  [337, 302],
                  [187, 116],
                  [395, 117],
                  [166, 438],
                  [55, 272],
                  [544, 292],
                ].map(([cx, cy], index) => (
                  <circle key={index} className="map-dot" cx={cx} cy={cy} r="8" />
                ))}
              </svg>
            </div>
            <div className="africa-slot">
              <span>{t.reserved_map}</span>
              <h3>
                {t.east_africa_net}
              </h3>
              <p style={{ whiteSpace: "pre-line" }}>
                {t.countries_list}
              </p>
              <small>{t.wider_map_note}</small>
            </div>
          </div>
        </div>
      </section>

      <section className="process section-pad">
        <div className="container">
          <SectionTitle
            number="04"
            eyebrow={t.process_eyebrow}
            title={t.process_title}
          />
          <div className="process-line">
            {[
              { title: t.step_1_title, desc: t.step_1_desc },
              { title: t.step_2_title, desc: t.step_2_desc },
              { title: t.step_3_title, desc: t.step_3_desc },
              { title: t.step_4_title, desc: t.step_4_desc },
              { title: t.step_5_title, desc: t.step_5_desc },
            ].map((step, i) => (
              <div className="process-step reveal" key={step.title}>
                <span>0{i + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="commitments">
        <div className="commit-main">
          <img src={IMG.warehouse} alt="" />
          <div className="commit-overlay" />
          <div className="commit-content-wrap">
            <div className="commit-copy">
              <SectionTitle
                number="05"
                eyebrow={t.commit_eyebrow}
                title={
                  <>
                    {t.commit_title_1}
                    <br />
                    {t.commit_title_2}
                  </>
                }
                light
              />
              <Button onClick={() => go("Contact")}>{t.commit_btn}</Button>
            </div>
            <div className="commit-list">
              {[
                t.commit_1,
                t.commit_2,
                t.commit_3,
                t.commit_4,
                t.commit_5,
                t.commit_6,
              ].map((x) => (
                <div key={x}>
                  <span className="check">
                    <Icon name="check" size={14} />
                  </span>
                  {x}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="commit-side">
          <div className="feature-words">
            <div>
              <b>{t.badge_corridor_title}</b>
              <span>{t.badge_corridor_sub}</span>
            </div>
            <div>
              <b>{t.badge_base_title}</b>
              <span>{t.badge_base_sub}</span>
            </div>
          </div>
          <img src={IMG.truck} alt="Regional freight truck on the road" />
        </div>
      </section>

      <ProductPreview />
      <Leadership />
      <NewsPreview />
      <Cta />
    </>
  );
}

function ProductPreview() {
  const { t } = useLang();
  return (
    <section className="featured section-pad">
      <div className="container">
        <div className="heading-row">
          <SectionTitle eyebrow={t.feat_eyebrow} title={t.feat_title} />
          <button className="text-link" onClick={() => go("Products")}>
            {t.feat_view_all} <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="product-grid">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.name} {...p} />
          ))}
        </div>
        <div className="center-action">
          <Button
            outline
            onClick={() => alert("The AuGust Aurea product brochure will be available shortly.")}
          >
            {t.feat_download} <Icon name="download" size={17} />
          </Button>
        </div>
      </div>
    </section>
  );
}

function ProductCard(p: (typeof products)[number]) {
  const { t } = useLang();
  return (
    <article className="product-card">
      <div className="product-image">
        <img src={p.image} alt={p.name} />
        <span>{p.cat}</span>
      </div>
      <div>
        <small>{p.cat}</small>
        <h3>{p.name}</h3>
        <button onClick={() => go("Contact")}>
          {t.feat_enquire} <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function Leadership() {
  const { t } = useLang();
  const team = [
    {
      name: "Abdul M. Salim",
      role: "Managing Director",
      bio: "Leads commercial strategy and regional partnerships.",
      image: IMG.p1,
    },
    {
      name: "Neema J. Mushi",
      role: "Head of Operations",
      bio: "Oversees sourcing, fulfilment and service standards.",
      image: IMG.p2,
    },
    {
      name: "Daniel K. Massawe",
      role: "Commercial Director",
      bio: "Builds manufacturer and institutional client relationships.",
      image: IMG.p3,
    },
  ];
  return (
    <section className="leadership section-pad">
      <div className="container">
        <SectionTitle
          eyebrow={t.lead_eyebrow}
          title={t.lead_title}
          copy={t.lead_copy}
        />
        <div className="team-grid">
          {team.map((x, i) => (
            <article key={x.name} className={i === 1 ? "offset" : ""}>
              <img src={x.image} alt={x.name} />
              <div>
                <span>0{i + 1}</span>
                <h3>{x.name}</h3>
                <b>{x.role}</b>
                <p>{x.bio}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const articles = [
  {
    date: "18 June 2025",
    cat: "Market Brief",
    title: "What reliable distribution looks like beyond the port gate",
    image: IMG.port2,
  },
  {
    date: "04 June 2025",
    cat: "Trade",
    title: "Preparing wholesale supply for seasonal demand",
    image: IMG.warehouse,
  },
  {
    date: "21 May 2025",
    cat: "Mining",
    title: "Procurement discipline for remote operating sites",
    image: IMG.mining,
  },
  {
    date: "08 May 2025",
    cat: "Logistics",
    title: "Why documentation matters in regional trade",
    image: IMG.truck,
  },
];

function NewsPreview() {
  const { t } = useLang();
  return (
    <section className="news-preview section-pad">
      <div className="container">
        <div className="heading-row">
          <SectionTitle eyebrow={t.news_eyebrow} title={t.news_title} />
          <button className="text-link" onClick={() => go("News")}>
            {t.news_view_all} <Icon name="arrow" size={18} />
          </button>
        </div>
        <div className="news-layout">
          <ArticleCard article={articles[0]} featured />
          <div>
            {articles.slice(1, 3).map((x) => (
              <ArticleCard key={x.title} article={x} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({
  article: a,
  featured = false,
}: {
  article: (typeof articles)[number];
  featured?: boolean;
}) {
  const { t } = useLang();
  return (
    <article className={`article ${featured ? "article-featured" : ""}`}>
      <img src={a.image} alt="" />
      <div>
        <small>
          {a.cat} <i /> {a.date}
        </small>
        <h3>{a.title}</h3>
        <button>
          {t.news_read_more} <Icon name="arrow" size={17} />
        </button>
      </div>
    </article>
  );
}

function Cta() {
  const { t } = useLang();
  return (
    <section className="cta">
      <div className="container">
        <div>
          <Eyebrow light>{t.cta_eyebrow}</Eyebrow>
          <h2>{t.cta_title}</h2>
        </div>
        <div className="cta-buttons">
          <Button onClick={() => go("Contact")}>{t.btn_enquire_now}</Button>
          <Button outline onClick={() => window.open("https://wa.me/255700000000", "_blank")}>
            {t.cta_whatsapp}
          </Button>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <InnerHero
        eyebrow="About Us"
        title="Built on trust. Driven by delivery."
        copy="A Tanzanian trading company with a practical understanding of how goods, markets and relationships move."
        image={IMG.warehouse2}
      />
      <section className="section-pad story">
        <div className="container split">
          <div>
            <SectionTitle
              number="01"
              eyebrow="Our Story"
              title="A better standard for everyday trade."
            />
          </div>
          <div>
            <p className="lead">
              AuGust Aurea Limited was founded to give businesses a more responsive, transparent way
              to source and move essential goods.
            </p>
            <p>
              From our base in Dar es Salaam, we work with manufacturers, corporate buyers and
              traders who value clear communication as much as competitive sourcing. Every
              assignment is handled with commercial care, from product verification and paperwork
              through delivery and follow-up.
            </p>
          </div>
        </div>
      </section>
      <section className="mission section-pad">
        <div className="container mission-grid">
          <div>
            <span>01</span>
            <Eyebrow>Our Mission</Eyebrow>
            <h2>Connect credible supply with real market demand.</h2>
            <p>
              To make regional trade more dependable through disciplined sourcing, reliable
              distribution and service that respects the client's time.
            </p>
          </div>
          <div>
            <span>02</span>
            <Eyebrow>Our Vision</Eyebrow>
            <h2>Become a trusted East African trade partner.</h2>
            <p>
              Known for doing the fundamentals exceptionally well and for building markets that
              create lasting commercial value.
            </p>
          </div>
        </div>
      </section>
      <section className="values section-pad">
        <div className="container">
          <SectionTitle number="03" eyebrow="Our Values" title="How we show up." />
          <div className="value-grid">
            {[
              ["Trust", "We communicate clearly and honour what we agree."],
              ["Determination", "We stay close to the detail until the job is complete."],
              ["Innovation", "We find practical, better routes through market complexity."],
            ].map((x, i) => (
              <article key={x[0]}>
                <span>0{i + 1}</span>
                <h3>{x[0]}</h3>
                <p>{x[1]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="about-map section-pad">
        <div className="container">
          <div className="flex flex-col items-start">
            <Eyebrow>Tanzania at our core</Eyebrow>
            <h2>Local knowledge, connected nationally.</h2>
            <p>
              Our operating network links the country's principal trade centres and gives clients a
              single, accountable point of coordination.
            </p>
            <button type="button" onClick={() => go("Contact")} className="btn about-cta">
              Work With Us
              <Icon name="arrow" size={17} />
            </button>
          </div>
          <svg
            className="tz-map"
            viewBox="0 0 584 586"
            role="img"
            aria-label="Tanzania trade network map"
          >
            <path
              className="map-outline"
              style={{ strokeWidth: 4 }}
              d="M127.763 4.128c3.485-.189 6.833-.12 10.319-.081.926 5.04-.424 20.498-2.313 25.417-3.048 7.935-3.082 15.711-3.307 24.088-.282 10.485 5.631 20.418 3.544 31.041 1.604 3.787 4.195 6.95 5.514 10.946 8.183-4.336 9.278-3.8 13.142-11.857 1.987-.196 4.474-.154 6.514-.172-.667-2.45-1.682-7.021-1.817-9.467 1.199-1.552 2.233-2.546 3.62-3.927 4.199 2.372 7.294 7.52 10.878 10.937 2.661 2.537 4.679 3.75 7.736 5.692 2.081-1.274 5.2-3.893 7.527-3.66 1.243 1.89 4.109 16.144 4.452 18.923 4.85-8.034 7.323-12.52 9.891-21.392 5.305-.957 7.551-.023 12.395-.216 8.411-.336 17.414-5.419 23.009-11.525l.355-.392c1.459-1.597 1.958-2.762 2.959-4.693-7.599-3.551-14.476-1.676-23.123-1.764l-1.059-4.031c2.41-2.893 8.377-6.42 11.785-8.39-1.173-1.138-2.557-2.727-3.689-3.965 2.633-.221 6.19-.14 8.894-.155-.384-2.792-.451-4.579-.528-7.389 2.194-1.208 4.353-2.475 6.476-3.802.062-5.046 3.795-9.882 7.096-13.64 2.521-.714 4.906-1.133 7.521-1.211-1.23-2.493-2.59-5.109-3.611-7.679.832-2.151 1.062-2.579 2.329-4.477 2.627-1.246 5.56-2.315 8.311-3.243 5.379 3.484 12.017 7.077 17.682 10.336l29.027 16.756 88.344 50.94 27.898 16.093c4.343 2.512 10.295 5.671 14.249 8.368 4.166 12.433 7.56 26.558 11.752 38.784 3.202 2.169 6.753 4.254 10.1 6.2 20.579 11.971 40.812 24.731 61.419 36.638-1.86 5.106-3.84 10.166-5.943 15.177-1.448 3.424-3.164 7.044-4.378 10.533-1.445 3.65-1.619 9.732-3.505 13.026-4.366 7.625-9.909 14.265-12.587 22.885-.546 1.763-1.568 4.998-1.164 6.817 1.27 5.745 3.605 10.801 4.403 16.794.481 3.533 6.973 7.177 9.016 10.097 2.304 3.296 4.043 7.228 7.045 9.952 5.196 4.586 13.145 6.366 16.464 12.936.607 1.224.836 2.057.395 3.282-2.538 2.575-10.993 1.636-12.79 7.265-2.023 6.343-.484 17.328 1.244 23.723 1.214 4.489 5.156 7.725 9.16 9.557-.879 5.934-3.889 8.695-4.81 14.075-.853 4.955 3.582 8.526 4.005 13.983.521 6.67-2.935 12.942-2.043 19.368 1.019 7.36 4.461 18.922 8.273 25.386 1.43 2.423 5.15 5.559 6.151 8.303 1.368 3.752.716 8.23 1.898 12.015.48 2.678 6.249 7.44 6.292 9.763.2 10.647 2.24 10.601 11.25 14.619 1.239.552 5.194 5.734 7.308 6.975 3.703 2.166 7.531 3.795 11.14 6.553-.527 2.664-.699 4.641-1.474 7.359-2.246 1.276-4.389 3.265-6.424 4.902-5.262 4.237-10.552 8.987-15.943 12.99-2.143 1.591-7.377 3.334-10.061 4.341l-16.81 6.2c-8.06 3.191-17.552 6.742-25.798 9.463-3.182 1.05-15.002 1.599-18.084.352-2.941-1.194-7.914-4.029-11.268-5.543-4.438.435-18.046 2.841-22.04 4.301-2.518.918-13.678 10.667-15.615 12.896-8.109-.315-16.092-.673-24.212-.57-3.737.049-8.988-.555-12.507.229-7.62 1.697-16.41 5.832-23.795 7.6l-.43.1c-6.97-4.217-13.92-8.132-20.842-12.455-21.259 7.433-42.868 14.435-64.062 22.132-5.347 1.943-15.389 4.859-19.911 7.162-3.443 1.754-12.687 9.153-16.435 11.949l6.469-14.956c1.253-2.864 3.98-8.742 4.624-11.551.454-4.023-.345-8.745-.547-12.768-.553-11.001-1.084-21.485-.716-32.507.247-7.377.088-14.561.5-22.007-4.881-7.004-14.673-16.324-19.033-23.568-.001-7.039-.265-8.067 1.977-14.708-2.469-2.154-4.776-4.709-7.461-7.039-4.182 1.325-10.454 2.65-14.883 3.812-10.38-4.252-19.728-9.543-30.748-13.723l-35.988-13.374c-4.07-1.502-15.524-5.356-19.012-7.211-5.948-3.158-15.919-15.783-22.169-18.916-1.331-.666-11.365-1.024-13.689-1.173-2.132 3.588-4.856 7.929-6.634 11.617-5.133-3.359-12.615-7.133-18.204-10.218-.465-6.741-8.39-48.056-10.984-52.17-1.494-2.372-4.968-4.438-7.177-6.201l-14.867-11.871c-4.794-3.826-8.301-6.067-11.744-11.3-5.57-8.464-12.484-16.584-17.768-25.211.625-5.229 1.143-10.788 1.365-16.05.191-5.549-.781-11.208-.837-16.721-.05-4.912-1.63-7.544-3.244-11.953-2.899-7.916-6.374-15.665-9.165-23.605 1.814-3.283 24.989-33.878 26.637-34.755 2.253-1.199 4.88-1.865 7.306-2.647 5.991-1.931 12.273-3.526 18.118-5.835 1.667-2.069 3.52-5.317 4.952-7.654l7.857-12.787 13.259-21.417c2.461-3.983 5.513-8.678 7.689-12.753-.511-2.924-1.175-12.602-2.765-14.574-2.252-2.794-8.387-7.949-11.476-10.16.917-2.791 4.546-12.85 5.733-15.042 4.041-7.464 9.022-15.656 13.363-22.975-7.328-14.489-14.262-30.218-21.353-44.959 4.175-.368 9.224-.18 13.544-.317l22.899-.789c6.148-.166 11.516-.141 17.769-.487Z"
            />
            <g className="routes" style={{ strokeWidth: 2.5 }}>
              <path d="M492 338 337 302 187 116" />
              <path d="M337 302 395 117" />
              <path d="M337 302 166 438" />
              <path d="M337 302 55 272" />
              <path d="M492 338 544 292" />
            </g>
            {[
              [492, 338],
              [337, 302],
              [187, 116],
              [395, 117],
              [166, 438],
              [55, 272],
              [544, 292],
            ].map(([cx, cy], index) => (
              <circle key={index} className="map-dot" cx={cx} cy={cy} r="8" />
            ))}
          </svg>
        </div>
      </section>
      <Leadership />
      <Cta />
    </>
  );
}

function ServicesPage() {
  return (
    <>
      <InnerHero
        eyebrow="Our Services"
        title="Three capabilities. One standard."
        copy="Distribution, trading and mining supply managed with precision from first enquiry to final handover."
        image={IMG.port2}
      />
      <section className="service-detail-wrap">
        {services.map((s, i) => (
          <section className={`service-detail ${i % 2 ? "reverse" : ""}`} key={s.title}>
            <div className="container">
              <div className="detail-image">
                <img src={s.image} alt={s.title} />
                <span>{s.n}</span>
              </div>
              <div className="detail-copy">
                <Eyebrow>{s.n} / Service</Eyebrow>
                <h2>{s.title}</h2>
                <p>
                  {s.copy} Our team coordinates requirements, confirms specifications and keeps each
                  stakeholder informed throughout the process.
                </p>
                <ul>
                  {(i === 0
                    ? [
                        "Wholesale and institutional supply",
                        "Route and delivery coordination",
                        "Manufacturer-to-market support",
                      ]
                    : i === 1
                      ? [
                          "Domestic and cross-border sourcing",
                          "Supplier and documentation checks",
                          "Responsive order coordination",
                        ]
                      : [
                          "Industrial consumables and PPE",
                          "Site-specific procurement",
                          "Quality and compliance review",
                        ]
                  ).map((x) => (
                    <li key={x}>
                      <span className="check">
                        <Icon name="check" size={14} />
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
                <Button onClick={() => go("Contact")}>Discuss Your Needs</Button>
              </div>
            </div>
          </section>
        ))}
      </section>
      <section className="service-standard section-pad">
        <div className="container">
          <SectionTitle number="04" eyebrow="Our Standard" title="No ambiguity in the handover." />
          <div className="standard-grid">
            {[
              "Clear scope",
              "Verified sourcing",
              "Documented progress",
              "Accountable delivery",
            ].map((x, i) => (
              <div key={x}>
                <b>0{i + 1}</b>
                <h3>{x}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}

function ProductsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Food & Beverage", "Household", "Mining Supply", "Trade Goods"];
  return (
    <>
      <InnerHero
        eyebrow="Products"
        title="Wholesale supply, carefully sourced."
        copy="A focused catalogue for corporate buyers, traders and distribution partners. Contact us for specifications and availability."
        image={IMG.shelves}
      />
      <section className="section-pad product-page">
        <div className="container">
          <div className="product-toolbar">
            <div>
              <Eyebrow>Product Catalogue</Eyebrow>
              <h2>Browse by category.</h2>
            </div>
            <Button
              outline
              onClick={() => alert("The AuGust Aurea product brochure will be available shortly.")}
            >
              Download Brochure <Icon name="download" size={17} />
            </Button>
          </div>
          <div className="filters">
            {cats.map((c) => (
              <button className={filter === c ? "active" : ""} onClick={() => setFilter(c)} key={c}>
                {c}
              </button>
            ))}
          </div>
          <div className="product-grid product-full">
            {products
              .filter((p) => filter === "All" || p.cat === filter)
              .map((p) => (
                <ProductCard key={p.name} {...p} />
              ))}
          </div>
          <p className="catalogue-note">
            Looking for a product not shown here? Our sourcing desk can review your specification
            and confirm the most suitable supply route.
          </p>
        </div>
      </section>
      <Cta />
    </>
  );
}

function GalleryPage() {
  const images = [
    IMG.port,
    IMG.warehouse,
    IMG.mining,
    IMG.truck,
    IMG.warehouse2,
    IMG.port2,
    IMG.shelves,
    IMG.mining2,
  ];
  const [active, setActive] = useState<number | null>(null);
  const step = (d: number) =>
    setActive((i) => (i === null ? i : (i + d + images.length) % images.length));
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);
  return (
    <>
      <InnerHero
        eyebrow="Gallery"
        title="Trade in motion."
        copy="A view of the environments, infrastructure and people that keep supply moving."
        image={IMG.truck}
      />
      <section className="section-pad">
        <div className="container">
          <SectionTitle eyebrow="Field Notes" title="Across our operations." />
          <div className="gallery-grid">
            {images.map((img, i) => (
              <button key={img} className={`gallery-item g${i}`} onClick={() => setActive(i)}>
                <img src={img} alt={`AuGust Aurea operations ${i + 1}`} />
                <span>
                  <Icon name="expand" />
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>
      {active !== null && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Gallery viewer"
          onClick={() => setActive(null)}
        >
          <button className="lb-close" aria-label="Close" onClick={() => setActive(null)}>
            <Icon name="close" />
          </button>
          <button
            className="lb-nav lb-prev"
            aria-label="Previous image"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
          >
            <Icon name="arrow" />
          </button>
          <img
            key={active}
            src={images[active]}
            alt={`AuGust Aurea operations ${active + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="lb-nav lb-next"
            aria-label="Next image"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
          >
            <Icon name="arrow" />
          </button>
          <span className="lb-count">
            {String(active + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
          </span>
        </div>
      )}
      <Cta />
    </>
  );
}

function NewsPage() {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Market Brief", "Trade", "Mining", "Logistics"];
  return (
    <>
      <InnerHero
        eyebrow="News & Insights"
        title="Signals from the market."
        copy="Practical perspectives on distribution, sourcing and regional trade across East Africa."
        image={IMG.port}
      />
      <section className="section-pad">
        <div className="container">
          <div className="filters">
            {cats.map((c) => (
              <button className={filter === c ? "active" : ""} onClick={() => setFilter(c)} key={c}>
                {c}
              </button>
            ))}
          </div>
          <div className="news-grid">
            {articles
              .filter((a) => filter === "All" || a.cat === filter)
              .map((a, i) => (
                <ArticleCard key={a.title} article={a} featured={i === 0 && filter === "All"} />
              ))}
          </div>
        </div>
      </section>
      <Cta />
    </>
  );
}

function Careers() {
  const roles = [
    "Commercial Account Executive",
    "Procurement & Sourcing Officer",
    "Distribution Coordinator",
  ];
  return (
    <>
      <InnerHero
        eyebrow="Careers"
        title="Do precise work that moves markets."
        copy="Join a determined team building a dependable trade business from Tanzania to the region."
        image={IMG.warehouse2}
      />
      <section className="section-pad careers">
        <div className="container careers-grid">
          <div>
            <SectionTitle
              number="01"
              eyebrow="Open Roles"
              title="Build with us."
              copy="We look for commercial judgement, practical initiative and respect for the details."
            />
            {roles.map((r, i) => (
              <button className="role" key={r}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{r}</h3>
                  <p>Dar es Salaam · Full time</p>
                </div>
                <Icon name="arrow" />
              </button>
            ))}
          </div>
          <ApplicationForm />
        </div>
      </section>
    </>
  );
}

function ApplicationForm() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <form className="form-card" onSubmit={submit}>
      <Eyebrow>Apply Now</Eyebrow>
      <h2>Introduce yourself.</h2>
      {sent ? (
        <div className="success">
          <span className="check">
            <Icon name="check" />
          </span>
          <h3>Application received.</h3>
          <p>
            Thank you. Our team will review your details and respond if your experience matches an
            open role.
          </p>
        </div>
      ) : (
        <>
          <label>
            Full name
            <input required placeholder="Your full name" />
          </label>
          <label>
            Email address
            <input required type="email" placeholder="name@email.com" />
          </label>
          <label>
            Role of interest
            <select>
              <option>Commercial Account Executive</option>
              <option>Procurement & Sourcing Officer</option>
              <option>Distribution Coordinator</option>
              <option>General application</option>
            </select>
          </label>
          <label>
            Short introduction
            <textarea required rows={5} placeholder="Tell us about your experience" />
          </label>
          <Button type="submit">Submit Application</Button>
        </>
      )}
    </form>
  );
}

function Contact() {
  const { t } = useLang();
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
  };
  return (
    <>
      <InnerHero
        eyebrow={t.contact_hero_eyebrow}
        title={t.contact_hero_title}
        copy={t.contact_hero_copy}
        image={IMG.port2}
      />
      <section className="contact-page section-pad">
        <div className="container contact-grid">
          <div className="contact-info">
            <SectionTitle number="01" eyebrow="Contact" title="Start a direct conversation." />
            <p>
              For product availability, bulk sourcing, distribution partnerships or mining supply,
              send us a clear requirement. We aim to acknowledge enquiries within one business day.
            </p>
            <div className="contact-lines">
              <div>
                <Icon name="phone" />
                <span>
                  <small>Phone & WhatsApp</small>+255 700 000 000
                </span>
              </div>
              <div>
                <Icon name="mail" />
                <span>
                  <small>Email</small>trade@augustaurea.co.tz
                </span>
              </div>
              <div>
                <Icon name="pin" />
                <span>
                  <small>Head Office</small>Dar es Salaam, Tanzania
                </span>
              </div>
            </div>
            <div className="contact-map">
              <svg
                className="tz-map"
                viewBox="0 0 584 586"
                role="img"
                aria-label="Tanzania trade network map"
              >
                <path
                  className="map-outline"
                  style={{ strokeWidth: 4 }}
                  d="M127.763 4.128c3.485-.189 6.833-.12 10.319-.081.926 5.04-.424 20.498-2.313 25.417-3.048 7.935-3.082 15.711-3.307 24.088-.282 10.485 5.631 20.418 3.544 31.041 1.604 3.787 4.195 6.95 5.514 10.946 8.183-4.336 9.278-3.8 13.142-11.857 1.987-.196 4.474-.154 6.514-.172-.667-2.45-1.682-7.021-1.817-9.467 1.199-1.552 2.233-2.546 3.62-3.927 4.199 2.372 7.294 7.52 10.878 10.937 2.661 2.537 4.679 3.75 7.736 5.692 2.081-1.274 5.2-3.893 7.527-3.66 1.243 1.89 4.109 16.144 4.452 18.923 4.85-8.034 7.323-12.52 9.891-21.392 5.305-.957 7.551-.023 12.395-.216 8.411-.336 17.414-5.419 23.009-11.525l.355-.392c1.459-1.597 1.958-2.762 2.959-4.693-7.599-3.551-14.476-1.676-23.123-1.764l-1.059-4.031c2.41-2.893 8.377-6.42 11.785-8.39-1.173-1.138-2.557-2.727-3.689-3.965 2.633-.221 6.19-.14 8.894-.155-.384-2.792-.451-4.579-.528-7.389 2.194-1.208 4.353-2.475 6.476-3.802.062-5.046 3.795-9.882 7.096-13.64 2.521-.714 4.906-1.133 7.521-1.211-1.23-2.493-2.59-5.109-3.611-7.679.832-2.151 1.062-2.579 2.329-4.477 2.627-1.246 5.56-2.315 8.311-3.243 5.379 3.484 12.017 7.077 17.682 10.336l29.027 16.756 88.344 50.94 27.898 16.093c4.343 2.512 10.295 5.671 14.249 8.368 4.166 12.433 7.56 26.558 11.752 38.784 3.202 2.169 6.753 4.254 10.1 6.2 20.579 11.971 40.812 24.731 61.419 36.638-1.86 5.106-3.84 10.166-5.943 15.177-1.448 3.424-3.164 7.044-4.378 10.533-1.445 3.65-1.619 9.732-3.505 13.026-4.366 7.625-9.909 14.265-12.587 22.885-.546 1.763-1.568 4.998-1.164 6.817 1.27 5.745 3.605 10.801 4.403 16.794.481 3.533 6.973 7.177 9.016 10.097 2.304 3.296 4.043 7.228 7.045 9.952 5.196 4.586 13.145 6.366 16.464 12.936.607 1.224.836 2.057.395 3.282-2.538 2.575-10.993 1.636-12.79 7.265-2.023 6.343-.484 17.328 1.244 23.723 1.214 4.489 5.156 7.725 9.16 9.557-.879 5.934-3.889 8.695-4.81 14.075-.853 4.955 3.582 8.526 4.005 13.983.521 6.67-2.935 12.942-2.043 19.368 1.019 7.36 4.461 18.922 8.273 25.386 1.43 2.423 5.15 5.559 6.151 8.303 1.368 3.752.716 8.23 1.898 12.015.48 2.678 6.249 7.44 6.292 9.763.2 10.647 2.24 10.601 11.25 14.619 1.239.552 5.194 5.734 7.308 6.975 3.703 2.166 7.531 3.795 11.14 6.553-.527 2.664-.699 4.641-1.474 7.359-2.246 1.276-4.389 3.265-6.424 4.902-5.262 4.237-10.552 8.987-15.943 12.99-2.143 1.591-7.377 3.334-10.061 4.341l-16.81 6.2c-8.06 3.191-17.552 6.742-25.798 9.463-3.182 1.05-15.002 1.599-18.084.352-2.941-1.194-7.914-4.029-11.268-5.543-4.438.435-18.046 2.841-22.04 4.301-2.518.918-13.678 10.667-15.615 12.896-8.109-.315-16.092-.673-24.212-.57-3.737.049-8.988-.555-12.507.229-7.62 1.697-16.41 5.832-23.795 7.6l-.43.1c-6.97-4.217-13.92-8.132-20.842-12.455-21.259 7.433-42.868 14.435-64.062 22.132-5.347 1.943-15.389 4.859-19.911 7.162-3.443 1.754-12.687 9.153-16.435 11.949l6.469-14.956c1.253-2.864 3.98-8.742 4.624-11.551.454-4.023-.345-8.745-.547-12.768-.553-11.001-1.084-21.485-.716-32.507.247-7.377.088-14.561.5-22.007-4.881-7.004-14.673-16.324-19.033-23.568-.001-7.039-.265-8.067 1.977-14.708-2.469-2.154-4.776-4.709-7.461-7.039-4.182 1.325-10.454 2.65-14.883 3.812-10.38-4.252-19.728-9.543-30.748-13.723l-35.988-13.374c-4.07-1.502-15.524-5.356-19.012-7.211-5.948-3.158-15.919-15.783-22.169-18.916-1.331-.666-11.365-1.024-13.689-1.173-2.132 3.588-4.856 7.929-6.634 11.617-5.133-3.359-12.615-7.133-18.204-10.218-.465-6.741-8.39-48.056-10.984-52.17-1.494-2.372-4.968-4.438-7.177-6.201l-14.867-11.871c-4.794-3.826-8.301-6.067-11.744-11.3-5.57-8.464-12.484-16.584-17.768-25.211.625-5.229 1.143-10.788 1.365-16.05.191-5.549-.781-11.208-.837-16.721-.05-4.912-1.63-7.544-3.244-11.953-2.899-7.916-6.374-15.665-9.165-23.605 1.814-3.283 24.989-33.878 26.637-34.755 2.253-1.199 4.88-1.865 7.306-2.647 5.991-1.931 12.273-3.526 18.118-5.835 1.667-2.069 3.52-5.317 4.952-7.654l7.857-12.787 13.259-21.417c2.461-3.983 5.513-8.678 7.689-12.753-.511-2.924-1.175-12.602-2.765-14.574-2.252-2.794-8.387-7.949-11.476-10.16.917-2.791 4.546-12.85 5.733-15.042 4.041-7.464 9.022-15.656 13.363-22.975-7.328-14.489-14.262-30.218-21.353-44.959 4.175-.368 9.224-.18 13.544-.317l22.899-.789c6.148-.166 11.516-.141 17.769-.487Z"
                />
                <g className="routes" style={{ strokeWidth: 2.5 }}>
                  <path d="M492 338 337 302 187 116" />
                  <path d="M337 302 395 117" />
                  <path d="M337 302 166 438" />
                  <path d="M337 302 55 272" />
                  <path d="M492 338 544 292" />
                </g>
                {[
                  [492, 338],
                  [337, 302],
                  [187, 116],
                  [395, 117],
                  [166, 438],
                  [55, 272],
                  [544, 292],
                ].map(([cx, cy], index) => (
                  <circle key={index} className="map-dot" cx={cx} cy={cy} r="8" />
                ))}
              </svg>
              <span>
                Serving Tanzania
                <br />
                and East Africa
              </span>
            </div>
          </div>
          <form className="form-card enquiry" onSubmit={submit}>
            <Eyebrow>Enquiry Form</Eyebrow>
            <h2>Wholesale requirements.</h2>
            {sent ? (
              <div className="success">
                <span className="check">
                  <Icon name="check" />
                </span>
                <h3>Thank you for your enquiry.</h3>
                <p>Our commercial team will review the details and contact you shortly.</p>
                <button className="text-link" onClick={() => setSent(false)}>
                  Send another enquiry <Icon name="arrow" />
                </button>
              </div>
            ) : (
              <div className="form-grid">
                <label>
                  Company
                  <input required placeholder="Company name" />
                </label>
                <label>
                  Contact name
                  <input required placeholder="Full name" />
                </label>
                <label>
                  Email
                  <input required type="email" placeholder="Business email" />
                </label>
                <label>
                  Phone
                  <input required placeholder="+255" />
                </label>
                <label>
                  Product interest
                  <select>
                    <option>FMCG wholesale</option>
                    <option>General trading</option>
                    <option>Mining supply</option>
                    <option>Distribution partnership</option>
                  </select>
                </label>
                <label>
                  Estimated quantity
                  <input placeholder="Cases, tonnes or units" />
                </label>
                <label className="wide">
                  Message
                  <textarea
                    required
                    rows={6}
                    placeholder="Include product specification, delivery location and required date"
                  />
                </label>
                <div className="wide">
                  <Button type="submit">Send Enquiry</Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Footer() {
  const { t } = useLang();
  const navLabels: Record<Page, string> = {
    Home: t.nav_home,
    About: t.nav_about,
    Services: t.nav_services,
    Products: t.nav_products,
    Gallery: t.nav_gallery,
    News: t.nav_news,
    Careers: t.nav_careers,
    Contact: t.nav_contact,
  };
  return (
    <footer>
      <div className="footer-main">
        <div className="container footer-grid">
          <div className="footer-about">
            <Logo light />
            <p>{t.footer_about}</p>
            <div className="socials">
              <button className="flex items-center justify-center" aria-label="LinkedIn">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M5.4 7.8H2V22h3.4V7.8ZM3.7 2A2 2 0 1 0 3.7 6a2 2 0 0 0 0-4ZM13.3 7.8H9.9V22h3.4v-7c0-1.8.3-3.6 2.6-3.6 2.2 0 2.3 2.1 2.3 3.7V22h3.4v-7.8c0-3.8-.8-6.7-5.2-6.7-2.1 0-3.5 1.2-4.1 2.3V7.8Z" />
                </svg>
              </button>
            </div>
          </div>
          <div>
            <h3>{t.footer_pages}</h3>
            {nav.slice(1).map((n) => (
              <button key={n} onClick={() => go(n)}>
                {navLabels[n]}
              </button>
            ))}
          </div>
          <div>
            <h3>{t.footer_contact}</h3>
            <p>
              <Icon name="phone" size={17} /> +255 700 000 000
            </p>
            <p>
              <Icon name="mail" size={17} /> trade@augustaurea.co.tz
            </p>
            <p>
              <Icon name="pin" size={17} /> Dar es Salaam, Tanzania
            </p>
          </div>
          <div className="newsletter">
            <h3>{t.footer_updates}</h3>
            <p>{t.footer_updates_copy}</p>
            <div>
              <input type="email" placeholder={t.footer_placeholder} aria-label="Newsletter email" />
              <button aria-label="Subscribe">
                <Icon name="arrow" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <span>{t.footer_rights}</span>
          <div>
            <button>{t.footer_terms}</button>
            <button>{t.footer_privacy}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("august_lang") as Lang;
      if (saved === "EN" || saved === "SW") return saved;
    }
    return "EN";
  });

  const handleSetLang = (l: Lang) => {
    setLang(l);
    if (typeof window !== "undefined") {
      localStorage.setItem("august_lang", l);
    }
  };

  const t = translations[lang] || translations.EN;
  const [page, setPage] = useState<Page | "Admin">(getPageFromUrl);
  const [adminView, setAdminView] = useState<"dashboard" | "studio">("dashboard");
  const [adminEditingPage, setAdminEditingPage] = useState<string>("Home");
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return Boolean(localStorage.getItem(ADMIN_AUTH_KEY) || sessionStorage.getItem(ADMIN_AUTH_KEY));
    } catch {
      return false;
    }
  });

  const handleAdminLogout = () => {
    try {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    } catch {}
    setIsAdminAuthenticated(false);
  };

  useEffect(() => {
    if (page !== "Admin") {
      document.documentElement.classList.remove("admin-mode");
      if (!("ontouchstart" in window) && navigator.maxTouchPoints === 0) {
        document.documentElement.classList.add("has-magnetic-cursor");
      }
      updateSeoMeta(page);
    } else {
      document.documentElement.classList.add("admin-mode");
      document.documentElement.classList.remove("has-magnetic-cursor");
      document.title = !isAdminAuthenticated
        ? "AuGust Admin | Secure Login Gate"
        : adminView === "dashboard"
          ? "AuGust Admin | Executive Dashboard & SEO"
          : `AuGust Studio | Editing ${adminEditingPage}`;
    }
  }, [page, adminView, adminEditingPage, isAdminAuthenticated]);

  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromUrl());
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  globalNavigate = (p) => {
    setPage(p);
    const targetPath = p === "Admin" ? "/Studio" : pageToPath[p as Page];
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ page: p }, "", targetPath);
    }
    window.scrollTo(0, 0);
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.12 },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, [page]);

  if (page === "Admin") {
    if (!isAdminAuthenticated) {
      return (
        <AdminLogin
          onLoginSuccess={() => setIsAdminAuthenticated(true)}
          onBackToSite={() => go("Home")}
        />
      );
    }

    return (
      <CmsProvider>
        {adminView === "dashboard" ? (
          <AdminDashboard
            onOpenEditor={(selectedPage) => {
              setAdminEditingPage(selectedPage);
              setAdminView("studio");
            }}
            onLogout={handleAdminLogout}
          />
        ) : (
          <WebflowStudio
            page={adminEditingPage}
            onBackToDashboard={() => setAdminView("dashboard")}
            onLogout={handleAdminLogout}
          />
        )}
      </CmsProvider>
    );
  }

  const pages: Record<Page, React.ReactNode> = {
    Home: <Home />,
    About: <About />,
    Services: <ServicesPage />,
    Products: <ProductsPage />,
    Gallery: <GalleryPage />,
    News: <NewsPage />,
    Careers: <Careers />,
    Contact: <Contact />,
  };
  return (
    <CmsProvider>
      <LangContext.Provider value={{ lang, setLang: handleSetLang, t }}>
        <Header page={page} />
        <main key={page} className="page-transition">
          {pages[page]}
        </main>
        <Footer />
        <button
          ref={(button) => {
          if (!button) return;

          let frame = 0;
          const updateContrast = () => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => {
              const bounds = button.getBoundingClientRect();
              button.style.pointerEvents = "none";
              let element = document.elementFromPoint(
                bounds.left + bounds.width / 2,
                bounds.top + bounds.height / 2,
              ) as HTMLElement | null;
              button.style.pointerEvents = "";

              let background = "rgb(255, 255, 255)";
              while (element) {
                const candidate = getComputedStyle(element).backgroundColor;
                const channels = candidate.match(/[\d.]+/g)?.map(Number) ?? [];
                if (channels.length >= 3 && (channels[3] ?? 1) > 0) {
                  background = candidate;
                  break;
                }
                element = element.parentElement;
              }

              const [red, green, blue] = (
                background.match(/[\d.]+/g)?.map(Number) ?? [255, 255, 255]
              ).map((channel) => {
                const value = channel / 255;
                return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
              });
              const luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
              const overDarkBackground = luminance < 0.35;

              button.style.backgroundColor = overDarkBackground ? "#FFFFFF" : "#080300";
              button.style.color = overDarkBackground ? "#080300" : "#FFFFFF";
            });
          };

          updateContrast();
          window.addEventListener("scroll", updateContrast, { passive: true });
          window.addEventListener("resize", updateContrast);

          return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("scroll", updateContrast);
            window.removeEventListener("resize", updateContrast);
          };
        }}
        className="whatsapp transition-colors duration-300"
        onClick={() => window.open("https://wa.me/255700000000", "_blank")}
        aria-label="Chat on WhatsApp"
      >
        <Icon name="whatsapp" size={20} />
      </button>
      <button
        className="to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
      >
        ↑
      </button>
      </LangContext.Provider>
    </CmsProvider>
  );
}

export default App;
