"use client";

import * as React from "react";
import {
  Cpu,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Users,
  Shield,
  Loader2,
} from "lucide-react";

interface SystemAutomationProps {
  initialAutoAssign: boolean;
  isSuperAdmin: boolean;
  onToast: (type: "success" | "error" | "info", title: string, description?: string) => void;
}

export function SystemAutomation({
  initialAutoAssign,
  isSuperAdmin,
  onToast,
}: SystemAutomationProps) {
  const [autoAssign, setAutoAssign] = React.useState(initialAutoAssign);
  const [toggling, setToggling] = React.useState(false);

  const handleToggleAutoAssign = async () => {
    if (!isSuperAdmin) {
      onToast("error", "Access Denied", "Super Administrator authority required to modify automation settings.");
      return;
    }

    const previousState = autoAssign;
    const newState = !previousState;

    // Optimistic UI toggle
    setAutoAssign(newState);
    setToggling(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "AUTO_ASSIGN_LEADS",
          value: newState ? "true" : "false",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to update auto-assignment setting.");
      }

      onToast(
        "success",
        newState ? "Auto-Assignment Active" : "Auto-Assignment Disabled",
        newState
          ? "New borrower inquiries will automatically route to the least-loaded Support Agent."
          : "Leads will now enter the pipeline unassigned for manual advocate allocation."
      );
    } catch (err: unknown) {
      // Revert optimistic toggle
      setAutoAssign(previousState);
      const msg = err instanceof Error ? err.message : "Error updating setting";
      onToast("error", "Update Failed", msg);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Automation Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">System Automation & Work Allocation</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Automated intake routing engines and attorney-client workload balancers.
            </p>
          </div>
        </div>

        {/* Round-Robin Toggle Card */}
        <div className="p-5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Round-Robin Lead Auto-Assignment</h3>
              <span
                className={`px-2 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${
                  autoAssign
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                {autoAssign ? "Engine Online" : "Manual Only"}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automatically distribute incoming website leads to the Support Agent or Legal Advisor with the fewest active cases using a Least-Loaded-Agent algorithm.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center gap-3 shrink-0">
            <span className="text-xs font-mono font-bold text-slate-300">
              {autoAssign ? "ENABLED" : "DISABLED"}
            </span>

            <button
              type="button"
              disabled={!isSuperAdmin || toggling}
              onClick={handleToggleAutoAssign}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50 ${
                autoAssign ? "bg-amber-500" : "bg-slate-800"
              }`}
              title={
                isSuperAdmin
                  ? "Toggle Round-Robin Auto-Assignment"
                  : "Super Administrator authority required"
              }
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-slate-950 shadow ring-0 transition duration-200 ease-in-out ${
                  autoAssign ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Algorithm Blueprint Notes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
            <span className="text-amber-400 font-bold block text-[11px]">1. Tier 1 Allocation</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Inquiries evaluate active <span className="text-slate-200 font-mono">SUPPORT_AGENT</span> staff first by lowest assigned case count.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
            <span className="text-blue-400 font-bold block text-[11px]">2. Fail-Safe Fallback</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              If no support agents are active, gracefully cascades to least-loaded active <span className="text-slate-200 font-mono">LEGAL_ADVISOR</span>.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/60 space-y-1">
            <span className="text-emerald-400 font-bold block text-[11px]">3. Audit Trail</span>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every routing event logs a permanent <span className="text-slate-200 font-mono">LEAD_AUTO_ASSIGNED</span> entry in Activity Log.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
