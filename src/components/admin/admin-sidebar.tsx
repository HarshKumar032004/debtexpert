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
  ShieldCheck,
  MessageSquare,
  Sparkles,
} from "lucide-react";

interface AdminSidebarProps {
  pendingCount?: number;
}

export function AdminSidebar({ pendingCount = 0 }: AdminSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

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
      badgeColor: "bg-amber-500/20 text-amber-300 border border-amber-500/30",
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
      className={`border-r border-slate-800 bg-slate-950 flex flex-col justify-between transition-all duration-300 z-30 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Top Brand Header */}
      <div>
        <div className="h-16 px-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3 overflow-hidden">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <div className="font-extrabold text-sm text-white tracking-tight truncate">
                  Debt Support Expert
                </div>
                <div className="text-[10px] uppercase font-bold text-amber-400/90 tracking-wider">
                  Legal CRM v2.0
                </div>
              </div>
            )}
          </Link>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? "bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? "text-slate-950" : "text-slate-400 group-hover:text-amber-400"
                  }`}
                />
                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge !== null && (
                      <span
                        className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-slate-950 text-amber-400"
                            : item.badgeColor || "bg-slate-800 text-slate-300"
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
      {!collapsed ? (
        <div className="p-4 border-t border-slate-800/80 m-3 rounded-xl bg-slate-900/60 text-xs space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Meta WhatsApp API Active</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Encrypted attorney-client work product under Indian Advocates Act 1961.
          </p>
        </div>
      ) : (
        <div className="p-3 border-t border-slate-800/80 flex justify-center">
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" title="Meta WhatsApp API Active" />
        </div>
      )}
    </aside>
  );
}
