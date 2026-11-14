import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { ClientConciergeWidget } from "./ClientConciergeWidget";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <ClientConciergeWidget />
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      className={`max-w-3xl ${
        align === "center" ? "mx-auto text-center" : ""
      }`}
    >
      {eyebrow && (
        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-4 text-3xl md:text-5xl font-semibold tracking-tight jt-text-gradient">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-white/60 text-base md:text-lg leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}
