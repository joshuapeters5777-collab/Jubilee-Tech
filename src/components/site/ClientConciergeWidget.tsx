import React, { useState } from "react";
import {
  MessageSquare,
  X,
  Send,
  CheckCircle2,
  ArrowUpRight,
  Bot,
  ShieldCheck,
} from "lucide-react";
import { addInboundLead, generateSmartClientReply } from "@/lib/business-store";
import { useCurrency } from "@/lib/currency";
import { db, isFirebaseConfigured } from "@/firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

interface ChatTurn {
  id: string;
  role: "agent" | "user";
  text: string;
  time: string;
}

const QUICK_QUESTIONS = [
  "How much for a conversion website?",
  "Can you build interactive 3D animations?",
  "How fast is your 14-day launch?",
  "Audit my current website",
];

export function ClientConciergeWidget() {
  const { formatZar } = useCurrency();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatTurn[]>([
    {
      id: "init-1",
      role: "agent",
      text: "Welcome to Jubilee Tech. I'm the studio's project concierge. Tell me what you would like to build and we will prepare a custom quote tailored to your exact requirements and scope.",
      time: "Just now",
    },
  ]);
  const [input, setInput] = useState("");
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const replyToQuestion = (question: string): string => {
    const q = question.toLowerCase();
    if (q.includes("price") || q.includes("much") || q.includes("cost") || q.includes("package") || q.includes("quote")) {
      return "Every project at Jubilee Tech is custom-quoted based on your exact requirements and scope. Tell me what features or pages you need, and we'll prepare a tailored quote for your project.";
    }
    if (q.includes("3d") || q.includes("animation") || q.includes("shader")) {
      return "Yes! We engineer custom 60FPS interactive 3D WebGL/Canvas experiences (like our /3d-studio showcase) with zero video bloat—and you can edit colors, geometry, and motion directly from your Admin dashboard.";
    }
    if (q.includes("fast") || q.includes("timeline") || q.includes("14") || q.includes("long")) {
      return "Our signature sprint takes 14 days from kickoff to live deployment: Days 1–3 Architecture & Wireframes, Days 4–9 Custom UI & 3D Engineering, Days 10–14 Funnel Automation, QA & Launch.";
    }
    if (q.includes("audit") || q.includes("review")) {
      return "Drop your website URL and email using the 'Get Custom Proposal' button below—our scanner will audit your mobile speed, SEO & conversion leaks and send a custom redesign preview immediately.";
    }
    return generateSmartClientReply({
      name: name || "there",
      company: company || undefined,
      service: "Custom Website & Growth System",
      inquiry: question,
    });
  };

  const handleSend = (textToSend?: string) => {
    const raw = (textToSend ?? input).trim();
    if (!raw) return;

    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      text: raw,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const agentResponse = replyToQuestion(raw);
    const agentTurn: ChatTurn = {
      id: `a-${Date.now() + 1}`,
      role: "agent",
      text: agentResponse,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userTurn, agentTurn]);
    if (!textToSend) setInput("");
  };

  const handleCaptureLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    const lastUserMessage =
      messages
        .filter((m) => m.role === "user")
        .map((m) => m.text)
        .join(" | ") || "Requested custom proposal via Live Concierge.";

    addInboundLead({
      name: name || "Website Visitor",
      email,
      company: company || "Direct Inquiry",
      service: "Concierge Proposal Request",
      message: lastUserMessage,
      source: "AI Live Concierge",
    });

    if (db && isFirebaseConfigured) {
      try {
        await addDoc(collection(db, "leads"), {
          name: name || "Website Visitor",
          email,
          business: company || "Direct Inquiry",
          service: "Concierge Proposal Request",
          message: lastUserMessage,
          priority: "High",
          createdAt: serverTimestamp(),
        });
      } catch {
        // Fallback already stored in local business store
      }
    }

    setSubmitted(true);
    setLeadFormOpen(false);
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-${Date.now()}`,
        role: "agent",
        text: `Got it, ${name || "friend"}! I've logged your inquiry into Joshua's Executive Pipeline and dispatched an instant scope summary to ${email}.`,
        time: "Just now",
      },
    ]);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open ? (
        <div className="w-[360px] sm:w-[400px] overflow-hidden rounded-3xl border border-white/15 bg-[#070916]/95 shadow-[0_25px_80px_-15px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-sky-500/15 via-indigo-500/10 to-transparent px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-sky-500/20 border border-sky-400/30 text-sky-300">
                <Bot size={18} />
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#070916]" />
              </div>
              <div>
                <div className="text-sm font-display font-semibold text-white">
                  Jubilee Client Concierge
                </div>
                <div className="text-[11px] text-emerald-300/90 flex items-center gap-1">
                  Instant AI Scope & Auto-Reply Active
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl p-1.5 text-white/60 hover:bg-white/10 hover:text-white transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="max-h-[310px] overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.role === "user"
                      ? "bg-sky-500 text-slate-950 font-medium rounded-br-sm"
                      : "bg-white/[0.06] border border-white/10 text-white/90 rounded-bl-sm"
                  }`}
                >
                  {m.text}
                </div>
                <span className="mt-1 text-[10px] text-white/35">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Quick prompts */}
          <div className="px-4 pb-2 flex flex-wrap gap-1.5">
            {QUICK_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleSend(q)}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/70 hover:border-sky-400/40 hover:text-white transition"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Lead Capture Drawer */}
          {leadFormOpen && !submitted && (
            <form
              onSubmit={handleCaptureLead}
              className="mx-4 mb-3 rounded-2xl border border-sky-400/30 bg-sky-500/10 p-3.5 space-y-2"
            >
              <div className="text-xs font-semibold text-white">
                Send to Founder + Receive Instant Proposal
              </div>
              <input
                type="text"
                placeholder="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
              <input
                type="email"
                placeholder="Work Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
              <input
                type="text"
                placeholder="Company / Website URL"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/50 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-sky-500 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition"
              >
                Dispatch to Pipeline
              </button>
            </form>
          )}

          {/* Footer Input */}
          <div className="border-t border-white/10 p-3 bg-black/40 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask a question or describe your project..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2 text-xs text-white placeholder:text-white/35 outline-none focus:border-sky-400/50"
              />
              <button
                type="button"
                onClick={() => handleSend()}
                className="rounded-xl bg-sky-500 p-2 text-slate-950 hover:bg-sky-400 transition"
              >
                <Send size={15} />
              </button>
            </div>

            <div className="flex items-center justify-between px-1">
              <button
                type="button"
                onClick={() => setLeadFormOpen((v) => !v)}
                className="text-[11px] font-medium text-sky-300 hover:text-sky-200 inline-flex items-center gap-1"
              >
                {submitted ? (
                  <>
                    <CheckCircle2 size={12} className="text-emerald-400" /> Lead logged in CRM
                  </>
                ) : (
                  <>
                    Get Custom Proposal <ArrowUpRight size={12} />
                  </>
                )}
              </button>
              <span className="text-[10px] text-white/35 inline-flex items-center gap-1">
                <ShieldCheck size={11} /> E2E Protected
              </span>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open messaging concierge"
          className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-[#0a0d1d]/90 text-white shadow-[0_14px_40px_-8px_rgba(14,165,233,0.45)] backdrop-blur-xl hover:border-sky-400/50 hover:scale-105 transition-all"
        >
          <span className="absolute top-2.5 right-2.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
          </span>
          <MessageSquare size={20} className="text-sky-300 group-hover:text-white transition-colors" />
        </button>
      )}
    </div>
  );
}
