import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { Sparkles, Plus, Minus, ArrowRight } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/faq")({
  component: FAQPage,
  head: () => ({
    meta: [
      { title: "FAQ — Jubilee Tech" },
      { name: "description", content: "Frequently asked questions about Jubilee Tech." },
    ],
  }),
});

const faqs = [
  { q: "How long does a typical project take?", a: "Most websites launch within 2–4 weeks. Full growth systems take 4–8 weeks depending on scope." },
  { q: "Do you offer payment plans?", a: "Yes — we usually split projects into 50% upfront and 50% on launch. Larger projects can be milestone-based." },
  { q: "What's included in your packages?", a: "Design, development, copy guidance, deployment, and one round of revisions. Add-ons are quoted separately." },
  { q: "Do you provide ongoing support?", a: "Yes. We offer monthly retainers for maintenance, optimization, and growth sprints." },
  { q: "Can you work with my existing brand?", a: "Absolutely. We can build on your current identity, or refine it as part of the engagement." },
];

function FAQPage() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <PageShell>
      <section className="relative isolate">
        <div className="jt-aurora" />
        <div className="relative mx-auto max-w-3xl px-6 pt-24 pb-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70">
            <Sparkles size={14} className="text-blue-300" /> FAQ
          </span>
          <h1 className="mt-6 text-4xl md:text-6xl font-semibold jt-text-gradient leading-tight">Questions, answered.</h1>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <div className="space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button key={f.q} onClick={() => setOpen(isOpen ? null : i)} className="w-full text-left rounded-2xl jt-glass p-5 md:p-6 transition hover:border-white/20">
                <div className="flex items-start justify-between gap-4">
                  <span className="text-white font-display font-medium text-lg">{f.q}</span>
                  <span className="mt-1 text-blue-300">{isOpen ? <Minus size={18} /> : <Plus size={18} />}</span>
                </div>
                {isOpen && <p className="mt-3 text-white/65 text-sm leading-relaxed">{f.a}</p>}
              </button>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-white jt-blue-gradient">
            Still have a question? Get in touch <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}