"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck, UserCheck, MessageSquare, ExternalLink } from "lucide-react";
import { UserRole } from "@/lib/auth";

interface AdminTopbarProps {
  user: {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      window.location.href = "/admin/login";
    }
  };

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Quick System Status */}
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
          <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold hidden sm:inline">Meta Cloud API:</span>
          <span className="text-emerald-400 font-mono font-bold">Connected (v21.0)</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
        >
          <span>View Public Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Right: User Roster & Sign Out */}
      <div className="flex items-center gap-4">
        {/* User Card */}
        <div className="flex items-center gap-3 text-right">
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-white leading-tight">{user.name}</div>
            <div className="text-[10px] text-slate-400 font-mono">{user.email}</div>
          </div>

          <span
            className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              user.role === "SUPER_ADMIN"
                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                : user.role === "LEGAL_ADVISOR"
                ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                : "bg-slate-800 text-slate-300 border border-slate-700"
            }`}
          >
            {user.role.replace("_", " ")}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors disabled:opacity-50"
          title="Sign out of Admin Session"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </header>
  );
}
