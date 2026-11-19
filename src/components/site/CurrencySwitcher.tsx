import React from "react";
import { CURRENCIES, type CurrencyCode, useCurrency } from "@/lib/currency";

export function CurrencySwitcher({ compact = false }: { compact?: boolean }) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/[0.04] p-1 backdrop-blur-xl"
      title="Switch Currency (South African Rand, US Dollar, British Pound, Euro)"
    >
      {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => {
        const item = CURRENCIES[code];
        const active = currency === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            className={`rounded-full px-2.5 py-1 text-[11px] font-mono font-semibold transition-all ${
              active
                ? "bg-white text-slate-950 shadow-sm"
                : "text-white/65 hover:text-white hover:bg-white/10"
            }`}
          >
            {compact ? `${item.flag} ${item.code}` : `${item.flag} ${item.symbol} ${item.code}`}
          </button>
        );
      })}
    </div>
  );
}
