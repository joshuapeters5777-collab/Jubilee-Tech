import React, { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  JUBILEE_PORTFOLIO_PROJECTS,
  PORTFOLIO_CATEGORIES,
  type PortfolioProject,
} from "@/lib/portfolio-catalog";
import {
  ArrowRight,
  Globe,
  ExternalLink,
  Layers,
  CheckCircle2,
  Maximize2,
  X,
  FolderCode,
  ShieldCheck,
  FileText,
  Download,
  Sparkles,
  Printer,
} from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  component: PortfolioPage,
  head: () => ({
    meta: [
      { title: "Case Work & Shipped Systems — Jubilee Tech" },
      {
        name: "description",
        content:
          "Complete showcase of web applications, e-commerce platforms, and enterprise systems engineered by Jubilee Tech.",
      },
    ],
  }),
});

function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof PORTFOLIO_CATEGORIES)[number]>("All");
  const [inspectedProject, setInspectedProject] = useState<PortfolioProject | null>(
    null,
  );

  const visibleProjects = useMemo(() => {
    if (selectedCategory === "All") return JUBILEE_PORTFOLIO_PROJECTS;
    return JUBILEE_PORTFOLIO_PROJECTS.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <PageShell>
      {/* Hero Section */}
      <section className="relative isolate border-b border-white/10">
        <div className="jt-aurora opacity-45" />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-14 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            <Layers size={13} /> COMPLETE ENGINEERING ARCHIVE //{" "}
            {JUBILEE_PORTFOLIO_PROJECTS.length} PRODUCTION SYSTEMS
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-display font-semibold jt-text-gradient leading-tight">
            Case Work & Engineered Platforms.
          </h1>
          <p className="mt-5 text-white/65 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Every web application, luxury e-commerce storefront, hospitality portal, and
            enterprise inventory system designed and engineered in the Jubilee Tech
            studio—ready for corporate inspection.
          </p>

          {/* Category Filter Bar */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-2">
            {PORTFOLIO_CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              const count =
                cat === "All"
                  ? JUBILEE_PORTFOLIO_PROJECTS.length
                  : JUBILEE_PORTFOLIO_PROJECTS.filter((p) => p.category === cat).length;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold transition-all border ${
                    active
                      ? "bg-white text-slate-950 border-white shadow-[0_8px_25px_-6px_rgba(255,255,255,0.5)]"
                      : "bg-white/[0.04] text-white/75 border-white/12 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {cat}{" "}
                  <span
                    className={`ml-1 font-mono text-[10px] ${
                      active ? "text-slate-600" : "text-white/45"
                    }`}
                  >
                    ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Executive PDF Briefs & Documentation Banner */}
      <section className="mx-auto max-w-7xl px-6 pt-10 pb-2">
        <div className="rounded-3xl border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-blue-950/20 to-slate-950/50 p-6 md:p-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
                CLIENT DOCUMENTATION // 2 PRODUCTION PDF BRIEFS
              </span>
              <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-white">
                Download Technical Case Studies & Build Roadmap
              </h2>
              <p className="mt-1 text-xs md:text-sm text-white/65 max-w-2xl">
                Ready-to-print executive briefs for enterprise buyers, investors, and prospective clients detailing our full-stack architecture and 14-day delivery sprint.
              </p>
            </div>

            <Link
              to="/case-studies"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-bold text-slate-950 hover:bg-sky-100 transition shadow-xl"
            >
              Open PDF Document Hub <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 grid md:grid-cols-2 gap-5">
            {/* PDF 1 Card */}
            <div className="rounded-2xl border border-white/12 bg-black/45 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="rounded-md bg-sky-500/20 border border-sky-400/40 px-2.5 py-0.5 font-mono text-[9px] font-bold text-sky-300">
                    PDF 1 · 3 PAGES
                  </span>
                  <span className="font-mono text-[10px] text-white/50">FULL-STACK CASE STUDY</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  KINETIX Performance Athletics E-Commerce
                </h3>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Next.js 15 App Router & Supabase PostgreSQL 17 storefront with zero-trust cart recalculation, Yoco Checkout webhooks, and 3 clean UI production screens.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono text-sky-200/80">
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">Goal & Challenges</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">Tech Stack</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">Auth · API · Database</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">3 UI Screenshots</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-300">Print / Save as PDF Ready</span>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 hover:text-white transition"
                >
                  View & Download PDF 1 →
                </Link>
              </div>
            </div>

            {/* PDF 2 Card */}
            <div className="rounded-2xl border border-white/12 bg-black/45 p-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="rounded-md bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 font-mono text-[9px] font-bold text-emerald-300">
                    PDF 2 · 1 PAGE
                  </span>
                  <span className="font-mono text-[10px] text-white/50">EXECUTIVE ROADMAP</span>
                </div>
                <h3 className="font-display font-bold text-lg text-white">
                  Build Process & Deliverables Roadmap
                </h3>
                <p className="mt-1.5 text-xs text-white/70 leading-relaxed">
                  Clear 4-phase visual roadmap: 1. Requirements & Architecture → 2. Responsive UI/UX → 3. Backend, API & Database → 4. Testing & Cloud Deployment.
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-mono text-emerald-200/80">
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">14-Day Sprint</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">Fixed Price Guarantee</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">100% Code Ownership</span>
                  <span className="rounded bg-white/5 border border-white/10 px-2 py-0.5">30-Day Warranty</span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-300">Print / Save as PDF Ready</span>
                <Link
                  to="/case-studies"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-white transition"
                >
                  View & Download PDF 2 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Projects Grid */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleProjects.map((p) => (
            <div
              key={p.id}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl jt-chrome-card p-3.5 transition-all duration-300 hover:border-sky-400/50"
            >
              <div>
                {/* Live Interactive Preview Container */}
                <div
                  onClick={() => setInspectedProject(p)}
                  className="relative aspect-[16/10] cursor-pointer rounded-2xl overflow-hidden bg-slate-950 border border-white/12 p-4 flex flex-col justify-between"
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
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] text-white/70 truncate">
                      <FolderCode size={11} className="text-sky-300 shrink-0" />
                      {p.folderSource || p.location}
                    </span>
                    <span className="rounded-full bg-emerald-500/20 border border-emerald-400/35 px-2.5 py-0.5 font-mono text-[10px] text-emerald-200 shrink-0">
                      {p.architectureBadge}
                    </span>
                  </div>
                </div>

                {/* Title, Tagline & Engineering Summary */}
                <div className="p-3.5 pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-white">
                        {p.name}
                      </h3>
                      <p className="text-xs text-sky-300/90 font-medium">{p.tag}</p>
                    </div>
                  </div>

                  <p className="mt-2.5 text-xs text-white/70 leading-relaxed">
                    {p.summary}
                  </p>

                  {/* Key Engineering Deliverables */}
                  <ul className="mt-3 space-y-1 border-t border-white/10 pt-2.5">
                    {p.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-1.5 text-[11px] text-white/80"
                      >
                        <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Tech Badges & Inspection Buttons */}
              <div className="p-3.5 pt-2 mt-auto">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {p.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg bg-white/5 border border-white/10 px-2 py-0.5 text-[10px] font-mono text-white/75"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setInspectedProject(p)}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white hover:bg-white hover:text-slate-950 transition"
                  >
                    <Maximize2 size={12} />
                    Live Preview
                  </button>

                  {p.href ? (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
                    >
                      <Globe size={12} />
                      Visit URL
                      <ExternalLink size={11} />
                    </a>
                  ) : (
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
                    >
                      Request Similar
                      <ArrowRight size={12} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Corporate B2B Call to Action Section */}
        <div className="mt-16 rounded-3xl jt-chrome-shell p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300">
              <ShieldCheck size={14} /> B2B TECHNICAL DUE DILIGENCE READY
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-display font-semibold text-white">
              Ready to commission a bespoke digital platform for your company?
            </h2>
            <p className="mt-2 text-sm text-white/70 leading-relaxed">
              We build custom React, Next.js, TanStack, and Supabase architectures tailored
              to South African and international businesses.
            </p>
          </div>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-xs font-semibold uppercase tracking-wider text-slate-950 bg-white hover:bg-sky-100 transition shrink-0 shadow-xl"
          >
            Commission Your Build <ArrowRight size={15} />
          </Link>
        </div>
      </section>

      {/* Interactive Fullscreen Preview Modal for Corporate Buyers */}
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
    </PageShell>
  );
}

export default PortfolioPage;
