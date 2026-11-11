"use client";

import * as React from "react";
import {
  ShieldCheck,
  MessageSquare,
  Send,
} from "lucide-react";
import { UserRole } from "@/lib/auth";
import { UserManagement, StaffUserItem } from "@/components/admin/settings/user-management";

interface SettingsViewProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  staffUsers: StaffUserItem[];
  configState: {
    dbProvider: string;
    hasMetaToken: boolean;
    hasPhoneNumberId: boolean;
    adminWhatsAppNumber: string;
    appUrl: string;
    nodeEnv: string;
  };
}

export function SettingsView({ currentUser, staffUsers, configState }: SettingsViewProps) {
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
          Counsel Settings & Access Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Super Administrator portal for staff credentials, RBAC authority, and Meta WhatsApp Cloud API status.
        </p>
      </div>

      {/* Grid: Meta WhatsApp & Security Health Cards */}
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
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-95"
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
              <span className="font-mono text-emerald-400 font-bold">HttpOnly, SameSite=Strict (8h)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/60">
              <span className="text-slate-400">Bot Honeypot Protection:</span>
              <span className="font-mono text-emerald-400 font-bold">Enabled (Silent Drop)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Password Hashing:</span>
              <span className="font-mono text-emerald-400 font-bold">Bcrypt (Salt Rounds: 10)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive User & Access Management Module */}
      <UserManagement
        currentUser={currentUser}
        initialStaffUsers={staffUsers}
      />
    </div>
  );
}
