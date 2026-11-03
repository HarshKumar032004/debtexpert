"use client";

import * as React from "react";
import {
  Settings,
  ShieldCheck,
  Users,
  Database,
  Lock,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sparkles,
  Terminal,
} from "lucide-react";

interface SettingsViewProps {
  staffUsers: Array<{
    id: string;
    name: string;
    email: string;
    role: string;
    isActive: boolean;
    createdAt: string;
  }>;
  configState: {
    dbProvider: string;
    hasMetaToken: boolean;
    hasPhoneNumberId: boolean;
    adminWhatsAppNumber: string;
    appUrl: string;
    nodeEnv: string;
  };
}

export function SettingsView({ staffUsers, configState }: SettingsViewProps) {
  const [testingWhatsApp, setTestingWhatsApp] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/test-whatsapp", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.message || "Test alert processed successfully.");
      } else {
        setTestResult(`Error: ${data.error || "Failed to trigger test."}`);
      }
    } catch (e: unknown) {
      setTestResult(`Network error: ${e instanceof Error ? e.message : String(e)}`);
    } finally {
      setTestingWhatsApp(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Counsel Settings & System Health
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Inspect Meta WhatsApp Cloud API connectivity, advocate staff user permissions, and security parameters.
        </p>
      </div>

      {/* Grid: Meta WhatsApp & Security */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Meta WhatsApp Cloud API Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Meta WhatsApp Cloud API</h2>
                <span className="text-[10px] font-mono text-emerald-400">Target: Graph API v21.0</span>
              </div>
            </div>

            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                configState.hasMetaToken
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
              }`}
            >
              {configState.hasMetaToken ? "Live Production" : "Local Dev Simulation"}
            </span>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Admin Notification Mobile:</span>
              <span className="font-mono text-white font-bold">+{configState.adminWhatsAppNumber}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Token Status:</span>
              <span className="font-mono text-slate-300">
                {configState.hasMetaToken ? "Loaded via .env" : "Mock Fallback Active (Clean Console Logs)"}
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Phone Number ID:</span>
              <span className="font-mono text-slate-300">
                {configState.hasPhoneNumberId ? "Loaded via .env" : "Using Dev Simulation Mock"}
              </span>
            </div>
          </div>

          {/* Test Action */}
          <div className="pt-2">
            <button
              onClick={handleTestWhatsApp}
              disabled={testingWhatsApp}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5 text-amber-400" />
              <span>{testingWhatsApp ? "Dispatching..." : "Send Test Lead Alert"}</span>
            </button>
            {testResult && (
              <p className="mt-2 text-[11px] p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                {testResult}
              </p>
            )}
          </div>
        </div>

        {/* Security & Database Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Security & Environment</h2>
              <span className="text-[10px] font-mono text-blue-400">JWT & Ingestion Firewall</span>
            </div>
          </div>

          <div className="space-y-2 text-xs border-t border-slate-800 pt-3">
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Database Engine:</span>
              <span className="font-mono text-white font-bold">{configState.dbProvider}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Session Cookie:</span>
              <span className="font-mono text-emerald-400 font-bold">HttpOnly, SameSite=Lax (7 Days)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bot Honeypot Protection:</span>
              <span className="font-mono text-emerald-400 font-bold">Enabled (Silent Drop)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">IP Rate Limiter:</span>
              <span className="font-mono text-slate-300">Max 15 Requests / Minute</span>
            </div>
          </div>
        </div>
      </div>

      {/* Staff User Roster Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-amber-400" />
            <div>
              <h2 className="text-sm font-bold text-white">Authorized Counsel & Staff Accounts</h2>
              <p className="text-[11px] text-slate-400">
                Role-based access control protecting all case files and client records
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-4 py-3 font-bold">Counsel Name</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">RBAC Role</th>
                <th className="px-4 py-3 font-bold">Status</th>
                <th className="px-4 py-3 font-bold">Account Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {staffUsers.map((staff) => (
                <tr key={staff.id} className="hover:bg-slate-800/30">
                  <td className="px-4 py-3 font-bold text-slate-200">{staff.name}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{staff.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                        staff.role === "SUPER_ADMIN"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          : staff.role === "LEGAL_ADVISOR"
                          ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                          : "bg-slate-800 text-slate-300 border border-slate-700"
                      }`}
                    >
                      {staff.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Active</span>
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(staff.createdAt).toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
