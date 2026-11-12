"use client";

import * as React from "react";
import {
  Search,
  AlertTriangle,
  Download,
  Phone,
  MessageCircle,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  X,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { LeadDrawer, LeadDetailData } from "@/components/admin/lead-drawer";
import { calculateLeadScore, LeadScoreResult } from "@/lib/lead-scoring";

export interface LeadTableRow {
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
  status: string;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; role: string } | null;
  nextFollowUpAt?: string | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  notes?: Array<{ id: string; authorName: string; content: string; createdAt: string }>;
  reminders?: Array<{ id: string; scheduledAt: string; note: string; isCompleted: boolean }>;
  whatsAppMessages?: Array<{ id: string; content: string; createdAt: string; status: string }>;
}

interface LeadsTableViewProps {
  initialLeads: LeadTableRow[];
  initialTotal: number;
  staffMembers: Array<{ id: string; name: string; role: string }>;
}

export function LeadsTableView({
  initialLeads,
  initialTotal,
  staffMembers,
}: LeadsTableViewProps) {
  const [leads, setLeads] = React.useState<LeadTableRow[]>(initialLeads);
  const [total, setTotal] = React.useState(initialTotal);
  const [loading, setLoading] = React.useState(false);

  // Filters
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [issueFilter, setIssueFilter] = React.useState("ALL");
  const [harassmentOnly, setHarassmentOnly] = React.useState(false);
  const [priorityFilter, setPriorityFilter] = React.useState<"ALL" | "HOT" | "WARM" | "NURTURE">("ALL");

  // Drawer
  const [selectedLeadId, setSelectedLeadId] = React.useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  // Status pills
  const statusPills = [
    { label: "All Leads", value: "ALL" },
    { label: "New (SLA)", value: "NEW" },
    { label: "Contacted", value: "CONTACTED" },
    { label: "Follow-Up", value: "FOLLOW_UP" },
    { label: "Consultation Booked", value: "CONSULTATION_SCHEDULED" },
    { label: "OTS Converted", value: "CONVERTED" },
    { label: "Closed", value: "CLOSED" },
  ];

  // Issue filter options
  const issueOptions = [
    { label: "All Debt Categories", value: "ALL" },
    { label: "Personal Loan", value: "Personal Loan" },
    { label: "Credit Card", value: "Credit Card" },
    { label: "Recovery Harassment", value: "Harassment" },
    { label: "Legal Notice / Sec 138", value: "138" },
    { label: "Business / MSME Loan", value: "Business" },
  ];

  // Fetch leads based on search & filters
  const fetchFilteredLeads = React.useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (issueFilter !== "ALL") params.set("issue", issueFilter);
    if (harassmentOnly) params.set("harassment", "true");

    try {
      const res = await fetch(`/api/admin/leads?${params.toString()}`);
      const data = await res.json();
      if (data.success && data.leads) {
        setLeads(data.leads);
        setTotal(data.pagination?.total || data.leads.length);
      }
    } catch (err) {
      console.error("Error fetching filtered leads:", err);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, issueFilter, harassmentOnly]);

  // Avoid redundant fetch on initial mount since SSR provides initialLeads
  const isFirstMount = React.useRef(true);

  // Debounced search trigger
  React.useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      fetchFilteredLeads();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchFilteredLeads]);

  // Handle instant status change
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    const prevLead = leads.find((l) => l.id === leadId);
    const prevStatus = prevLead?.status;

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) {
        if (prevStatus) {
          setLeads((prev) =>
            prev.map((l) => (l.id === leadId ? { ...l, status: prevStatus } : l))
          );
        }
        toast.error("Failed to update lead status");
      } else {
        toast.success(`Lead status updated to ${newStatus}`);
      }
    } catch (e) {
      console.error("Error updating status:", e);
      if (prevStatus) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: prevStatus } : l))
        );
      }
      toast.error("Failed to update lead status");
    }
  };

  // Open CSV export in new tab
  const handleExportCsv = () => {
    toast.info("Preparing CSV export...");
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (issueFilter !== "ALL") params.set("issue", issueFilter);
    if (harassmentOnly) params.set("harassment", "true");

    window.open(`/api/admin/leads/export?${params.toString()}`, "_blank");
  };

  // Filter by search & priority locally for instant responsive UI
  const displayLeads = React.useMemo(() => {
    let result = leads;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (l) =>
          l.fullName?.toLowerCase().includes(q) ||
          l.phone?.includes(q) ||
          l.referenceId?.toLowerCase().includes(q) ||
          (l.city && l.city.toLowerCase().includes(q)) ||
          (l.lenders && l.lenders.toLowerCase().includes(q))
      );
    }
    if (priorityFilter === "ALL") return result;
    return result.filter((l) => calculateLeadScore(l).tier === priorityFilter);
  }, [leads, search, priorityFilter]);

  const openDrawer = (leadId: string) => {
    setSelectedLeadId(leadId);
    setDrawerOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white">
              Leads Pipeline & Case Roster
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-zinc-800 text-amber-700 dark:text-amber-400 border border-gray-200 dark:border-zinc-700">
              {total} Total Files
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-zinc-400 mt-1">
            Real-time filterable case desk with sub-100ms status synchronization and dynamic lead scoring.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-700 dark:text-zinc-200 text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Top Filter Toolbar Card */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 shadow-sm space-y-4">
        {/* Row 1: Search bar + Issue select + Harassment toggle + Priority pills */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar (5 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-zinc-500" />
            <input
              type="text"
              placeholder="Search Name, Mobile, City, or Ref ID (e.g. DSE-MUM849)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-gray-400 dark:placeholder:text-zinc-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Issue dropdown (3 cols) */}
          <div className="md:col-span-3">
            <select
              value={issueFilter}
              onChange={(e) => setIssueFilter(e.target.value)}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-zinc-200 text-xs font-semibold focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              {issueOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Harassment Emergency toggle (2 cols) */}
          <div className="md:col-span-2">
            <button
              type="button"
              onClick={() => setHarassmentOnly(!harassmentOnly)}
              className={`w-full py-2.5 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                harassmentOnly
                  ? "bg-red-50 dark:bg-red-950/80 border-red-300 dark:border-red-800 text-red-700 dark:text-red-300 shadow-sm"
                  : "bg-gray-50 dark:bg-zinc-950 border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200"
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${harassmentOnly ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-zinc-500"}`} />
              <span>Harassment Only</span>
            </button>
          </div>

          {/* Priority Filter (2 cols) */}
          <div className="md:col-span-2 flex items-center gap-1 justify-end flex-wrap">
            <span className="text-[10px] text-gray-500 dark:text-zinc-500 uppercase font-bold mr-1 hidden lg:inline">Priority:</span>
            {(["ALL", "HOT", "WARM", "NURTURE"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                  priorityFilter === p
                    ? p === "HOT"
                      ? "bg-red-600 text-white"
                      : p === "WARM"
                      ? "bg-amber-500 text-slate-950"
                      : p === "NURTURE"
                      ? "bg-gray-600 dark:bg-zinc-600 text-white"
                      : "bg-gray-900 dark:bg-white text-white dark:text-slate-950"
                    : "bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 border border-gray-200 dark:border-zinc-800"
                }`}
              >
                {p === "ALL" ? "All" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {statusPills.map((pill) => {
            const active = statusFilter === pill.value;
            return (
              <button
                key={pill.value}
                onClick={() => setStatusFilter(pill.value)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                  active
                    ? "bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/20"
                    : "bg-gray-50 dark:bg-zinc-950 text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-zinc-200 hover:bg-gray-100 dark:hover:bg-zinc-800 border border-gray-200 dark:border-zinc-800/80"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Card with horizontal swipe container */}
      <div className="rounded-2xl border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm overflow-hidden">
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-thin">
          <table className="w-full text-left text-xs min-w-[850px]">
            <thead className="bg-gray-50/80 dark:bg-zinc-950/70 text-gray-500 dark:text-zinc-400 border-b border-gray-200 dark:border-zinc-800 uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-5 py-3.5 font-bold">Case Ref & Ingestion</th>
                <th className="px-4 py-3.5 font-bold">Client / Location</th>
                <th className="px-4 py-3.5 font-bold">Debt Portfolio & Lenders</th>
                <th className="px-4 py-3.5 font-bold text-center">Score / Priority</th>
                <th className="px-4 py-3.5 font-bold">Status Action</th>
                <th className="px-4 py-3.5 font-bold">Follow-Up</th>
                <th className="px-4 py-3.5 font-bold text-right">Quick Desk</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800/80">
              {loading && leads.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Synchronizing leads pipeline...</span>
                  </td>
                </tr>
              ) : displayLeads.length > 0 ? (
                displayLeads.map((lead) => {
                  const score = calculateLeadScore(lead);
                  const isOverdue =
                    lead.nextFollowUpAt && new Date(lead.nextFollowUpAt) < new Date();

                  return (
                    <tr
                      key={lead.id}
                      className="hover:bg-gray-50 dark:hover:bg-zinc-800/40 transition-colors group cursor-pointer"
                      onClick={() => openDrawer(lead.id)}
                    >
                      {/* Col 1: Reference ID & Source */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400 text-xs">
                          {lead.referenceId}
                        </div>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-gray-100 dark:bg-zinc-800 text-[10px] font-mono text-gray-600 dark:text-zinc-400 mt-1">
                          {lead.source}
                        </span>
                        <div className="text-[10px] text-gray-500 dark:text-zinc-500 mt-0.5">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </td>

                      {/* Col 2: Client Name & Contact */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900 dark:text-zinc-100 text-sm">
                          {lead.fullName}
                        </div>
                        <div className="font-mono text-gray-600 dark:text-zinc-400 text-xs">
                          +{lead.phone}
                        </div>
                        <div className="text-[11px] text-gray-500 dark:text-zinc-500">
                          {lead.city || "India"}
                        </div>
                      </td>

                      {/* Col 3: Debt & Lenders */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-gray-900 dark:text-zinc-200">
                          {lead.totalDebtRange || "Unspecified"}
                        </div>
                        <div className="text-gray-600 dark:text-zinc-400 truncate max-w-[170px]" title={lead.lenders || ""}>
                          {lead.lenders || "Multiple Banks"}
                        </div>
                        {lead.overdueStatus && (
                          <div className="text-[10px] text-amber-600 dark:text-amber-400/80">
                            Overdue: {lead.overdueStatus}
                          </div>
                        )}
                        {lead.harassmentLevel && (
                          <div className="text-[10px] text-red-600 dark:text-red-400 font-bold flex items-center gap-1 mt-0.5">
                            <AlertTriangle className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-[150px]">{lead.harassmentLevel}</span>
                          </div>
                        )}
                      </td>

                      {/* Col 4: Score / Priority Badge */}
                      <td className="px-4 py-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            score.tier === "HOT"
                              ? "bg-red-500/15 text-red-700 dark:text-red-400 border border-red-500/30"
                              : score.tier === "WARM"
                              ? "bg-amber-500/15 text-amber-700 dark:text-amber-400 border border-amber-500/30"
                              : "bg-gray-100 dark:bg-zinc-700/50 text-gray-600 dark:text-zinc-400 border border-gray-200 dark:border-zinc-600/30"
                          }`}
                          title={score.reasons.join(" | ")}
                        >
                          ● {score.tier} ({score.score})
                        </span>
                      </td>

                      {/* Col 5: Interactive Status Dropdown */}
                      <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={lead.status}
                          onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-2.5 py-1 border transition-colors focus:outline-none ${
                            lead.status === "NEW"
                              ? "bg-amber-50 dark:bg-amber-950/70 text-amber-800 dark:text-amber-400 border-amber-300 dark:border-amber-800"
                              : lead.status === "CONSULTATION_SCHEDULED"
                              ? "bg-blue-50 dark:bg-blue-950/70 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-800"
                              : lead.status === "CONVERTED"
                              ? "bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800"
                              : lead.status === "CONTACTED"
                              ? "bg-purple-50 dark:bg-purple-950/70 text-purple-800 dark:text-purple-400 border-purple-300 dark:border-purple-800"
                              : lead.status === "FOLLOW_UP"
                              ? "bg-amber-100/60 dark:bg-amber-900/60 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700"
                              : "bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-400 border-gray-300 dark:border-zinc-700"
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="FOLLOW_UP">FOLLOW UP</option>
                          <option value="CONSULTATION_SCHEDULED">CONSULTATION</option>
                          <option value="CONVERTED">CONVERTED (OTS)</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>
                      </td>

                      {/* Col 6: Follow-Up Schedule */}
                      <td className="px-4 py-4">
                        {lead.nextFollowUpAt ? (
                          <div
                            className={`text-xs font-medium flex items-center gap-1 ${
                              isOverdue ? "text-red-600 dark:text-red-400 font-bold" : "text-gray-700 dark:text-zinc-300"
                            }`}
                          >
                            <span>
                              {new Date(lead.nextFollowUpAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                              })}
                            </span>
                            <span className="text-[10px] text-gray-500 dark:text-zinc-500">
                              {new Date(lead.nextFollowUpAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-400 dark:text-zinc-600">—</span>
                        )}
                        {lead.reminders && lead.reminders.length > 0 && (
                          <div className="text-[10px] text-gray-500 dark:text-zinc-400 truncate max-w-[130px]">
                            {lead.reminders[0].note}
                          </div>
                        )}
                      </td>

                      {/* Col 7: Quick Desk Actions */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1">
                          {/* Direct Phone Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            title={`Call +${lead.phone}`}
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>

                          {/* In-App WhatsApp */}
                          <a
                            href={`/admin/whatsapp?leadId=${lead.id}`}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors relative"
                            title="Open In-App WhatsApp Inbox"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            {lead.unreadCount > 0 && (
                              <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-500" />
                            )}
                          </a>

                          {/* Direct WhatsApp Web */}
                          <a
                            href={`https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(
                              `Hello ${lead.fullName}, this is Advocate desk at Debt Support Expert regarding your Case Ref #${lead.referenceId}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Open Direct in WhatsApp Web"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </a>

                          {/* Open 360 Drawer */}
                          <button
                            type="button"
                            onClick={() => openDrawer(lead.id)}
                            className="p-1.5 rounded-lg text-gray-500 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Open 360° Lead Drawer"
                          >
                            <FolderOpen className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500 dark:text-zinc-400">
                    No leads found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer: Total Count & Hint */}
        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-950/60 flex items-center justify-between text-[11px] text-gray-500 dark:text-zinc-400">
          <div>
            Showing <span className="font-bold text-gray-900 dark:text-zinc-200">{displayLeads.length}</span> of {total} case files
          </div>
          <div className="text-[10px] hidden sm:block">
            Click any row to open the complete 360° advocate case file drawer.
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
        onLeadUpdated={(updatedLead) => {
          setLeads((prev) =>
            prev.map((l) => (l.id === updatedLead.id ? { ...l, ...updatedLead } : l))
          );
        }}
      />
    </div>
  );
}
