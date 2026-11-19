import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { ExecutiveDocumentsViewer } from "@/components/site/ExecutiveDocuments";
import { FileText, Layers, Download, CheckCircle2, ShieldCheck, Printer } from "lucide-react";

export const Route = createFileRoute("/case-studies")({
  component: CaseStudiesPage,
  head: () => ({
    meta: [
      {
        title: "Executive Case Studies & Build Roadmap (PDF) — Jubilee Tech",
      },
      {
        name: "description",
        content:
          "Official Jubilee Tech executive documentation: 3-page Full-Stack Case Study and 1-page Build Process & Deliverables Roadmap for corporate buyers and founders.",
      },
    ],
  }),
});

function CaseStudiesPage() {
  return (
    <PageShell>
      {/* Hero Header */}
      <section className="no-print relative isolate border-b border-white/10">
        <div className="jt-aurora opacity-45" />
        <div className="relative mx-auto max-w-5xl px-6 pt-20 pb-12 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
            <FileText size={13} /> OFFICIAL EXECUTIVE DOCUMENTATION // 2 PDF ASSETS
          </span>
          <h1 className="mt-5 text-4xl md:text-6xl font-display font-bold jt-text-gradient leading-tight">
            Case Studies & Build Roadmap.
          </h1>
          <p className="mt-4 text-white/70 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Download and inspect our technical documentation for corporate stakeholders. Review our full-stack e-commerce architecture or our 14-day production roadmap.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-white/60">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400" /> Print-to-PDF Ready
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-sky-400" /> Full System Architecture
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1.5">
              <Layers size={13} className="text-purple-400" /> 14-Day Delivery Sprint
            </span>
          </div>
        </div>
      </section>

      {/* Main Document Viewer */}
      <section className="pb-24">
        <ExecutiveDocumentsViewer initialDoc="case-study" showBackLink={true} />
      </section>
    </PageShell>
  );
}
