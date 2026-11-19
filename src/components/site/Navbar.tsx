import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Box, ShieldCheck, ArrowUpRight } from "lucide-react";

const links = [
  { to: "/", label: "Index" },
  { to: "/services", label: "Capabilities" },
  { to: "/portfolio", label: "Case Work" },
  { to: "/case-studies", label: "Executive PDFs", badge: "PDF" },
  { to: "/3d-studio", label: "3D Spatial Lab", badge: "LIVE" },
  { to: "/about", label: "Studio" },
  { to: "/contact", label: "Inquire" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#060814]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.8)]"
          : "bg-transparent border-b border-white/[0.04]"
      }`}
    >
      <nav className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="h-9 w-9 rounded-xl border border-white/25 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-900 grid place-items-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_0_24px_rgba(56,189,248,0.4)]">
            <span className="font-display font-bold text-white text-sm tracking-tighter">
              JT
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-semibold tracking-tight text-white text-sm leading-none">
              JUBILEE<span className="text-sky-300"> TECH</span>
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/45 mt-0.5">
              SOUTH AFRICA · GLOBAL B2B
            </span>
          </div>
        </Link>

        <ul className="hidden xl:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 backdrop-blur-xl">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to as any}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white/70 hover:text-white transition-colors rounded-full"
                activeProps={{
                  className:
                    "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]",
                }}
              >
                {l.to === "/3d-studio" && <Box size={13} className="text-sky-300" />}
                {l.label}
                {"badge" in l && l.badge && (
                  <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-1.5 py-0.2 font-mono text-[9px] text-sky-300">
                    {l.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-2.5">
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-2 text-xs font-medium text-white/85 hover:bg-white/10 hover:border-white/30 transition"
          >
            <ShieldCheck size={14} className="text-sky-300" />
            Business OS
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-slate-950 bg-white hover:bg-sky-100 transition shadow-[0_8px_24px_-6px_rgba(255,255,255,0.4)]"
          >
            Start Project
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <button
          className="xl:hidden text-white p-2"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="xl:hidden border-t border-white/10 bg-[#060814]/95 backdrop-blur-2xl">
          <ul className="px-6 py-5 flex flex-col gap-2">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to as any}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between py-2 text-sm text-white/85"
                >
                  <span>{l.label}</span>
                  {"badge" in l && l.badge && (
                    <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-2 py-0.5 font-mono text-[10px] text-sky-300">
                      {l.badge}
                    </span>
                  )}
                </Link>
              </li>
            ))}
            <li className="pt-3 flex flex-col gap-2 border-t border-white/10">
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white"
              >
                <ShieldCheck size={14} className="text-sky-300" />
                Open Admin Business OS
              </Link>
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex w-full justify-center rounded-full px-4 py-2.5 text-xs font-semibold text-slate-950 bg-white"
              >
                Start a Project
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
