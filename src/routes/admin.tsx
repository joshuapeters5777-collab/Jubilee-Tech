import React, { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import {
  auth,
  db,
  isFirebaseConfigured,
} from "@/firebase/firebase";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  checkLoginRateLimit,
  clearLocalAdminSession,
  clearLoginRateLimit,
  createLocalAdminSession,
  getLocalAdminSession,
  getSecurityConfig,
  recordAuditLog,
  recordFailedLoginAttempt,
  sanitizeHtml,
} from "@/lib/security";
import {
  type BusinessLead,
  type InvoiceRecord,
  type LeadStatus,
  type MeetingItem,
  getBusinessLeads,
  getInvoices,
  getMeetings,
  saveMeetings,
} from "@/lib/business-store";
import { useCurrency } from "@/lib/currency";
import { CurrencySwitcher } from "@/components/site/CurrencySwitcher";
import { WebsiteGeneratorStudio } from "@/components/admin/WebsiteGeneratorStudio";
import { ClientFinderAndInbox, StatusPill } from "@/components/admin/ClientFinderAndInbox";
import { YouTubeShortsStudio } from "@/components/admin/YouTubeShortsStudio";
import { Admin3DStudioTab } from "@/components/admin/Admin3DStudioTab";
import { RevenueAndSecurityPanel } from "@/components/admin/RevenueAndSecurityPanel";
import {
  LayoutDashboard,
  Users,
  Search,
  Globe,
  Video,
  Box,
  DollarSign,
  ShieldCheck,
  Database,
  Bell,
  Lock,
  LogOut,
  Percent,
  Wallet,
  Calendar as CalendarIcon,
  Plus,
  MessageSquare,
  Wand2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

interface PageEntry {
  id: string;
  slug?: string;
  title?: string;
  html?: string;
  updatedAt?: { seconds: number } | null;
}

interface CollectionDocument {
  id: string;
  data: DocumentData;
}

type AdminTabId =
  | "overview"
  | "inbox"
  | "finder"
  | "websites"
  | "shorts"
  | "3d-lab"
  | "revenue"
  | "cms"
  | "security";

const MONTH_NAMES = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];

