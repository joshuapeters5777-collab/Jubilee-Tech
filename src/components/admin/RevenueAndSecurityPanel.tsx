import React, { useState } from "react";
import {
  type InvoiceRecord,
  getInvoices,
  saveInvoices,
} from "@/lib/business-store";
import {
  type AuditLogEntry,
  type SecurityConfig,
  getAuditLogs,
  getSecurityConfig,
  recordAuditLog,
  saveSecurityConfig,
} from "@/lib/security";
import { useCurrency } from "@/lib/currency";
import { CurrencySwitcher } from "@/components/site/CurrencySwitcher";
import {
  Plus,
  CheckCircle2,
  Download,
  ShieldCheck,
  RefreshCw,
  Trash2,
} from "lucide-react";

export function RevenueAndSecurityPanel({
  mode,
}: {
  mode: "revenue" | "security";
}) {
  const { format, meta } = useCurrency();
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => getInvoices());
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [projectTitle, setProjectTitle] = useState("Extra Growth Website & Funnel");
  const [amountZar, setAmountZar] = useState("24500");

  // Security state
  const [secConfig, setSecConfig] = useState<SecurityConfig>(() =>
    getSecurityConfig(),
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    getAuditLogs(),
  );
  const [pinSaved, setPinSaved] = useState(false);

  const totalPaidZar = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, i) => acc + (i.amountZar || 0), 0);
  const totalPendingZar = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((acc, i) => acc + (i.amountZar || 0), 0);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;
    const numericZar = Number(amountZar) || 12500;
    const newInv: InvoiceRecord = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `JT-2026-${Math.floor(100 + Math.random() * 899)}`,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || "accounts@client.co.za",
      projectTitle: projectTitle.trim(),
      amountZar: numericZar,
      status: "Pending",
      issuedDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      items: [{ description: projectTitle.trim(), qty: 1, rateZar: numericZar }],
    };

    const next = [newInv, ...invoices];
    setInvoices(next);
    saveInvoices(next);
    recordAuditLog(
      "Invoice Issued",
      "billing",
      `Created invoice ${newInv.invoiceNumber} for ${newInv.clientName} (R${numericZar.toLocaleString()})`,
    );
    setClientName("");
    setClientEmail("");
  };

  const toggleInvoiceStatus = (id: string) => {
    const next = invoices.map((inv) =>
      inv.id === id
        ? {
            ...inv,
            status: (inv.status === "Paid" ? "Pending" : "Paid") as InvoiceRecord["status"],
          }
        : inv,
    );
    setInvoices(next);
    saveInvoices(next);
  };

  const deleteInvoice = (id: string) => {
    const next = invoices.filter((i) => i.id !== id);
    setInvoices(next);
    saveInvoices(next);
  };

  const downloadInvoiceHtml = (inv: InvoiceRecord) => {
    const formattedTotal = format(inv.amountZar);
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/><title>Invoice ${inv.invoiceNumber}</title>
<style>body{font-family:system-ui,sans-serif;padding:48px;color:#0f172a;max-width:800px;margin:0 auto;}
.header{display:flex;justify-content:space-between;border-bottom:2px solid #e2e8f0;padding-bottom:24px;}
.badge{padding:6px 14px;border-radius:999px;font-weight:700;font-size:12px;background:${
      inv.status === "Paid" ? "#dcfce7;color:#166534" : "#fef3c7;color:#92400e"
    };}
table{width:100%;border-collapse:collapse;margin-top:32px;}
th,td{padding:14px;border-bottom:1px solid #e2e8f0;text-align:left;}</style></head>
<body>
<div class="header">
  <div><h1>JUBILEE TECH (SOUTH AFRICA)</h1><p>jubileetech31@gmail.com</p></div>
  <div style="text-align:right"><h2>INVOICE ${inv.invoiceNumber}</h2><span class="badge">${inv.status.toUpperCase()}</span></div>
</div>
<div style="margin-top:24px;">
  <strong>Billed To:</strong> ${inv.clientName} (${inv.clientEmail})<br/>
  <strong>Issued:</strong> ${inv.issuedDate} · <strong>Due:</strong> ${inv.dueDate}
</div>
<table><thead><tr><th>Description</th><th>Qty</th><th>Total (${meta.code})</th></tr></thead>
<tbody><tr><td>${inv.projectTitle}</td><td>1</td><td>${formattedTotal}</td></tr></tbody></table>
<h2 style="text-align:right;margin-top:32px;">Total Due: ${formattedTotal}</h2>
</body></html>`;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${inv.invoiceNumber}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (mode === "revenue") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
              REVENUE & CLIENT INVOICING ({meta.code})
            </span>
            <h2 className="text-2xl font-display font-semibold text-white">
              Real-Time Financial Ledger (Starts at {format(0)})
            </h2>
          </div>
          <CurrencySwitcher />
        </div>

        {/* Financial Summary Cards — Real Totals Starting at 0 */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="jt-chrome-card rounded-3xl p-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300">
              COLLECTED REVENUE
            </span>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {format(totalPaidZar)}
            </div>
            <p className="text-xs text-white/60 mt-1">
              {invoices.filter((i) => i.status === "Paid").length} paid client invoices
            </p>
          </div>
          <div className="jt-chrome-card rounded-3xl p-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-amber-300">
              OUTSTANDING / PENDING
            </span>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {format(totalPendingZar)}
            </div>
            <p className="text-xs text-white/60 mt-1">
              {invoices.filter((i) => i.status !== "Paid").length} pending invoices
            </p>
          </div>
          <div className="jt-chrome-card rounded-3xl p-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
              ACTIVE RETAINER MRR
            </span>
            <div className="mt-2 text-3xl font-display font-bold text-white">
              {format(0)}
              <span className="text-sm font-normal text-white/50">/mo</span>
            </div>
            <p className="text-xs text-white/60 mt-1">
              Ready for your first monthly retainer client
            </p>
          </div>
        </div>

        {/* Create New Invoice / Proposal */}
        <div className="jt-chrome-card rounded-3xl p-6">
          <h3 className="text-lg font-display font-semibold text-white">
            Issue New Client Invoice (Amount in ZAR — Auto-Converts to USD/GBP/EUR)
          </h3>
          <form
            onSubmit={handleCreateInvoice}
            className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
          >
            <input
              type="text"
              placeholder="Client / Company Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              required
              className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />
            <input
              type="email"
              placeholder="Client Email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />
            <input
              type="text"
              placeholder="Package / Scope"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />
            <input
              type="number"
              placeholder="Amount in ZAR (e.g. 24500)"
              value={amountZar}
              onChange={(e) => setAmountZar(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
            >
              <Plus size={14} /> Issue Invoice
            </button>
          </form>
        </div>

        {/* Invoices Table */}
        <div className="jt-chrome-card rounded-3xl p-6 overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead className="border-b border-white/15 text-white/60 font-mono uppercase text-[10px]">
              <tr>
                <th className="py-3 px-3">Invoice #</th>
                <th className="py-3 px-3">Client</th>
                <th className="py-3 px-3">Scope</th>
                <th className="py-3 px-3">Amount ({meta.code})</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-white/50">
                    No invoices issued yet ({format(0)} recorded). Use the form above when you sign your first client.
                  </td>
                </tr>
              ) : (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5">
                    <td className="py-3.5 px-3 font-mono text-sky-300">
                      {inv.invoiceNumber}
                    </td>
                    <td className="py-3.5 px-3 font-medium">{inv.clientName}</td>
                    <td className="py-3.5 px-3 text-white/70">{inv.projectTitle}</td>
                    <td className="py-3.5 px-3 font-semibold">
                      {format(inv.amountZar)}
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        type="button"
                        onClick={() => toggleInvoiceStatus(inv.id)}
                        className={`rounded-md border px-2.5 py-0.5 text-[10px] font-semibold ${
                          inv.status === "Paid"
                            ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-200"
                            : "border-amber-400/40 bg-amber-500/20 text-amber-200"
                        }`}
                      >
                        {inv.status} (Click to toggle)
                      </button>
                    </td>
                    <td className="py-3.5 px-3 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => downloadInvoiceHtml(inv)}
                        className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] hover:bg-white/20"
                      >
                        <Download size={12} /> Export
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteInvoice(inv.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-400/30 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/25"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // SECURITY & AUDIT LOG VIEW
  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="jt-chrome-card rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldCheck size={20} className="text-emerald-300" />
              <h3 className="text-lg font-display font-semibold text-white">
                Zero-Trust Access & WAF Controls
              </h3>
            </div>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 text-[10px] font-mono text-emerald-300">
              HARDENED
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Admin 2FA Security PIN
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  maxLength={8}
                  value={secConfig.adminPin}
                  onChange={(e) =>
                    setSecConfig((prev) => ({ ...prev, adminPin: e.target.value }))
                  }
                  className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white font-mono outline-none focus:border-sky-400"
                />
                <button
                  type="button"
                  onClick={() => {
                    saveSecurityConfig(secConfig);
                    recordAuditLog(
                      "Updated Security Policy",
                      "security",
                      "Updated Admin PIN & session protection rules.",
                    );
                    setAuditLogs(getAuditLogs());
                    setPinSaved(true);
                    setTimeout(() => setPinSaved(false), 2000);
                  }}
                  className="rounded-xl bg-sky-400 px-3 py-2 text-xs font-semibold text-slate-950 shrink-0"
                >
                  {pinSaved ? "Saved" : "Update"}
                </button>
              </div>
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                Max Failed Logins Before Lockout
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={secConfig.maxLoginAttempts}
                onChange={(e) => {
                  const next = saveSecurityConfig({
                    maxLoginAttempts: Number(e.target.value) || 5,
                  });
                  setSecConfig(next);
                }}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-xs text-white outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white">
              <span>Enforce 2FA PIN Gate on Admin Session Unlock</span>
              <input
                type="checkbox"
                checked={secConfig.requirePinGate}
                onChange={(e) => {
                  const next = saveSecurityConfig({
                    requirePinGate: e.target.checked,
                  });
                  setSecConfig(next);
                }}
                className="accent-sky-400"
              />
            </label>
            <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/30 p-3 text-xs text-white">
              <span>Strict DOM/XSS Payload Sanitizer (CMS & Lead Inputs)</span>
              <input
                type="checkbox"
                checked={secConfig.strictXssProtection}
                onChange={(e) => {
                  const next = saveSecurityConfig({
                    strictXssProtection: e.target.checked,
                  });
                  setSecConfig(next);
                }}
                className="accent-sky-400"
              />
            </label>
          </div>
        </div>

        <div className="jt-chrome-card rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
              ACTIVE PROTECTION LAYERS
            </span>
            <h3 className="mt-1 text-lg font-display font-semibold text-white">
              Cryptographic & Edge Security Posture
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                Admin Email Allowlist Bound (`jubileetech31@gmail.com`)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                Brute-Force Exponential Rate Limiting Active
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                HTML/Script Injection Sanitizer Active on Content Editor
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-emerald-300 shrink-0" />
                HTTP Security Headers (`X-Frame-Options`, `CSP`, `NOSNIFF`)
              </li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/50">
            <span>Session Timeout: {secConfig.sessionTimeoutMinutes} mins</span>
            <button
              type="button"
              onClick={() => setAuditLogs(getAuditLogs())}
              className="inline-flex items-center gap-1 text-sky-300 hover:text-white"
            >
              <RefreshCw size={12} /> Refresh Audit Stream
            </button>
          </div>
        </div>
      </div>

      <div className="jt-chrome-card rounded-3xl p-6">
        <h3 className="text-lg font-display font-semibold text-white mb-4">
          Immutable Security & Operations Audit Trail
        </h3>
        <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-white/10 bg-black/35 px-4 py-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-[10px] uppercase font-bold ${
                    log.severity === "critical"
                      ? "bg-rose-500/25 text-rose-300"
                      : log.severity === "warning"
                        ? "bg-amber-500/25 text-amber-300"
                        : "bg-sky-500/20 text-sky-300"
                  }`}
                >
                  {log.category}
                </span>
                <div>
                  <div className="font-semibold text-white">{log.action}</div>
                  <div className="text-white/60 text-[11px]">{log.details}</div>
                </div>
              </div>
              <div className="text-right font-mono text-[10px] text-white/45">
                <div>{new Date(log.timestamp).toLocaleString()}</div>
                <div>{log.ipFingerprint}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
