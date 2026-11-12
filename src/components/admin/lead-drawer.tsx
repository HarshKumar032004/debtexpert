"use client";

import * as React from "react";
import Link from "next/link";
import {
  X,
  Phone,
  MessageCircle,
  Clock,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  Building2,
  FileText,
  Send,
  User,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  History,
  Sparkles,
  DollarSign,
  ChevronRight,
} from "lucide-react";
import { calculateLeadScore, LeadScoreResult } from "@/lib/lead-scoring";

export interface LeadDetailData {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  source: string;
  legalIssue: string;
  lenders?: string | null;
  totalDebtRange?: string | null;
  overdueStatus?: string | null;
  harassmentLevel?: string | null;
  settlementReadiness?: string | null;
  consultationMode?: string | null;
  consultationSlot?: string | null;
  preferredCallbackTime?: string | null;
  message?: string | null;
  status: string;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; role: string } | null;
  nextFollowUpAt?: string | null;
  unreadCount: number;
  lastMessageAt: string;
  consentGiven: boolean;
  consentTimestamp: string;
  ipAddress?: string | null;
  createdAt: string;
  notes?: Array<{
    id: string;
    authorName: string;
    content: string;
    createdAt: string;
  }>;
  reminders?: Array<{
    id: string;
    scheduledAt: string;
    note: string;
    isCompleted: boolean;
  }>;
  whatsAppMessages?: Array<{
    id: string;
    direction: string;
    type: string;
    content: string;
    status: string;
    createdAt: string;
  }>;
  activityLogs?: Array<{
    id: string;
    actorName: string;
    action: string;
    details: string;
    createdAt: string;
  }>;
}

interface LeadDrawerProps {
  leadId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onLeadUpdated?: (updatedLead: Partial<LeadDetailData>) => void;
  staffMembers?: Array<{ id: string; name: string; role: string }>;
}

