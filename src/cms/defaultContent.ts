export interface SectionSchema {
  section_key: string;
  section_name: string;
  page_key: string;
  fields: {
    key: string;
    label: string;
    type: "text" | "textarea" | "image" | "list";
    defaultValue: any;
  }[];
}

export const defaultSections: Record<string, Record<string, any>> = {
  Home: {
    hero: {
      eyebrow: "AuGust Aurea Limited",
      title_1: "Connecting &",
      title_2: "Creating Markets",
      copy: "Reliable sourcing, distribution and service for businesses trading across Tanzania and the East African corridor.",
      btn_primary: "Enquire Now",
      btn_secondary: "View Products",
      bg_image: "https://images.unsplash.com/photo-1786207289475-e08d256f0258?auto=format&fit=crop&w=1800&q=85",
    },
    credentials: {
      item_1: "Full Licensed",
      item_2: "Registered in Tanzania",
      item_3: "East Africa Trade Network",
      item_4: "Multilingual Support",
    },
    who: {
      eyebrow: "Who We Are",
      title_1: "Built for the gaps",
      title_2: "others overlook.",
      copy: "AuGust Aurea was established in Tanzania to close a familiar service gap: businesses needed a trading partner that could move with urgency without compromising standards. We combine local market knowledge with disciplined sourcing and accountable delivery.",
      link_text: "Learn more about us",
      badge_bold: "Local insight.",
      badge_sub: "Regional reach.",
      image: "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80",
    },
    services_intro: {
      eyebrow: "What We Do",
      title: "Trade, delivered with discipline.",
      copy: "Connected capabilities, managed through one accountable business relationship.",
    },
    operate: {
      eyebrow: "Where We Operate",
      title_1: "A strong Tanzanian base.",
      title_2: "A regional outlook.",
      copy: "Our network connects key commercial centres, border corridors and ports, supporting movement into neighbouring East African markets.",
      loc_1: "Dar es Salaam & Zanzibar",
      loc_2: "Dodoma & Arusha",
      loc_3: "Mwanza & Kigoma",
      loc_4: "Mbeya & southern corridor",
      reserved_title: "East Africa Trade Network",
      reserved_countries: "Kenya · Uganda · Rwanda · DRC\nZambia · Mozambique · Malawi",
      reserved_sub: "Wider regional map to be added",
    },
    process: {
      eyebrow: "How We Work",
      title: "A clear route from request to delivery.",
      step_1: "Enquiry",
      step_1_desc: "Tell us what you need and where it is required.",
      step_2: "Quote",
      step_2_desc: "Receive a clear, documented response within 24 hours.",
      step_3: "Sourcing",
      step_3_desc: "We validate suppliers, quality and compliance.",
      step_4: "Delivery",
      step_4_desc: "Goods are coordinated through the agreed route.",
      step_5: "After-sale Support",
      step_5_desc: "Your account lead stays available after handover.",
    },
    commitments: {
      eyebrow: "Our Commitments",
      title_1: "Standards you can",
      title_2: "build business on.",
      button: "Start an Enquiry",
      bg_image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80",
      truck_image: "https://images.unsplash.com/photo-1657725099160-53c81f45e4df?auto=format&fit=crop&w=1400&q=80",
      commit_1: "Quote within 24 hours",
      commit_2: "Dedicated account manager",
      commit_3: "Quality-checked sourcing",
      commit_4: "Reliable delivery",
      commit_5: "Transparent communication",
      commit_6: "Compliance first",
      badge_corridor: "East Africa",
      badge_corridor_sub: "Trade Corridor",
      badge_base: "Tanzania",
      badge_base_sub: "Base of Operations",
    },
    cta: {
      eyebrow: "Start a conversation",
      title: "Ready to place a wholesale order?",
      btn_enquire: "Enquire Now",
      btn_whatsapp: "Chat on WhatsApp",
    },
  },
  About: {
    hero: {
      eyebrow: "About Us",
      title: "Built on trust. Driven by delivery.",
      copy: "A Tanzanian trading company with a practical understanding of how goods, markets and relationships move.",
      image: "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80",
    },
    story: {
      eyebrow: "Our Story",
      title: "A better standard for everyday trade.",
      lead: "AuGust Aurea Limited was founded to give businesses a more responsive, transparent way to source and move essential goods.",
      body: "From our base in Dar es Salaam, we work with manufacturers, corporate buyers and traders who value clear communication as much as competitive sourcing. Every assignment is handled with commercial care, from product verification and paperwork through delivery and follow-up.",
    },
    mission: {
      item_1_num: "01",
      item_1_eyebrow: "Our Mission",
      item_1_title: "Connect credible supply with real market demand.",
      item_1_desc: "To make regional trade more dependable through disciplined sourcing, reliable distribution and service that respects the client's time.",
      item_2_num: "02",
      item_2_eyebrow: "Our Vision",
      item_2_title: "Become a trusted East African trade partner.",
      item_2_desc: "Known for doing the fundamentals exceptionally well and for building markets that create lasting commercial value.",
    },
  },
  Services: {
    hero: {
      eyebrow: "Our Services",
      title: "Trade capabilities built around accountability.",
      copy: "From single consignments to managed regional distribution, we support businesses that need dependable execution.",
      image: "https://images.unsplash.com/photo-1769752803898-e7e9a843a120?auto=format&fit=crop&w=1200&q=80",
    },
  },
  Products: {
    hero: {
      eyebrow: "Wholesale Catalogue",
      title: "Essential goods, ready for reliable supply.",
      copy: "Verified FMCG, food commodities, cleaning supplies and site consumables for regional commercial buyers.",
      image: "https://images.unsplash.com/photo-1757802868665-60b771aa399b?auto=format&fit=crop&w=1000&q=80",
    },
  },
  Gallery: {
    hero: {
      eyebrow: "Operations Gallery",
      title: "Trade in motion across corridors and hubs.",
      copy: "A visual record of our port clearances, warehouse distribution, logistics fleet and field teams.",
      image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1400&q=80",
    },
  },
  News: {
    hero: {
      eyebrow: "Trade News & Corridors",
      title: "Practical market insight from the ground.",
      copy: "Analysis, trade updates and commentary on East African logistics, commodities and distribution.",
      image: "https://images.unsplash.com/photo-1523848309072-c199db53f137?auto=format&fit=crop&w=1400&q=80",
    },
  },
  Careers: {
    hero: {
      eyebrow: "Careers & Culture",
      title: "Work with purpose in regional trade.",
      copy: "Join a dedicated, disciplined team building the trade and distribution infrastructure of tomorrow.",
      image: "https://images.unsplash.com/photo-1586528116022-aeda1613c63d?auto=format&fit=crop&w=1400&q=80",
    },
  },
  Contact: {
    hero: {
      eyebrow: "Wholesale Enquiry",
      title: "Tell us what you need.",
      copy: "Share your requirement and our commercial team will respond with the next practical step.",
      image: "https://images.unsplash.com/photo-1769752803898-e7e9a843a120?auto=format&fit=crop&w=1200&q=80",
    },
    info: {
      phone: "+255 700 000 000",
      email: "trade@augustaurea.co.tz",
      address: "Dar es Salaam, Tanzania",
    },
  },
};
