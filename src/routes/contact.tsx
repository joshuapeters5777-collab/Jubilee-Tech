import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CurrencySwitcher } from "@/components/site/CurrencySwitcher";
import { useCurrency } from "@/lib/currency";
import {
  Mail,
  MessageSquare,
  Send,
  Instagram,
  CheckCircle2,
  Bot,
  ShieldCheck,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { addInboundLead, type BusinessLead } from "@/lib/business-store";
import { db, isFirebaseConfigured } from "@/firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Commission a Build — Jubilee Tech" },
      {
        name: "description",
        content:
          "Start your website, 3D animation, or lead engine build with Jubilee Tech in South Africa or globally.",
      },
    ],
  }),
});

function ContactPage() {
  const { formatZar } = useCurrency();
  const [createdLead, setCreatedLead] = useState<BusinessLead | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const essentialFormatted = `${formatZar(12500)} (Essential)`;
  const extraFormatted = `${formatZar(24500)} (Extra Growth)`;
  const premiumFormatted = `${formatZar(45000)}+ (Premium OS)`;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const company = String(formData.get("company") || "");
    const service = String(formData.get("service") || "Website & Growth System");
    const budget = String(formData.get("budget") || extraFormatted);
    const message = String(formData.get("message") || "");

    const lead = addInboundLead({
      name,
      email,
      phone,
      company,
      service,
      budget,
      message,
      source: "Public Contact Page",
    });

    if (db && isFirebaseConfigured) {
      try {
        await addDoc(collection(db, "leads"), {
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          business: lead.company,
          service: lead.service,
          chosenPlan: lead.budget,
          message: lead.notes,
          priority: "High",
          createdAt: serverTimestamp(),
        });
      } catch {
        // Local store already persisted the lead
      }
    }

    setCreatedLead(lead);
    setSubmitting(false);
  };

  const autoReplyMessage = createdLead?.messages.find((m) => m.sender === "ai-auto");

  return (
    <PageShell>
      <section className="relative isolate">
        <div className="jt-aurora opacity-40" />
        <div className="relative mx-auto max-w-6xl px-6 pt-20 pb-24">
          <div className="grid lg:grid-cols-[1.05fr_1.15fr] gap-12 items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300">
                DIRECT INQUIRY // 24/7 AUTO-RESPONSE
              </span>
              <h1 className="mt-6 text-4xl md:text-6xl font-display font-semibold jt-text-gradient leading-tight">
                Let's architect your next growth leap.
              </h1>
              <p className="mt-5 text-white/65 text-base md:text-lg max-w-md leading-relaxed">
                Submit your project parameters. Our autonomous client concierge will
                generate an immediate scope response and log your brief directly into
                Joshua's executive pipeline.
              </p>

              <div className="mt-6">
                <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/45 mb-2">
                  Select Preferred Quote Currency
                </span>
                <CurrencySwitcher />
              </div>

              <div className="mt-8 space-y-4">
                <ContactRow
                  icon={<MapPin size={18} />}
                  label="Studio Base"
                  value="South Africa (Serving SA, UK, EU & US)"
                />
                <ContactRow
                  icon={<Mail size={18} />}
                  label="Executive Desk"
                  value="jubileetech31@gmail.com"
                  href="mailto:jubileetech31@gmail.com"
                />
                <ContactRow
                  icon={<Instagram size={18} />}
                  label="Instagram"
                  value="@jubileetech"
                  href="https://instagram.com"
                />
                <ContactRow
                  icon={<MessageSquare size={18} />}
                  label="Autonomous Concierge"
                  value="Instant AI Proposal + 24h Founder Review"
                />
              </div>
            </div>

            <div className="rounded-3xl jt-chrome-shell p-8 md:p-10">
              {createdLead ? (
                <div className="space-y-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 grid place-items-center text-emerald-300">
                      <CheckCircle2 size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-display font-semibold text-white">
                        Project Brief Logged
                      </h3>
                      <p className="text-xs text-white/60">
                        Reference ID: {createdLead.id} · Dispatched to Executive CRM
                      </p>
                    </div>
                  </div>

                  {autoReplyMessage && (
                    <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-sky-300">
                          <Bot size={14} /> Instant Autonomous Response
                        </span>
                        <span className="text-[11px] text-emerald-300">Sent Just Now</span>
                      </div>
                      <p className="whitespace-pre-line text-xs md:text-sm text-white/90 leading-relaxed">
                        {autoReplyMessage.body}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setCreatedLead(null)}
                    className="w-full rounded-full border border-white/20 bg-white/5 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-display font-semibold text-white">
                      Project Brief
                    </h2>
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-300">
                      <ShieldCheck size={14} /> Encrypted
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Your Name" name="name" placeholder="Thabo Mokoena" />
                    <Field
                      label="Work Email"
                      name="email"
                      type="email"
                      placeholder="name@company.co.za"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <Field
                      label="Phone / WhatsApp"
                      name="phone"
                      required={false}
                      placeholder="+27 82 000 0000"
                    />
                    <Field
                      label="Company / Brand"
                      name="company"
                      required={false}
                      placeholder="Your Company Name"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <label className="block">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mb-2">
                        Primary Capability
                      </span>
                      <select
                        name="service"
                        className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
                      >
                        <option value="Conversion Website & Funnel">
                          Conversion Website & Funnel
                        </option>
                        <option value="3D Interactive Web Showcase">
                          3D Interactive Web Showcase
                        </option>
                        <option value="E-Commerce Flagship Build">
                          E-Commerce Flagship Build
                        </option>
                        <option value="Enterprise Portal / Inventory System">
                          Enterprise Portal / Inventory System
                        </option>
                      </select>
                    </label>

                    <label className="block">
                      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mb-2">
                        Target Investment
                      </span>
                      <select
                        name="budget"
                        defaultValue={extraFormatted}
                        className="w-full rounded-xl bg-slate-950/80 border border-white/15 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
                      >
                        <option value={essentialFormatted}>{essentialFormatted}</option>
                        <option value={extraFormatted}>{extraFormatted}</option>
                        <option value={premiumFormatted}>{premiumFormatted}</option>
                      </select>
                    </label>
                  </div>

                  <div className="mt-4">
                    <Field
                      label="Project Goals & Timeline"
                      name="message"
                      textarea
                      placeholder="Tell us about your company, target launch date, and key requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mt-6 w-full inline-flex justify-center items-center gap-2 rounded-full px-6 py-4 text-sm font-semibold text-slate-950 bg-white hover:bg-sky-100 transition shadow-[0_14px_40px_-10px_rgba(255,255,255,0.45)]"
                  >
                    {submitting ? "Dispatching..." : "Submit Brief & Get Instant Proposal"}
                    <Send size={14} />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-2xl jt-chrome-card px-5 py-4">
      <div className="h-10 w-10 rounded-xl bg-white/10 border border-white/15 grid place-items-center text-sky-300">
        {icon}
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">
          {label}
        </div>
        <div className="text-sm font-medium text-white">{value}</div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block hover:opacity-90 transition">
      {inner}
    </a>
  ) : (
    inner
  );
}

function Field({
  label,
  name,
  type = "text",
  textarea = false,
  required = true,
  placeholder = "",
}: {
  label: string;
  name: string;
  type?: string;
  textarea?: boolean;
  required?: boolean;
  placeholder?: string;
}) {
  const cls =
    "w-full rounded-xl bg-black/40 border border-white/15 px-4 py-3 text-sm text-white placeholder:text-white/30 outline-none focus:border-sky-400 transition";
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-white/55 mb-2">
        {label}
      </span>
      {textarea ? (
        <textarea
          name={name}
          required={required}
          rows={4}
          placeholder={placeholder}
          className={cls}
        />
      ) : (
        <input
          type={type}
          name={name}
          required={required}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </label>
  );
}
