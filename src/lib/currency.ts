import { useEffect, useState } from "react";

export type CurrencyCode = "ZAR" | "USD" | "GBP" | "EUR";

export interface CurrencyMeta {
  code: CurrencyCode;
  symbol: string;
  label: string;
  flag: string;
  rateFromZar: number; // 1 ZAR in target currency
}

export const CURRENCIES: Record<CurrencyCode, CurrencyMeta> = {
  ZAR: {
    code: "ZAR",
    symbol: "R",
    label: "ZAR (R)",
    flag: "🇿🇦",
    rateFromZar: 1,
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "USD ($)",
    flag: "🇺🇸",
    rateFromZar: 0.056,
  },
  GBP: {
    code: "GBP",
    symbol: "£",
    label: "GBP (£)",
    flag: "🇬🇧",
    rateFromZar: 0.044,
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "EUR (€)",
    flag: "🇪🇺",
    rateFromZar: 0.052,
  },
};

const CURRENCY_STORAGE_KEY = "jt_active_currency_v1";

export function getActiveCurrency(): CurrencyCode {
  if (typeof window === "undefined") return "ZAR";
  try {
    const saved = localStorage.getItem(CURRENCY_STORAGE_KEY) as CurrencyCode | null;
    if (saved && saved in CURRENCIES) return saved;
    return "ZAR";
  } catch {
    return "ZAR";
  }
}

export function setActiveCurrency(code: CurrencyCode) {
  if (typeof window !== "undefined") {
    localStorage.setItem(CURRENCY_STORAGE_KEY, code);
    window.dispatchEvent(new CustomEvent("jt-currency-changed", { detail: { code } }));
  }
}

/**
  * Formats an amount denominated in ZAR into the currently selected currency
  */
export function formatZarAmount(
  zarAmount: number,
  currencyCode: CurrencyCode = "ZAR",
  options?: { compact?: boolean; suffix?: string },
): string {
  const safeNum = Number.isFinite(zarAmount) ? zarAmount : 0;
  const meta = CURRENCIES[currencyCode] ?? CURRENCIES.ZAR;
  const converted = Math.round(safeNum * meta.rateFromZar);

  if (options?.compact && converted >= 1000) {
    const kVal = (converted / 1000).toFixed(converted % 1000 === 0 ? 0 : 1);
    return `${meta.symbol}${kVal}K${options?.suffix ?? ""}`;
  }

  return `${meta.symbol}${converted.toLocaleString("en-US")}${options?.suffix ?? ""}`;
}

export function useCurrency() {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => getActiveCurrency());

  useEffect(() => {
    const onUpdate = () => setCurrencyState(getActiveCurrency());
    window.addEventListener("jt-currency-changed", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("jt-currency-changed", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const setCurrency = (code: CurrencyCode) => {
    setActiveCurrency(code);
    setCurrencyState(code);
  };

  const format = (
    zarAmount: number,
    options?: { compact?: boolean; suffix?: string },
  ) => formatZarAmount(zarAmount, currency, options);

  const formatZar = (
    zarAmount: number,
    options?: { compact?: boolean; suffix?: string },
  ) => formatZarAmount(zarAmount, currency, options);

  const formatCompactZar = (zarAmount: number, suffix?: string) =>
    formatZarAmount(zarAmount, currency, { compact: true, suffix });

  return {
    currency,
    meta: CURRENCIES[currency] ?? CURRENCIES.ZAR,
    setCurrency,
    format,
    formatZar,
    formatCompactZar,
  };
}
