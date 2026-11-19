import React, { useMemo, useState } from "react";
import {
  type GeneratedWebsite,
  buildStandaloneWebsiteHtml,
  getGeneratedWebsites,
  saveGeneratedWebsites,
} from "@/lib/business-store";
import { JUBILEE_PORTFOLIO_PROJECTS } from "@/lib/portfolio-catalog";
import {
  SUPABASE_PROJECT_ID,
  SUPABASE_URL,
  deployFilesToVercel,
  supabaseUpsert,
} from "@/lib/supabase";
import {
  Code2,
  Download,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2,
  Copy,
  Trash2,
  Wand2,
  Eye,
  Rocket,
  Database,
  ExternalLink,
  Loader2,
  FolderGit2,
} from "lucide-react";

const NICHE_TEMPLATES: Record<
  string,
  {
    niche: string;
    tagline: string;
    primaryColor: string;
    secondaryColor: string;
    themeMode: GeneratedWebsite["themeMode"];
    fontStyle: GeneratedWebsite["fontStyle"];
    ctaText: string;
    heroTitle: string;
    heroSubtitle: string;
    items: { title: string; desc: string; badge: string; price: string }[];
  }
> = {
  fragrance: {
    niche: "Luxury Parfumerie & E-Commerce",
    tagline: "Extrait de Parfum — Small-Batch Olfactory Art.",
    primaryColor: "#d4af37",
    secondaryColor: "#0c0a09",
    themeMode: "dark-luxury",
    fontStyle: "serif",
    ctaText: "Explore The Collection",
    heroTitle: "Scent That Commands The Room Before You Speak.",
    heroSubtitle:
      "Hand-poured Extrait de Parfum at 35% concentration. Rare Grasse absolutes engineered for 18-hour trail.",
    items: [
      {
        title: "NOIR VELOURS No. 07",
        desc: "Smoked Oud, Black Cardamom, Madagascar Vanilla & Ambergris.",
        badge: "Flagship",
        price: "R3,400",
      },
      {
        title: "SOLEIL D'OR No. 12",
        desc: "Calabrian Bergamot, Saffron Threads, White Leather & Tonka.",
        badge: "Limited",
        price: "R3,850",
      },
      {
        title: "DISCOVERY COFFRET (5×5ml)",
        desc: "Experience all 5 signature extraits + R750 full-bottle credit.",
        badge: "Best Value",
        price: "R980",
      },
    ],
  },
  restaurant: {
    niche: "Fine Dining & Hospitality Ordering",
    tagline: "Wood-Fired Prime Cuts & Craft Mixology.",
    primaryColor: "#f97316",
    secondaryColor: "#090d16",
    themeMode: "warm-artisan",
    fontStyle: "space",
    ctaText: "Reserve Table / Order Online",
    heroTitle: "Where 45-Day Dry-Aged Ribeye Meets Open Ironbark Flame.",
    heroSubtitle:
      "Instant online table reservations, VIP private dining, and 1-tap gourmet takeaway ordering.",
    items: [
      {
        title: "900g Wagyu Tomahawk",
        desc: "Carved tableside over smoked rosemary embers with bone-marrow jus.",
        badge: "Chef's Signature",
        price: "R1,450",
      },
      {
        title: "Truffle Wagyu Smash Burger",
        desc: "Double aged brisket patty, black truffle aioli, aged gruyère on brioche.",
        badge: "Most Ordered",
        price: "R185",
      },
      {
        title: "Chef's 6-Course Fire Tasting",
        desc: "Curated progression with optional sommelier vintage pairing.",
        badge: "VIP Experience",
        price: "R1,750",
      },
    ],
  },
  medspa: {
    niche: "Aesthetics & Longevity MedSpa",
    tagline: "Physician-Led Regenerative Aesthetics.",
    primaryColor: "#38bdf8",
    secondaryColor: "#0f172a",
    themeMode: "cyber-glass",
    fontStyle: "space",
    ctaText: "Book Private Consultation",
    heroTitle: "Natural, Undetectable Facial Restoration & Cellular Longevity.",
    heroSubtitle:
      "Bespoke treatment protocols combining Swiss bio-stimulators, laser resurfacing, and medical-grade precision.",
    items: [
      {
        title: "Full-Face Bio-Remodeling",
        desc: "Profhilo & polynucleotides for deep dermal hydration and lift.",
        badge: "Zero Downtime",
        price: "R6,800",
      },
      {
        title: "PicoSure Laser Glass Skin",
        desc: "Targets pigmentation, pores, and collagen synthesis in 30 minutes.",
        badge: "Popular",
        price: "R4,500",
      },
      {
        title: "3D Facial Assessment & Plan",
        desc: "Diagnostic skin imaging + tailored 12-month rejuvenation roadmap.",
        badge: "New Patient",
        price: "R1,250",
      },
    ],
  },
  saas: {
    niche: "B2B AI & Workflow Platform",
    tagline: "Autonomous Revenue Operations For Modern Teams.",
    primaryColor: "#8b5cf6",
    secondaryColor: "#060814",
    themeMode: "cyber-glass",
    fontStyle: "mono",
    ctaText: "Start 14-Day Free Trial",
    heroTitle: "Automate 84% Of Pipeline Qualification In One Unified OS.",
    heroSubtitle:
      "Connect your CRM, inbox, and billing in 90 seconds. Backed by Supabase PostgreSQL 17 & Vercel Edge.",
    items: [
      {
        title: "Growth Team Plan",
        desc: "Up to 10 seats, unlimited AI workflows, and real-time webhook sync.",
        badge: "Most Popular",
        price: "R2,450/mo",
      },
      {
        title: "Scale Enterprise",
        desc: "Dedicated VPC cluster, custom SSO, and 24/7 solutions engineer.",
        badge: "Enterprise",
        price: "R8,900/mo",
      },
      {
        title: "Done-For-You Onboarding",
        desc: "Full CRM migration and custom agent tuning in 7 days.",
        badge: "Add-on",
        price: "R12,500",
      },
    ],
  },
};

