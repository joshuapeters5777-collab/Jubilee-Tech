import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({ meta: [{ title: "Privacy — Jubilee Tech" }] }),
});

function PrivacyPage() {
  return (
    <PageShell>
      <article className="mx-auto max-w-3xl px-6 pt-24 pb-24">
        <h1 className="text-4xl md:text-5xl font-display font-semibold jt-text-gradient">Privacy Policy</h1>
        <p className="mt-3 text-sm text-white/50">Last updated: 2026</p>
        <div className="mt-10 space-y-6 text-white/75 leading-relaxed">
          <p>Jubilee Tech respects your privacy. This policy explains what information we collect, how we use it, and the choices you have.</p>
          <Section title="Information we collect">We collect information you provide directly (name, email, company) when you contact us, plus basic analytics about how visitors use our site.</Section>
          <Section title="How we use information">To respond to inquiries, deliver our services, improve the site, and send relevant updates if you opt in.</Section>
          <Section title="Sharing">We don't sell your data. We only share with trusted providers necessary to operate our business (e.g. email, hosting).</Section>
          <Section title="Your rights">You can request access, correction, or deletion of your data at any time by contacting jubileetech31@gmail.com.</Section>
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