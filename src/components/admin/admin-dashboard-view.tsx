"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  AlertTriangle,
  Calendar,
  TrendingUp,
  ChevronRight,
  DollarSign,
  ArrowUpRight,
  Radar,
} from "lucide-react";
import { LeadDrawer } from "@/components/admin/lead-drawer";
import { calculateLeadScore } from "@/lib/lead-scoring";

interface KpiData {
  totalActive: number;
  harassmentCount: number;
  scheduledCount: number;
  pipelineValueStr: string;
  conversionRate: number;
}

interface DailyVolume {
  dayLabel: string;
  dateStr: string;
  count: number;
  isToday: boolean;
}

interface FollowUpLead {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  city?: string | null;
  totalDebtRange?: string | null;
  legalIssue: string;
  harassmentLevel?: string | null;
  status: string;
  nextFollowUpAt?: string | null;
  lastMessageAt: string;
}

interface AdminDashboardViewProps {
  kpis: KpiData;
  dailyVolume: DailyVolume[];
  initialFollowUps: FollowUpLead[];
  staffMembers: Array<{ id: string; name: string; role: string }>;
}

export function AdminDashboardView({
  kpis,
  dailyVolume,
  initialFollowUps,
  staffMembers,
}: AdminDashboardViewProps) {
  const [followUps, setFollowUps] = React.useState<FollowUpLead[]>(initialFollowUps);
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Maximum count for chart bar scaling
  const maxVolume = Math.max(1, ...dailyVolume.map((d) => d.count));

  // Quick 1-Click action: Mark Contacted
  const handleMarkContacted = async (leadId: string) => {
    // Optimistic UI update
    setFollowUps((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: "CONTACTED" } : l))
    );

    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "CONTACTED" }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Quick 1-Click action: Postpone 24h
  const handlePostpone24h = async (leadId: string) => {
    const targetDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    setFollowUps((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, nextFollowUpAt: targetDate } : l))
    );

    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nextFollowUpAt: targetDate }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const openDrawer = (leadId: string) => {
    setSelectedLeadId(leadId);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Welcome & Quick Jump */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>Executive Command Center</span>
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
              Live Real-Time
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Real-time borrower ingestion telemetry, emergency harassment monitoring, and OTS pipeline tracking.
          </p>
        </div>

        <Link
          href="/admin/leads"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20 active:scale-95 transition-all"
        >
          <span>Open Full Leads Table</span>
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {/* KPI 1: Total Inquiries */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Inquiries</span>
            <Users className="h-4 w-4 text-blue-500 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{kpis.totalActive}</div>
          <p className="text-[11px] text-gray-500 dark:text-zinc-500 flex items-center gap-1">
            <span>5 Funnels Ingesting</span>
          </p>
        </div>

        {/* KPI 2: Harassment Emergencies */}
        <div className="p-5 rounded-2xl bg-red-50/60 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-red-600 dark:text-red-400">
            <span className="text-xs font-bold uppercase tracking-wider">Harassment Cases</span>
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
          <div className="text-3xl font-extrabold text-red-600 dark:text-red-400">{kpis.harassmentCount}</div>
          <p className="text-[11px] text-red-600/80 dark:text-red-400/80">Immediate Legal Notice</p>
        </div>

        {/* KPI 3: Consultations Scheduled */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Consultations</span>
            <Calendar className="h-4 w-4 text-amber-500 dark:text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-400">{kpis.scheduledCount}</div>
          <p className="text-[11px] text-gray-500 dark:text-zinc-500">Scheduled Bookings</p>
        </div>

        {/* KPI 4: Estimated Pipeline Value */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Debt</span>
            <DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {kpis.pipelineValueStr}
          </div>
          <p className="text-[11px] text-gray-500 dark:text-zinc-500">Under Active OTS Defense</p>
        </div>

        {/* KPI 5: Conversion Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-2 relative overflow-hidden group">
          <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400">
            <span className="text-xs font-bold uppercase tracking-wider">OTS Conversion</span>
            <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">{kpis.conversionRate}%</div>
          <p className="text-[11px] text-gray-500 dark:text-zinc-500">Inquiry to Sanctioned OTS</p>
        </div>
      </div>

      {/* Mid Section: Follow-Up Radar & Daily Volume Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Follow-Up Radar Card (7 Cols) */}
        <div className="lg:col-span-7 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-zinc-800 flex items-center justify-between bg-gray-50/80 dark:bg-zinc-950/40">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Radar className="h-4 w-4 animate-pulse" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <span>Follow-Up Radar</span>
                  <span className="px-2 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 text-[10px] font-mono">
                    {followUps.length} Pending
                  </span>
                </h2>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Priority callbacks due now or requiring follow-up action
                </p>
              </div>
            </div>

            <Link
              href="/admin/reminders"
              className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
            >
              <span>View Reminders</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-gray-100 dark:divide-zinc-800/80 flex-1 overflow-y-auto max-h-[380px]">
            {followUps.length > 0 ? (
              followUps.map((item) => {
                const isOverdue =
                  item.nextFollowUpAt && new Date(item.nextFollowUpAt) < new Date();
                const score = calculateLeadScore(item);

                return (
                  <div
                    key={item.id}
                    className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-[11px]">
                          {item.referenceId}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">
                          {item.fullName}
                        </span>
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                            score.tier === "HOT"
                              ? "bg-red-500/15 text-red-700 dark:text-red-300"
                              : "bg-amber-500/15 text-amber-700 dark:text-amber-300"
                          }`}
                        >
                          {score.tier}
                        </span>
                        {isOverdue && (
                          <span className="text-[10px] font-bold text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-950/80 px-1.5 py-0.5 rounded border border-red-300 dark:border-red-800">
                            OVERDUE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-zinc-400 flex-wrap">
                        <span>📱 +{item.phone}</span>
                        {item.city && <span>📍 {item.city}</span>}
                        {item.totalDebtRange && (
                          <span className="font-semibold text-gray-700 dark:text-zinc-300">
                            💰 {item.totalDebtRange}
                          </span>
                        )}
                        <span className="text-gray-500 dark:text-zinc-500 truncate max-w-[160px]">
                          {item.legalIssue}
                        </span>
                      </div>
                    </div>

                    {/* 1-Click Action Buttons */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleMarkContacted(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold border border-gray-200 dark:border-zinc-700 transition-colors"
                        title="Mark Status as Contacted"
                      >
                        Contacted
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePostpone24h(item.id)}
                        className="px-2.5 py-1.5 rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-200 text-[11px] font-semibold border border-gray-200 dark:border-zinc-700 transition-colors"
                        title="Delay follow-up by 24 hours"
                      >
                        +24h
                      </button>

                      <button
                        type="button"
                        onClick={() => openDrawer(item.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold shadow transition-colors"
                      >
                        Open File
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-8 text-center text-gray-500 dark:text-zinc-500 text-xs">
                No overdue follow-ups! All active case files contacted.
              </div>
            )}
          </div>
        </div>

        {/* 7-Day Ingestion Volume Chart (5 Cols) */}
        <div className="lg:col-span-5 rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm p-4 sm:p-5 flex flex-col justify-between">
          <div className="space-y-1 mb-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white flex items-center justify-between">
              <span>7-Day Ingestion Volume</span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
                Active Inflow
              </span>
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-zinc-400">
              Daily verified borrower submissions across web funnels & WhatsApp
            </p>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-2 pt-4 px-2">
            {dailyVolume.map((vol) => {
              const heightPct = Math.max(12, Math.round((vol.count / maxVolume) * 100));

              return (
                <div key={vol.dateStr} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-zinc-400 group-hover:text-amber-500 transition-colors">
                    {vol.count}
                  </span>
                  <div
                    className="w-full rounded-t-lg transition-all duration-300 relative"
                    style={{
                      height: `${heightPct}%`,
                      backgroundColor: vol.isToday
                        ? "#f59e0b"
                        : vol.count > 0
                        ? "#0ea5e9"
                        : "#94a3b8",
                    }}
                  />
                  <span
                    className={`text-[10px] font-medium uppercase ${
                      vol.isToday ? "text-amber-600 dark:text-amber-400 font-bold" : "text-gray-500 dark:text-zinc-500"
                    }`}
                  >
                    {vol.dayLabel}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-zinc-800/80 flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
            <span>Peak Day: {maxVolume} Inquiries</span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Today</span>
            </span>
          </div>
        </div>
      </div>

      {/* 360 Client Case Drawer */}
      <LeadDrawer
        leadId={selectedLeadId}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLeadId(null);
        }}
        staffMembers={staffMembers}
        onLeadUpdated={(updated) => {
          if (updated.status) {
            setFollowUps((prev) =>
              prev.map((l) => (l.id === updated.id ? { ...l, status: updated.status! } : l))
            );
          }
        }}
      />
    </div>
  );
}