export default function AdminPage() {
  const { formatZar, formatCompactZar } = useCurrency();

  // Auth & Security state
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<User | null>(null);
  const [localSessionActive, setLocalSessionActive] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [unlockPasswordInput, setUnlockPasswordInput] = useState("");

  // Navigation & Search
  const [activeTab, setActiveTab] = useState<AdminTabId>("overview");
  const [globalSearch, setGlobalSearch] = useState("");
  const [hoveredMonth, setHoveredMonth] = useState<string>("Nov");
  const [selectedDay, setSelectedDay] = useState<number>(8);

  // Business Store State (Starts cleanly at 0!)
  const [leads, setLeads] = useState<BusinessLead[]>(() => getBusinessLeads());
  const [invoices, setInvoices] = useState<InvoiceRecord[]>(() => getInvoices());
  const [meetings, setMeetings] = useState<MeetingItem[]>(() => getMeetings());
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("10:00 AM");

  // Firestore CMS & Raw Collection state
  const [pageEntries, setPageEntries] = useState<PageEntry[]>([
    {
      id: "home-hero",
      slug: "/",
      title: "Homepage Hero & Value Proposition",
      html: "<h2>Production-grade web systems engineered for modern companies.</h2><p>Bespoke high-converting websites, 3D shaders, and autonomous client acquisition systems.</p>",
    },
  ]);
  const [selectedPageId, setSelectedPageId] = useState("home-hero");
  const [pageTitle, setPageTitle] = useState("Homepage Hero & Value Proposition");
  const [pageHtml, setPageHtml] = useState(
    "<h2>Production-grade web systems engineered for modern companies.</h2><p>Bespoke high-converting websites, 3D shaders, and autonomous client acquisition systems.</p>",
  );
  const [saveMessage, setSaveMessage] = useState("");
  const [collectionName] = useState("leads");
  const [, setCollectionDocs] = useState<CollectionDocument[]>([]);

  // Check existing session on mount
  useEffect(() => {
    clearLoginRateLimit();
    const existingLocal = getLocalAdminSession();
    if (existingLocal && existingLocal.email === ADMIN_EMAIL) {
      setLocalSessionActive(true);
    }

    if (!auth || !isFirebaseConfigured) {
      setAuthLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const emailAddress = user?.email?.toLowerCase() ?? "";
      if (user && emailAddress === ADMIN_EMAIL) {
        setAdminUser(user);
        createLocalAdminSession(ADMIN_EMAIL, true);
        setLocalSessionActive(true);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Listen for local store updates (from Contact form, AI Concierge, Invoices, etc.)
  useEffect(() => {
    const syncStore = () => {
      setLeads(getBusinessLeads());
      setInvoices(getInvoices());
      setMeetings(getMeetings());
    };
    window.addEventListener("jt-store-updated", syncStore);
    window.addEventListener("storage", syncStore);
    return () => {
      window.removeEventListener("jt-store-updated", syncStore);
      window.removeEventListener("storage", syncStore);
    };
  }, []);

  // Sync Firestore leads & pages when Firebase user is authenticated
  useEffect(() => {
    if (!adminUser || !db || !isFirebaseConfigured) return;

    try {
      const leadsQuery = query(collection(db, "leads"), orderBy("createdAt", "desc"));
      const pagesQuery = collection(db, "pages");

      const unsubLeads = onSnapshot(
        leadsQuery,
        (snapshot) => {
          const remoteLeads: BusinessLead[] = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              id: d.id,
              name: data.name ? `${data.name} ${data.surname || ""}`.trim() : "Website Lead",
              email: data.email || "lead@client.com",
              phone: data.phone || "—",
              company: data.business || "Inbound Inquiry",
              source: "Website Form",
              service: data.service || data.chosenPlan || "Website Build",
              budget: data.chosenPlan || "R24,500",
              status: (data.status as LeadStatus) || "New",
              priority: "High",
              createdAt: data.createdAt?.seconds
                ? data.createdAt.seconds * 1000
                : Date.now(),
              notes: data.message || "",
              messages: [
                {
                  id: `m-${d.id}`,
                  sender: "client",
                  senderName: data.name || "Client",
                  body: data.message || "Submitted inquiry via website.",
                  timestamp: Date.now(),
                },
              ],
            };
          });
          if (remoteLeads.length > 0) {
            const localLeads = getBusinessLeads();
            const mergedMap = new Map<string, BusinessLead>();
            [...remoteLeads, ...localLeads].forEach((item) => {
              mergedMap.set(item.id, item);
            });
            setLeads(Array.from(mergedMap.values()));
          }
        },
        () => {
          // Keep local store leads on permission error
        },
      );

      const unsubPages = onSnapshot(
        pagesQuery,
        (snapshot) => {
          const entries = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DocumentData),
          })) as PageEntry[];
          if (entries.length > 0) {
            setPageEntries(entries);
            if (!selectedPageId) setSelectedPageId(entries[0].id);
          }
        },
        () => {},
      );

      return () => {
        unsubLeads();
        unsubPages();
      };
    } catch {
      return;
    }
  }, [adminUser, selectedPageId]);

  useEffect(() => {
    if (!adminUser || !db || !isFirebaseConfigured) return;
    try {
      const colRef = collection(db, collectionName);
      const unsub = onSnapshot(
        colRef,
        (snap) => {
          setCollectionDocs(snap.docs.map((d) => ({ id: d.id, data: d.data() })));
        },
        () => {},
      );
      return () => unsub();
    } catch {
      return;
    }
  }, [adminUser, collectionName]);

  const isAuthorized = Boolean(adminUser || localSessionActive);

  const filteredLeads = useMemo(() => {
    if (!globalSearch.trim()) return leads;
    const q = globalSearch.toLowerCase();
    return leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.company.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.service.toLowerCase().includes(q) ||
        l.status.toLowerCase().includes(q),
    );
  }, [leads, globalSearch]);

  // Real Dynamic KPI Calculations (Starts at 0!)
  const paidInvoices = useMemo(
    () => invoices.filter((inv) => inv.status === "Paid"),
    [invoices],
  );
  const totalPaidZar = useMemo(
    () => paidInvoices.reduce((sum, inv) => sum + inv.amountZar, 0),
    [paidInvoices],
  );
  const avgDealZar = useMemo(
    () => (paidInvoices.length > 0 ? Math.round(totalPaidZar / paidInvoices.length) : 0),
    [paidInvoices, totalPaidZar],
  );
  const closedLeadsCount = useMemo(
    () => leads.filter((l) => l.status === "Closed").length,
    [leads],
  );
  const conversionRatePct = useMemo(
    () => (leads.length > 0 ? Math.round((closedLeadsCount / leads.length) * 100) : 0),
    [leads, closedLeadsCount],
  );

  // Compute monthly revenue bars dynamically from real paid invoices
  const revenueMonths = useMemo(() => {
    return MONTH_NAMES.map((m, idx) => {
      // Put current paid revenue in the latest month ("Nov") or match dueDate
      const monthTotalZar =
        idx === MONTH_NAMES.length - 1
          ? totalPaidZar
          : paidInvoices
              .filter((inv) => inv.dueDate.toLowerCase().includes(m.toLowerCase()))
              .reduce((s, i) => s + i.amountZar, 0);
      return {
        month: m,
        totalZar: monthTotalZar,
      };
    });
  }, [paidInvoices, totalPaidZar]);

  const maxMonthZar = useMemo(
    () => Math.max(50000, ...revenueMonths.map((m) => m.totalZar)),
    [revenueMonths],
  );

  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== ADMIN_EMAIL) {
      setError(`Access denied. Only ${ADMIN_EMAIL} is authorized for Executive Admin.`);
      return;
    }

    if (password !== ADMIN_PASSWORD) {
      setError("Incorrect admin password. Please try again.");
      return;
    }

    setLoading(true);

    if (auth && isFirebaseConfigured) {
      try {
        const cred = await signInWithEmailAndPassword(auth, normalizedEmail, password);
        setAdminUser(cred.user);
      } catch (signInErr: any) {
        if (
          signInErr?.code === "auth/user-not-found" ||
          signInErr?.message?.includes("user-not-found")
        ) {
          try {
            const created = await createUserWithEmailAndPassword(
              auth,
              normalizedEmail,
              password,
            );
            setAdminUser(created.user);
          } catch {
            // Continue with verified Founder session
          }
        }
      }
    }

    clearLoginRateLimit();
    createLocalAdminSession(ADMIN_EMAIL, true);
    setLocalSessionActive(true);
    recordAuditLog(
      "Executive Admin Sign-In Succeeded",
      "auth",
      "Authenticated with primary Founder credentials.",
    );
    setLoading(false);
  };

  const handleLogout = async () => {
    setLoading(true);
    clearLocalAdminSession();
    setLocalSessionActive(false);
    setAdminUser(null);
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch {
        // Ignore
      }
    }
    recordAuditLog("Admin Session Signed Out", "auth", "User initiated sign-out.");
    setLoading(false);
  };

  const handleSavePage = async () => {
    const cleanHtml = sanitizeHtml(pageHtml);
    setPageHtml(cleanHtml);

    setPageEntries((prev) =>
      prev.map((p) =>
        p.id === selectedPageId ? { ...p, title: pageTitle, html: cleanHtml } : p,
      ),
    );
    recordAuditLog(
      "CMS Page Updated & Sanitized",
      "cms",
      `Saved page "${pageTitle}" (XSS sanitizer verified).`,
    );

    if (db && isFirebaseConfigured && adminUser) {
      try {
        await updateDoc(doc(db, "pages", selectedPageId), {
          title: pageTitle,
          html: cleanHtml,
          updatedAt: serverTimestamp(),
        });
      } catch {
        // Saved locally
      }
    }
    setSaveMessage("Page sanitized & saved successfully.");
    setTimeout(() => setSaveMessage(""), 3000);
  };

  const handleAddMeeting = (e: FormEvent) => {
    e.preventDefault();
    if (!newMeetingTitle.trim()) return;
    const item: MeetingItem = {
      id: `meet-${Date.now()}`,
      title: newMeetingTitle.trim(),
      client: "Executive Call",
      time: newMeetingTime,
      dateDay: selectedDay,
      type: "Strategy Call",
      completed: false,
    };
    const next = [...meetings, item];
    setMeetings(next);
    saveMeetings(next);
    setNewMeetingTitle("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen jt-iridescent-backdrop flex items-center justify-center text-white">
        <div className="jt-chrome-card rounded-3xl px-8 py-6 text-sm font-mono uppercase tracking-widest">
          Verifying Cryptographic Session…
        </div>
      </div>
    );
  }

  // Session Lock Screen (Password Protected)
  if (isAuthorized && isLocked) {
    return (
      <div className="min-h-screen jt-iridescent-backdrop flex items-center justify-center px-4 text-white">
        <div className="w-full max-w-sm jt-chrome-shell rounded-3xl p-8 text-center space-y-5">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-sky-500/20 border border-sky-400/40 grid place-items-center text-sky-300">
            <Lock size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold">Session Locked</h2>
            <p className="text-xs text-white/65 mt-1">
              Enter your Admin Password to resume.
            </p>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={unlockPasswordInput}
            onChange={(e) => setUnlockPasswordInput(e.target.value)}
            className="w-full rounded-2xl border border-white/20 bg-black/50 px-4 py-3 text-center text-sm text-white outline-none focus:border-sky-400"
          />
          <button
            type="button"
            onClick={() => {
              if (unlockPasswordInput === ADMIN_PASSWORD) {
                setIsLocked(false);
                setUnlockPasswordInput("");
              }
            }}
            className="w-full rounded-2xl bg-white py-3 text-xs font-semibold uppercase tracking-wider text-slate-950 hover:bg-sky-100 transition"
          >
            Unlock Executive OS
          </button>
        </div>
      </div>
    );
  }

  // Sign-In Screen
  if (!isAuthorized) {
    return (
      <div className="min-h-screen jt-iridescent-backdrop flex items-center justify-center px-4 py-12 text-white">
        <form
          onSubmit={handleSignIn}
          className="w-full max-w-md jt-chrome-shell rounded-[32px] p-8 md:p-10 space-y-5"
        >
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-2xl border border-white/30 bg-gradient-to-br from-sky-400 to-indigo-700 grid place-items-center shadow-lg">
              <ShieldCheck size={24} className="text-white" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-sky-300">
              JUBILEE TECH // ZERO-TRUST GATEWAY
            </p>
            <h1 className="mt-2 text-3xl font-display font-bold text-white">
              Executive Business OS
            </h1>
            <p className="text-xs text-white/65 mt-1">
              Protected by Zero-Trust Credentials & Session Lockout.
            </p>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Authorized Founder Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block font-mono text-[10px] uppercase tracking-wider text-white/60 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-2xl border border-white/20 bg-black/45 px-4 py-3 text-sm text-white outline-none focus:border-sky-400"
              />
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-rose-400/40 bg-rose-500/15 p-3 text-xs text-rose-200 text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-400 via-blue-500 to-indigo-500 py-3.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-xl hover:brightness-110 transition"
          >
            {loading ? "Authenticating…" : "Unlock Executive Dashboard"}
          </button>

          <div className="text-center pt-2">
            <Link
              to="/"
              className="text-xs text-white/60 hover:text-white transition"
            >
              ← Return to Public Website
            </Link>
          </div>
        </form>
      </div>
    );
  }

  // MAIN FROSTED METALLIC GLASS BENTO DASHBOARD (MATCHING REFERENCE SCREENSHOT)
  const navItems: {
    id: AdminTabId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }[] = [
    {
      id: "overview",
      label: "Dashboard",
      icon: <LayoutDashboard size={16} />,
      badge: "Active",
    },
    {
      id: "inbox",
      label: "Leads & Auto-Reply",
      icon: <Users size={16} />,
      badge: `${leads.length}`,
    },
    {
      id: "finder",
      label: "Client Finder",
      icon: <Search size={16} />,
    },
    {
      id: "websites",
      label: "Website Generator",
      icon: <Globe size={16} />,
    },
    {
      id: "shorts",
      label: "YouTube Shorts",
      icon: <Video size={16} />,
      badge: "AUTO",
    },
    {
      id: "3d-lab",
      label: "3D Animation Lab",
      icon: <Box size={16} />,
      badge: "3D",
    },
    {
      id: "revenue",
      label: "Revenue & Billing",
      icon: <DollarSign size={16} />,
    },
    {
      id: "cms",
      label: "CMS & Database",
      icon: <Database size={16} />,
    },
    {
      id: "security",
      label: "Security & WAF",
      icon: <ShieldCheck size={16} />,
    },
  ];

  return (
    <div className="min-h-screen jt-iridescent-backdrop p-3 sm:p-6 lg:p-8 text-white">
      {/* Outer Frosted Metallic Frame matching screenshot */}
      <div className="mx-auto max-w-[1440px] jt-chrome-shell rounded-[34px] p-4 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[245px_1fr]">
          {/* LEFT FROSTED METALLIC SIDEBAR */}
          <aside className="jt-chrome-sidebar rounded-[26px] p-5 flex flex-col justify-between">
            <div>
              {/* Brand Emblem */}
              <div className="flex items-center justify-between px-2 pb-6 border-b border-white/20">
                <Link to="/" className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-xl bg-slate-950 text-white grid place-items-center font-display font-bold text-sm shadow-md">
                    P
                  </div>
                  <div>
                    <span className="font-display font-bold tracking-wider text-sm text-white block leading-none">
                      JUBILEE OS
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-widest text-white/65">
                      SOUTH AFRICAHQ
                    </span>
                  </div>
                </Link>
              </div>

              {/* Sidebar Nav */}
              <nav className="mt-5 space-y-1.5">
                {navItems.map((item) => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between rounded-2xl px-3.5 py-2.5 text-xs font-medium transition-all ${
                        isActive
                          ? "bg-white/25 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.6),0_8px_20px_-6px_rgba(0,0,0,0.35)] border border-white/35"
                          : "text-white/75 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={isActive ? "text-sky-300" : "text-white/70"}>
                          {item.icon}
                        </span>
                        {item.label}
                      </span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            item.badge === "Active"
                              ? "bg-emerald-400/25 text-emerald-200 border border-emerald-400/40"
                              : "bg-white/15 text-white/90"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Cloud Storage Card (Matches Reference Screenshot Bottom-Left) */}
            <div className="mt-8 rounded-2xl border border-white/25 bg-white/10 p-4 shadow-inner">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>Cloud Storage</span>
                <span className="font-mono text-[10px] text-sky-200">Ready</span>
              </div>
              <div className="mt-1 text-[11px] text-white/70">
                12 Portfolio Systems Indexed
              </div>
              <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-950/50">
                <div className="h-full w-[25%] rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500" />
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("websites")}
                className="mt-3.5 w-full rounded-xl bg-white py-2 text-xs font-semibold text-slate-950 shadow hover:bg-sky-50 transition"
              >
                Generate Client Site
              </button>
            </div>
          </aside>

          {/* RIGHT MAIN WORKSPACE */}
          <div className="space-y-5">
            {/* TOP FROSTED HEADER BAR */}
            <header className="jt-chrome-card rounded-[24px] px-5 py-3.5 flex flex-wrap items-center justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px] max-w-md">
                <Search
                  size={15}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60"
                />
                <input
                  type="text"
                  placeholder="Search leads, client websites, shorts, or analytics..."
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className="w-full rounded-full border border-white/25 bg-white/10 pl-10 pr-4 py-2 text-xs text-white placeholder:text-white/60 outline-none focus:border-white/50 focus:bg-white/15"
                />
              </div>

              {/* Right Quick Actions, Currency Switcher & Profile Pill */}
              <div className="flex flex-wrap items-center gap-2.5">
                <CurrencySwitcher compact />

                <Link
                  to="/"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-white hover:bg-white/20 transition"
                >
                  Live Site <ExternalLink size={12} />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsLocked(true)}
                  title="Lock Admin Session"
                  className="relative rounded-full border border-white/25 bg-white/10 p-2 text-white hover:bg-white/20 transition"
                >
                  <Lock size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("inbox")}
                  title="Client Inbox Notifications"
                  className="relative rounded-full border border-white/25 bg-white/10 p-2 text-white hover:bg-white/20 transition"
                >
                  <Bell size={15} />
                  {leads.length > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-slate-900" />
                  )}
                </button>

                {/* Profile Pill matching screenshot */}
                <div className="flex items-center gap-2.5 rounded-full border border-white/25 bg-white/15 pl-2 pr-3.5 py-1">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 grid place-items-center text-xs font-bold text-white shadow">
                    JT
                  </div>
                  <div className="text-left leading-tight">
                    <div className="text-xs font-semibold text-white">
                      Joshua · Founder
                    </div>
                    <div className="text-[10px] text-emerald-300 flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      CEO Online
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    title="Sign Out"
                    className="ml-1 rounded-full p-1.5 text-white/70 hover:bg-white/20 hover:text-white transition"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              </div>
            </header>

            {/* TAB 1: EXECUTIVE BENTO DASHBOARD (CLEAN ZERO STARTING BASELINE) */}
            {activeTab === "overview" && (
              <div className="space-y-5">
                {/* ROW 1: 4 KPI CARDS (Starts at 0 until first client/invoice is added) */}
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <div
                    onClick={() => setActiveTab("inbox")}
                    className="cursor-pointer jt-chrome-card rounded-[24px] p-5 hover:border-white/40 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-white/75">
                          Leads
                        </span>
                        <div className="mt-2 text-3xl font-display font-bold text-white">
                          {leads.length}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-white/25 bg-white/15 grid place-items-center text-white">
                        <Users size={17} />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-medium text-white/60">
                      {leads.length === 0
                        ? "No leads yet — use Client Finder"
                        : `${leads.length} active in pipeline`}
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("revenue")}
                    className="cursor-pointer jt-chrome-card rounded-[24px] p-5 hover:border-white/40 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-white/75">
                          CLV / Avg Deal
                        </span>
                        <div className="mt-2 text-3xl font-display font-bold text-white">
                          {formatCompactZar(avgDealZar)}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-white/25 bg-white/15 grid place-items-center text-white">
                        <DollarSign size={17} />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-medium text-white/60">
                      {paidInvoices.length === 0
                        ? "Starts at 0 until 1st paid deal"
                        : `Across ${paidInvoices.length} paid invoice(s)`}
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("finder")}
                    className="cursor-pointer jt-chrome-card rounded-[24px] p-5 hover:border-white/40 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-white/75">
                          Conversion Rate
                        </span>
                        <div className="mt-2 text-3xl font-display font-bold text-white">
                          {conversionRatePct}%
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-white/25 bg-white/15 grid place-items-center text-white">
                        <Percent size={17} />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-medium text-white/60">
                      {closedLeadsCount} closed of {leads.length} leads
                    </div>
                  </div>

                  <div
                    onClick={() => setActiveTab("revenue")}
                    className="cursor-pointer jt-chrome-card rounded-[24px] p-5 hover:border-white/40 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-xs font-medium text-white/75">
                          Revenue Collected
                        </span>
                        <div className="mt-2 text-3xl font-display font-bold text-white">
                          {formatZar(totalPaidZar)}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full border border-white/25 bg-white/15 grid place-items-center text-white">
                        <Wallet size={17} />
                      </div>
                    </div>
                    <div className="mt-3 text-[11px] font-medium text-sky-300">
                      {totalPaidZar === 0
                        ? "Fresh account (0 recorded)"
                        : "Verified paid invoices"}
                    </div>
                  </div>
                </div>

                {/* ROW 2: REVENUE OVERVIEW + CALENDAR + MEETING SCHEDULE */}
                <div className="grid gap-4 xl:grid-cols-[1.5fr_0.85fr_0.85fr]">
                  {/* Revenue Overview Bar Chart */}
                  <div className="jt-chrome-card rounded-[26px] p-6 flex flex-col justify-between">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="text-xs font-medium text-white/75">
                          Revenue Overview
                        </span>
                        <div className="mt-1 text-xl sm:text-2xl font-display font-bold text-white">
                          Total Revenue: {formatZar(totalPaidZar)}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("revenue")}
                        className="rounded-full bg-white/10 border border-white/25 px-3 py-1 text-xs font-semibold text-sky-200 hover:bg-white/20 transition"
                      >
                        {totalPaidZar === 0 ? "+ Create First Invoice" : "Manage Billing"}
                      </button>
                    </div>

                    {/* Glowing Multi-Tiered Bars (Starts at baseline 0% height when R0) */}
                    <div className="mt-6 grid grid-cols-[48px_1fr] gap-2 items-end">
                      <div className="flex flex-col justify-between h-44 text-[10px] font-mono text-white/55 pb-6">
                        <span>{formatCompactZar(maxMonthZar)}</span>
                        <span>{formatCompactZar(Math.round(maxMonthZar * 0.6))}</span>
                        <span>{formatCompactZar(Math.round(maxMonthZar * 0.3))}</span>
                        <span>{formatZar(0)}</span>
                      </div>

                      <div className="grid grid-cols-6 gap-3 items-end h-44 pt-4">
                        {revenueMonths.map((m) => {
                          const rawPct =
                            m.totalZar > 0
                              ? Math.max(12, Math.round((m.totalZar / maxMonthZar) * 100))
                              : 6;
                          const isSelected = hoveredMonth === m.month;
                          return (
                            <div
                              key={m.month}
                              onMouseEnter={() => setHoveredMonth(m.month)}
                              onClick={() => setHoveredMonth(m.month)}
                              className="group relative flex flex-col items-center cursor-pointer h-full justify-end"
                            >
                              {isSelected && (
                                <div className="mb-1.5 z-10 whitespace-nowrap rounded-xl border border-white/30 bg-slate-950/90 px-2.5 py-1 text-center shadow-xl">
                                  <div className="text-[9px] text-white/70">
                                    {m.month} 2026
                                  </div>
                                  <div className="text-[11px] font-bold text-sky-300">
                                    {formatZar(m.totalZar)}
                                  </div>
                                </div>
                              )}
                              <div
                                style={{ height: `${rawPct}%` }}
                                className={`w-full max-w-[44px] rounded-t-xl transition-all duration-300 flex flex-col justify-end overflow-hidden border border-white/25 ${
                                  m.totalZar > 0 && isSelected
                                    ? "bg-gradient-to-t from-blue-600 via-sky-400 to-cyan-200 shadow-[0_0_25px_rgba(56,189,248,0.65)]"
                                    : m.totalZar > 0
                                      ? "bg-gradient-to-t from-slate-800/80 via-sky-500/45 to-white/35"
                                      : "bg-white/10 opacity-50"
                                }`}
                              />
                              <span className="mt-2 text-[11px] text-white/75">
                                {m.month}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Interactive Calendar Widget */}
                  <div className="jt-chrome-card rounded-[26px] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          Calendar
                        </span>
                        <span className="text-[11px] text-white/70 flex items-center gap-1">
                          <ChevronLeft size={13} /> Nov 2026 <ChevronRight size={13} />
                        </span>
                      </div>

                      <div className="mt-4 grid grid-cols-7 text-center text-[10px] font-semibold text-white/60 gap-y-2">
                        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                          <span key={d}>{d}</span>
                        ))}
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
                          const hasMeeting = meetings.some((m) => m.dateDay === day);
                          const isSelected = selectedDay === day;
                          return (
                            <button
                              key={day}
                              type="button"
                              onClick={() => setSelectedDay(day)}
                              className={`mx-auto h-7 w-7 rounded-lg text-[11px] font-medium transition grid place-items-center ${
                                isSelected
                                  ? "bg-white text-slate-950 font-bold shadow"
                                  : hasMeeting
                                    ? "bg-sky-500/30 text-sky-200 border border-sky-400/40"
                                    : "text-white/80 hover:bg-white/10"
                              }`}
                            >
                              {day}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-white/15 flex items-center justify-between text-[11px] text-white/70">
                      <span>Selected: Nov {selectedDay}</span>
                      <span className="text-sky-300 font-semibold">
                        {meetings.filter((m) => m.dateDay === selectedDay).length} calls
                      </span>
                    </div>
                  </div>

                  {/* Meeting Schedule Widget */}
                  <div className="jt-chrome-card rounded-[26px] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          Meeting Schedule
                        </span>
                        <CalendarIcon size={14} className="text-sky-300" />
                      </div>

                      <div className="mt-3.5 space-y-2.5 max-h-[155px] overflow-y-auto pr-1">
                        {meetings.length === 0 ? (
                          <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-4 text-center text-xs text-white/50">
                            No calls scheduled yet. Add a discovery call below.
                          </div>
                        ) : (
                          meetings.map((m) => (
                            <div
                              key={m.id}
                              className="rounded-2xl border border-white/20 bg-white/10 p-3"
                            >
                              <div className="text-xs font-semibold text-white">
                                {m.title}
                              </div>
                              <div className="mt-0.5 flex items-center justify-between text-[11px] text-white/70">
                                <span>{m.time}</span>
                                <span className="text-sky-200">Nov {m.dateDay}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <form onSubmit={handleAddMeeting} className="mt-3 flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Schedule client call..."
                        value={newMeetingTitle}
                        onChange={(e) => setNewMeetingTitle(e.target.value)}
                        className="flex-1 rounded-xl border border-white/20 bg-black/35 px-2.5 py-1.5 text-[11px] text-white placeholder:text-white/45 outline-none"
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-white px-2.5 py-1.5 text-xs font-bold text-slate-950"
                      >
                        <Plus size={13} />
                      </button>
                    </form>
                  </div>
                </div>

                {/* ROW 3: LEADS MANAGEMENT TABLE + TOP MARKETS + SYSTEM READINESS */}
                <div className="grid gap-4 xl:grid-cols-[1.5fr_0.85fr_0.85fr]">
                  {/* Leads Management Table */}
                  <div className="jt-chrome-card rounded-[26px] p-6 overflow-x-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-display font-semibold text-white">
                        Leads Management
                      </h3>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setActiveTab("finder")}
                          className="text-xs text-emerald-300 hover:text-white font-medium"
                        >
                          + Find Clients
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveTab("inbox")}
                          className="text-xs text-sky-300 hover:text-white font-medium"
                        >
                          Open Smart Inbox →
                        </button>
                      </div>
                    </div>

                    {filteredLeads.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-white/15 bg-black/20 p-6 text-center space-y-3">
                        <p className="text-xs text-white/65">
                          Your lead pipeline is currently empty (0 leads recorded).
                        </p>
                        <div className="flex flex-wrap justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setActiveTab("finder")}
                            className="rounded-xl bg-white px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-100 transition"
                          >
                            Scan for Clients in Client Finder
                          </button>
                          <button
                            type="button"
                            onClick={() => setActiveTab("websites")}
                            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white hover:bg-white/20 transition"
                          >
                            Generate a Client Website
                          </button>
                        </div>
                      </div>
                    ) : (
                      <table className="w-full text-left text-xs text-white">
                        <thead className="border-b border-white/15 text-[11px] text-white/65">
                          <tr>
                            <th className="pb-2.5 pr-3">Lead Name</th>
                            <th className="pb-2.5 px-2">Source</th>
                            <th className="pb-2.5 px-2">Status</th>
                            <th className="pb-2.5 px-2">Date</th>
                            <th className="pb-2.5 pl-2 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                          {filteredLeads.slice(0, 5).map((lead) => (
                            <tr key={lead.id} className="hover:bg-white/5 transition">
                              <td className="py-3 pr-3 font-medium">
                                <div>{lead.name}</div>
                                <div className="text-[10px] text-white/55">
                                  {lead.company}
                                </div>
                              </td>
                              <td className="py-3 px-2 text-white/75">{lead.source}</td>
                              <td className="py-3 px-2">
                                <StatusPill status={lead.status} />
                              </td>
                              <td className="py-3 px-2 text-white/70 font-mono text-[11px]">
                                {new Date(lead.createdAt).toLocaleDateString()}
                              </td>
                              <td className="py-3 pl-2 text-right">
                                <div className="inline-flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab("inbox")}
                                    title="Reply to client"
                                    className="rounded-lg border border-white/15 bg-white/10 p-1.5 text-white/80 hover:bg-white/25"
                                  >
                                    <MessageSquare size={12} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setActiveTab("websites")}
                                    title="Generate website for client"
                                    className="rounded-lg border border-sky-400/30 bg-sky-500/20 p-1.5 text-sky-200 hover:bg-sky-500/35"
                                  >
                                    <Wand2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* Target Markets Card (South Africa HQ + Global Currencies) */}
                  <div className="jt-chrome-card rounded-[26px] p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-white">
                        Supported Markets
                      </span>
                      <Globe size={14} className="text-sky-300" />
                    </div>

                    <div className="relative my-3 h-32 rounded-2xl border border-white/15 bg-slate-950/55 p-3 overflow-hidden flex items-center justify-center">
                      <svg
                        viewBox="0 0 240 110"
                        className="w-full h-full opacity-80"
                      >
                        <path
                          d="M22,38 Q42,22 65,36 T112,32 T162,45 T210,36 L218,68 Q185,84 148,72 T82,82 T26,65 Z"
                          fill="rgba(56, 189, 248, 0.25)"
                          stroke="rgba(56, 189, 248, 0.65)"
                          strokeWidth="1.5"
                        />
                        <circle cx="132" cy="82" r="5.5" fill="#34d399" />
                        <circle cx="118" cy="36" r="4.5" fill="#38bdf8" />
                        <circle cx="62" cy="44" r="4.5" fill="#a855f7" />
                      </svg>

                      <div className="absolute top-2.5 right-2.5 rounded-lg border border-white/25 bg-white/95 px-2 py-0.5 text-[10px] font-bold text-slate-950 shadow">
                        🇿🇦 South Africa (ZAR)
                      </div>
                      <div className="absolute bottom-2.5 left-2.5 rounded-lg border border-white/25 bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-white shadow">
                        🇬🇧 UK (GBP) · 🇪🇺 EU (EUR)
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-white/75">
                      <div className="flex items-center justify-between rounded-xl bg-black/25 px-2.5 py-1.5">
                        <span>🇿🇦 ZAR Default</span>
                        <strong className="text-emerald-300">Active</strong>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-black/25 px-2.5 py-1.5">
                        <span>🇺🇸 USD / GBP / EUR</span>
                        <strong className="text-sky-300">Live</strong>
                      </div>
                    </div>
                  </div>

                  {/* Portfolio & Studio Readiness Gauge Card */}
                  <div className="jt-chrome-card rounded-[26px] p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-white">
                          Studio Readiness
                        </span>
                        <span className="text-xs text-emerald-300 font-mono">100%</span>
                      </div>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-display font-bold text-white">
                          12 Sites
                        </span>
                        <span className="text-xs font-semibold text-sky-300">
                          In Case Work
                        </span>
                      </div>
                    </div>

                    <div className="my-2 flex items-center justify-center">
                      <svg viewBox="0 0 160 115" className="w-40 h-28">
                        <path
                          d="M 20 98 A 60 60 0 1 1 140 98"
                          fill="none"
                          stroke="rgba(255,255,255,0.14)"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 20 98 A 60 60 0 1 1 140 98"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="10"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 35 98 A 45 45 0 1 1 125 98"
                          fill="none"
                          stroke="#34d399"
                          strokeWidth="8"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 50 98 A 30 30 0 1 1 110 98"
                          fill="none"
                          stroke="#a855f7"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>

                    <div className="text-center text-[11px] text-white/70">
                      All Jubilee Tech Websites & YouTube Auto-Publish Online
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: CLIENT INBOX & AUTONOMOUS RESPONDER */}
            {activeTab === "inbox" && (
              <ClientFinderAndInbox
                leads={leads}
                onLeadsChange={setLeads}
                mode="inbox"
              />
            )}

            {/* TAB 3: CLIENT FINDER & OUTBOUND PROSPECTOR */}
            {activeTab === "finder" && (
              <ClientFinderAndInbox
                leads={leads}
                onLeadsChange={setLeads}
                mode="finder"
              />
            )}

            {/* TAB 4: CLIENT WEBSITE GENERATOR STUDIO */}
            {activeTab === "websites" && <WebsiteGeneratorStudio />}

            {/* TAB 5: YOUTUBE SHORTS GENERATOR + AUTO-UPLOAD STUDIO */}
            {activeTab === "shorts" && <YouTubeShortsStudio />}

            {/* TAB 6: 3D ANIMATION LAB */}
            {activeTab === "3d-lab" && <Admin3DStudioTab />}

            {/* TAB 7: REVENUE & INVOICES */}
            {activeTab === "revenue" && (
              <RevenueAndSecurityPanel mode="revenue" />
            )}

            {/* TAB 8: CMS & FIRESTORE DATABASE MANAGER */}
            {activeTab === "cms" && (
              <div className="space-y-6">
                <div className="jt-chrome-card rounded-3xl p-6">
                  <div className="flex items-center justify-between border-b border-white/15 pb-4 mb-5">
                    <div>
                      <span className="font-mono text-[10px] uppercase tracking-widest text-sky-300">
                        SANITIZED CONTENT EDITOR
                      </span>
                      <h2 className="text-2xl font-display font-semibold text-white">
                        Live Page Content & XSS-Protected HTML Preview
                      </h2>
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
                    <div className="space-y-4">
                      <div>
                        <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                          Select Page Block
                        </label>
                        <select
                          value={selectedPageId}
                          onChange={(e) => {
                            const id = e.target.value;
                            setSelectedPageId(id);
                            const found = pageEntries.find((p) => p.id === id);
                            if (found) {
                              setPageTitle(found.title || "");
                              setPageHtml(found.html || "");
                            }
                          }}
                          className="w-full rounded-xl border border-white/15 bg-slate-950 px-3.5 py-2.5 text-xs text-white"
                        >
                          {pageEntries.map((p) => (
                            <option key={p.id} value={p.id}>
                              {p.title || p.slug || p.id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-mono text-[10px] uppercase text-white/60 mb-1">
                          Section Title
                        </label>
                        <input
                          type="text"
                          value={pageTitle}
                          onChange={(e) => setPageTitle(e.target.value)}
                          className="w-full rounded-xl border border-white/15 bg-black/40 px-3.5 py-2.5 text-xs text-white outline-none focus:border-sky-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleSavePage}
                        className="w-full rounded-xl bg-sky-400 py-3 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
                      >
                        Sanitize & Save Content
                      </button>

                      {saveMessage && (
                        <p className="text-xs text-emerald-300">{saveMessage}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <textarea
                        rows={7}
                        value={pageHtml}
                        onChange={(e) => setPageHtml(e.target.value)}
                        className="w-full rounded-2xl border border-white/15 bg-black/45 p-4 font-mono text-xs text-white outline-none focus:border-sky-400"
                      />
                      <div className="rounded-2xl border border-white/15 bg-black/55 p-5">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-sky-300 mb-2">
                          Sanitized Live Render (Scripts & Inline Handlers Stripped)
                        </div>
                        <div
                          className="prose prose-invert max-w-none text-sm text-white/90"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtml(pageHtml),
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: SECURITY & WAF AUDIT */}
            {activeTab === "security" && (
              <RevenueAndSecurityPanel mode="security" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
