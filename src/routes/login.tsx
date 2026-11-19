import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import {
  auth,
  isFirebaseConfigured,
} from "../firebase/firebase";
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  checkLoginRateLimit,
  clearLoginRateLimit,
  createLocalAdminSession,
  getSecurityConfig,
  recordAuditLog,
  recordFailedLoginAttempt,
} from "@/lib/security";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    clearLoginRateLimit();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const isFounder = email.trim().toLowerCase() === ADMIN_EMAIL;
    if (isFounder && password !== ADMIN_PASSWORD) {
      setError("Incorrect admin password. Please try again.");
      return;
    }

    setLoading(true);

    if (auth && isFirebaseConfigured) {
      try {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      } catch {
        // Fallback to local verified session if founder credentials matched
        if (!isFounder) {
          recordFailedLoginAttempt(email);
          setError("Invalid credentials.");
          setLoading(false);
          return;
        }
      }
    }

    clearLoginRateLimit();
    if (isFounder) {
      createLocalAdminSession(ADMIN_EMAIL, true);
      recordAuditLog(
        "Portal Sign-In Succeeded",
        "auth",
        `${email} signed in via /login portal.`,
      );
    }

    setLoading(false);
    navigate({
      to: isFounder ? "/admin" : "/",
    });
  };

  return (
    <div className="min-h-screen jt-iridescent-backdrop flex items-center justify-center px-6 py-12 text-white">
      <div className="w-full max-w-md jt-chrome-shell rounded-[32px] p-8 md:p-10 shadow-2xl">
        <div className="text-center mb-6">
          <div className="mx-auto mb-3 h-11 w-11 rounded-2xl border border-white/30 bg-gradient-to-br from-sky-400 to-indigo-700 grid place-items-center">
            <ShieldCheck size={22} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white">
            Jubilee Tech Portal
          </h1>
          <p className="text-xs text-white/65 mt-1">
            Zero-Trust Client & Executive Authentication
          </p>
        </div>

        <div className="flex bg-black/40 border border-white/15 rounded-2xl p-1 mb-6">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`w-1/2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              isLogin ? "bg-white text-slate-950 shadow" : "text-white/65"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`w-1/2 py-2.5 text-xs font-semibold rounded-xl transition-all ${
              !isLogin ? "bg-white text-slate-950 shadow" : "text-white/65"
            }`}
          >
            Register Client
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-black/45 text-white px-4 py-3 text-sm rounded-2xl outline-none border border-white/15 focus:border-sky-400"
            />
          )}

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/45 text-white px-4 py-3 text-sm rounded-2xl outline-none border border-white/15 focus:border-sky-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-black/45 text-white px-4 py-3 text-sm rounded-2xl outline-none border border-white/15 focus:border-sky-400"
          />

          {error && (
            <div className="bg-rose-500/15 border border-rose-400/40 text-rose-200 p-3 rounded-xl text-xs text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-sky-100 transition text-slate-950 font-bold text-xs uppercase tracking-wider py-3.5 rounded-2xl shadow-lg"
          >
            {loading ? "Verifying..." : isLogin ? "Continue to Portal" : "Create Account"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/" className="text-white/60 hover:text-white text-xs transition">
            ← Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
