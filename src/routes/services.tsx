import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import {
  Globe,
  Target,
  LineChart,
  Layers,
  Rocket,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Box,
  Video,
  Bot,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Capabilities — Jubilee Tech" },
      {
        name: "description",
        content:
          "Bespoke websites, interactive 3D animations, autonomous client funnels, and viral video engines engineered by Jubilee Tech.",
      },
    ],
  }),
});

const services = [
  {
    icon: Globe,
    code: "01 // ARCHITECTURE",
    title: "Bespoke Website Engineering",
    desc: "Custom, non-template storefronts built for sub-second speed, authority, and conversion.",
    bullets: [
      "Tactile frosted-chrome & editorial UI",
      "99/100 Mobile Core Web Vitals",
      "Technical SEO & schema markup",
      "14-day design-to-deployment sprint",
    ],
  },
  {
    icon: Box,
    code: "02 // SPATIAL WEB",
    title: "Interactive 3D & Shader Systems",
    desc: "60FPS procedural 3D product showcases and interactive brand centerpieces editable from your Admin OS.",
    bullets: [
      "Real-time 3D orbit & morphing geometry",
      "Iridescent chrome, gold & glass shaders",
      "Live Admin 3D scene customizer",
      "Zero video bloat or slow loading",
    ],
  },
  {
    icon: Bot,
    code: "03 // AUTONOMOUS CRM",
    title: "Lead Engines & AI Concierge",
    desc: "24/7 autonomous client qualification, instant proposal dispatch, and pipeline automation.",
    bullets: [
      "Instant AI concierge chat & auto-replies",
      "Interactive ROI & Website Audit magnets",
      "Automated calendar & WhatsApp routing",
      "Full executive CRM pipeline",
    ],
  },
  {
    icon: Video,
    code: "04 // VIRAL CONTENT",
    title: "Short-Form Video & Shorts Systems",
    desc: "High-retention 9:16 YouTube Shorts, Reels, and 3D story kits engineered for organic client acquisition.",
    bullets: [
      "Hormozi-style kinetic caption systems",
      "3D Pixar & High-RPM POV prompt packs",
      "Automated scene & voiceover scripts",
      "Organic traffic-to-funnel bridge",
    ],
  },
  {
    icon: LineChart,
    code: "05 // ACQUISITION",
    title: "Paid Ads & Conversion Optimization",
    desc: "Meta & Google acquisition campaigns paired with rigorous landing page split-testing.",
    bullets: [
      "Server-side Pixel & CAPI tracking",
      "High-converting ad creatives",
      "Heatmaps & checkout drop-off fixes",
      "Predictable cost-per-acquisition",
    ],
  },
  {
    icon: Layers,
    code: "06 // RETAINER",
    title: "Executive Growth Partnership",
    desc: "Dedicated monthly engineering, new landing pages, 3D updates, and continuous CRO sprints.",
    bullets: [
      "Unlimited priority copy & design updates",
      "Monthly conversion & revenue audits",
      "New campaign funnels on demand",
      "Direct Slack/WhatsApp founder access",
    ],
  },
];

function ServicesPage() {
  return (
    <PageShell>
      <section className="relative isolate">
        <div className="jt-aurora opacity-40" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            STUDIO CAPABILITIES // FULL-STACK GROWTH
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-display font-semibold jt-text-gradient leading-tight">
            Six disciplines. One unified revenue engine.
          </h1>
          <p className="mt-5 text-white/65 text-base md:text-lg max-w-2xl mx-auto">
            Every layer—from your 3D hero and mobile checkout to your autonomous AI lead
            responder—is engineered together so every visit compounds into revenue.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, code, title, desc, bullets }) => (
            <div
              key={title}
              className="group relative rounded-3xl jt-chrome-card p-7 transition-all hover:-translate-y-0.5 hover:border-sky-400/40"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-sky-300">
                  {code}
                </span>
                <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/20 grid place-items-center text-white">
                  <Icon size={18} />
                </div>
              </div>
              <h3 className="mt-5 text-xl font-display font-semibold text-white">
                {title}
              </h3>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{desc}</p>
              <ul className="mt-5 space-y-2 border-t border-white/10 pt-4">
                {bullets.map((b) => (
                  <li key={b} className="flex items-center gap-2 text-xs text-white/80">
                    <CheckCircle2 size={14} className="text-sky-300 shrink-0" /> {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl jt-chrome-shell p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-300">
              CUSTOM ARCHITECTURE
            </span>
            <h2 className="mt-2 text-3xl md:text-4xl font-display font-semibold text-white">
              Need a custom website + 3D showcase?
            </h2>
            <p className="mt-2 text-white/75">
              Test our interactive 3D Spatial Lab or request a tailored prototype today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/3d-studio"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/20 transition"
            >
              Open 3D Lab <Box size={15} />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-full bg-white text-slate-950 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider hover:bg-sky-100 transition"
            >
              Commission Build <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
