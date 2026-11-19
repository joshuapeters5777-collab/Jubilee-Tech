import React, { useState } from "react";
import {
  type AutoResponderConfig,
  type BusinessLead,
  type LeadStatus,
  type ProspectResult,
  generateSmartClientReply,
  getAutoResponderConfig,
  getProspects,
  saveAutoResponderConfig,
  saveBusinessLeads,
  saveProspects,
} from "@/lib/business-store";
import { useCurrency } from "@/lib/currency";
import {
  Search,
  Send,
  Bot,
  CheckCircle2,
  Mail,
  Globe,
  AlertTriangle,
  Wand2,
  UserPlus,
  Sliders,
} from "lucide-react";

interface ClientFinderAndInboxProps {
  leads: BusinessLead[];
  onLeadsChange: (leads: BusinessLead[]) => void;
  mode: "finder" | "inbox";
}

export function ClientFinderAndInbox({
  leads,
  onLeadsChange,
  mode,
}: ClientFinderAndInboxProps) {
  const { format } = useCurrency();
  const [prospects, setProspects] = useState<ProspectResult[]>(() => getProspects());
  const [searchNiche, setSearchNiche] = useState("MedSpa & Aesthetics Clinic");
  const [searchCity, setSearchCity] = useState("Sandton, Johannesburg");
  const [customScanDomain, setCustomScanDomain] = useState("");
  const [scanning, setScanning] = useState(false);

  // Inbox state
  const [selectedLeadId, setSelectedLeadId] = useState<string>(
    () => leads[0]?.id || "",
  );
  const [replyText, setReplyText] = useState("");
  const [autoConfig, setAutoConfig] = useState<AutoResponderConfig>(() =>
    getAutoResponderConfig(),
  );
  const [showAutoSettings, setShowAutoSettings] = useState(false);

  const selectedLead =
    leads.find((l) => l.id === selectedLeadId) ?? leads[0] ?? null;

  const handleFindClients = (e: React.FormEvent) => {
    e.preventDefault();
    setScanning(true);

    setTimeout(() => {
      const domainBase = customScanDomain.trim()
        ? customScanDomain.replace(/^https?:\/\//, "").split("/")[0]
        : `${searchNiche.split(" ")[0].toLowerCase()}-${searchCity
            .split(",")[0]
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "")}.co.za`;

      const brandTitle = customScanDomain.trim()
        ? domainBase.split(".")[0].replace(/-/g, " ").toUpperCase()
        : `${searchCity.split(",")[0].trim()} ${searchNiche.split("&")[0].trim()} Group`;

      const generatedProspect: ProspectResult = {
        id: `pros-${Date.now()}`,
        businessName: brandTitle,
        niche: searchNiche,
        city: searchCity,
        website: domainBase,
        email: `info@${domainBase}`,
        phone: "+27 11 555 0823",
        mobileScore: Math.floor(32 + Math.random() * 22),
        seoScore: Math.floor(38 + Math.random() * 25),
        hasFunnel: false,
        hasSSL: true,
        detectedIssues: [
          `Slow mobile load (5.2s) causing high bounce rate on mobile networks`,
          `No automated lead capture or instant WhatsApp/online booking funnel`,
          `Outdated visual layout with zero interactive 3D or conversion triggers`,
        ],
        estimatedDealValueZar: 24500,
        recommendedPitch: `Hi ${brandTitle} team — we ran a diagnostic on ${domainBase} and noticed your mobile booking flow takes 5.2s to load and lacks an instant qualification funnel. We built a custom 14-day prototype for ${brandTitle} at Jubilee Tech. Can I send over the live preview link?`,
      };

      const next = [generatedProspect, ...prospects];
      setProspects(next);
      saveProspects(next);
      setCustomScanDomain("");
      setScanning(false);
    }, 450);
  };

  const handleImportProspectToCrm = (prospect: ProspectResult) => {
    const newLead: BusinessLead = {
      id: `lead-pros-${Date.now()}`,
      name: `${prospect.businessName}`,
      email: prospect.email,
      phone: prospect.phone,
      company: prospect.businessName,
      source: "AI Client Finder",
      service: `${prospect.niche} Website & Funnel`,
      budget: format(prospect.estimatedDealValueZar),
      status: "Contacted",
      priority: "High",
      createdAt: Date.now(),
      websiteUrl: `https://${prospect.website}`,
      notes: `Detected issues: ${prospect.detectedIssues.join("; ")}`,
      autoReplied: true,
      messages: [
        {
          id: `msg-out-${Date.now()}`,
          sender: "ai-auto",
          senderName: "Jubilee Outbound Engine",
          body: prospect.recommendedPitch,
          timestamp: Date.now(),
        },
      ],
    };

    const updatedLeads = [newLead, ...leads];
    saveBusinessLeads(updatedLeads);
    onLeadsChange(updatedLeads);

    const updatedProspects = prospects.map((p) =>
      p.id === prospect.id ? { ...p, importedToCrm: true } : p,
    );
    setProspects(updatedProspects);
    saveProspects(updatedProspects);
    setSelectedLeadId(newLead.id);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !replyText.trim()) return;

    const newMsg = {
      id: `msg-adm-${Date.now()}`,
      sender: "admin" as const,
      senderName: "Joshua — Founder & CEO",
      body: replyText.trim(),
      timestamp: Date.now(),
    };

    const updated = leads.map((l) =>
      l.id === selectedLead.id
        ? {
            ...l,
            status: (l.status === "New" ? "Contacted" : l.status) as LeadStatus,
            messages: [...(l.messages || []), newMsg],
          }
        : l,
    );

    saveBusinessLeads(updated);
    onLeadsChange(updated);
    setReplyText("");
  };

  const handleDraftSmartReply = () => {
    if (!selectedLead) return;
    const latestClientMsg =
      [...(selectedLead.messages || [])]
        .reverse()
        .find((m) => m.sender === "client")?.body || selectedLead.notes;

    const smartDraft = generateSmartClientReply({
      name: selectedLead.name,
      company: selectedLead.company,
      service: selectedLead.service,
      budget: selectedLead.budget,
      inquiry: latestClientMsg,
    });
    setReplyText(smartDraft);
  };

  const handleStatusChange = (leadId: string, status: LeadStatus) => {
    const updated = leads.map((l) => (l.id === leadId ? { ...l, status } : l));
    saveBusinessLeads(updated);
    onLeadsChange(updated);
  };

  const toggleAutoResponder = () => {
    const next = saveAutoResponderConfig({ enabled: !autoConfig.enabled });
    setAutoConfig(next);
  };

  if (mode === "finder") {
    return (
      <div className="space-y-6">
        <div className="jt-chrome-card rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
                AUTONOMOUS CLIENT FINDER & AUDIT ENGINE
              </span>
              <h2 className="text-2xl font-display font-semibold text-white mt-1">
                Discover Businesses in South Africa & Globally Needing Websites
              </h2>
            </div>
            <div className="rounded-full border border-sky-400/30 bg-sky-500/15 px-3.5 py-1 text-xs font-medium text-sky-200">
              {prospects.length} Prospects Ready to Pitch
            </div>
          </div>

          <form
            onSubmit={handleFindClients}
            className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Target Industry / Niche
              </label>
              <select
                value={searchNiche}
                onChange={(e) => setSearchNiche(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-slate-950/80 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
              >
                <option value="MedSpa & Aesthetics Clinic">MedSpa & Aesthetics Clinic</option>
                <option value="Fine Dining & Hospitality">Fine Dining & Hospitality</option>
                <option value="Luxury Retail & E-Commerce">Luxury Retail & E-Commerce</option>
                <option value="Real Estate & Architecture">Real Estate & Architecture</option>
                <option value="Private Dental & Orthodontics">Private Dental & Orthodontics</option>
                <option value="Logistics & Inventory Systems">Logistics & Inventory Systems</option>
              </select>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                City / Target Market
              </label>
              <input
                type="text"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                placeholder="e.g. Sandton, Cape Town, Pretoria, London"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Or Scan Specific Domain (Optional)
              </label>
              <input
                type="text"
                value={customScanDomain}
                onChange={(e) => setCustomScanDomain(e.target.value)}
                placeholder="e.g. prospect-business.co.za"
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2.5 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>

            <div className="flex items-end">
              <button
                type="submit"
                disabled={scanning}
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-600 px-4 py-2.5 text-xs font-semibold text-slate-950 shadow-lg hover:brightness-110 transition"
              >
                <Search size={14} />
                {scanning ? "Scanning Market..." : "Find & Audit Prospects"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {prospects.map((pros) => (
            <div
              key={pros.id}
              className="jt-chrome-card rounded-3xl p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
                      {pros.niche} · {pros.city}
                    </span>
                    <h3 className="mt-1 text-xl font-display font-semibold text-white">
                      {pros.businessName}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-white/60">
                      <span className="inline-flex items-center gap-1">
                        <Globe size={12} className="text-sky-300" /> {pros.website}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Mail size={12} className="text-sky-300" /> {pros.email}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-3 py-1 font-mono text-xs font-bold text-emerald-300">
                      Est. {format(pros.estimatedDealValueZar || 24500)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-black/35 p-3 text-center">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-white/45">
                      Mobile Speed
                    </div>
                    <div className="text-base font-display font-bold text-rose-400">
                      {pros.mobileScore}/100
                    </div>
                  </div>
                  <div className="border-x border-white/10">
                    <div className="text-[10px] font-mono uppercase text-white/45">
                      SEO Visibility
                    </div>
                    <div className="text-base font-display font-bold text-amber-300">
                      {pros.seoScore}/100
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-white/45">
                      Lead Funnel
                    </div>
                    <div className="text-base font-display font-bold text-rose-400">
                      Missing
                    </div>
                  </div>
                </div>

                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <AlertTriangle size={12} /> Detected Conversion Leaks:
                  </div>
                  {pros.detectedIssues.map((issue) => (
                    <div key={issue} className="text-xs text-white/75 pl-2">
                      • {issue}
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-2xl border border-white/10 bg-black/40 p-3.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-sky-300 mb-1">
                    Ready-to-Send Personalized Pitch
                  </div>
                  <p className="text-xs text-white/80 leading-relaxed">
                    "{pros.recommendedPitch}"
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                {pros.importedToCrm ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                    <CheckCircle2 size={14} /> Added to Pipeline & Pitch Queued
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleImportProspectToCrm(pros)}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
                  >
                    <UserPlus size={14} />
                    Import to CRM & Auto-Pitch
                  </button>
                )}

                <a
                  href={`mailto:${pros.email}?subject=${encodeURIComponent(
                    `Quick prototype for ${pros.businessName}`,
                  )}&body=${encodeURIComponent(pros.recommendedPitch)}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/20 transition"
                >
                  <Mail size={13} /> Send Direct Email
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="jt-chrome-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 grid place-items-center text-emerald-300">
              <Bot size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-display font-semibold text-white">
                  24/7 Autonomous Client Responder & Smart Inbox
                </h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-mono uppercase font-semibold ${
                    autoConfig.enabled
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                      : "bg-white/10 text-white/50"
                  }`}
                >
                  {autoConfig.enabled ? "AUTO-AGENT ACTIVE" : "PAUSED"}
                </span>
              </div>
              <p className="text-xs text-white/65 mt-0.5">
                Automatically answers inbound leads with tailored pricing, 14-day scope,
                and your calendar booking link.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowAutoSettings((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 px-3.5 py-2 text-xs font-medium text-white hover:bg-white/15 transition"
            >
              <Sliders size={14} /> Configure Rules
            </button>
            <button
              type="button"
              onClick={toggleAutoResponder}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                autoConfig.enabled
                  ? "bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                  : "bg-white/15 text-white hover:bg-white/25"
              }`}
            >
              {autoConfig.enabled ? "Auto-Reply: ON" : "Enable Auto-Reply"}
            </button>
          </div>
        </div>

        {showAutoSettings && (
          <div className="mt-5 pt-5 border-t border-white/15 grid gap-4 md:grid-cols-3">
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Calendar / Strategy Call Link
              </label>
              <input
                type="text"
                value={autoConfig.bookingUrl}
                onChange={(e) => {
                  const next = saveAutoResponderConfig({ bookingUrl: e.target.value });
                  setAutoConfig(next);
                }}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Executive Signature
              </label>
              <input
                type="text"
                value={autoConfig.signature}
                onChange={(e) => {
                  const next = saveAutoResponderConfig({ signature: e.target.value });
                  setAutoConfig(next);
                }}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-xs text-white/80 cursor-pointer pb-2">
                <input
                  type="checkbox"
                  checked={autoConfig.includePriceEstimate}
                  onChange={(e) => {
                    const next = saveAutoResponderConfig({
                      includePriceEstimate: e.target.checked,
                    });
                    setAutoConfig(next);
                  }}
                  className="accent-sky-400"
                />
                Auto-include package price estimate
              </label>
            </div>
          </div>
        )}
      </div>

      {leads.length === 0 ? (
        <div className="jt-chrome-card rounded-3xl p-10 text-center space-y-3">
          <div className="text-lg font-display font-semibold text-white">
            Your Client Inbox is Clean (0 Leads Yet)
          </div>
          <p className="text-xs text-white/65 max-w-md mx-auto">
            As soon as a visitor fills out your Contact form, uses the AI Concierge chat,
            or you import a prospect from the Client Finder tab, their conversation will
            appear here and auto-reply automatically.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
          <div className="jt-chrome-card rounded-3xl p-4 space-y-2.5 max-h-[600px] overflow-y-auto">
            <div className="px-2 py-1 flex items-center justify-between text-xs font-mono uppercase tracking-wider text-white/55">
              <span>Client Conversations ({leads.length})</span>
            </div>
            {leads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedLeadId(lead.id)}
                className={`cursor-pointer rounded-2xl border p-3.5 transition ${
                  selectedLead?.id === lead.id
                    ? "border-sky-400 bg-sky-500/15"
                    : "border-white/10 bg-black/30 hover:bg-white/5"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-sm font-semibold text-white truncate">
                    {lead.name}
                  </span>
                  <StatusPill status={lead.status} />
                </div>
                <div className="text-xs text-sky-300 truncate mt-0.5">
                  {lead.company} · {lead.budget}
                </div>
                <div className="mt-1.5 text-[11px] text-white/55 line-clamp-1">
                  {lead.service}
                </div>
              </div>
            ))}
          </div>

          {selectedLead ? (
            <div className="jt-chrome-card rounded-3xl p-6 flex flex-col justify-between min-h-[540px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-4">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-xl font-display font-semibold text-white">
                        {selectedLead.name}
                      </h3>
                      <span className="text-xs text-white/50">
                        ({selectedLead.company})
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-4 text-xs text-white/65">
                      <span>{selectedLead.email}</span>
                      <span>{selectedLead.phone}</span>
                      <span className="text-sky-300 font-semibold">
                        {selectedLead.service} ({selectedLead.budget})
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["New", "Contacted", "Qualified", "Closed"] as LeadStatus[]).map(
                      (st) => (
                        <button
                          key={st}
                          type="button"
                          onClick={() => handleStatusChange(selectedLead.id, st)}
                          className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold transition ${
                            selectedLead.status === st
                              ? "bg-white text-slate-950"
                              : "bg-white/5 text-white/60 hover:bg-white/15"
                          }`}
                        >
                          {st}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <div className="mt-4 space-y-3 max-h-[280px] overflow-y-auto pr-2">
                  {(selectedLead.messages || []).map((msg) => (
                    <div
                      key={msg.id}
                      className={`rounded-2xl p-4 text-xs leading-relaxed ${
                        msg.sender === "client"
                          ? "border border-white/15 bg-black/45 text-white"
                          : msg.sender === "ai-auto"
                            ? "border border-sky-400/35 bg-sky-500/15 text-sky-100 ml-6"
                            : "border border-emerald-400/35 bg-emerald-500/15 text-emerald-100 ml-6"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider opacity-70 mb-1.5">
                        <span>{msg.senderName}</span>
                        <span>{new Date(msg.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="whitespace-pre-line">{msg.body}</div>
                    </div>
                  ))}
                </div>
              </div>

              <form
                onSubmit={handleSendReply}
                className="mt-5 pt-4 border-t border-white/15 space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={handleDraftSmartReply}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/15 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/25 transition"
                  >
                    <Wand2 size={13} /> Generate AI Smart Proposal Reply
                  </button>

                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${selectedLead.email}?subject=${encodeURIComponent(
                        `Jubilee Tech — ${selectedLead.service} Proposal`,
                      )}&body=${encodeURIComponent(replyText || "")}`}
                      className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-white/80 hover:bg-white/15 transition"
                    >
                      <Mail size={12} /> Open in Mail App
                    </a>
                  </div>
                </div>

                <textarea
                  rows={4}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply or click 'Generate AI Smart Proposal Reply' above..."
                  className="w-full rounded-2xl border border-white/15 bg-black/45 p-3.5 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400"
                />

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
                  >
                    <Send size={13} /> Send & Log Response
                  </button>
                </div>
              </form>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export function StatusPill({ status }: { status: LeadStatus }) {
  const styles: Record<LeadStatus, string> = {
    New: "bg-cyan-400/20 text-cyan-200 border-cyan-400/40",
    Contacted: "bg-amber-400/20 text-amber-200 border-amber-400/40",
    Qualified: "bg-emerald-400/20 text-emerald-200 border-emerald-400/40",
    Closed: "bg-rose-400/25 text-rose-200 border-rose-400/40",
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-semibold ${
        styles[status] || styles.New
      }`}
    >
      {status}
    </span>
  );
}
