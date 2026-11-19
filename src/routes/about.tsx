import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell, SectionHeader } from "@/components/site/PageShell";
import { Sparkles, Target, Heart, Trophy, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Jubilee Tech" },
      { name: "description", content: "Jubilee Tech is a premium digital growth studio helping businesses turn visitors into clients." },
    ],
  }),
});

const values = [
  { icon: Target, title: "Results-driven", body: "Everything we build is focused on one goal — more customers and more revenue." },
  { icon: Heart, title: "Done-for-you", body: "From websites to ads to automations — one team, end-to-end, no juggling vendors." },
  { icon: Trophy, title: "Built for growth", body: "Our systems are designed to scale with your business and support long-term success." },
];

function AboutPage() {
  return (
    <PageShell>
      <section className="relative isolate">
        <div className="jt-aurora" />
        <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <Sparkles size={14} className="text-blue-300" /> About
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold jt-text-gradient leading-tight">
            We help ambitious businesses win online.
          </h1>
          <p className="mt-5 text-white/65 text-lg max-w-2xl mx-auto">
            Jubilee Tech is a small, focused studio building premium websites and growth systems for founders who don't have time to figure it out alone.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="grid md:grid-cols-2 gap-5">
          <div className="rounded-2xl jt-glass p-8 md:p-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-blue-300">Our vision</h3>
            <p className="mt-4 text-lg text-white/85 leading-relaxed">
              A world where every business has access to powerful digital tools that drive growth and create lasting success.
            </p>
          </div>
          <div className="rounded-2xl jt-glass p-8 md:p-10">
            <h3 className="text-xs uppercase tracking-[0.2em] text-blue-300">Our mission</h3>
            <p className="mt-4 text-lg text-white/85 leading-relaxed">
              To help businesses grow faster through premium websites and systems that generate consistent revenue.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <SectionHeader eyebrow="Our values" title="What makes us different." />
        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {values.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-2xl jt-glass p-7">
              <div className="h-11 w-11 rounded-xl jt-blue-gradient grid place-items-center text-white">
                <Icon size={18} />
              </div>
              <h4 className="mt-5 text-xl font-display font-semibold text-white">{title}</h4>
              <p className="mt-2 text-sm text-white/65 leading-relaxed">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white jt-blue-gradient shadow-[0_12px_40px_-10px_rgba(37,99,235,0.8)]">
            Work with us <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}