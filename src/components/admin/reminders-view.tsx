"use client";

import * as React from "react";
import {
  Bell,
  Clock,
  CheckCircle2,
  AlertCircle,
  FolderOpen,
  Phone,
  MessageCircle,
  Calendar,
  Sparkles,
} from "lucide-react";
import { LeadDrawer } from "@/components/admin/lead-drawer";

export interface ReminderItem {
  id: string;
  leadId: string;
  leadReferenceId: string;
  clientName: string;
  clientPhone: string;
  scheduledAt: string;
  note: string;
  isCompleted: boolean;
  assignedAdvisorName?: string;
}

interface RemindersViewProps {
  initialReminders: ReminderItem[];
  staffMembers: Array<{ id: string; name: string; role: string }>;
}

export function RemindersView({
  initialReminders,
  staffMembers,
}: RemindersViewProps) {
  const [reminders, setReminders] = React.useState<ReminderItem[]>(initialReminders);
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

  const handleToggle = async (leadId: string, reminderId: string, currentStatus: boolean) => {
    // Optimistic update
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isCompleted: !currentStatus } : r))
    );

    try {
      await fetch(`/api/admin/leads/${leadId}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId, isCompleted: !currentStatus }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const overdueList = reminders.filter(
    (r) => !r.isCompleted && new Date(r.scheduledAt) < now
  );

  const todayList = reminders.filter(
    (r) =>
      !r.isCompleted &&
      new Date(r.scheduledAt) >= startOfToday &&
      new Date(r.scheduledAt) <= endOfToday
  );

  const upcomingAndDone = reminders.filter(
    (r) => r.isCompleted || new Date(r.scheduledAt) > endOfToday
  );

  const renderReminderCard = (rem: ReminderItem, isOverdue = false) => (
    <div
      key={rem.id}
      className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors shadow-sm ${
        rem.isCompleted
          ? "bg-gray-50/50 dark:bg-zinc-950/40 border-gray-200 dark:border-zinc-800 text-gray-400 dark:text-zinc-500 line-through"
          : isOverdue
          ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-gray-900 dark:text-zinc-200"
          : "bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-200"
      }`}
    >
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono font-bold text-amber-600 dark:text-amber-400 text-[11px]">
            {rem.leadReferenceId}
          </span>
          <span className="font-bold text-gray-900 dark:text-white text-sm">{rem.clientName}</span>
          <span className="font-mono text-gray-500 dark:text-zinc-400 text-[11px]">+{rem.clientPhone}</span>
          {isOverdue && !rem.isCompleted && (
            <span className="px-1.5 py-0.2 rounded bg-red-100 dark:bg-red-900/80 text-red-700 dark:text-red-300 font-extrabold text-[9px] uppercase tracking-wider">
              Overdue
            </span>
          )}
        </div>

        <p className="font-medium text-gray-700 dark:text-zinc-300">{rem.note}</p>

        <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-amber-600 dark:text-amber-400" />
            <span>{new Date(rem.scheduledAt).toLocaleString("en-IN")}</span>
          </span>
          {rem.assignedAdvisorName && (
            <span>Adv: {rem.assignedAdvisorName}</span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => handleToggle(rem.leadId, rem.id, rem.isCompleted)}
          className={`px-3 py-1.5 min-h-[36px] rounded-lg text-xs font-bold transition-colors ${
            rem.isCompleted
              ? "bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300"
              : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950/20"
          }`}
        >
          {rem.isCompleted ? "Mark Pending" : "Mark Completed"}
        </button>

        <button
          type="button"
          onClick={() => {
            setSelectedLeadId(rem.leadId);
            setDrawerOpen(true);
          }}
          className="p-2 min-h-[36px] min-w-[36px] flex items-center justify-center rounded-lg bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-amber-700 dark:text-amber-400 transition-colors"
          title="Open Case File"
          aria-label="Open Case File"
        >
          <FolderOpen className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
            Reminders & Follow-Up Desk
          </h1>
          <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 border border-gray-200 dark:border-zinc-700">
            {overdueList.length + todayList.length} Active
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
          Track scheduled client callbacks, settlement negotiations, and legal representation milestones.
        </p>
      </div>

      {/* Overdue Queue */}
      {overdueList.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-rose-600 dark:text-red-400 text-xs font-bold uppercase tracking-wider">
            <AlertCircle className="h-4 w-4" />
            <span>Overdue Callbacks ({overdueList.length})</span>
          </div>
          <div className="space-y-2">
            {overdueList.map((r) => renderReminderCard(r, true))}
          </div>
        </div>
      )}

      {/* Due Today Queue */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Calendar className="h-4 w-4" />
          <span>Scheduled Today ({todayList.length})</span>
        </div>
        <div className="space-y-2">
          {todayList.length > 0 ? (
            todayList.map((r) => renderReminderCard(r, false))
          ) : (
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center text-xs text-gray-500 dark:text-zinc-400">
              No callbacks due today.
            </div>
          )}
        </div>
      </div>

      {/* Upcoming & Completed Queue */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-500 dark:text-zinc-400 text-xs font-bold uppercase tracking-wider">
          <Clock className="h-4 w-4" />
          <span>Upcoming & Resolved ({upcomingAndDone.length})</span>
        </div>
        <div className="space-y-2">
          {upcomingAndDone.length > 0 ? (
            upcomingAndDone.map((r) => renderReminderCard(r, false))
          ) : (
            <div className="p-6 rounded-xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-center text-xs text-gray-500 dark:text-zinc-400">
              No upcoming reminders.
            </div>
          )}
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
      />
    </div>
  );
}
