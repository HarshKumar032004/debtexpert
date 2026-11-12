"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { LogOut, ExternalLink, Menu } from "lucide-react";
import { UserRole } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";

interface AdminTopbarProps {
  user: {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
  };
  onOpenMobileSidebar?: () => void;
}

export function AdminTopbar({ user, onOpenMobileSidebar }: AdminTopbarProps) {
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
    <header className="h-16 border-b border-gray-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md sticky top-0 z-20 px-3 sm:px-6 flex items-center justify-between transition-colors">
      {/* Left: Mobile Hamburger & Quick System Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Mobile Hamburger Trigger */}
        <button
          onClick={onOpenMobileSidebar}
          className="flex md:hidden p-2 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-300 hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* API Health Pill */}
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-[11px] text-gray-600 dark:text-zinc-300">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold hidden sm:inline">Meta Cloud API:</span>
          <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">Connected (v21.0)</span>
        </div>

        {/* Public Portal Link */}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden lg:inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors"
        >
          <span>View Public Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Right: Theme Toggle, User Profile & Sign Out */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle Button */}
        <ThemeToggle />

        {/* User Card */}
        <div className="flex items-center gap-2.5 text-right">
          <div className="hidden sm:block">
            <div className="text-xs font-bold text-gray-900 dark:text-white leading-tight">{user.name}</div>
            <div className="text-[10px] text-gray-500 dark:text-zinc-400 font-mono truncate max-w-[140px]">{user.email}</div>
          </div>

          <span
            className={`text-[10px] font-mono font-extrabold px-2 sm:px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
              user.role === "SUPER_ADMIN"
                ? "bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30"
                : user.role === "LEGAL_ADVISOR"
                ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                : "bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700"
            }`}
          >
            {user.role === "SUPER_ADMIN" ? "SUPER ADMIN" : user.role.replace("_", " ")}
          </span>
        </div>

        {/* Sign Out Button */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 text-xs font-semibold text-gray-700 dark:text-zinc-300 transition-colors disabled:opacity-50"
          title="Sign out of Admin Session"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span className="hidden md:inline">{loggingOut ? "Signing out..." : "Sign Out"}</span>
        </button>
      </div>
    </header>
  );
}
