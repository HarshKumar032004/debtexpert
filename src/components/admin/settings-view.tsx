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
  Loader2,
  Database,
  RefreshCw,
  Zap,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { UserRole } from "@/lib/auth";
import { UserManagement, StaffUserItem } from "@/components/admin/settings/user-management";
import { TemplateManager, TemplateItem } from "@/components/admin/settings/template-manager";
import { SystemAutomation } from "@/components/admin/settings/system-automation";
import { SystemHealthData } from "@/lib/system-health";

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
  initialHealth?: SystemHealthData;
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
  initialHealth,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = React.useState<"STAFF" | "TEMPLATES" | "AUTOMATION">("STAFF");
  const [testingWhatsApp, setTestingWhatsApp] = React.useState(false);
  const [testResult, setTestResult] = React.useState<string | null>(null);

  // Dynamic Live Health State
  const [health, setHealth] = React.useState<SystemHealthData | null>(initialHealth || null);
  const [refreshingHealth, setRefreshingHealth] = React.useState(false);

  const handleRefreshHealth = async () => {
    setRefreshingHealth(true);
    try {
      const res = await fetch("/api/admin/health", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && data.success && data.health) {
        setHealth(data.health);
        addToast("success", "Diagnostics Updated", "Live database and Meta API probes verified successfully.");
      } else {
        addToast("error", "Diagnostics Check Failed", data.error || "Could not retrieve live health probe.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Network error probing health.";
      addToast("error", "Diagnostic Error", msg);
    } finally {
      setRefreshingHealth(false);
    }
  };

  // Global Toast System
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const addToast = (type: "success" | "error" | "info", title: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev, { id, type, title, description }]);
    if (type === "success") {
      toast.success(title, { description });
    } else if (type === "error") {
      toast.error(title, { description });
    } else {
      toast.info(title, { description });
    }
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
        <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
          Counsel Settings & System Health
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
          Super Administrator portal for staff credentials, WhatsApp quick-reply templates, and lead routing automation.
        </p>
      </div>

      {/* Navigation Tabs - Horizontally scrollable on mobile */}
      <div className="flex items-center gap-2 border-b border-gray-200 dark:border-zinc-800 pb-2 overflow-x-auto whitespace-nowrap scrollbar-thin">
        <button
          onClick={() => setActiveTab("STAFF")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] shrink-0 ${
            activeTab === "STAFF"
              ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
              : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Staff & Permissions</span>
        </button>

        <button
          onClick={() => setActiveTab("TEMPLATES")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] shrink-0 ${
            activeTab === "TEMPLATES"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900"
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          <span>WhatsApp Templates</span>
        </button>

        <button
          onClick={() => setActiveTab("AUTOMATION")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all min-h-[40px] shrink-0 ${
            activeTab === "AUTOMATION"
              ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
              : "text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-900"
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

          {/* Real-time Diagnostics Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gray-100/80 dark:bg-zinc-900/80 border border-gray-200 dark:border-zinc-800">
            <div className="flex items-center gap-2.5">
              <Activity className="h-5 w-5 text-amber-500 animate-pulse shrink-0" />
              <div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Live System Diagnostics & Dynamic Health</h3>
                <p className="text-[11px] text-gray-500 dark:text-zinc-400">
                  Real-time query probe for PostgreSQL Database, Meta WhatsApp Graph API, and Gateway Firewall.
                </p>
              </div>
            </div>
            <button
              onClick={handleRefreshHealth}
              disabled={refreshingHealth}
              className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-60 shrink-0"
            >
              <RefreshCw className={`h-3.5 w-3.5 text-amber-500 ${refreshingHealth ? "animate-spin" : ""}`} />
              <span>{refreshingHealth ? "Probing System..." : "Re-check Live Health"}</span>
            </button>
          </div>

          {/* Grid: Database, Meta WhatsApp, & Security Health Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Card 1: Database Engine Status */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Database Engine</h4>
                      <span className="text-[10px] font-mono text-gray-500 dark:text-zinc-400">Prisma ORM • Client Pool</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      health?.database.active
                        ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                        : "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                    }`}
                  >
                    {health?.database.active && (
                      <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                      </span>
                    )}
                    {health?.database.active ? "Active & Connected" : "Disconnected"}
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-gray-200 dark:border-zinc-800 pt-3">
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Status:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {health?.database.status || "CONNECTED"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Query Latency:</span>
                    <span className="font-mono text-amber-600 dark:text-amber-400 font-bold">
                      ⚡ {health?.database.latencyMs ?? 0} ms
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Host Engine:</span>
                    <span className="font-mono text-gray-900 dark:text-white font-semibold truncate max-w-[160px]" title={health?.database.provider}>
                      {health?.database.provider || configState.dbProvider}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-zinc-400">Live Records:</span>
                    <span className="font-mono text-gray-700 dark:text-zinc-300">
                      {health?.database.totalLeads ?? 0} Leads • {health?.database.totalUsers ?? 0} Staff
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-gray-500 dark:text-zinc-500 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500 shrink-0" />
                <span>SSL Connection Pool • Active Health Probe</span>
              </div>
            </div>

            {/* Card 2: Meta WhatsApp Cloud API Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Meta WhatsApp API</h4>
                      <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">Graph API v21.0/v26.0</span>
                    </div>
                  </div>

                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      health?.meta.status === "LIVE_CONNECTED"
                        ? "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                        : health?.meta.status === "RESTRICTED"
                        ? "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                        : health?.meta.status === "AUTH_ERROR"
                        ? "bg-rose-500/10 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                        : "bg-gray-500/10 text-gray-700 dark:bg-gray-500/20 dark:text-gray-300 border border-gray-500/30"
                    }`}
                  >
                    {health?.meta.active && (
                      <span className="relative flex h-1.5 w-1.5 mr-1.5">
                        <span
                          className={`animate-ping absolute inline-flex h-full w-full rounded-full ${
                            health?.meta.status === "LIVE_CONNECTED" ? "bg-emerald-400" : "bg-amber-400"
                          } opacity-75`}
                        ></span>
                        <span
                          className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
                            health?.meta.status === "LIVE_CONNECTED" ? "bg-emerald-500" : "bg-amber-500"
                          }`}
                        ></span>
                      </span>
                    )}
                    {health?.meta.status === "LIVE_CONNECTED"
                      ? "Live & Connected"
                      : health?.meta.status === "RESTRICTED"
                      ? "Meta Action Required"
                      : health?.meta.status === "AUTH_ERROR"
                      ? "Auth Error"
                      : "Simulation Mock"}
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-gray-200 dark:border-zinc-800 pt-3">
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Account / Verified:</span>
                    <span className="font-mono text-gray-900 dark:text-white font-bold truncate max-w-[150px]">
                      {health?.meta.verifiedName || "WhatsApp Business"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Sender Number:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold truncate max-w-[150px]">
                      {health?.meta.displayPhoneNumber || health?.meta.phoneNumberId || "Not Registered"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Quality / Ping:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {health?.meta.qualityRating || "GREEN"} {health?.meta.latencyMs ? `(⚡${health.meta.latencyMs}ms)` : ""}
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-zinc-400">Admin Receiver:</span>
                    <span className="font-mono text-gray-700 dark:text-zinc-300">
                      +{health?.meta.adminWhatsAppNumber || configState.adminWhatsAppNumber}
                    </span>
                  </div>

                  {/* Render Meta Restrictions / Required Actions */}
                  {health?.meta.healthErrors && health.meta.healthErrors.length > 0 && (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-800 dark:text-amber-300 space-y-1.5 mt-2">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertCircle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                        <span>Delivery Blocked by Meta:</span>
                      </div>
                      <ul className="list-disc list-inside space-y-1 text-[10px] leading-relaxed text-amber-900/90 dark:text-amber-200/90">
                        {health.meta.healthErrors.map((err, i) => (
                          <li key={i}>
                            <span className="font-semibold">[{err.entityType} #{err.code}]</span> {err.description}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Test Action */}
              <div className="pt-2">
                <button
                  onClick={handleTestWhatsApp}
                  disabled={testingWhatsApp}
                  className="w-full py-2 px-3 rounded-xl bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 text-xs font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2 transition-colors disabled:opacity-50 active:scale-95 min-h-[38px]"
                >
                  {testingWhatsApp ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-amber-600 dark:text-amber-400" />
                      <span>Dispatching...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                      <span>Send Test Lead Alert</span>
                    </>
                  )}
                </button>
                {testResult && (
                  <p className="mt-2 text-[11px] p-2 rounded-lg bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 text-gray-700 dark:text-zinc-300">
                    {testResult}
                  </p>
                )}
              </div>
            </div>

            {/* Card 3: Security & Gateway Firewall */}
            <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-xl space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white">Security & Gateway</h4>
                      <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400">Ingestion Guard</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30">
                    <span className="relative flex h-1.5 w-1.5 mr-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    Guarded
                  </span>
                </div>

                <div className="space-y-2 text-xs border-t border-gray-200 dark:border-zinc-800 pt-3">
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Webhook Verification:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {health?.security.webhookConfigured ? "Token Guard Active" : "Unset"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">HMAC-SHA256:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      {health?.security.appSecretConfigured ? "Constant-Time Match" : "Dev Simulation"}
                    </span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-zinc-800/60">
                    <span className="text-gray-500 dark:text-zinc-400">Session JWT Token:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      HttpOnly (8h TTL)
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-500 dark:text-zinc-400">Bot Honeypot:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      Active (Silent Drop)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-gray-500 dark:text-zinc-500 truncate" title={health?.security.appUrl}>
                <span>App URL: {health?.security.appUrl || configState.appUrl}</span>
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
                ? "bg-white/95 dark:bg-zinc-900/95 border-emerald-500/40 text-emerald-800 dark:text-emerald-300"
                : toast.type === "error"
                ? "bg-white/95 dark:bg-zinc-900/95 border-rose-500/40 text-rose-800 dark:text-rose-300"
                : "bg-white/95 dark:bg-zinc-900/95 border-blue-500/40 text-blue-800 dark:text-blue-300"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {toast.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              ) : toast.type === "error" ? (
                <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="text-xs font-bold text-gray-900 dark:text-white">{toast.title}</h4>
                {toast.description && (
                  <p className="text-[11px] text-gray-600 dark:text-zinc-300 mt-0.5 leading-relaxed">{toast.description}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-gray-400 hover:text-gray-700 dark:text-zinc-400 dark:hover:text-white p-1 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
