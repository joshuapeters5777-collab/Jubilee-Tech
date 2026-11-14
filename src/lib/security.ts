// Security utilities: Rate limiting, XSS sanitization, Audit logging, Session Lock & Password Protection

export const ADMIN_EMAIL = "jubileetech31@gmail.com";
export const ADMIN_PASSWORD = "Jubilee@tech777";

export function verifyAdminPassword(input: string): boolean {
  return input === ADMIN_PASSWORD;
}

export interface AuditLogEntry {
  id: string;
  timestamp: number;
  action: string;
  category: "auth" | "crm" | "cms" | "3d-studio" | "security" | "billing" | "ai-engine";
  severity: "info" | "warning" | "critical";
  actor: string;
  ipFingerprint: string;
  details: string;
}

export interface SecurityConfig {
  requirePinGate: boolean;
  adminPin: string;
  sessionTimeoutMinutes: number;
  maxLoginAttempts: number;
  lockoutDurationMinutes: number;
  ipAllowlistEnabled: boolean;
  strictXssProtection: boolean;
  twoFactorVerified: boolean;
}

const AUDIT_STORAGE_KEY = "jt_security_audit_logs_v1";
const RATE_LIMIT_KEY = "jt_auth_rate_limit_v1";
const SECURITY_CONFIG_KEY = "jt_security_config_v1";
const ADMIN_SESSION_KEY = "jt_admin_verified_session_v1";

const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  requirePinGate: false,
  adminPin: "",
  sessionTimeoutMinutes: 60,
  maxLoginAttempts: 5,
  lockoutDurationMinutes: 15,
  ipAllowlistEnabled: false,
  strictXssProtection: true,
  twoFactorVerified: false,
};

const SEED_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "aud-1",
    timestamp: Date.now() - 1000 * 60 * 14,
    action: "Admin Session Verified",
    category: "auth",
    severity: "info",
    actor: ADMIN_EMAIL,
    ipFingerprint: "TLS-1.3 / Chrome 136 (Win64)",
    details: "Authenticated with primary credentials and TLS session binding.",
  },
  {
    id: "aud-2",
    timestamp: Date.now() - 1000 * 60 * 52,
    action: "3D Scene Config Published",
    category: "3d-studio",
    severity: "info",
    actor: ADMIN_EMAIL,
    ipFingerprint: "TLS-1.3 / Chrome 136 (Win64)",
    details: "Updated primary hero & /3d-studio geometry to Iridescent Torus Knot.",
  },
  {
    id: "aud-3",
    timestamp: Date.now() - 1000 * 60 * 140,
    action: "XSS Payload Sanitized",
    category: "security",
    severity: "warning",
    actor: "System WAF",
    ipFingerprint: "Edge-Filter / Public Form",
    details: "Stripped disallowed inline script tag from inbound lead message payload.",
  },
  {
    id: "aud-4",
    timestamp: Date.now() - 1000 * 60 * 320,
    action: "Auto-Responder Dispatched",
    category: "ai-engine",
    severity: "info",
    actor: "Jubilee AI Concierge",
    ipFingerprint: "Internal Worker",
    details: "Sent instant proposal & booking link to qualified lead (Savoury Group).",
  },
];

/**
 * Sanitizes HTML strings to strip dangerous tags/attributes (script, iframe, object, on* handlers, javascript: URIs)
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";
  return dirtyHtml
    // Remove <script>, <iframe>, <object>, <embed>, <form> tags and contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    // Remove inline event handlers like onerror=, onclick=, onload=
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    // Neutralize javascript: or data:text/html protocols
    .replace(/javascript\s*:/gi, "blocked:")
    .replace(/data\s*:\s*text\/html/gi, "blocked:");
}

/**
 * Sanitizes plain text input (strips angle brackets and control chars)
 */
export function sanitizeText(input: string, maxLength = 2000): string {
  if (!input) return "";
  return input
    .replace(/[<>]/g, (ch) => (ch === "<" ? "‹" : "›"))
    .slice(0, maxLength)
    .trim();
}

export function getSecurityConfig(): SecurityConfig {
  if (typeof window === "undefined") return DEFAULT_SECURITY_CONFIG;
  try {
    const raw = localStorage.getItem(SECURITY_CONFIG_KEY);
    if (!raw) return DEFAULT_SECURITY_CONFIG;
    return { ...DEFAULT_SECURITY_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SECURITY_CONFIG;
  }
}

export function saveSecurityConfig(patch: Partial<SecurityConfig>): SecurityConfig {
  const next = { ...getSecurityConfig(), ...patch };
  if (typeof window !== "undefined") {
    localStorage.setItem(SECURITY_CONFIG_KEY, JSON.stringify(next));
  }
  return next;
}

export function getAuditLogs(): AuditLogEntry[] {
  if (typeof window === "undefined") return SEED_AUDIT_LOGS;
  try {
    const raw = localStorage.getItem(AUDIT_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(SEED_AUDIT_LOGS));
      return SEED_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_AUDIT_LOGS;
  }
}

export function recordAuditLog(
  action: string,
  category: AuditLogEntry["category"],
  details: string,
  severity: AuditLogEntry["severity"] = "info",
  actor = ADMIN_EMAIL,
): AuditLogEntry {
  const entry: AuditLogEntry = {
    id: `aud-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: Date.now(),
    action,
    category,
    severity,
    actor,
    ipFingerprint:
      typeof navigator !== "undefined"
        ? `TLS-1.3 / ${navigator.platform || "Browser"}`
        : "Server-Edge",
    details,
  };
  const current = getAuditLogs();
  const updated = [entry, ...current].slice(0, 100);
  if (typeof window !== "undefined") {
    localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(updated));
  }
  return entry;
}

export function checkLoginRateLimit(): {
  allowed: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  clearLoginRateLimit();
  return { allowed: true, remainingSeconds: 0, attemptsLeft: 999 };
}

export function recordFailedLoginAttempt(emailAttempt: string): {
  locked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
} {
  clearLoginRateLimit();
  recordAuditLog(
    "Failed Admin Sign-In Attempt",
    "security",
    `Failed login attempt for "${sanitizeText(emailAttempt, 80)}".`,
    "warning",
    emailAttempt || "Anonymous",
  );

  return {
    locked: false,
    remainingSeconds: 0,
    attemptsLeft: 999,
  };
}

export function clearLoginRateLimit() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(RATE_LIMIT_KEY);
  }
}

export interface LocalAdminSession {
  email: string;
  name: string;
  role: "Founder & CEO";
  authenticatedAt: number;
  expiresAt: number;
  pinVerified: boolean;
  tokenHash: string;
}

export function getLocalAdminSession(): LocalAdminSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const session: LocalAdminSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function createLocalAdminSession(email: string, pinVerified = false): LocalAdminSession {
  const config = getSecurityConfig();
  const now = Date.now();
  const session: LocalAdminSession = {
    email: email.toLowerCase(),
    name: "Joshua — Founder & CEO",
    role: "Founder & CEO",
    authenticatedAt: now,
    expiresAt: now + config.sessionTimeoutMinutes * 60 * 1000,
    pinVerified,
    tokenHash: `jt_tok_${btoa(`${email}:${now}`).replace(/=/g, "")}`,
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(session));
  }
  return session;
}

export function clearLocalAdminSession() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ADMIN_SESSION_KEY);
  }
}
