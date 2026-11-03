"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Scale,
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Sparkles,
  UserCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Successful login
      router.push("/admin");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error during login.";
      setError(msg);
      setLoading(false);
    }
  };

  const fillCredentials = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-slate-950 text-slate-100 relative overflow-hidden selection:bg-amber-500 selection:text-slate-950">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand / Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-gradient-to-tr from-amber-500/20 to-primary-600/30 border border-amber-500/30 text-amber-400 mb-2 shadow-inner">
            <Scale className="h-7 w-7" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Debt Support Expert
          </h1>
          <p className="text-xs uppercase tracking-widest font-semibold text-amber-400">
            Legal Lead Management System (CRM)
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Restricted Authorized Counsel & Staff Access</span>
          </div>
        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300" htmlFor="admin-email">
                Advocate / Staff Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="admin-email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@debtsupportexpert.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="admin-password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 bg-slate-950/70 text-slate-100 placeholder:text-slate-600 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-lg shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <span>Authenticating with Secure Key...</span>
              ) : (
                <>
                  <span>Sign In to CRM Portal</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Fill Demo Credentials */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-400">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>Quick Fill Demo Credentials for Review:</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-left">
              <button
                type="button"
                onClick={() => fillCredentials("admin@debtsupportexpert.com", "Admin@12345")}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
              >
                <div className="font-bold text-amber-400 flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  <span>Super Admin</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">admin@debtsupport...</div>
              </button>

              <button
                type="button"
                onClick={() => fillCredentials("advocate.sharma@debtsupportexpert.com", "Advisor@12345")}
                className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/60 text-[11px] text-slate-300 transition-colors"
              >
                <div className="font-bold text-blue-400 flex items-center gap-1">
                  <Scale className="h-3 w-3" />
                  <span>Legal Advisor</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate">advocate.sharma...</div>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-center text-[11px] text-slate-600">
          Privileged Attorney-Client Work Product. All system access, audits, and WhatsApp transmissions are logged under Indian IT Act and Advocates Act.
        </p>
      </div>
    </div>
  );
}
