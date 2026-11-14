import React, { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionHeader } from "@/components/site/PageShell";
import { Interactive3DCanvas } from "@/components/site/Interactive3DCanvas";
import {
  JUBILEE_PORTFOLIO_PROJECTS,
  PORTFOLIO_CATEGORIES,
  type PortfolioProject,
} from "@/lib/portfolio-catalog";
import {
  ArrowRight,
  ArrowUpRight,
  Target,
  LineChart,
  Globe,
  Layers,
  CheckCircle2,
  ExternalLink,
  Code2,
  Box,
  Wand2,
  Maximize2,
  X,
  FolderCode,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      {
        title:
          "Jubilee Tech — Bespoke Web Architecture, 3D Systems & Enterprise Engineering",
      },
      {
        name: "description",
        content:
          "South African & global B2B digital engineering studio building custom websites, interactive 3D web experiences, e-commerce platforms, and automated client systems.",
      },
    ],
  }),
});

function Index() {
  return (
    <PageShell>
      <Hero />
      <CapabilitiesRibbon />
      <Projects />
      <BentoServices />
      <Process />
      <CTA />
    </PageShell>
  );
}

function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="jt-aurora opacity-45" />
      <div className="absolute inset-0 jt-grid-bg opacity-30" />

      <div className="relative mx-auto max-w-7xl px-6 pt-14 pb-20 md:pt-20 md:pb-28">
        <div className="grid lg:grid-cols-[1.15fr_0.95fr] gap-12 items-center">
          {/* Left: Editorial B2B Architectural Copy */}
          <div className="jt-fade-up">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-xl">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/80">
                JUBILEE TECH // SOUTH AFRICA & GLOBAL B2B STUDIO
              </span>
            </div>

            <h1 className="mt-6 text-4xl sm:text-6xl xl:text-[66px] font-display font-semibold tracking-[-0.03em] text-white leading-[1.03]">
              Production-grade{" "}
              <span className="jt-text-gradient underline decoration-sky-500/40 decoration-2 underline-offset-8">
                web systems
              </span>{" "}
              engineered for modern companies.
            </h1>

            <p className="mt-6 text-base md:text-lg text-white/65 max-w-xl leading-relaxed">
              We design and engineer custom e-commerce storefronts, enterprise web
              applications, interactive 3D spatial product showcases, and automated
              lead-capture architectures built to represent your brand at the highest
              level.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3.5">
              <Link
                to="/portfolio"
                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-7 py-4 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_-10px_rgba(255,255,255,0.45)] hover:bg-sky-100 transition"
              >
                Inspect {JUBILEE_PORTFOLIO_PROJECTS.length} Built Websites
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/3d-studio"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-6 py-4 text-sm font-medium text-white hover:bg-white/10 transition backdrop-blur-xl"
              >
                <Box size={16} className="text-sky-300" />
                Explore 3D Spatial Lab
              </Link>
            </div>

            {/* Technical Proof Row — Honest Engineering Specs */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-8 max-w-lg">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  [01 // ARCHIVE]
                </div>
                <div className="mt-1 text-2xl md:text-3xl font-display font-semibold text-white">
                  {JUBILEE_PORTFOLIO_PROJECTS.length} Builds
                </div>
                <div className="text-xs text-white/55">Complete case work</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  [02 // SPRINT]
                </div>
                <div className="mt-1 text-2xl md:text-3xl font-display font-semibold text-white">
                  14 Days
                </div>
                <div className="text-xs text-white/55">Architecture to launch</div>
              </div>
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
                  [03 // STANDARDS]
                </div>
                <div className="mt-1 text-2xl md:text-3xl font-display font-semibold text-white">
                  99/100
                </div>
                <div className="text-xs text-white/55">Core Web Vitals target</div>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive 3D Centerpiece (Editable from Admin!) */}
          <div className="relative">
            <Interactive3DCanvas
              heightClass="h-[460px] md:h-[520px]"
              interactiveControls={true}
              compactHud={true}
            />
            <div className="mt-3 flex items-center justify-between px-2 text-xs text-white/50">
              <span className="font-mono text-[11px]">
                LIVE 3D SCENE · DRAG TO ORBIT · SYNCED WITH ADMIN
              </span>
              <Link
                to="/3d-studio"
                className="text-sky-300 hover:text-sky-200 inline-flex items-center gap-1 font-medium"
              >
                Customize in 3D Lab <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CapabilitiesRibbon() {
  const highlights = [
    { name: "Stud. The Burger Shop", tag: "TanStack + Supabase" },
    { name: "KINETIX Performance", tag: "Next.js + Yoco Checkout" },
    { name: "T&R Inventory Hub", tag: "Enterprise BI & Drizzle" },
    { name: "Kiss The Flame", tag: "D2C E-Commerce" },
    { name: "Equine Dream Ride", tag: "Booking & Motion UI" },
    { name: "GoNow Micro-Mobility", tag: "Clean-Tech Portal" },
    { name: "Hubafleurs & Miliano", tag: "Luxury Flagships" },
  ];
  return (
    <section className="border-b border-white/10 bg-[#070915]">
      <div className="mx-auto max-w-7xl px-6 py-5 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
          ENGINEERED IN JUBILEE TECH //
        </span>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {highlights.map((b) => (
            <div key={b.name} className="flex items-center gap-2">
              <span className="text-xs font-display font-semibold text-white/85">
                {b.name}
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] text-sky-200">
                {b.tag}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Projects() {
  const [activeTab, setActiveTab] = useState<"projects" | "techStack">("projects");
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof PORTFOLIO_CATEGORIES)[number]>("All");
  const [inspectedProject, setInspectedProject] = useState<PortfolioProject | null>(
    null,
  );

  const visibleProjects = useMemo(() => {
    if (selectedCategory === "All") return JUBILEE_PORTFOLIO_PROJECTS;
    return JUBILEE_PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  const fullTechStack = [
    {
      name: "React 19 & Next.js",
      category: "UI Architecture",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/react.svg",
    },
    {
      name: "TypeScript",
      category: "Strict Type Safety",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/typescript.svg",
    },
    {
      name: "Tailwind CSS",
      category: "Design Systems",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/tailwindcss.svg",
    },
    {
      name: "Supabase & Postgres",
      category: "Database & Auth",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/supabase.svg",
    },
    {
      name: "Firebase",
      category: "Realtime Cloud",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/firebase.svg",
    },
    {
      name: "WebGL / 3D Canvas",
      category: "Spatial Shaders",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/webgl.svg",
    },
    {
      name: "Vite",
      category: "Build Pipeline",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/vite.svg",
    },
    {
      name: "Cloudflare / Netlify",
      category: "Edge Deployment",
      logo: "https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/cloudflare.svg",
    },
  ];

  return (
    <section className="relative mx-auto max-w-7xl px-6 py-24">
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <SectionHeader
          eyebrow="01 // CASE WORK PORTFOLIO"
          title="Websites & platforms engineered in our studio."
          description="Explore every build from the Jubilee Tech workspace—complete with interactive previews, tech stack breakdowns, and full-screen corporate inspection."
          align="left"
        />
        <Link
          to="/portfolio"
          className="text-sm text-sky-300 hover:text-white inline-flex items-center gap-1.5 transition-colors font-medium"
        >
          Open dedicated Case Work page <ArrowUpRight size={15} />
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              activeTab === "projects"
                ? "bg-white text-slate-950 border-white shadow-lg"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Layers size={14} />
            All Jubilee Tech Builds ({JUBILEE_PORTFOLIO_PROJECTS.length})
          </button>

          <button
            onClick={() => setActiveTab("techStack")}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 border ${
              activeTab === "techStack"
                ? "bg-white text-slate-950 border-white shadow-lg"
                : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Code2 size={14} />
            Engineering Stack
          </button>
        </div>

        {activeTab === "projects" && (
          <div className="flex flex-wrap gap-1.5">
            {PORTFOLIO_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition border ${
                  selectedCategory === cat
                    ? "bg-sky-500/20 text-sky-200 border-sky-400/50"
                    : "bg-white/[0.03] text-white/65 border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {activeTab === "projects" ? (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl jt-chrome-card p-3.5 transition-all duration-300 hover:border-sky-400/50"
            >
              <div>
                <div
                  onClick={() => setInspectedProject(p)}
                  className="relative aspect-[16/10] cursor-pointer rounded-2xl overflow-hidden bg-slate-950 border border-white/10 p-4 flex flex-col justify-between"
                  style={{
                    background: `radial-gradient(circle at 80% 20%, ${
                      p.accentColor || "#38bdf8"
                    }38, transparent 58%), linear-gradient(155deg, #0b1120 0%, #060913 100%)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                      <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                      <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                      <span className="ml-1.5 rounded-full bg-slate-900/90 border border-white/15 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-sky-300">
                        {p.category}
                      </span>
                    </div>
                    <span className="rounded-full bg-white/10 border border-white/20 p-1.5 text-white/80 group-hover:text-white group-hover:bg-sky-500/30 transition">
                      <Maximize2 size={12} />
                    </span>
                  </div>

                  <div className="my-auto py-2">
                    <div
                      className="inline-block rounded-md px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest mb-1.5"
                      style={{
                        backgroundColor: `${p.accentColor || "#38bdf8"}24`,
                        color: p.accentColor || "#38bdf8",
                        border: `1px solid ${p.accentColor || "#38bdf8"}45`,
                      }}
                    >
                      CLICK TO LAUNCH INTERACTIVE BUILD
                    </div>
                    <div className="font-display text-xl font-bold text-white tracking-tight line-clamp-1">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-white/65 line-clamp-1 mt-0.5">
                      {p.tag}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/10">
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/75 truncate">
                      <FolderCode size={11} className="text-sky-300 shrink-0" />
                      {p.folderSource || p.location}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2.5 py-0.5 text-[10px] text-emerald-300 font-mono shrink-0">
                      {p.architectureBadge}
                    </span>
                  </div>
                </div>

                <div className="p-3.5 pb-2">
                  <h3 className="font-display text-lg font-semibold text-white">
                    {p.name}
                  </h3>
                  <p className="text-xs text-sky-300/90 font-medium">{p.tag}</p>
                  <p className="mt-2 text-xs text-white/65 leading-relaxed line-clamp-2">
                    {p.summary}
                  </p>
                </div>
              </div>

              <div className="p-3.5 pt-2 mt-auto">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/70"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectedProject(p)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-white/10 border border-white/15 px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-white hover:text-slate-950"
                  >
                    <Maximize2 size={12} />
                    Inspect Build
                  </button>

                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-all hover:bg-sky-400"
                    >
                      <Globe size={12} />
                      Live Site
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-all hover:bg-sky-400"
                    >
                      Commission
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {fullTechStack.map((tech) => (
            <div
              key={tech.name}
              className="flex flex-col items-center justify-center gap-2 p-5 rounded-3xl jt-chrome-card transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="w-16 h-16 flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 p-3.5">
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="max-w-full max-h-full invert filter"
                />
              </div>
              <div className="text-sm font-display font-semibold text-white mt-1">
                {tech.name}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-white/45">
                {tech.category}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Modal Preview */}
      {inspectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-8 backdrop-blur-xl">
          <div className="flex h-[88vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/25 bg-[#070a18] shadow-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 px-6 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-bold text-white">
                    {inspectedProject.name}
                  </h3>
                  <span className="rounded-full bg-sky-500/20 border border-sky-400/35 px-2.5 py-0.5 font-mono text-[10px] text-sky-300">
                    {inspectedProject.category}
                  </span>
                  <span className="rounded-full bg-white/10 px-2.5 py-0.5 font-mono text-[10px] text-white/70">
                    {inspectedProject.folderSource}
                  </span>
                </div>
                <p className="text-xs text-white/65 mt-0.5">{inspectedProject.summary}</p>
              </div>

              <div className="flex items-center gap-2">
                {inspectedProject.href && (
                  <a
                    href={inspectedProject.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
                  >
                    Open in New Tab <ExternalLink size={12} />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setInspectedProject(null)}
                  className="rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-1 bg-slate-950">
              {inspectedProject.href ? (
                <iframe
                  src={inspectedProject.href}
                  title={inspectedProject.name}
                  className="h-full w-full border-0"
                />
              ) : (
                <iframe
                  srcDoc={inspectedProject.previewHtml}
                  title={inspectedProject.name}
                  sandbox="allow-scripts"
                  className="h-full w-full border-0"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function BentoServices() {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <SectionHeader
        eyebrow="02 // CAPABILITIES"
        title="Full-stack digital craftsmanship."
        description="Websites, interactive 3D scenes, autonomous lead capture, and high-converting funnels built under one roof."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[minmax(190px,auto)]">
        <div className="md:col-span-4 md:row-span-2 group relative overflow-hidden rounded-3xl jt-chrome-card p-8 md:p-10 flex flex-col justify-between">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-sky-500/20 blur-3xl pointer-events-none" />
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-white">
              <Globe size={12} className="text-sky-300" /> Flagship B2B & D2C Architecture
            </span>
            <h3 className="mt-5 text-2xl md:text-4xl font-display font-semibold text-white leading-tight max-w-xl">
              Bespoke websites engineered to look unmistakable and win corporate trust.
            </h3>
            <p className="mt-4 text-white/70 max-w-lg text-sm md:text-base leading-relaxed">
              Hand-crafted typography, tactile metallic glass surfaces, sub-second page
              transitions, South African Yoco/Paystack or global Stripe checkouts, and
              built-in CRM lead capture.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-100 transition"
            >
              Explore Capabilities <ArrowUpRight size={14} />
            </Link>
            <Link
              to="/3d-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 transition"
            >
              Interactive 3D Lab <Box size={14} className="text-sky-300" />
            </Link>
          </div>
        </div>

        <div className="md:col-span-2 rounded-3xl jt-chrome-card p-7">
          <div className="h-10 w-10 rounded-xl bg-sky-500/15 border border-sky-400/30 grid place-items-center text-sky-300">
            <Box size={18} />
          </div>
          <h4 className="mt-5 text-lg font-display font-semibold text-white">
            3D Web & Shader Studio
          </h4>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Interactive 60fps 3D product & brand geometry you can edit live from your Admin portal.
          </p>
        </div>

        <div className="md:col-span-2 rounded-3xl jt-chrome-card p-7">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-400/30 grid place-items-center text-emerald-300">
            <Target size={18} />
          </div>
          <h4 className="mt-5 text-lg font-display font-semibold text-white">
            Autonomous Lead Engine
          </h4>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Funnels, AI concierge auto-replies, and CRM pipelines that qualify clients 24/7.
          </p>
        </div>

        <div className="md:col-span-3 rounded-3xl jt-chrome-card p-7">
          <div className="h-10 w-10 rounded-xl bg-purple-500/15 border border-purple-400/30 grid place-items-center text-purple-300">
            <Wand2 size={18} />
          </div>
          <h4 className="mt-5 text-lg font-display font-semibold text-white">
            Automated YouTube Shorts Studio
          </h4>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            9:16 WebM video rendering with direct YouTube Data API v3 auto-publishing for organic reach.
          </p>
        </div>

        <div className="md:col-span-3 rounded-3xl jt-chrome-card p-7">
          <div className="h-10 w-10 rounded-xl bg-amber-500/15 border border-amber-400/30 grid place-items-center text-amber-300">
            <LineChart size={18} />
          </div>
          <h4 className="mt-5 text-lg font-display font-semibold text-white">
            Enterprise Dashboards & Portals
          </h4>
          <p className="mt-2 text-sm text-white/65 leading-relaxed">
            Role-based inventory hubs, Supabase databases, and real-time analytics dashboards.
          </p>
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    {
      n: "01",
      title: "Diagnostic & Funnel Architecture",
      body: "We audit your brand positioning, map your buyer journey, and wireframe a bespoke high-converting architecture.",
    },
    {
      n: "02",
      title: "Custom UI, 3D & Code Sprint",
      body: "We engineer your custom storefront, interactive 3D visuals, and automated CRM capture in a focused 14-day build.",
    },
    {
      n: "03",
      title: "Launch, Auto-Reply & Handover",
      body: "We deploy on global edge infrastructure, connect autonomous client responders, and hand over full administrative control.",
    },
  ];
  return (
    <section className="relative border-y border-white/10 bg-white/[0.015]">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <SectionHeader
          eyebrow="03 // EXECUTION PROTOCOL"
          title="From kickoff to live deployment in 14 days."
        />
        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="relative rounded-3xl jt-chrome-card p-8 overflow-hidden"
            >
              <div className="font-mono text-xs uppercase tracking-[0.22em] text-sky-300">
                PHASE // {s.n}
              </div>
              <h3 className="mt-4 text-2xl font-display font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-sm text-white/65 leading-relaxed">
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-[36px] jt-chrome-shell p-10 md:p-16 text-center">
        <div className="relative max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-200">
            NEXT SPRINT SLOT AVAILABLE
          </span>
          <h2 className="mt-6 text-3xl md:text-5xl font-display font-semibold text-white leading-tight">
            Ready to launch a website that commands authority?
          </h2>
          <p className="mt-4 text-white/75 text-base md:text-lg">
            Book a strategy call or jump straight into our 3D Spatial Lab to test our
            engineering firsthand.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-semibold text-slate-950 bg-white hover:bg-sky-100 transition shadow-xl"
            >
              Start Your Project <ArrowRight size={16} />
            </Link>
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-white border border-white/25 bg-white/10 hover:bg-white/20 transition"
            >
              Inspect All 12 Case Studies <Layers size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
