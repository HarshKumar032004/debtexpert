"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  Scale,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  pendingCount?: number;
  unreadWhatsAppCount?: number;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({
  pendingCount = 0,
  unreadWhatsAppCount = 0,
  mobileOpen = false,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setCollapsed(true);
    }
  }, []);

  const navItems = [
    {
      label: "Overview",
      href: "/admin",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Leads Pipeline",
      href: "/admin/leads",
      icon: Users,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: "bg-amber-500/20 text-amber-600 dark:text-amber-300 border border-amber-500/30",
    },
    {
      label: "WhatsApp Inbox",
      href: "/admin/whatsapp",
      icon: MessageSquare,
      badge: unreadWhatsAppCount > 0 ? unreadWhatsAppCount : null,
      badgeColor: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30",
    },
    {
      label: "Follow-Up Radar",
      href: "/admin/reminders",
      icon: Bell,
      badge: null,
    },
    {
      label: "Settings & API",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 md:static md:z-30 flex flex-col justify-between border-r border-gray-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 transition-all duration-300 ${
        mobileOpen
          ? "translate-x-0 shadow-2xl"
          : "-translate-x-full md:translate-x-0"
      } ${collapsed ? "md:w-20 w-72" : "w-72 md:w-64"}`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between">
          <Link
            href="/admin"
            onClick={onMobileClose}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center transition-transform group-hover:scale-105">
              <Scale className="h-5 w-5" />
            </div>
            {(!collapsed || mobileOpen) && (
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-gray-900 dark:text-white tracking-tight truncate">
                  Debt Support Expert
                </div>
                <div className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-400 tracking-wider">
                  Legal CRM v2.0
                </div>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={onMobileClose}
            className="flex md:hidden p-2 rounded-xl text-gray-500 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors"
            aria-label="Close navigation sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onMobileClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-amber-500 text-white dark:text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                    : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900/80"
                }`}
                title={collapsed && !mobileOpen ? item.label : undefined}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive
                      ? "text-white dark:text-zinc-950"
                      : "text-gray-500 dark:text-zinc-400 group-hover:text-amber-500 dark:group-hover:text-amber-400"
                  }`}
                />
                {(!collapsed || mobileOpen) && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 dark:bg-zinc-950/40 text-white dark:text-zinc-950"
                            : item.badgeColor || "bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Info / Status Badge */}
      {!collapsed || mobileOpen ? (
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800/80 m-3 rounded-xl bg-gray-50 dark:bg-zinc-900/60 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Meta WhatsApp API Active</span>
          </div>
          <p className="text-[10px] text-gray-500 dark:text-zinc-500 leading-relaxed">
            Encrypted attorney-client work product under Indian Advocates Act 1961.
          </p>
        </div>
      ) : (
        <div className="p-3 border-t border-gray-200 dark:border-zinc-800/80 flex justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" title="Meta WhatsApp API Active" />
        </div>
      )}
    </aside>
  );
}
