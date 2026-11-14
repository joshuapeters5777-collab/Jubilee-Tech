import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({ meta: [{ title: "Terms — Jubilee Tech" }] }),
});

function TermsPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 pt-24 pb-24">
        <h1 className="text-4xl md:text-5xl font-display font-semibold jt-text-gradient">Terms & Conditions</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: 2026</p>
        <div className="mt-10 space-y-6 text-white/75 leading-relaxed">
          <Section title="Engagement">By engaging Jubilee Tech, you agree to the scope and timeline outlined in your project proposal.</Section>
          <Section title="Payment">Projects typically require a 50% deposit to begin, with the remaining balance due upon launch unless otherwise agreed.</Section>
          <Section title="Revisions">Each package includes one round of revisions. Additional revisions are billed at our standard hourly rate.</Section>
          <Section title="Ownership">Upon final payment, you own all final deliverables. Source files and working assets are provided on request.</Section>
          <Section title="Liability">Jubilee Tech is not liable for business outcomes outside our reasonable control. We commit to best-effort delivery aligned to your stated goals.</Section>
        </div>
      </article>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xl font-display font-semibold text-white">{title}</h2>
      <p className="mt-2">{children}</p>
    </div>
  );
}