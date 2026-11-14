import { Link } from "@tanstack/react-router";
import { Instagram, Mail, ArrowUpRight, ShieldCheck, Box } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 mt-24 bg-[#05060f]">
      <div className="mx-auto max-w-7xl px-6 py-16 grid gap-12 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl border border-white/25 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-900 grid place-items-center">
              <span className="font-display font-bold text-white text-sm">JT</span>
            </div>
            <span className="font-display text-lg font-semibold text-white">
              Jubilee Tech
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm text-white/60 leading-relaxed">
            Bespoke conversion architecture, interactive 3D web engineering, and automated client acquisition systems.
          </p>
          <a
            href="mailto:jubileetech31@gmail.com"
            className="mt-6 inline-flex items-center gap-2 text-sm text-white hover:text-sky-300 transition-colors"
          >
            <Mail size={16} />
            <span>jubileetech31@gmail.com</span>
          </a>
        </div>

        <FooterCol
          title="Studio"
          items={[
            { label: "Case Work", to: "/portfolio" },
            { label: "3D Spatial Lab", to: "/3d-studio" },
            { label: "Capabilities", to: "/services" },
            { label: "About Studio", to: "/about" },
          ]}
        />
        <FooterCol
          title="Systems"
          items={[
            { label: "Admin Business OS", to: "/admin" },
            { label: "Start a Project", to: "/contact" },
            { label: "FAQ", to: "/faq" },
          ]}
        />
        <FooterCol
          title="Governance"
          items={[
            { label: "Privacy Policy", to: "/privacy" },
            { label: "Terms of Service", to: "/terms" },
            { label: "Portal Sign In", to: "/login" },
          ]}
        />
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/45 font-mono" suppressHydrationWarning>
            © {new Date().getFullYear()} JUBILEE TECH STUDIO. ALL SYSTEMS OPERATIONAL.
          </p>
          <div className="flex items-center gap-5">
            <Link
              to="/3d-studio"
              className="text-xs text-sky-300 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <Box size={13} /> 3D Lab
            </Link>
            <Link
              to="/admin"
              className="text-xs text-white/70 hover:text-white inline-flex items-center gap-1 transition-colors"
            >
              <ShieldCheck size={13} /> Executive OS
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/50 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={17} />
            </a>
            <Link
              to="/contact"
              className="text-xs text-white hover:text-sky-300 inline-flex items-center gap-1 font-medium"
            >
              Commission a build <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: { label: string; to: string }[];
}) {
  return (
    <div>
      <h4 className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((i) => (
          <li key={i.to}>
            <Link
              to={i.to as any}
              className="text-sm text-white/70 hover:text-white transition-colors"
            >
              {i.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
