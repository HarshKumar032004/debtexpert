"use client";

import * as React from "react";
import {
  ShieldCheck,
  MessageSquare,
  Send,
  Users,
  Cpu,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { UserRole } from "@/lib/auth";
import { UserManagement, StaffUserItem } from "@/components/admin/settings/user-management";
import { TemplateManager, TemplateItem } from "@/components/admin/settings/template-manager";
import { SystemAutomation } from "@/components/admin/settings/system-automation";

interface SettingsViewProps {
  currentUser: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  staffUsers: StaffUserItem[];
  templates: TemplateItem[];
  autoAssignLeads: boolean;
  configState: {
    dbProvider: string;
    hasMetaToken: boolean;
    hasPhoneNumberId: boolean;
    adminWhatsAppNumber: string;
    appUrl: string;
    nodeEnv: string;
  };
}

interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  title: string;
  description?: string;
}

export function SettingsView({
  currentUser,
  staffUsers,
  templates,
  autoAssignLeads,
  configState,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = React.useState<"STAFF" | "TEMPLATES" | "AUTOMATION">("STAFF");
  const [testingWhatsApp, setTestingWhatsApp] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  // Global Toast System
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTestWhatsApp = async () => {
    setTestingWhatsApp(true);
    setTestResult(null);

    try {
      const res = await fetch("/api/admin/test-whatsapp", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setTestResult(data.message || "Test alert processed successfully.");
        addToast("success", "Test Alert Dispatched", data.message || "Alert processed via Meta WhatsApp.");
      } else {
        setTestResult(`Error: ${data.error || "Failed to trigger test."}`);
        addToast("error", "Dispatch Failed", data.error || "Failed to trigger test alert.");
      }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      setTestResult(`Network error: ${msg}`);
      addToast("error", "Network Error", msg);
    } finally {
      setTestingWhatsApp(false);
    }
  };

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white">
          Counsel Settings & System Health
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Super Administrator portal for staff credentials, WhatsApp quick-reply templates, and lead routing automation.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab("STAFF")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "STAFF"
              ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Staff & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("TEMPLATES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "TEMPLATES"
              ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Templates</span>
        </button>

        <button
          onClick={() => setActiveTab("AUTOMATION")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === "AUTOMATION"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
              : "text-slate-400 hover:text-white hover:bg-slate-900"
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>System Automation & Health</span>
        </button>
      </div>

      {/* TAB 1: STAFF MANAGEMENT */}
      {activeTab === "STAFF" && (
        <UserManagement
          currentUser={currentUser}
          initialStaffUsers={staffUsers}
        />
      )}

      {/* TAB 2: WHATSAPP TEMPLATES */}
      {activeTab === "TEMPLATES" && (
        <TemplateManager
          initialTemplates={templates}
          isSuperAdmin={isSuperAdmin}
          onToast={addToast}
        />
      )}

      {/* TAB 3: SYSTEM AUTOMATION & HEALTH */}
      {activeTab === "AUTOMATION" && (
        <div className="space-y-8">
          {/* Round-Robin Auto-Assignment Toggle Card */}
          <SystemAutomation
            initialAutoAssign={autoAssignLeads}
            isSuperAdmin={isSuperAdmin}
            onToast={addToast}
          />

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
        </div>
      )}

      {/* Shared Toast Container */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200 ${
              toast.type === "success"
                ? "bg-slate-900/95 border-emerald-500/40 text-emerald-300"
                : toast.type === "error"
                ? "bg-slate-900/95 border-rose-500/40 text-rose-300"
                : "bg-slate-900/95 border-blue-500/40 text-blue-300"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-blue-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