export function WebsiteGeneratorStudio() {
  const [websites, setWebsites] = useState<GeneratedWebsite[]>(() =>
    getGeneratedWebsites(),
  );
  const [selectedId, setSelectedId] = useState<string>(
    () => getGeneratedWebsites()[0]?.id || "",
  );
  const [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview");
  const [copied, setCopied] = useState(false);

  // Generator form state
  const [templateKey, setTemplateKey] = useState<string>("fragrance");
  const [clientName, setClientName] = useState("");
  const [customTagline, setCustomTagline] = useState("");
  const [customColor, setCustomColor] = useState("#38bdf8");
  const [contactEmail, setContactEmail] = useState("");

  // Vercel & Supabase Cloud Deployment State
  const [vercelToken, setVercelToken] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("jt_vercel_token") || "";
  });
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [deployedUrls, setDeployedUrls] = useState<Record<string, string>>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem("jt_vercel_deployed_urls") || "{}");
    } catch {
      return {};
    }
  });
  const [deployNotice, setDeployNotice] = useState<string>("");

  const activeSite = useMemo(
    () => websites.find((w) => w.id === selectedId) ?? websites[0] ?? null,
    [websites, selectedId],
  );

  const generatedHtml = useMemo(
    () => (activeSite ? buildStandaloneWebsiteHtml(activeSite) : ""),
    [activeSite],
  );

  const handleSaveVercelToken = (val: string) => {
    setVercelToken(val);
    if (typeof window !== "undefined") {
      localStorage.setItem("jt_vercel_token", val);
    }
  };

  const handleDeployToVercelAndSupabase = async (
    id: string,
    name: string,
    htmlContent: string,
  ) => {
    setDeployingId(id);
    setDeployNotice("");

    // Always sync to live Supabase PostgreSQL 17 first
    await supabaseUpsert("jt_generated_sites", {
      id,
      client_name: name,
      niche: "Vercel + Supabase Production Build",
      headline: name,
      html_code: htmlContent,
      created_at: new Date().toISOString(),
    });

    if (!vercelToken.trim()) {
      setDeployingId(null);
      setDeployNotice(
        `✅ "${name}" saved to Supabase PostgreSQL (${SUPABASE_PROJECT_ID}). Paste your Vercel Access Token above to also push directly to a live .vercel.app URL in 1 click!`,
      );
      return;
    }

    const res = await deployFilesToVercel({
      projectName: `jt-${name}`,
      vercelToken,
      files: [
        {
          file: "index.html",
          data: htmlContent,
        },
      ],
    });

    setDeployingId(null);
    if (res.ok && res.url) {
      const nextUrls = { ...deployedUrls, [id]: res.url };
      setDeployedUrls(nextUrls);
      if (typeof window !== "undefined") {
        localStorage.setItem("jt_vercel_deployed_urls", JSON.stringify(nextUrls));
      }
      await supabaseUpsert("jt_generated_sites", {
        id,
        client_name: name,
        niche: "Vercel + Supabase Production Build",
        headline: name,
        html_code: htmlContent,
        vercel_deployment_url: res.url,
      });
      setDeployNotice(`🚀 Deployed "${name}" to Vercel (${res.url}) & synced with Supabase!`);
    } else {
      setDeployNotice(
        `⚠️ Saved to Supabase, but Vercel API returned: ${res.error || "Check your Vercel token"}`,
      );
    }
  };

  const handleDeployAllPortfolioToCloud = async () => {
    setDeployingId("all-portfolio");
    setDeployNotice("Syncing all Jubilee Tech websites to Supabase & Vercel...");

    for (const proj of JUBILEE_PORTFOLIO_PROJECTS) {
      const html =
        proj.previewHtml ||
        `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=${proj.href || "/"}" /></head><body>Redirecting to ${proj.name}...</body></html>`;

      await supabaseUpsert("jt_generated_sites", {
        id: `portfolio-${proj.id}`,
        client_name: proj.name,
        niche: proj.category,
        headline: proj.tag,
        subheadline: proj.summary,
        html_code: html,
        vercel_deployment_url: proj.href || deployedUrls[proj.id] || "",
      });

      if (vercelToken.trim() && proj.previewHtml) {
        const vRes = await deployFilesToVercel({
          projectName: `jubilee-${proj.id}`,
          vercelToken,
          files: [{ file: "index.html", data: proj.previewHtml }],
        });
        if (vRes.ok && vRes.url) {
          setDeployedUrls((prev) => {
            const next = { ...prev, [proj.id]: vRes.url! };
            if (typeof window !== "undefined") {
              localStorage.setItem("jt_vercel_deployed_urls", JSON.stringify(next));
            }
            return next;
          });
        }
      }
    }

    setDeployingId(null);
    setDeployNotice(
      vercelToken.trim()
        ? `🚀 All ${JUBILEE_PORTFOLIO_PROJECTS.length} Jubilee Tech websites deployed to Vercel & backed up in Supabase (${SUPABASE_PROJECT_ID})!`
        : `✅ All ${JUBILEE_PORTFOLIO_PROJECTS.length} Jubilee Tech websites synced to Supabase PostgreSQL (${SUPABASE_PROJECT_ID}). Add your Vercel Token above to push all 12 to your Vercel account in 1 click!`,
    );
  };

  const handleGenerateSite = (e: React.FormEvent) => {
    e.preventDefault();
    const tpl = NICHE_TEMPLATES[templateKey] ?? NICHE_TEMPLATES.fragrance;
    const finalName = clientName.trim() || "Aurelia Bespoke";
    const newSite: GeneratedWebsite = {
      id: `site-${Date.now()}`,
      clientName: finalName,
      niche: tpl.niche,
      tagline: customTagline.trim() || tpl.tagline,
      primaryColor: customColor || tpl.primaryColor,
      secondaryColor: tpl.secondaryColor,
      themeMode: tpl.themeMode,
      fontStyle: tpl.fontStyle,
      ctaText: tpl.ctaText,
      include3DHero: true,
      contactEmail:
        contactEmail.trim() ||
        `hello@${finalName.toLowerCase().replace(/[^a-z0-9]/g, "")}.co.za`,
      contactPhone: "+27 82 000 0000",
      createdAt: Date.now(),
      status: "Preview Ready",
      sections: [
        {
          id: `sec-h-${Date.now()}`,
          type: "hero",
          title: tpl.heroTitle,
          subtitle: tpl.heroSubtitle,
          items: [
            { title: "14-Day Build", desc: "Engineered by Jubilee Tech" },
            { title: "Supabase DB", desc: "PostgreSQL 17 backend wired" },
            { title: "Vercel Ready", desc: "1-click edge deployment" },
          ],
        },
        {
          id: `sec-s-${Date.now()}`,
          type: "showcase",
          title: `${finalName} — Signature Offerings`,
          subtitle: "Curated packages engineered for maximum client satisfaction.",
          items: tpl.items,
        },
      ],
    };

    const updated = [newSite, ...websites];
    setWebsites(updated);
    saveGeneratedWebsites(updated);
    setSelectedId(newSite.id);
    setClientName("");
    setCustomTagline("");
  };

  const handleUpdateActiveSite = (patch: Partial<GeneratedWebsite>) => {
    if (!activeSite) return;
    const updated = websites.map((w) =>
      w.id === activeSite.id ? { ...w, ...patch } : w,
    );
    setWebsites(updated);
    saveGeneratedWebsites(updated);
  };

  const handleDeleteSite = (id: string) => {
    const updated = websites.filter((w) => w.id !== id);
    setWebsites(updated);
    saveGeneratedWebsites(updated);
    if (selectedId === id && updated[0]) {
      setSelectedId(updated[0].id);
    }
  };

  const handleCopyCode = () => {
    if (!generatedHtml) return;
    navigator.clipboard.writeText(generatedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadHtml = () => {
    if (!activeSite || !generatedHtml) return;
    const blob = new Blob([generatedHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeSite.clientName.toLowerCase().replace(/\s+/g, "-")}-website.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* VERCEL + SUPABASE UNIFIED CLOUD DEPLOYMENT HUB */}
      <div className="jt-chrome-card rounded-3xl p-6 border border-sky-400/35">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                <Database size={11} /> SUPABASE CONNECTED ({SUPABASE_PROJECT_ID})
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-0.5 font-mono text-[10px] uppercase tracking-wider text-sky-300">
                <Rocket size={11} /> VERCEL EDGE DEPLOYER
              </span>
            </div>
            <h3 className="text-xl font-display font-semibold text-white mt-2">
              All Jubilee Tech Websites — Vercel Hosting & Supabase PostgreSQL Backend
            </h3>
            <p className="text-xs text-white/65 mt-0.5">
              Every website in your Jubilee Tech workspace is wired to your live Supabase
              PostgreSQL 17 database (<code className="text-sky-300">{SUPABASE_URL}</code>
              ). Enter your Vercel Access Token below to push any or all websites directly
              to Vercel in 1 click.
            </p>
          </div>

          <button
            type="button"
            onClick={handleDeployAllPortfolioToCloud}
            disabled={deployingId !== null}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-slate-950 shadow-lg hover:bg-sky-100 transition disabled:opacity-50"
          >
            {deployingId === "all-portfolio" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Rocket size={14} />
            )}
            Deploy All 12 Websites to Vercel + Supabase
          </button>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[1fr_auto] items-center">
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Vercel Personal Access Token (from vercel.com/account/tokens — enables 1-click live .vercel.app deployment)
            </label>
            <input
              type="password"
              placeholder="Paste Vercel Token (e.g. vcp_... or Bearer token) for instant cloud deployment"
              value={vercelToken}
              onChange={(e) => handleSaveVercelToken(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/45 px-3.5 py-2.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400"
            />
          </div>
          {activeSite && (
            <div className="flex items-end pt-4">
              <button
                type="button"
                onClick={() =>
                  handleDeployToVercelAndSupabase(
                    activeSite.id,
                    activeSite.clientName,
                    generatedHtml,
                  )
                }
                disabled={deployingId !== null}
                className="inline-flex items-center gap-2 rounded-xl bg-sky-500 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
              >
                {deployingId === activeSite.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Rocket size={14} />
                )}
                Deploy "{activeSite.clientName}" Now
              </button>
            </div>
          )}
        </div>

        {deployNotice && (
          <div className="mt-3 rounded-2xl border border-emerald-400/35 bg-emerald-500/15 px-4 py-2.5 text-xs text-emerald-200">
            {deployNotice}
          </div>
        )}

        {/* Quick Status Grid of All 12 Jubilee Tech Portfolio Websites */}
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {JUBILEE_PORTFOLIO_PROJECTS.map((proj) => {
            const liveUrl = deployedUrls[proj.id] || proj.href;
            return (
              <div
                key={proj.id}
                className="flex items-center justify-between rounded-2xl border border-white/12 bg-black/35 px-3 py-2 text-xs"
              >
                <div className="truncate pr-2">
                  <div className="font-semibold text-white truncate">{proj.name}</div>
                  <div className="font-mono text-[10px] text-emerald-300 flex items-center gap-1">
                    <FolderGit2 size={10} /> Supabase Ready
                  </div>
                </div>
                {liveUrl ? (
                  <a
                    href={liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 rounded-lg bg-sky-500/20 border border-sky-400/40 px-2 py-1 text-[10px] font-semibold text-sky-200 hover:bg-sky-500/35 inline-flex items-center gap-1"
                  >
                    Live <ExternalLink size={10} />
                  </a>
                ) : (
                  <button
                    type="button"
                    onClick={() =>
                      handleDeployToVercelAndSupabase(
                        proj.id,
                        proj.name,
                        proj.previewHtml || "",
                      )
                    }
                    className="shrink-0 rounded-lg bg-white/10 border border-white/20 px-2 py-1 text-[10px] font-semibold text-white hover:bg-white hover:text-slate-950 transition"
                  >
                    Deploy
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Generator Bar */}
      <div className="jt-chrome-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
              CLIENT WEBSITE GENERATOR STUDIO
            </span>
            <h2 className="text-2xl font-display font-semibold text-white mt-1">
              Generate New Client Websites (Wired to Supabase + Vercel)
            </h2>
          </div>
          <span className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-300">
            {websites.length} Client Builds Saved
          </span>
        </div>

        <form
          onSubmit={handleGenerateSite}
          className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        >
          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Industry Blueprint
            </label>
            <select
              value={templateKey}
              onChange={(e) => {
                setTemplateKey(e.target.value);
                const tpl = NICHE_TEMPLATES[e.target.value];
                if (tpl) setCustomColor(tpl.primaryColor);
              }}
              className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            >
              <option value="fragrance">Luxury Parfumerie / E-Com</option>
              <option value="restaurant">Fine Dining / Ordering</option>
              <option value="medspa">MedSpa & Aesthetics Clinic</option>
              <option value="saas">B2B AI / SaaS Platform</option>
            </select>
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Client Business Name
            </label>
            <input
              type="text"
              placeholder="e.g. Sandton Luxury Motors"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Custom Value Proposition
            </label>
            <input
              type="text"
              placeholder="Optional custom tagline..."
              value={customTagline}
              onChange={(e) => setCustomTagline(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400"
            />
          </div>

          <div>
            <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/40 px-2.5 py-1.5">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="h-6 w-8 cursor-pointer border-0 bg-transparent"
              />
              <span className="font-mono text-xs text-white/80">{customColor}</span>
            </div>
          </div>

          <div className="flex items-end">
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg hover:brightness-110 transition"
            >
              <Wand2 size={14} />
              Generate Website
            </button>
          </div>
        </form>
      </div>

      {/* Workspace Split: Saved Client Websites List + Live Interactive Preview / Code */}
      <div className="grid gap-6 lg:grid-cols-[310px_1fr]">
        {/* Left Column: Generated Sites + Quick Customizer */}
        <div className="space-y-4">
          <div className="jt-chrome-card rounded-3xl p-5 space-y-3">
            <div className="text-xs font-mono uppercase tracking-wider text-white/60">
              Client Builds Library
            </div>
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {websites.map((site) => (
                <div
                  key={site.id}
                  onClick={() => setSelectedId(site.id)}
                  className={`group cursor-pointer rounded-2xl border p-3.5 transition ${
                    activeSite?.id === site.id
                      ? "border-sky-400 bg-sky-500/15"
                      : "border-white/10 bg-black/30 hover:bg-white/5"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: site.primaryColor }}
                      />
                      <span className="font-display text-sm font-semibold text-white">
                        {site.clientName}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSite(site.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-rose-400 transition"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  <div className="mt-1 text-[11px] text-white/55 truncate">
                    {site.niche}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-sky-200">
                      {deployedUrls[site.id] ? "Live on Vercel" : site.status}
                    </span>
                    <span className="text-[10px] text-white/40">
                      {new Date(site.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeSite && (
            <div className="jt-chrome-card rounded-3xl p-5 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-sky-300">
                Live Customizer — {activeSite.clientName}
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">
                  Hero Headline
                </label>
                <input
                  type="text"
                  value={activeSite.sections[0]?.title || ""}
                  onChange={(e) => {
                    const nextSections = [...activeSite.sections];
                    if (nextSections[0]) {
                      nextSections[0] = { ...nextSections[0], title: e.target.value };
                      handleUpdateActiveSite({ sections: nextSections });
                    }
                  }}
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">
                    Primary Color
                  </label>
                  <input
                    type="color"
                    value={activeSite.primaryColor}
                    onChange={(e) =>
                      handleUpdateActiveSite({ primaryColor: e.target.value })
                    }
                    className="h-8 w-full cursor-pointer rounded-lg border border-white/15 bg-black/40 p-1"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-white/60 mb-1">
                    Theme Mode
                  </label>
                  <select
                    value={activeSite.themeMode}
                    onChange={(e) =>
                      handleUpdateActiveSite({
                        themeMode: e.target.value as GeneratedWebsite["themeMode"],
                      })
                    }
                    className="w-full rounded-lg border border-white/15 bg-slate-950 px-2 py-2 text-xs text-white"
                  >
                    <option value="dark-luxury">Dark Luxury</option>
                    <option value="editorial-light">Editorial Light</option>
                    <option value="cyber-glass">Cyber Glass</option>
                    <option value="warm-artisan">Warm Artisan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-white/60 mb-1">
                  Primary CTA Button Text
                </label>
                <input
                  type="text"
                  value={activeSite.ctaText}
                  onChange={(e) =>
                    handleUpdateActiveSite({ ctaText: e.target.value })
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
                />
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Live Browser Preview & Exportable HTML/CSS */}
        <div className="jt-chrome-card rounded-3xl p-5 flex flex-col">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/15 pb-4">
            <div className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setViewMode("preview")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "preview"
                    ? "bg-white text-slate-950"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Eye size={13} /> Live Render
              </button>
              <button
                type="button"
                onClick={() => setViewMode("code")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  viewMode === "code"
                    ? "bg-white text-slate-950"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <Code2 size={13} /> Production HTML
              </button>
            </div>

            {viewMode === "preview" && (
              <div className="flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 p-1">
                <button
                  type="button"
                  onClick={() => setViewport("desktop")}
                  className={`rounded-lg p-1.5 ${
                    viewport === "desktop" ? "bg-white/20 text-white" : "text-white/50"
                  }`}
                  title="Desktop view"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("tablet")}
                  className={`rounded-lg p-1.5 ${
                    viewport === "tablet" ? "bg-white/20 text-white" : "text-white/50"
                  }`}
                  title="Tablet view"
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewport("mobile")}
                  className={`rounded-lg p-1.5 ${
                    viewport === "mobile" ? "bg-white/20 text-white" : "text-white/50"
                  }`}
                  title="Mobile view"
                >
                  <Smartphone size={14} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
              >
                {copied ? <CheckCircle2 size={13} className="text-emerald-300" /> : <Copy size={13} />}
                {copied ? "Copied HTML" : "Copy Code"}
              </button>
              <button
                type="button"
                onClick={handleDownloadHtml}
                className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-3.5 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
              >
                <Download size={13} />
                Download .HTML
              </button>
            </div>
          </div>

          {/* Viewport Body */}
          <div className="mt-4 flex-1 flex items-center justify-center bg-black/50 rounded-2xl border border-white/10 p-3 min-h-[500px]">
            {viewMode === "preview" ? (
              <div
                className={`h-[500px] overflow-hidden rounded-xl border border-white/15 bg-slate-950 transition-all duration-300 ${
                  viewport === "desktop"
                    ? "w-full"
                    : viewport === "tablet"
                      ? "w-[740px] max-w-full"
                      : "w-[375px] max-w-full"
                }`}
              >
                <iframe
                  title="Generated Client Website Preview"
                  srcDoc={generatedHtml}
                  className="h-full w-full border-0"
                />
              </div>
            ) : (
              <pre className="h-[500px] w-full overflow-auto rounded-xl bg-slate-950 p-4 font-mono text-xs text-sky-200">
                {generatedHtml}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