export function LeadDrawer({
  leadId,
  isOpen,
  onClose,
  onLeadUpdated,
  staffMembers = [],
}: LeadDrawerProps) {
  const [lead, setLead] = React.useState<LeadDetailData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<"details" | "notes" | "reminders" | "timeline">("details");

  // Form states
  const [newNote, setNewNote] = React.useState("");
  const [submittingNote, setSubmittingNote] = React.useState(false);
  const [reminderDate, setReminderDate] = React.useState("");
  const [reminderNote, setReminderNote] = React.useState("");
  const [submittingReminder, setSubmittingReminder] = React.useState(false);
  const [statusUpdating, setStatusUpdating] = React.useState(false);

  // Fetch full 360 lead details when leadId changes
  React.useEffect(() => {
    if (!leadId || !isOpen) return;

    let isMounted = true;
    setLoading(true);

    fetch(`/api/admin/leads/${leadId}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.success && data.lead) {
          setLead(data.lead);
        }
      })
      .catch((err) => console.error("Error loading lead 360 data:", err))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [leadId, isOpen]);

  if (!isOpen) return null;

  const scoreResult: LeadScoreResult = lead
    ? calculateLeadScore(lead)
    : { score: 20, tier: "NURTURE", reasons: [] };

  // Status changer handler
  const handleStatusChange = async (newStatus: string) => {
    if (!lead) return;
    setStatusUpdating(true);

    // Optimistic update
    const prevStatus = lead.status;
    setLead({ ...lead, status: newStatus });
    if (onLeadUpdated) onLeadUpdated({ id: lead.id, status: newStatus });

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        setLead({ ...lead, status: prevStatus });
      }
    } catch {
      setLead({ ...lead, status: prevStatus });
    } finally {
      setStatusUpdating(false);
    }
  };

  // Advisor assignment handler
  const handleAssigneeChange = async (advisorId: string) => {
    if (!lead) return;
    const selectedAdvisor = staffMembers.find((s) => s.id === advisorId) || null;
    setLead({ ...lead, assignedToId: advisorId, assignedTo: selectedAdvisor });

    try {
      await fetch(`/api/admin/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedToId: advisorId }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Add internal note handler
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !newNote.trim()) return;

    setSubmittingNote(true);
    const content = newNote.trim();

    // Sub-50ms Optimistic Note Update
    const tempNote = {
      id: `temp_${Date.now()}`,
      authorName: "You (Advocate Desk)",
      content,
      createdAt: new Date().toISOString(),
    };

    setLead({
      ...lead,
      notes: [tempNote, ...(lead.notes || [])],
    });
    setNewNote("");

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await res.json();

      if (data.success && data.note) {
        setLead((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            notes: (prev.notes || []).map((n) => (n.id === tempNote.id ? data.note : n)),
          };
        });
      }
    } catch (err) {
      console.error("Error creating note:", err);
      // Revert optimistic note on network failure
      setLead((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          notes: (prev.notes || []).filter((n) => n.id !== tempNote.id),
        };
      });
    } finally {
      setSubmittingNote(false);
    }
  };

  // Schedule follow-up reminder handler
  const handleScheduleReminder = async (scheduledAt: string, noteText: string) => {
    if (!lead || !scheduledAt) return;
    setSubmittingReminder(true);

    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scheduledAt: new Date(scheduledAt).toISOString(),
          note: noteText || "Follow up call",
        }),
      });
      const data = await res.json();

      if (data.success && data.reminder) {
        setLead({
          ...lead,
          nextFollowUpAt: scheduledAt,
          reminders: [data.reminder, ...(lead.reminders || [])],
        });
        setReminderDate("");
        setReminderNote("");
        if (onLeadUpdated) onLeadUpdated({ id: lead.id, nextFollowUpAt: scheduledAt });
      }
    } catch (err) {
      console.error("Error scheduling reminder:", err);
    } finally {
      setSubmittingReminder(false);
    }
  };

  // Quick postpone reminder shortcut
  const handleQuickPostpone = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 60 * 60 * 1000);
    handleScheduleReminder(
      target.toISOString(),
      `Postponed callback (+${hoursFromNow}h)`
    );
  };

  // Toggle reminder completion
  const handleToggleReminder = async (reminderId: string, currentStatus: boolean) => {
    if (!lead) return;
    try {
      const res = await fetch(`/api/admin/leads/${lead.id}/reminders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reminderId, isCompleted: !currentStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setLead({
          ...lead,
          reminders: lead.reminders?.map((r) =>
            r.id === reminderId ? { ...r, isCompleted: !currentStatus } : r
          ),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Dispatch Fee Proposal formatted WhatsApp text
  const dispatchFeeProposal = (planName: string, fee: string, scopeText: string) => {
    if (!lead) return;

    const proposalMessage = [
      `⚖️ *LEGAL FEE PROPOSAL & ADVOCATE ENGAGEMENT*`,
      `*Debt Support Expert — Senior Advocate Panel*`,
      `----------------------------------------`,
      `Dear ${lead.fullName},`,
      ``,
      `Pursuant to the legal audit of your loan portfolio under Case File #${lead.referenceId}, we recommend the following structured legal representation package:`,
      ``,
      `📁 *Recommended Plan:* ${planName}`,
      `💰 *Professional Legal Retainer:* ${fee} (One-Time / All Inclusive)`,
      ``,
      `🛡️ *Scope of Legal Work:*`,
      scopeText,
      ``,
      `⏰ *Statutory Protection:*`,
      `Upon formal engagement, our advocate panel issues immediate Section 2(1)(d) legal representation notices to all your lending institutions, compelling all recovery calls and unauthorized visits to stop immediately.`,
      `----------------------------------------`,
      `To accept this engagement proposal, please reply *"AGREE"* or call your assigned advocate.`,
      `_High Court Empanelled Advocate Desk_`,
    ].join("\n");

    const waUrl = `https://wa.me/${lead.phone}?text=${encodeURIComponent(proposalMessage)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end transition-opacity duration-300">
      <div
        className="w-full md:w-[600px] max-w-full bg-white dark:bg-zinc-900 border-l border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-zinc-100 h-full flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-right duration-300"
        role="dialog"
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 dark:border-zinc-800 bg-gray-50/90 dark:bg-zinc-950/60 flex items-start justify-between gap-4">
          <div className="space-y-1.5 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-extrabold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                {lead?.referenceId || "LOADING..."}
              </span>

              {/* Priority badge */}
              <span
                className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  scoreResult.tier === "HOT"
                    ? "bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border border-red-500/30"
                    : scoreResult.tier === "WARM"
                    ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border border-amber-500/30"
                    : "bg-gray-200 text-gray-700 dark:bg-zinc-800 dark:text-zinc-300 border border-gray-300 dark:border-zinc-700"
                }`}
                title={`Lead Score: ${scoreResult.score}/100\n${scoreResult.reasons.join("\n")}`}
              >
                ● {scoreResult.tier} ({scoreResult.score} pts)
              </span>

              <span className="text-[11px] text-gray-500 dark:text-zinc-400">
                {lead?.city ? `📍 ${lead.city}` : ""}
              </span>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white truncate">
              {lead?.fullName || "Loading Client..."}
            </h2>

            <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-zinc-300">
              <a
                href={`tel:${lead?.phone}`}
                className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold"
              >
                <Phone className="h-3 w-3" />
                <span>+{lead?.phone}</span>
              </a>
              {lead?.email && (
                <span className="text-gray-500 dark:text-zinc-400 truncate">📧 {lead.email}</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              aria-label="Close details"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Quick Toolbar: Status & Advisor selector */}
        {lead && (
          <div className="px-5 py-3 bg-gray-50/50 dark:bg-zinc-950/40 border-b border-gray-200 dark:border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Status Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-400 font-semibold">Status:</span>
              <select
                value={lead.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                disabled={statusUpdating}
                className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 font-bold rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none"
              >
                <option value="NEW">NEW</option>
                <option value="CONTACTED">CONTACTED</option>
                <option value="FOLLOW_UP">FOLLOW UP</option>
                <option value="CONSULTATION_SCHEDULED">CONSULTATION SCHEDULED</option>
                <option value="CONVERTED">CONVERTED (OTS IN PROGRESS)</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            {/* Assigned Advisor Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 dark:text-zinc-400 font-semibold">Counsel:</span>
              <select
                value={lead.assignedToId || ""}
                onChange={(e) => handleAssigneeChange(e.target.value)}
                className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 text-gray-900 dark:text-zinc-100 font-medium rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400 focus:outline-none max-w-[180px] truncate"
              >
                <option value="">Unassigned</option>
                {staffMembers.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {staff.name.split(" ")[0]} ({staff.role === "LEGAL_ADVISOR" ? "Adv" : "Admin"})
                  </option>
                ))}
              </select>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Link
                href={`/admin/whatsapp?leadId=${lead.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                <span>Inbox Chat</span>
              </Link>

              <a
                href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(
                  `Hello ${lead.fullName}, this is Advocate desk at Debt Support Expert regarding your Case Ref #${lead.referenceId}.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300 transition-colors"
                title="Open Direct in WhatsApp Web"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/60 text-xs overflow-x-auto whitespace-nowrap">
          <button
            onClick={() => setActiveTab("details")}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition-colors ${
              activeTab === "details"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-gray-100/60 dark:bg-zinc-800/40"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Case Details & Proposals
          </button>
          <button
            onClick={() => setActiveTab("notes")}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition-colors relative ${
              activeTab === "notes"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-gray-100/60 dark:bg-zinc-800/40"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Advocate Notes
            {lead?.notes && lead.notes.length > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gray-200 dark:bg-zinc-800 text-[10px] text-amber-700 dark:text-amber-300 font-bold">
                {lead.notes.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reminders")}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition-colors ${
              activeTab === "reminders"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-gray-100/60 dark:bg-zinc-800/40"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Follow-Up Scheduler
          </button>
          <button
            onClick={() => setActiveTab("timeline")}
            className={`flex-1 py-3 px-3 font-bold text-center border-b-2 transition-colors ${
              activeTab === "timeline"
                ? "border-amber-500 text-amber-600 dark:text-amber-400 bg-gray-100/60 dark:bg-zinc-800/40"
                : "border-transparent text-gray-500 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-zinc-200"
            }`}
          >
            Audit Timeline
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500 dark:text-zinc-400 text-sm">
              Loading complete 360° portfolio file...
            </div>
          ) : !lead ? (
            <div className="text-center py-12 text-gray-500 dark:text-zinc-400 text-sm">
              No lead selected.
            </div>
          ) : activeTab === "details" ? (
            <div className="space-y-6">
              {/* Harassment Emergency Banner if present */}
              {lead.harassmentLevel && (
                <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 flex items-start gap-3 text-red-800 dark:text-red-300 text-xs">
                  <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-red-700 dark:text-red-400">
                      Harassment / Recovery Threat Flag:
                    </span>
                    {lead.harassmentLevel}
                  </div>
                </div>
              )}

              {/* Financial & Loan Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                  <span className="text-gray-500 dark:text-zinc-400 block uppercase tracking-wider text-[10px] font-bold">
                    Total Unsecured Debt
                  </span>
                  <span className="font-bold text-base text-gray-900 dark:text-white">
                    {lead.totalDebtRange || "Not Specified"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                  <span className="text-gray-500 dark:text-zinc-400 block uppercase tracking-wider text-[10px] font-bold">
                    Overdue Aging
                  </span>
                  <span className="font-bold text-base text-amber-600 dark:text-amber-400">
                    {lead.overdueStatus || "Not Overdue"}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                  <span className="text-gray-500 dark:text-zinc-400 block uppercase tracking-wider text-[10px] font-bold">
                    Primary Legal Issue
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                    {lead.legalIssue}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1">
                  <span className="text-gray-500 dark:text-zinc-400 block uppercase tracking-wider text-[10px] font-bold">
                    Settlement Readiness
                  </span>
                  <span className="font-semibold text-gray-800 dark:text-zinc-200">
                    {lead.settlementReadiness || "Evaluating Options"}
                  </span>
                </div>
              </div>

              {/* Lenders List */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1.5 text-xs">
                <span className="text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-[10px] font-bold block">
                  Lenders / Lending Institutions
                </span>
                <p className="font-medium text-gray-800 dark:text-zinc-200">
                  {lead.lenders || "None listed"}
                </p>
              </div>

              {/* Client Message / Hardship description */}
              {lead.message && (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1.5 text-xs">
                  <span className="text-gray-500 dark:text-zinc-400 uppercase tracking-wider text-[10px] font-bold block">
                    Client Case Statement / Inquiry Notes
                  </span>
                  <p className="text-gray-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {lead.message}
                  </p>
                </div>
              )}

              {/* Consultation Booking Slot */}
              {lead.consultationSlot && (
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-1 text-xs text-blue-900 dark:text-blue-200">
                  <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300">
                    <Calendar className="h-4 w-4" />
                    <span>Booked Consultation Slot:</span>
                  </div>
                  <p>
                    {lead.consultationSlot} (Mode: {lead.consultationMode || "Phone Call"})
                  </p>
                </div>
              )}

              {/* 1-Click Fee Proposal Dispatch Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-amber-100/30 dark:from-zinc-950 dark:via-zinc-900 dark:to-amber-950/30 border border-amber-300/80 dark:border-amber-500/30 shadow-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500 dark:text-amber-400" />
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      1-Click Legal Fee Proposal Dispatch
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-700 dark:text-amber-400 font-bold uppercase">
                    Via Official WhatsApp
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-zinc-400">
                  Select a standardized engagement retainer plan. Formats an official advocate retainer proposal with statutory scope and opens direct WhatsApp transmission:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() =>
                      dispatchFeeProposal(
                        "Essential Anti-Harassment & Notice Defense Plan",
                        "₹5,000",
                        "• Anti-Harassment Legal Shield under RBI Fair Practices Code\n• Formal reply to up to 2 Legal Notices / Demand Letters\n• Advocate representation calls with collection managers"
                      )
                    }
                    className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-slate-700/80 text-left transition-all hover:border-amber-500/50 group shadow-sm"
                  >
                    <div className="text-xs font-bold text-gray-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center justify-between">
                      <span>Essential Plan</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹5,000</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      Harassment defense & Section 138 notice reply
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      dispatchFeeProposal(
                        "CIBIL Protection & Multi-Lender OTS Settlement Plan",
                        "₹7,000",
                        "• Complete legal representation for 3-5 loan accounts\n• One Time Settlement (OTS) compromise negotiation with bank zonal heads\n• Verification of bank genuine settlement letters before payment"
                      )
                    }
                    className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-slate-700/80 text-left transition-all hover:border-amber-500/50 group shadow-sm"
                  >
                    <div className="text-xs font-bold text-gray-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center justify-between">
                      <span>CIBIL Protection</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹7,000</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      Full multi-bank OTS compromise & letter audit
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      dispatchFeeProposal(
                        "Senior Advocate Complete Debt Resolution & Rebuilding",
                        "₹10,000",
                        "• Unlimited debt accounts & MSME / Credit card restructuring\n• Senior High Court Advocate arbitration & Lok Adalat representation\n• Post-settlement No-Dues Certificate (NDC) & CIBIL score rebuild roadmap"
                      )
                    }
                    className="p-3 rounded-xl bg-white dark:bg-zinc-900/90 hover:bg-gray-50 dark:hover:bg-zinc-800 border border-gray-200 dark:border-slate-700/80 text-left transition-all hover:border-amber-500/50 group shadow-sm"
                  >
                    <div className="text-xs font-bold text-gray-800 dark:text-zinc-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center justify-between">
                      <span>Full Rebuilding</span>
                      <span className="font-mono text-emerald-600 dark:text-emerald-400 font-extrabold">₹10,000</span>
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      High Court counsel representation + NDC closure
                    </p>
                  </button>
                </div>
              </div>

              {/* Source & Metadata */}
              <div className="pt-2 border-t border-gray-200 dark:border-zinc-800 text-[11px] text-gray-500 dark:text-zinc-500 space-y-1">
                <div>Ingestion Source: <span className="font-mono text-gray-800 dark:text-zinc-300">{lead.source}</span></div>
                <div>Submitted At: <span className="text-gray-800 dark:text-zinc-300">{new Date(lead.createdAt).toLocaleString("en-IN")}</span></div>
                <div>IP Address: <span className="font-mono text-gray-800 dark:text-zinc-300">{lead.ipAddress || "N/A"}</span></div>
              </div>
            </div>
          ) : activeTab === "notes" ? (
            <div className="space-y-5">
              {/* Add Note Form */}
              <form onSubmit={handleAddNote} className="space-y-3">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Record advocate consultation notes, settlement offers, or harassment evidence..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-gray-300 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-600"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submittingNote || !newNote.trim()}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 disabled:opacity-50 transition-colors shadow-sm"
                  >
                    <Send className="h-3 w-3" />
                    <span>{submittingNote ? "Saving..." : "Add Internal Note"}</span>
                  </button>
                </div>
              </form>

              {/* Notes List */}
              <div className="space-y-3">
                {lead.notes && lead.notes.length > 0 ? (
                  lead.notes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3.5 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-1 text-xs"
                    >
                      <div className="flex items-center justify-between text-gray-500 dark:text-zinc-400 text-[11px]">
                        <span className="font-bold text-amber-600 dark:text-amber-400">{note.authorName}</span>
                        <span>{new Date(note.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-gray-800 dark:text-zinc-200 whitespace-pre-wrap">{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs text-gray-500 dark:text-zinc-400">
                    No advocate notes recorded yet. Add one above.
                  </p>
                )}
              </div>
            </div>
          ) : activeTab === "reminders" ? (
            <div className="space-y-6">
              {/* Quick Delay Shortcuts */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Quick Postpone Call
                </span>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(2)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-300 font-semibold text-center border border-gray-200 dark:border-zinc-700 transition-colors"
                  >
                    +2 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(24)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-300 font-semibold text-center border border-gray-200 dark:border-zinc-700 transition-colors"
                  >
                    +24 Hours
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(72)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-300 font-semibold text-center border border-gray-200 dark:border-zinc-700 transition-colors"
                  >
                    +3 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickPostpone(168)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800/80 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-800 dark:text-zinc-300 font-semibold text-center border border-gray-200 dark:border-zinc-700 transition-colors"
                  >
                    +1 Week
                  </button>
                </div>
              </div>

              {/* Custom Date/Time Reminder Form */}
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-950/60 border border-gray-200 dark:border-zinc-800 space-y-3">
                <span className="text-[11px] font-bold text-gray-700 dark:text-zinc-300 uppercase tracking-wider block">
                  Set Specific Callback Reminder
                </span>
                <input
                  type="datetime-local"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-xs text-gray-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400"
                />
                <input
                  type="text"
                  placeholder="Reminder note (e.g. Call Rahul to review OTS offer letter)"
                  value={reminderNote}
                  onChange={(e) => setReminderNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-gray-300 dark:border-zinc-700 text-xs text-gray-900 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-amber-500 dark:focus:ring-amber-400"
                />
                <button
                  type="button"
                  onClick={() => handleScheduleReminder(reminderDate, reminderNote)}
                  disabled={submittingReminder || !reminderDate}
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs disabled:opacity-50 transition-colors shadow-sm"
                >
                  {submittingReminder ? "Scheduling..." : "Schedule Follow-Up Reminder"}
                </button>
              </div>

              {/* Reminders List */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                  Scheduled Tasks & History
                </span>
                {lead.reminders && lead.reminders.length > 0 ? (
                  lead.reminders.map((rem) => {
                    const isOverdue =
                      !rem.isCompleted && new Date(rem.scheduledAt) < new Date();
                    return (
                      <div
                        key={rem.id}
                        className={`p-3 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                          rem.isCompleted
                            ? "bg-gray-100/50 dark:bg-zinc-950/40 border-gray-200 dark:border-zinc-800/60 text-gray-400 dark:text-zinc-500 line-through"
                            : isOverdue
                            ? "bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/60 text-red-700 dark:text-red-200"
                            : "bg-gray-50 dark:bg-zinc-950/80 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <p className="font-semibold">{rem.note}</p>
                          <div className="text-[11px] opacity-75">
                            ⏰ {new Date(rem.scheduledAt).toLocaleString("en-IN")}
                            {isOverdue && " (OVERDUE)"}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleToggleReminder(rem.id, rem.isCompleted)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold transition-colors ${
                            rem.isCompleted
                              ? "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 hover:bg-gray-300 dark:hover:bg-zinc-700"
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {rem.isCompleted ? "Completed" : "Mark Done"}
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center py-6 text-xs text-gray-500 dark:text-zinc-400">
                    No reminders recorded.
                  </p>
                )}
              </div>
            </div>
          ) : (
            /* Tab 4: Audit & Activity Timeline */
            <div className="space-y-4">
              <span className="text-[11px] font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
                Immutable Event Stream
              </span>

              {lead.activityLogs && lead.activityLogs.length > 0 ? (
                <div className="relative pl-6 border-l border-gray-200 dark:border-zinc-800 space-y-5">
                  {lead.activityLogs.map((log) => (
                    <div key={log.id} className="relative text-xs space-y-1">
                      {/* Timeline dot */}
                      <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-amber-500 border-2 border-white dark:border-zinc-900" />
                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
                        <span className="font-bold text-gray-800 dark:text-zinc-200">{log.action.replace("_", " ")}</span>
                        <span>{new Date(log.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                      <p className="text-gray-700 dark:text-zinc-300">{log.details}</p>
                      <div className="text-[10px] text-gray-400 dark:text-zinc-500">By: {log.actorName}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-xs text-gray-500 dark:text-zinc-400">
                  No activity log entries found.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
