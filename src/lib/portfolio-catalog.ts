export const PORTFOLIO_CATEGORIES = [
  "All",
  "E-Commerce",
  "Hospitality",
  "Enterprise & SaaS",
  "Luxury & Lifestyle",
] as const;

export interface PortfolioProjectItem {
  id: string;
  name: string;
  client: string;
  tag: string;
  category: "E-Commerce" | "Hospitality" | "Enterprise & SaaS" | "Luxury & Lifestyle";
  location: string;
  folderSource?: string;
  architectureBadge: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  href?: string;
  previewHtml?: string;
  accentColor?: string;
}

export type PortfolioProject = PortfolioProjectItem;

export const JUBILEE_PORTFOLIO_PROJECTS: PortfolioProjectItem[] = [
  {
    id: "stud-burger",
    name: "Stud. The Burger Shop",
    client: "Stud Hospitality (WC & Gauteng)",
    tag: "Multi-Branch Hospitality & Ordering",
    category: "Hospitality",
    location: "Western Cape & Gauteng, SA",
    architectureBadge: "TanStack Start + Supabase",
    summary:
      "Flagship digital brand and branch locator for Stud. The Burger Shop — Single origin Boran stud beef, ground fresh daily across 7 South African branches.",
    highlights: [
      "Interactive 7-branch locator across Western Cape & Gauteng",
      "Dynamic Boran Stud Beef smash menu & combo builder",
      "Supabase backend with sub-second mobile page transitions",
    ],
    techStack: ["React 19", "TanStack Router", "Tailwind CSS", "Supabase", "Vercel"],
    href: "https://swift-delta-48l7oqa.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#0c0a09;color:#fafaf9;font-family:system-ui,-apple-system,sans-serif;padding:24px}
      .nav{display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #dc2626;padding-bottom:14px}
      .logo{font-size:28px;font-weight:900;letter-spacing:-0.04em;color:#fff}
      .logo span{color:#dc2626}
      .pill{background:#dc2626;color:#fff;font-size:11px;font-weight:800;padding:6px 14px;border-radius:999px;text-transform:uppercase}
      .marquee{margin-top:14px;background:#1c1917;padding:8px 12px;border-radius:8px;font-size:10px;font-weight:800;letter-spacing:0.18em;color:#f87171;text-transform:uppercase}
      .hero{margin-top:26px;background:linear-gradient(135deg,#1c1917 0%,#0c0a09 100%);border:1px solid #292524;border-radius:20px;padding:28px}
      h1{font-size:38px;line-height:1.02;font-weight:900;letter-spacing:-0.03em}
      p{color:#a8a29e;font-size:14px;margin-top:12px;max-width:480px;line-height:1.5}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px}
      .card{background:#18181b;border:1px solid #27272a;border-radius:14px;padding:14px}
      .price{color:#f87171;font-weight:800;font-size:15px;margin-top:6px}
    </style></head><body>
      <div class="nav"><div class="logo">STUD<span>.</span></div><div class="pill">7 SA Branches</div></div>
      <div class="marquee">SINGLE ORIGIN · BORAN STUD BEEF · GROUND FRESH DAILY · FARM TO BUN</div>
      <div class="hero">
        <h1>No frills. No fuss.<br/>Just Boran stud beef.</h1>
        <p>Ground fresh daily, seared hard on flat-iron steel, stacked in a toasted artisanal brioche bun across Western Cape & Gauteng.</p>
        <div class="grid">
          <div class="card"><strong>The Double Stud</strong><div style="font-size:11px;color:#a1a1aa;margin-top:4px">2x 120g Boran patties, aged cheddar, stud sauce</div><div class="price">R115</div></div>
          <div class="card"><strong>Bacon & Jalapeño</strong><div style="font-size:11px;color:#a1a1aa;margin-top:4px">Wood-smoked streaky bacon, pickled chili, American cheese</div><div class="price">R128</div></div>
          <div class="card"><strong>Truffle Mushroom</strong><div style="font-size:11px;color:#a1a1aa;margin-top:4px">Roasted brown mushrooms, black garlic mayo, Swiss</div><div class="price">R132</div></div>
        </div>
      </div>
    </body></html>`,
  },
  {
    id: "kinetix-fitness",
    name: "KINETIX Performance Store",
    client: "Kinetix Athletics ZA",
    tag: "Athletic E-Commerce + Yoco Payments",
    category: "E-Commerce",
    location: "Johannesburg, South Africa",
    architectureBadge: "Next.js + Yoco + Supabase",
    summary:
      "High-performance athletic equipment & apparel storefront engineered with Next.js App Router, persistent Zustand cart, Supabase RLS, and hosted South African Yoco Checkout.",
    highlights: [
      "Native Yoco Checkout webhook integration (ZAR payment verification)",
      "Persistent client-side Zustand cart with real-time stock validation",
      "Row-Level Security (RLS) Supabase order & inventory schema",
    ],
    techStack: ["Next.js", "TypeScript", "Zustand", "Supabase", "Yoco Checkout", "Vercel"],
    href: "https://brisk-dune-k3dy7pp.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#090d16;color:#f8fafc;font-family:system-ui,sans-serif;padding:24px}
      .top{display:flex;justify-content:space-between;align-items:center;padding-bottom:14px;border-bottom:1px solid rgba(255,255,255,0.1)}
      .brand{font-weight:900;font-size:22px;letter-spacing:0.12em;color:#38bdf8}
      .yoco{background:#10b98122;border:1px solid #10b98166;color:#34d399;padding:4px 10px;border-radius:999px;font-size:10px;font-weight:700}
      .hero{margin-top:20px;background:linear-gradient(135deg,#0f172a,#1e293b);border:1px solid rgba(56,189,248,0.25);border-radius:18px;padding:24px}
      h1{font-size:32px;font-weight:800;letter-spacing:-0.02em}
      .products{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:18px}
      .p{background:#090d16;border:1px solid rgba(255,255,255,0.1);border-radius:14px;padding:16px;display:flex;justify-content:space-between;align-items:center}
      .btn{background:#38bdf8;color:#020617;font-weight:700;font-size:11px;padding:8px 14px;border-radius:8px}
    </style></head><body>
      <div class="top"><div class="brand">KINETIX // ZA</div><div class="yoco">YOCO INSTANT CHECKOUT</div></div>
      <div class="hero">
        <h1>Engineered For Peak Output.</h1>
        <p style="font-size:13px;color:#94a3b8;margin-top:8px">Precision strength gear & compression wear shipped nationwide across South Africa.</p>
        <div class="products">
          <div class="p"><div><div style="font-size:13px;font-weight:700">Kinetix Carbon Lifting Belt</div><div style="font-size:11px;color:#38bdf8;margin-top:4px">R1,850.00</div></div><div class="btn">Add +</div></div>
          <div class="p"><div><div style="font-size:13px;font-weight:700">AeroGrip Pro Wrist Wraps</div><div style="font-size:11px;color:#38bdf8;margin-top:4px">R490.00</div></div><div class="btn">Add +</div></div>
        </div>
      </div>
    </body></html>`,
  },
  {
    id: "tr-inventory-hub",
    name: "T&R Inventory Hub",
    client: "T&R Enterprise (CSA Showgrounds)",
    tag: "Enterprise Stock & Venue Auditing SaaS",
    category: "Enterprise & SaaS",
    location: "South Africa",
    architectureBadge: "Drizzle ORM + Supabase BI",
    summary:
      "Full-stack stock intelligence and physical reconciliation platform for T&R Enterprise, servicing major event venues and clubs with real-time loss-prevention auditing.",
    highlights: [
      "Business Intelligence dashboard for daily venue stock monitoring",
      "On-site physical count vs. logical database discrepancy engine",
      "Role-Based Access Control (Admins, On-Site Auditors, Venue Clients)",
    ],
    techStack: ["React", "TypeScript", "Drizzle ORM", "Supabase", "Vercel"],
    href: "https://speedy-citrine-h7zq7z3.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#060913;color:#f1f5f9;font-family:system-ui,sans-serif;padding:22px}
      .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:12px}
      .kpis{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px}
      .kpi{background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:14px}
      .val{font-size:24px;font-weight:800;color:#38bdf8;margin-top:6px}
      .tbl{margin-top:16px;background:#0f172a;border:1px solid #1e293b;border-radius:14px;padding:14px;font-size:12px}
      .row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #1e293b}
    </style></head><body>
      <div class="hdr"><div><strong style="font-size:16px">T&R INVENTORY HUB</strong><div style="font-size:10px;color:#64748b">Managing Your Stock with Security, Accuracy, and Trust</div></div><span style="background:#0284c733;color:#38bdf8;padding:4px 10px;border-radius:6px;font-size:10px">CSA Showgrounds Active</span></div>
      <div class="kpis">
        <div class="kpi"><div style="font-size:10px;color:#94a3b8">STOCK ACCURACY</div><div class="val">99.4%</div></div>
        <div class="kpi"><div style="font-size:10px;color:#94a3b8">ACTIVE VENUE AUDITS</div><div class="val">14 Zones</div></div>
        <div class="kpi"><div style="font-size:10px;color:#94a3b8">LOSS PREVENTION</div><div class="val" style="color:#34d399">Verified</div></div>
      </div>
      <div class="tbl">
        <div class="row"><span style="color:#94a3b8">Beverage Vault A · Physical vs Logical</span><span style="color:#34d399;font-weight:700">0 Variance</span></div>
        <div class="row"><span style="color:#94a3b8">VIP Lounge Bar · Night Audit</span><span style="color:#34d399;font-weight:700">Reconciled</span></div>
      </div>
    </body></html>`,
  },
  {
    id: "kiss-the-flame",
    name: "Kiss The Flame Store",
    client: "Kiss The Flame Artisanal Candles",
    tag: "Boutique Home Fragrance E-Commerce",
    category: "E-Commerce",
    location: "South Africa",
    architectureBadge: "Next.js 15 + Framer Motion",
    summary:
      "Warm editorial e-commerce storefront for hand-poured pastel soy candles, featuring interactive category sliders, slide-out mobile cart drawer, and Cloudinary media optimization.",
    highlights: [
      "Tactile warm-cream (#FCF8F5) editorial aesthetic & typography",
      "Animated product gallery & scent profile filter engine",
      "Full cart state management and mobile drawer checkout",
    ],
    techStack: ["Next.js", "Framer Motion", "Supabase", "Tailwind CSS", "Vercel"],
    href: "https://quick-kazoo-0sng8t1.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#FCF8F5;color:#1c1917;font-family:Georgia,serif;padding:24px}
      .top{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #e7e5e4;padding-bottom:12px}
      .hero{margin-top:20px;background:#f5ebe6;border-radius:20px;padding:26px;border:1px solid #e7e5e4}
      h1{font-size:30px;font-weight:600;color:#292524}
      .cards{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px;font-family:system-ui,sans-serif}
      .c{background:#fff;border:1px solid #e7e5e4;border-radius:14px;padding:14px}
    </style></head><body>
      <div class="top"><strong style="font-size:18px;letter-spacing:0.06em">KISS THE FLAME</strong><span style="font-family:system-ui;font-size:11px;background:#292524;color:#fff;padding:5px 12px;border-radius:99px">Hand-Poured in SA</span></div>
      <div class="hero">
        <h1>Warmth & joy, poured by hand.</h1>
        <p style="font-family:system-ui;font-size:13px;color:#57534e;margin-top:8px">Small-batch pastel soy wax candles crafted for serene living spaces.</p>
        <div class="cards">
          <div class="c"><div style="height:8px;width:36px;background:#f9a8d4;border-radius:99px;margin-bottom:8px"></div><strong>Velvet Peony</strong><div style="font-size:12px;color:#78716c;margin-top:4px">R320</div></div>
          <div class="c"><div style="height:8px;width:36px;background:#fcd34d;border-radius:99px;margin-bottom:8px"></div><strong>Golden Fig & Honey</strong><div style="font-size:12px;color:#78716c;margin-top:4px">R340</div></div>
          <div class="c"><div style="height:8px;width:36px;background:#c4b5fd;border-radius:99px;margin-bottom:8px"></div><strong>French Lavender</strong><div style="font-size:12px;color:#78716c;margin-top:4px">R310</div></div>
        </div>
      </div>
    </body></html>`,
  },
  {
    id: "equine-dream-ride",
    name: "Equine Dream Ride",
    client: "CHG Equestrians (Midrand)",
    tag: "Equestrian Simulator & Training Platform",
    category: "Luxury & Lifestyle",
    location: "Midrand, Gauteng",
    architectureBadge: "React + Supabase Storage",
    summary:
      "Bespoke booking and showcase platform for CHG Equestrians in Midrand, featuring their advanced mechanical equestrian riding simulator and rider biomechanics coaching.",
    highlights: [
      "Interactive session booking for dressage, showjumping & posture analysis",
      "Resilient Supabase Storage media gallery with instant local fallbacks",
      "Tailored luxury equestrian branding for Midrand riders",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Supabase", "Vercel"],
    href: "/sites/equine-dream-ride/index.html",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#0f1411;color:#f4f4f0;font-family:system-ui,sans-serif;padding:24px}
      .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(212,175,55,0.25);padding-bottom:12px}
      .gold{color:#d4af37;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase}
      .box{margin-top:20px;background:linear-gradient(135deg,#18221c,#0f1411);border:1px solid rgba(212,175,55,0.3);border-radius:18px;padding:26px}
      h1{font-size:30px;font-family:Georgia,serif}
      .row{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:18px}
      .item{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);padding:14px;border-radius:12px}
    </style></head><body>
      <div class="hdr"><strong style="font-family:Georgia,serif;font-size:18px">EQUINE DREAM RIDE</strong><span class="gold">CHG Equestrians · Midrand</span></div>
      <div class="box">
        <div class="gold">Advanced Equestrian Simulator</div>
        <h1 style="margin-top:8px">Master Seat, Balance & Precision in Midrand.</h1>
        <div class="row">
          <div class="item"><strong>Simulator Biomechanics Session</strong><div style="font-size:12px;color:#a3b1aa;margin-top:4px">45-Min 1-on-1 Coaching · R650</div></div>
          <div class="item"><strong>Dressage & Canter Mastery</strong><div style="font-size:12px;color:#a3b1aa;margin-top:4px">Real-time sensor feedback · R850</div></div>
        </div>
      </div>
    </body></html>`,
  },
  {
    id: "gonow-mobility",
    name: "GoNow Micro-Mobility",
    client: "GoNow Urban Energy & Fleet",
    tag: "Electric Scooter & Energy Platform",
    category: "Enterprise & SaaS",
    location: "South Africa",
    architectureBadge: "TanStack Router + Tailwind",
    summary:
      "Modern clean-tech web platform for GoNow Micro-Mobility & Energy Storage, combining app download funnels, fleet safety protocols, and urban commuter telemetry.",
    highlights: [
      "App download & QR onboarding flow for urban commuters",
      "Interactive safety & battery-swapping energy storage breakdown",
      "High-contrast clean-energy visual identity",
    ],
    techStack: ["React", "TanStack Router", "Tailwind CSS", "Supabase", "Vercel"],
    href: "https://nimble-teal-hbmneuu.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#06120e;color:#ecfdf5;font-family:system-ui,sans-serif;padding:24px}
      .top{display:flex;justify-content:space-between;align-items:center}
      .badge{background:#10b981;color:#022c22;font-weight:800;font-size:11px;padding:5px 12px;border-radius:99px}
      .hero{margin-top:20px;background:#0b211a;border:1px solid #10b98144;border-radius:20px;padding:26px}
      h1{font-size:32px;font-weight:900}
      .stats{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:18px}
      .st{background:#06120e;padding:12px;border-radius:12px;border:1px solid #10b98133}
    </style></head><body>
      <div class="top"><strong style="font-size:20px;color:#34d399">GoNow⚡</strong><span class="badge">Micro-Mobility & Energy</span></div>
      <div class="hero">
        <h1>Unlock Your City. Zero Emissions.</h1>
        <p style="font-size:13px;color:#a7f3d0;margin-top:8px">Smart electric scooters and modular lithium energy storage stations built for modern African cities.</p>
        <div class="stats">
          <div class="st"><div style="font-size:18px;font-weight:800;color:#34d399">45 km</div><div style="font-size:10px">Range per swap</div></div>
          <div class="st"><div style="font-size:18px;font-weight:800;color:#34d399">24/7</div><div style="font-size:10px">GPS Fleet Telemetry</div></div>
          <div class="st"><div style="font-size:18px;font-weight:800;color:#34d399">Instant</div><div style="font-size:10px">QR App Unlock</div></div>
        </div>
      </div>
    </body></html>`,
  },
  {
    id: "hubafleurs",
    name: "Hubafleurs Floral Boutique",
    client: "Hubafleurs Bespoke Blooms",
    tag: "Luxury Florist & Scheduled Delivery",
    category: "Luxury & Lifestyle",
    location: "South Africa",
    architectureBadge: "React + Scheduled Cart",
    summary:
      "Bespoke floral e-commerce studio featuring occasion-based filtering ('Best sellers', 'Birthday', 'Anniversary'), delivery date scheduling, and interactive bouquet previews.",
    highlights: [
      "Occasion & stem filtering ('The Scarlet Hour', 'Citrus Crush', 'The Grand Gesture')",
      "Built-in delivery date calendar picker inside the slide-over cart",
      "Luxury editorial product cards with instant quick-view modal",
    ],
    techStack: ["React", "Vite", "Supabase", "Vercel"],
    href: "https://turbo-silver-i9vs2g0.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#181115;color:#fdf2f8;font-family:Georgia,serif;padding:24px}
      .hdr{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid rgba(244,114,182,0.2);padding-bottom:12px}
      .grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:20px;font-family:system-ui,sans-serif}
      .card{background:#261920;border:1px solid rgba(244,114,182,0.25);border-radius:16px;padding:16px}
      .tag{font-size:10px;text-transform:uppercase;color:#f472b6;letter-spacing:0.12em}
    </style></head><body>
      <div class="hdr"><strong style="font-size:20px;letter-spacing:0.08em">HUBAFLEURS</strong><span style="font-family:system-ui;font-size:11px;color:#f472b6">Same-Day Boutique Delivery</span></div>
      <h2 style="margin-top:18px;font-size:26px;font-weight:400">Sculptural Floral Arrangements.</h2>
      <div class="grid">
        <div class="card"><div class="tag">Best Seller</div><strong style="display:block;margin-top:6px">The Scarlet Hour</strong><div style="margin-top:8px;color:#f9a8d4;font-weight:700">R890</div></div>
        <div class="card"><div class="tag">Fresh Today</div><strong style="display:block;margin-top:6px">Citrus Crush</strong><div style="margin-top:8px;color:#f9a8d4;font-weight:700">R650</div></div>
        <div class="card"><div class="tag">Pre-Order Luxury</div><strong style="display:block;margin-top:6px">The Grand Gesture</strong><div style="margin-top:8px;color:#f9a8d4;font-weight:700">R4,850</div></div>
      </div>
    </body></html>`,
  },
  {
    id: "miliano-fragrance",
    name: "Miliano Fragrance",
    client: "Miliano Parfumerie",
    tag: "Luxury Extrait de Parfum Showcase",
    category: "Luxury & Lifestyle",
    location: "South Africa / International",
    architectureBadge: "3D Luxury Showcase",
    summary:
      "Dark-luxury olfactory showcase and discovery coffret funnel designed for high-concentration Extrait de Parfum collections.",
    highlights: [
      "Olfactory pyramid breakdown (Top, Heart & Base notes)",
      "Discovery Coffret sample-to-full-flacon voucher funnel",
      "Obsidian & 24K gold luxury visual identity",
    ],
    techStack: ["React", "3D Shaders", "Tailwind CSS", "Supabase", "Vercel"],
    href: "https://speedy-platinum-sjaydv0.tmp.now",
    previewHtml: `<!DOCTYPE html><html><head><meta charset="utf-8"/><style>
      *{box-sizing:border-box;margin:0;padding:0}
      body{background:#090807;color:#fafaf9;font-family:Georgia,serif;padding:24px}
      .hdr{display:flex;justify-content:space-between;border-bottom:1px solid rgba(212,175,55,0.3);padding-bottom:12px}
      .hero{margin-top:20px;padding:28px;border-radius:18px;border:1px solid rgba(212,175,55,0.35);background:radial-gradient(circle at top right,rgba(212,175,55,0.18),transparent 65%)}
    </style></head><body>
      <div class="hdr"><strong style="letter-spacing:0.2em;color:#d4af37">MILIANO FRAGRANCE</strong><span style="font-size:11px;color:#a8a29e">EXTRAIT DE PARFUM</span></div>
      <div class="hero">
        <div style="font-size:11px;letter-spacing:0.2em;color:#d4af37">35% OIL CONCENTRATION</div>
        <h1 style="font-size:32px;margin-top:10px">Scent That Commands The Room.</h1>
        <p style="font-family:system-ui;font-size:13px;color:#a8a29e;margin-top:10px">Smoked Oud, Black Cardamom & Madagascar Vanilla Bean sealed in obsidian glass.</p>
      </div>
    </body></html>`,
  },
  {
    id: "savoury-bites",
    name: "Savoury Bites",
    client: "Savoury Hospitality",
    tag: "Gourmet Food & Online Ordering",
    category: "Hospitality",
    location: "Live Edge Deployment",
    architectureBadge: "Live Netlify Deployment",
    summary:
      "Conversion-focused digital restaurant experience featuring interactive menu discovery, chef specials, and fast mobile ordering.",
    highlights: [
      "Mobile-first digital menu replacing static PDF downloads",
      "High-contrast appetizing food photography & fast category tabs",
      "Deployed on global edge CDN with sub-second load time",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Lucide React"],
    href: "https://sovourybites.netlify.app",
  },
  {
    id: "swift-mart",
    name: "Swift Mart",
    client: "Swift Mart Retail",
    tag: "Modern High-Speed E-Commerce",
    category: "E-Commerce",
    location: "Live Edge Deployment",
    architectureBadge: "Live Netlify Deployment",
    summary:
      "Streamlined multi-category e-commerce storefront designed for frictionless product discovery and rapid mobile checkout.",
    highlights: [
      "Instant category filtering & responsive product grid",
      "Frictionless slide-out cart and express checkout layout",
      "Optimized Core Web Vitals across mobile and desktop",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Lucide React"],
    href: "https://swift-mart-07.netlify.app",
  },
  {
    id: "nexora",
    name: "Nexora Commerce",
    client: "Nexora Lifestyle",
    tag: "Modern E-Commerce Storefront",
    category: "E-Commerce",
    location: "Live Vercel Deployment",
    architectureBadge: "Live Vercel Deployment",
    summary:
      "Clean, editorial e-commerce storefront with curated collections, product quick-views, and conversion-focused product pages.",
    highlights: [
      "Editorial hero presentation & seasonal collection grids",
      "Mobile-optimized product cards with instant cart actions",
      "Hosted on Vercel Edge network",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    href: "https://nexora-shop-kohl.vercel.app/",
  },
  {
    id: "scaling-waffles",
    name: "Scaling Waffles",
    client: "Scaling Waffles D2C",
    tag: "Specialty Food & E-Commerce UI",
    category: "Hospitality",
    location: "Live Vercel Deployment",
    architectureBadge: "Live Vercel Deployment",
    summary:
      "Crafted specialty food brand storefront featuring custom topping builders, bundle offers, and vibrant visual hierarchy.",
    highlights: [
      "Interactive product showcase & bundle upsell layout",
      "Responsive mobile-first ordering flow",
      "Fast static & dynamic asset delivery on Vercel",
    ],
    techStack: ["React", "Vite", "Tailwind CSS", "Vercel"],
    href: "https://scaling-waffle-ui.vercel.app/",
  },
];
