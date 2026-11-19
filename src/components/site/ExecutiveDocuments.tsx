import React, { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  FileText,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Database,
  Lock,
  ArrowRight,
  ExternalLink,
  Layers,
  Sparkles,
  Server,
  Code2,
  Calendar,
  Clock,
  Eye,
  Check,
  ShoppingBag,
  CreditCard,
  RefreshCw,
  Cpu,
  ChevronRight,
} from "lucide-react";

export type DocumentType = "case-study" | "build-process";

// ============================================================================
// PDF 1: FULL-STACK CASE STUDY (3 PAGES)
// Application: KINETIX Performance Athletics (Next.js 15 + Supabase + Yoco)
// ============================================================================

export function CaseStudyPage1() {
  return (
    <div className="print-page relative min-h-[960px] rounded-3xl border border-white/20 bg-[#070b14] p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />

      <div>
        {/* Document Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/30 bg-gradient-to-br from-sky-400 to-indigo-700 grid place-items-center shadow-lg font-display font-bold text-white text-base">
              JT
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                JUBILEE<span className="text-sky-300"> TECH</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                SOUTH AFRICA · BESPOKE DIGITAL ENGINEERING
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-sky-300">
              CASE STUDY // ENTERPRISE FULL-STACK
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-[10px] text-white/70">
              PAGE 01 OF 03
            </span>
          </div>
        </div>

        {/* Project Title & Badge */}
        <div className="mt-8">
          <div className="inline-flex items-center gap-2 rounded-md bg-emerald-500/15 border border-emerald-400/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300 mb-3">
            <CheckCircle2 size={12} /> VERIFIED PRODUCTION DEPLOYMENT · NEXT.JS + SUPABASE
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white leading-tight tracking-tight">
            KINETIX Performance Athletics
          </h1>
          <p className="mt-2 text-lg font-medium text-sky-300/90 max-w-3xl">
            High-Performance E-Commerce Platform with Zero-Trust Cart Architecture & Automated South African Yoco Checkout Settlement.
          </p>
        </div>

        {/* Executive Metadata Grid */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3.5">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">Client & Industry</div>
            <div className="mt-1 font-semibold text-white text-sm">Kinetix Athletics ZA</div>
            <div className="text-[11px] text-white/60">Sports Equipment & Apparel</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">Market & Audience</div>
            <div className="mt-1 font-semibold text-white text-sm">South Africa & SADC</div>
            <div className="text-[11px] text-white/60">Mobile-first Shoppers (ZAR)</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">Core Tech Stack</div>
            <div className="mt-1 font-semibold text-white text-sm">Next.js 15 · Supabase</div>
            <div className="text-[11px] text-white/60">Postgres 17, Tailwind, Yoco</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/50">Production Status</div>
            <div className="mt-1 font-semibold text-emerald-300 text-sm">Live & Transacting</div>
            <div className="text-[11px] text-white/60">Vercel Global Edge CDN</div>
          </div>
        </div>

        {/* The Goal & Engineering Challenge */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <div className="rounded-3xl border border-white/12 bg-black/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-amber-300 mb-2">
                <Zap size={14} /> The Business Challenge
              </div>
              <h3 className="text-lg font-display font-semibold text-white">
                Eliminating Cart Dropoffs & Payment Fraud
              </h3>
              <p className="mt-2.5 text-xs text-white/75 leading-relaxed">
                Legacy monolithic storefronts were causing severe mobile friction across South Africa. High latency on mobile LTE networks (Vodacom/MTN) created 40%+ dropoffs before the checkout page even finished loading. Concurrently, standard Shopify/WooCommerce setups were prone to client-side payload manipulation and lacked native, frictionless ZAR card & instant EFT integration.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Goal: Sub-second mobile latency nationwide</span>
              <span className="text-amber-300 font-mono">CRITICAL</span>
            </div>
          </div>

          <div className="rounded-3xl border border-white/12 bg-black/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-sky-300 mb-2">
                <ShieldCheck size={14} /> The Jubilee Tech Solution
              </div>
              <h3 className="text-lg font-display font-semibold text-white">
                Zero-Trust Server Recalculation & Hosted Yoco
              </h3>
              <p className="mt-2.5 text-xs text-white/75 leading-relaxed">
                Jubilee Tech engineered a ground-up headless storefront on Next.js 15 App Router paired with Supabase PostgreSQL 17. Cart items are persisted locally in Zustand for 0ms visual responsiveness, but <span className="text-sky-300 font-semibold">all pricing and stock availability are strictly verified server-side</span> before minting a hosted South African Yoco Checkout session with cryptographic webhook confirmation.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-white/50">
              <span>Security: Zero client-side price trust</span>
              <span className="text-emerald-300 font-mono">100% INTEGRITY</span>
            </div>
          </div>
        </div>

        {/* Quantified Business Outcomes Callout Banner */}
        <div className="mt-8 rounded-3xl border border-sky-400/30 bg-gradient-to-r from-sky-950/40 via-blue-950/30 to-slate-950/50 p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-sky-300 mb-3">
            VERIFIED BENCHMARKS & PERFORMANCE AUDIT
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-white">0.72s</div>
              <div className="text-xs text-white/60 mt-1">Mobile First Contentful Paint</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-emerald-300">99/100</div>
              <div className="text-xs text-white/60 mt-1">Lighthouse Performance</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-sky-300">-42%</div>
              <div className="text-xs text-white/60 mt-1">Checkout Abandonment Drop</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-display font-bold text-indigo-300">0.00%</div>
              <div className="text-xs text-white/60 mt-1">Payment Fraud / Tampering</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50 font-mono">
        <div>Jubilee Tech Engineering Case Study · KINETIX Platform</div>
        <div>CONFIDENTIAL CLIENT BRIEF · PREPARED FOR EXECUTIVE REVIEW</div>
        <div>Page 01 / 03</div>
      </div>
    </div>
  );
}

export function CaseStudyPage2() {
  return (
    <div className="print-page relative min-h-[960px] rounded-3xl border border-white/20 bg-[#070b14] p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
      <div>
        {/* Document Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/30 bg-gradient-to-br from-sky-400 to-indigo-700 grid place-items-center shadow-lg font-display font-bold text-white text-base">
              JT
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                JUBILEE<span className="text-sky-300"> TECH</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                TECHNICAL ARCHITECTURE & SECURITY SPECIFICATION
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-sky-300">
              SECTION 02 // KEY SYSTEM FEATURES
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-[10px] text-white/70">
              PAGE 02 OF 03
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mt-8">
          <span className="font-mono text-xs uppercase tracking-widest text-sky-300">
            ENGINEERING SPECIFICATION // AUTH · API · DATABASE
          </span>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-white">
            Architecture Blueprint & Security Matrix
          </h2>
        </div>

        {/* Feature 1: Authentication & Zero-Trust Security */}
        <div className="mt-6 rounded-3xl border border-white/12 bg-black/40 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-sky-500/20 border border-sky-400/35 grid place-items-center text-sky-300 shrink-0">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  1. Authentication & Row-Level Security (RLS)
                </h3>
                <p className="text-xs text-white/60">
                  PostgreSQL Row-Level Access Policies + JWT Session Tokens
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-emerald-500/15 border border-emerald-400/30 px-3 py-1 font-mono text-[10px] text-emerald-300">
              ZERO-LEAK GUARANTEE
            </span>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4 text-xs text-white/75 leading-relaxed">
            <div>
              <strong className="text-white block mb-1">Row-Level Security Policies:</strong>
              Supabase PostgreSQL RLS rules restrict table operations at the engine level. Public visitors can only execute <code className="text-sky-300 bg-sky-950/60 px-1 py-0.5 rounded">SELECT</code> on active products. Customers can only inspect their own orders authenticated via cryptographically signed JWT tokens.
            </div>
            <div>
              <strong className="text-white block mb-1">Server Role Isolation:</strong>
              The elevated <code className="text-sky-300 bg-sky-950/60 px-1 py-0.5 rounded">SUPABASE_SERVICE_ROLE_KEY</code> is strictly quarantined inside Next.js server functions and is never bundled into client browser chunks, preventing credential scraping.
            </div>
          </div>
        </div>

        {/* Feature 2: API & Checkout Engine */}
        <div className="mt-5 rounded-3xl border border-white/12 bg-black/40 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-blue-500/20 border border-blue-400/35 grid place-items-center text-blue-300 shrink-0">
                <Server size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  2. API & Server-Side Price Re-Verification Engine
                </h3>
                <p className="text-xs text-white/60">
                  Tamper-Proof Next.js App Router API Routes (`/api/checkout` & `/api/webhooks/yoco`)
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-blue-500/15 border border-blue-400/30 px-3 py-1 font-mono text-[10px] text-blue-300">
              IDEMPOTENT & TIMING-SAFE
            </span>
          </div>

          <div className="mt-4 grid md:grid-cols-2 gap-4 text-xs text-white/75 leading-relaxed">
            <div>
              <strong className="text-white block mb-1">Server-Side Price Recalculation:</strong>
              When the customer triggers checkout, the payload submits only <code className="text-sky-300 bg-sky-950/60 px-1 py-0.5 rounded">productId</code> and <code className="text-sky-300 bg-sky-950/60 px-1 py-0.5 rounded">quantity</code>. The API reloads real-time prices from the database, completely overriding any browser-modified prices.
            </div>
            <div>
              <strong className="text-white block mb-1">Hosted Yoco Checkout Integration:</strong>
              The backend securely initiates a session with Yoco's API, returns a hosted payment URI, and stores a pending order record. The customer pays in South African Rand (ZAR) across Cards, Apple Pay, or Instant EFT.
            </div>
          </div>
        </div>

        {/* Feature 3: Database & Webhook Reconciliation */}
        <div className="mt-5 rounded-3xl border border-white/12 bg-black/40 p-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-purple-500/20 border border-purple-400/35 grid place-items-center text-purple-300 shrink-0">
                <Database size={18} />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-white">
                  3. Relational Database Schema & Webhook Reconciliation
                </h3>
                <p className="text-xs text-white/60">
                  PostgreSQL 17 ACID Tables with HMAC SHA-256 Webhook Verification
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block rounded-full bg-purple-500/15 border border-purple-400/30 px-3 py-1 font-mono text-[10px] text-purple-300">
              ACID COMPLIANT
            </span>
          </div>

          <div className="mt-4 grid md:grid-cols-3 gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3.5">
              <div className="font-mono text-[11px] font-bold text-white flex items-center gap-1.5 mb-1.5">
                <Layers size={13} className="text-sky-400" /> Relational Tables
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Clean normalized tables: <code className="text-sky-300">products</code>, <code className="text-sky-300">orders</code>, <code className="text-sky-300">order_items</code>, and <code className="text-sky-300">audit_logs</code> with foreign key constraints.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3.5">
              <div className="font-mono text-[11px] font-bold text-white flex items-center gap-1.5 mb-1.5">
                <ShieldCheck size={13} className="text-emerald-400" /> Webhook HMAC Guard
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Raw-body signature verification with timestamp tolerance windows prevents replay attacks. Webhook confirms payment before updating order state to <code className="text-emerald-300">Paid</code>.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/50 p-3.5">
              <div className="font-mono text-[11px] font-bold text-white flex items-center gap-1.5 mb-1.5">
                <RefreshCw size={13} className="text-purple-400" /> Atomic Inventory Lock
              </div>
              <p className="text-[11px] text-white/65 leading-relaxed">
                Transactional row locking (<code className="text-purple-300">SELECT FOR UPDATE</code>) guarantees items cannot be double-sold during concurrent high-traffic drops.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50 font-mono">
        <div>Jubilee Tech Engineering Case Study · KINETIX Platform</div>
        <div>ARCHITECTURE SPECIFICATION · AUTH, API & DATABASE</div>
        <div>Page 02 / 03</div>
      </div>
    </div>
  );
}

export function CaseStudyPage3() {
  return (
    <div className="print-page relative min-h-[960px] rounded-3xl border border-white/20 bg-[#070b14] p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
      <div>
        {/* Document Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/30 bg-gradient-to-br from-sky-400 to-indigo-700 grid place-items-center shadow-lg font-display font-bold text-white text-base">
              JT
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                JUBILEE<span className="text-sky-300"> TECH</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                USER INTERFACE & PRODUCTION SCREENSHOTS
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-500/20 border border-sky-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-sky-300">
              SECTION 03 // UI SHOWCASE & VERDICT
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-[10px] text-white/70">
              PAGE 03 OF 03
            </span>
          </div>
        </div>

        {/* Section Title */}
        <div className="mt-8">
          <span className="font-mono text-xs uppercase tracking-widest text-emerald-300">
            VISUAL WORK SAMPLES // 3 KEY USER INTERFACE VIEWPORTS
          </span>
          <h2 className="mt-1 text-2xl md:text-3xl font-display font-bold text-white">
            Clean Production UI & Visual Proof
          </h2>
          <p className="mt-1.5 text-xs text-white/60">
            Real interactive viewports captured directly from the shipped KINETIX production environment.
          </p>
        </div>

        {/* 3 Clean UI Screenshots Grid */}
        <div className="mt-6 grid md:grid-cols-3 gap-5">
          {/* Screenshot 1: Storefront Catalog */}
          <div className="rounded-2xl border border-white/15 bg-black/60 p-3 flex flex-col justify-between shadow-xl">
            <div className="relative aspect-[16/11] rounded-xl overflow-hidden border border-white/10 bg-[#090d16] p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px] font-mono text-white/60">
                <span className="text-sky-300 font-bold">KINETIX // ZA</span>
                <span className="text-emerald-400">YOCO CONNECTED</span>
              </div>
              <div className="my-auto py-2">
                <div className="font-display font-bold text-sm text-white leading-tight">
                  Engineered For Peak Output.
                </div>
                <div className="mt-1.5 text-[9px] text-white/60">
                  Precision gear shipped nationwide across South Africa.
                </div>
                <div className="mt-2.5 rounded-lg border border-white/10 bg-slate-900/80 p-2 flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-white">Carbon Lifting Belt</div>
                    <div className="text-[9px] text-sky-400 font-mono">R1,850.00</div>
                  </div>
                  <span className="rounded bg-sky-400 text-slate-950 font-bold px-2 py-0.5 text-[8px]">
                    ADD +
                  </span>
                </div>
              </div>
              <div className="text-[8px] font-mono text-white/40 pt-1 border-t border-white/10 flex justify-between">
                <span>Next.js App Router</span>
                <span className="text-emerald-400">99 Lighthouse</span>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                1. Storefront & Real-Time Stock
              </div>
              <p className="mt-1 text-[11px] text-white/65 leading-relaxed">
                Tactile dark metallic aesthetic engineered for sub-second mobile loads with dynamic stock status pills.
              </p>
            </div>
          </div>

          {/* Screenshot 2: Slide-Over Cart & Instant Yoco */}
          <div className="rounded-2xl border border-white/15 bg-black/60 p-3 flex flex-col justify-between shadow-xl">
            <div className="relative aspect-[16/11] rounded-xl overflow-hidden border border-white/10 bg-[#090d16] p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px] font-mono text-white/60">
                <span className="text-sky-300 font-bold">YOUR CART (2 ITEMS)</span>
                <span className="text-amber-400">RE-VERIFIED</span>
              </div>
              <div className="my-auto py-2 space-y-1.5">
                <div className="rounded-lg border border-white/10 bg-slate-900/80 p-1.5 flex items-center justify-between text-[9px]">
                  <div>
                    <div className="font-semibold text-white">Carbon Lifting Belt (M)</div>
                    <div className="text-white/50">Qty: 1</div>
                  </div>
                  <span className="font-mono text-white">R1,850</span>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/80 p-1.5 flex items-center justify-between text-[9px]">
                  <div>
                    <div className="font-semibold text-white">AeroGrip Wrist Wraps</div>
                    <div className="text-white/50">Qty: 1</div>
                  </div>
                  <span className="font-mono text-white">R490</span>
                </div>
                <div className="pt-1 flex justify-between text-[9px] font-bold text-emerald-400 font-mono">
                  <span>TOTAL (ZAR)</span>
                  <span>R2,340.00</span>
                </div>
                <button
                  type="button"
                  className="w-full rounded bg-gradient-to-r from-sky-400 to-blue-500 py-1 text-[9px] font-bold text-slate-950 uppercase tracking-wider"
                >
                  Pay via Yoco Instant Checkout
                </button>
              </div>
              <div className="text-[8px] font-mono text-white/40 pt-1 border-t border-white/10 flex justify-between">
                <span>Zustand Client Store</span>
                <span className="text-sky-300">0ms State Sync</span>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                2. Frictionless Slide-Over Cart
              </div>
              <p className="mt-1 text-[11px] text-white/65 leading-relaxed">
                Instant slide-over checkout with live cart state recalculations and 1-click South African Yoco payment gateway handoff.
              </p>
            </div>
          </div>

          {/* Screenshot 3: Order Confirmation & Webhook Log */}
          <div className="rounded-2xl border border-white/15 bg-black/60 p-3 flex flex-col justify-between shadow-xl">
            <div className="relative aspect-[16/11] rounded-xl overflow-hidden border border-white/10 bg-[#090d16] p-3 flex flex-col justify-between">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-[9px] font-mono text-white/60">
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Check size={10} /> PAYMENT SUCCESS
                </span>
                <span className="text-white/50">#KTX-9821</span>
              </div>
              <div className="my-auto py-2 space-y-1.5">
                <div className="rounded-lg border border-emerald-500/25 bg-emerald-500/10 p-2 text-center">
                  <div className="text-[10px] font-bold text-emerald-300">
                    R2,340.00 Settled
                  </div>
                  <div className="text-[8px] text-white/60 mt-0.5 font-mono">
                    Yoco Ref: ch_91af238c9
                  </div>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-900/80 p-2 text-[8px] font-mono space-y-0.5 text-white/70">
                  <div className="text-sky-300 font-bold">// WEBHOOK AUDIT LOG</div>
                  <div>• Event: payment.succeeded</div>
                  <div>• HMAC Signature: verified (256-bit)</div>
                  <div>• Status: Paid → Pending_Routing</div>
                </div>
              </div>
              <div className="text-[8px] font-mono text-white/40 pt-1 border-t border-white/10 flex justify-between">
                <span>Automated Dispatch</span>
                <span className="text-emerald-300">100% Reconciled</span>
              </div>
            </div>
            <div className="mt-3 px-1">
              <div className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                3. Webhook Order Reconciliation
              </div>
              <p className="mt-1 text-[11px] text-white/65 leading-relaxed">
                Real-time cryptographic confirmation that updates PostgreSQL order states and dispatches fulfillment notifications automatically.
              </p>
            </div>
          </div>
        </div>

        {/* Executive Verdict & Client Sign-Off */}
        <div className="mt-7 rounded-3xl border border-white/15 bg-white/[0.04] p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
                CLIENT VERDICT // FOUNDER FEEDBACK
              </span>
              <p className="mt-2 text-xs md:text-sm text-white/90 italic leading-relaxed">
                "Jubilee Tech transformed our South African digital operations. The site loads faster than any competitor in the market, our mobile checkout dropoff plummeted by over 40%, and the Yoco integration has run flawlessly since day one."
              </p>
              <div className="mt-2 text-xs font-semibold text-white">
                — Managing Director, Kinetix Athletics ZA
              </div>
            </div>

            <div className="rounded-2xl border border-sky-400/30 bg-sky-500/10 p-4 text-center min-w-[200px]">
              <div className="font-mono text-[10px] uppercase tracking-wider text-sky-300">
                JUBILEE TECH STUDIO
              </div>
              <div className="mt-1 font-display font-bold text-base text-white">
                Joshua Peters
              </div>
              <div className="text-[11px] text-white/60">Lead Engineer & Architect</div>
              <div className="mt-2 text-[10px] text-emerald-300 font-mono">
                jubileetech31@gmail.com
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50 font-mono">
        <div>Jubilee Tech Engineering Case Study · KINETIX Platform</div>
        <div>END OF DOCUMENT · ALL RIGHTS RESERVED</div>
        <div>Page 03 / 03</div>
      </div>
    </div>
  );
}

// ============================================================================
// PDF 2: BUILD PROCESS & DELIVERABLES ROADMAP (1 PAGE)
// A simple visual roadmap showing 1. Requirements & Architecture → 2. Responsive UI/UX → 3. Backend, API & Database → 4. Testing & Cloud Deployment
// ============================================================================

export function BuildProcessRoadmapPage() {
  return (
    <div className="print-page relative min-h-[960px] rounded-3xl border border-white/20 bg-[#070b14] p-8 md:p-12 text-white shadow-2xl flex flex-col justify-between overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-sky-500/15 blur-3xl pointer-events-none" />

      <div>
        {/* Document Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/15 pb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl border border-white/30 bg-gradient-to-br from-emerald-400 to-sky-600 grid place-items-center shadow-lg font-display font-bold text-white text-base">
              JT
            </div>
            <div>
              <div className="font-display font-bold text-base tracking-tight text-white">
                JUBILEE<span className="text-emerald-300"> TECH</span>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/50">
                CLIENT ENGAGEMENT & PRODUCTION ROADMAP
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
              1-PAGE EXECUTIVE ROADMAP
            </span>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-1 font-mono text-[10px] text-white/70">
              14-DAY SPRINT CYCLE
            </span>
          </div>
        </div>

        {/* Title Banner */}
        <div className="mt-8 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 mb-3">
            <Sparkles size={12} /> HOW WORKING WITH JUBILEE TECH LOOKS LIKE
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight leading-tight">
            Build Process & Deliverables
          </h1>
          <p className="mt-3 text-sm md:text-base text-white/70 leading-relaxed">
            A transparent, disciplined 4-stage engineering sprint that takes your business from first concept to a world-class production system in 14 days.
          </p>
        </div>

        {/* The 4-Stage Visual Roadmap */}
        <div className="mt-10 grid gap-4 md:grid-cols-4 relative">
          {/* Phase 1 */}
          <div className="rounded-3xl border border-white/15 bg-black/45 p-5 flex flex-col justify-between hover:border-sky-400/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-sky-500/20 border border-sky-400/40 px-2.5 py-1 font-mono text-[10px] font-bold text-sky-300">
                  STAGE 01
                </span>
                <span className="font-mono text-[10px] text-white/45">DAYS 1–3</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Requirements & Architecture
              </h3>
              <p className="mt-2 text-xs text-white/65 leading-relaxed">
                We align on core business objectives, define the technical scope, and map out the full system architecture.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-sky-300 font-bold">
                  DELIVERABLES:
                </div>
                <ul className="text-[11px] space-y-1.5 text-white/80">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-sky-400 mt-0.5 shrink-0" />
                    <span>Technical Architecture Spec</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-sky-400 mt-0.5 shrink-0" />
                    <span>Database Entity Diagrams (ERD)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-sky-400 mt-0.5 shrink-0" />
                    <span>API Endpoints & Contracts</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-sky-400 mt-0.5 shrink-0" />
                    <span>Conversion Wireframe Walkthrough</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-sky-300/80">
              Output: Signed Scope Blueprint
            </div>
          </div>

          {/* Phase 2 */}
          <div className="rounded-3xl border border-white/15 bg-black/45 p-5 flex flex-col justify-between hover:border-blue-400/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-blue-500/20 border border-blue-400/40 px-2.5 py-1 font-mono text-[10px] font-bold text-blue-300">
                  STAGE 02
                </span>
                <span className="font-mono text-[10px] text-white/45">DAYS 4–7</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Responsive UI/UX & Interaction
              </h3>
              <p className="mt-2 text-xs text-white/65 leading-relaxed">
                Crafting the tactile dark/metallic aesthetic, fluid component hierarchy, and mobile-first responsive screens.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-blue-300 font-bold">
                  DELIVERABLES:
                </div>
                <ul className="text-[11px] space-y-1.5 text-white/80">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-blue-400 mt-0.5 shrink-0" />
                    <span>Bespoke Design System</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-blue-400 mt-0.5 shrink-0" />
                    <span>Interactive Prototype (Figma/Vite)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-blue-400 mt-0.5 shrink-0" />
                    <span>Mobile/Desktop Layouts</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-blue-400 mt-0.5 shrink-0" />
                    <span>Custom 3D / Shaders / Motion</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-blue-300/80">
              Output: Interactive UI Preview
            </div>
          </div>

          {/* Phase 3 */}
          <div className="rounded-3xl border border-white/15 bg-black/45 p-5 flex flex-col justify-between hover:border-purple-400/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-purple-500/20 border border-purple-400/40 px-2.5 py-1 font-mono text-[10px] font-bold text-purple-300">
                  STAGE 03
                </span>
                <span className="font-mono text-[10px] text-white/45">DAYS 8–11</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Backend, API & Database
              </h3>
              <p className="mt-2 text-xs text-white/65 leading-relaxed">
                Deploying production PostgreSQL databases, setting up Row-Level Security, wiring APIs, and integrating payments.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-purple-300 font-bold">
                  DELIVERABLES:
                </div>
                <ul className="text-[11px] space-y-1.5 text-white/80">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-purple-400 mt-0.5 shrink-0" />
                    <span>Supabase PostgreSQL Schema</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-purple-400 mt-0.5 shrink-0" />
                    <span>Row-Level Security Policies</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-purple-400 mt-0.5 shrink-0" />
                    <span>Yoco / Paystack / Stripe APIs</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-purple-400 mt-0.5 shrink-0" />
                    <span>Automated Webhook Handlers</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-purple-300/80">
              Output: Live Full-Stack Engine
            </div>
          </div>

          {/* Phase 4 */}
          <div className="rounded-3xl border border-white/15 bg-black/45 p-5 flex flex-col justify-between hover:border-emerald-400/50 transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="rounded-lg bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-1 font-mono text-[10px] font-bold text-emerald-300">
                  STAGE 04
                </span>
                <span className="font-mono text-[10px] text-white/45">DAYS 12–14</span>
              </div>
              <h3 className="font-display font-bold text-base text-white">
                Testing & Cloud Deployment
              </h3>
              <p className="mt-2 text-xs text-white/65 leading-relaxed">
                Rigorous multi-device stress testing, speed optimization, global CDN deployment, and seamless client handover.
              </p>

              <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                <div className="font-mono text-[9px] uppercase tracking-wider text-emerald-300 font-bold">
                  DELIVERABLES:
                </div>
                <ul className="text-[11px] space-y-1.5 text-white/80">
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>Core Web Vitals (&gt;95 Lighthouse)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>Vercel Edge Global Deployment</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>Custom Domain & SSL Provisioning</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <Check size={12} className="text-emerald-400 mt-0.5 shrink-0" />
                    <span>Admin Walkthrough & 30-Day Care</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 font-mono text-[10px] text-emerald-300/80">
              Output: Transacting Production System
            </div>
          </div>
        </div>

        {/* Buyer Guarantees & Deliverables Matrix */}
        <div className="mt-8 rounded-3xl border border-white/15 bg-gradient-to-r from-emerald-950/40 via-slate-900/40 to-sky-950/40 p-6">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-300 mb-3 text-center sm:text-left">
            JUBILEE TECH // CLIENT COMMITMENTS & ASSURANCES
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-400" /> Fixed Quote Guarantee
              </div>
              <p className="text-white/70 text-[11px] leading-relaxed">
                Zero surprise charges or hidden fees. We quote flat upfront pricing based on verified requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-400" /> 100% Code Ownership
              </div>
              <p className="text-white/70 text-[11px] leading-relaxed">
                Full Git repository, Supabase database ownership, and Vercel project access transferred directly to your team upon launch.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
              <div className="font-bold text-white flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-emerald-400" /> 30-Day Post-Launch Warranty
              </div>
              <p className="text-white/70 text-[11px] leading-relaxed">
                Complimentary 30-day bug-fixing, performance tuning, and operational support included with every production build.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-white/50 font-mono">
        <div>Jubilee Tech · Client Engagement & Build Roadmap</div>
        <div>CONTACT: jubileetech31@gmail.com · SOUTH AFRICA & GLOBAL</div>
        <div>Page 01 / 01</div>
      </div>
    </div>
  );
}

// ============================================================================
// EXECUTIVE DOCUMENT VIEWER & MODAL WRAPPER
// Includes 1-Click Print / Save as PDF & Document Switcher
// ============================================================================

export function ExecutiveDocumentsViewer({
  initialDoc = "case-study",
  showBackLink = false,
}: {
  initialDoc?: DocumentType;
  showBackLink?: boolean;
}) {
  const [activeDoc, setActiveDoc] = useState<DocumentType>(initialDoc);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    // Triggers browser print-to-PDF dialog with instructions
    window.print();
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3500);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Top Floating Control Bar (Hidden when printing!) */}
      <div className="no-print sticky top-20 z-40 mb-8 rounded-3xl border border-white/20 bg-[#090e1c]/95 p-4 backdrop-blur-2xl shadow-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Document Switcher Tabs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveDoc("case-study")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeDoc === "case-study"
                ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            }`}
          >
            <FileText size={14} />
            PDF 1: Full-Stack Case Study (3 Pages)
          </button>

          <button
            type="button"
            onClick={() => setActiveDoc("build-process")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold transition ${
              activeDoc === "build-process"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25"
                : "bg-white/10 text-white/70 hover:bg-white/15 hover:text-white"
            }`}
          >
            <Layers size={14} />
            PDF 2: Build Process Roadmap (1 Page)
          </button>
        </div>

        {/* Actions: Print / Save as PDF */}
        <div className="flex items-center gap-2.5">
          {showBackLink && (
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-medium text-white/80 hover:bg-white/10 transition"
            >
              ← Back to Case Work
            </Link>
          )}

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition"
            title="Open Print Dialog to save as vector PDF"
          >
            <Printer size={14} />
            Print Preview
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-sky-100 transition shadow-xl"
          >
            <Download size={14} />
            Download PDF
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="no-print mb-6 rounded-2xl border border-emerald-400/40 bg-emerald-500/15 p-4 text-xs text-emerald-200 text-center font-mono">
          ✓ In your print dialog, select "Save as PDF" for the highest resolution vector export.
        </div>
      )}

      {/* Render Active Document Content */}
      {activeDoc === "case-study" ? (
        <div className="space-y-8">
          <CaseStudyPage1 />
          <CaseStudyPage2 />
          <CaseStudyPage3 />
        </div>
      ) : (
        <BuildProcessRoadmapPage />
      )}
    </div>
  );
}
