"use client";

import * as React from "react";
import {
  Search,
  Filter,
  Download,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronDown,
  AlertTriangle,
  Clock,
  Sparkles,
  RefreshCw,
  FolderOpen,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { LeadDrawer, LeadDetailData } from "@/components/admin/lead-drawer";
import { calculateLeadScore } from "@/lib/lead-scoring";

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
  status: string;
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; role: string } | null;
  nextFollowUpAt?: string | null;
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
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

  // Debounced search trigger
  React.useEffect(() => {
    const timer = setTimeout(() => {
      fetchFilteredLeads();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchFilteredLeads]);

  // Handle instant status change
  const handleUpdateStatus = async (leadId: string, newStatus: string) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
    );

    try {
      await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      console.error("Error updating status:", e);
    }
  };

  // Open CSV export in new tab
  const handleExportCsv = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (statusFilter !== "ALL") params.set("status", statusFilter);
    if (issueFilter !== "ALL") params.set("issue", issueFilter);
    if (harassmentOnly) params.set("harassment", "true");

    window.open(`/api/admin/leads/export?${params.toString()}`, "_blank");
  };

  // Filter by priority locally
  const displayLeads = React.useMemo(() => {
    if (priorityFilter === "ALL") return leads;
    return leads.filter((l) => calculateLeadScore(l).tier === priorityFilter);
  }, [leads, priorityFilter]);

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
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">
              Leads Pipeline & Case Roster
            </h1>
            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
              {total} Total Files
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Real-time filterable case desk with sub-100ms status synchronization and dynamic lead scoring.
          </p>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExportCsv}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold transition-all shadow-md active:scale-95"
        >
          <Download className="h-4 w-4 text-emerald-400" />
          <span>Export Filtered to CSV</span>
        </button>
      </div>

      {/* Top Filter Toolbar Card */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        {/* Row 1: Search bar + Issue select + Harassment toggle + Priority pills */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar (6 cols) */}
          <div className="md:col-span-5 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search Name, Mobile, City, or Ref ID (e.g. DSE-MUM849)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-100 text-xs focus:ring-2 focus:ring-amber-500/50 focus:outline-none placeholder:text-slate-600"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
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
              className="w-full py-2.5 px-3 rounded-xl border border-slate-800 bg-slate-950 text-slate-200 text-xs font-semibold focus:ring-1 focus:ring-amber-400 focus:outline-none"
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
                  ? "bg-red-950/80 border-red-800 text-red-300 shadow-md shadow-red-950"
                  : "bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200"
              }`}
            >
              <AlertTriangle className={`h-3.5 w-3.5 ${harassmentOnly ? "text-red-400" : "text-slate-500"}`} />
              <span>Harassment Only</span>
            </button>
          </div>

          {/* Priority Filter (2 cols) */}
          <div className="md:col-span-2 flex items-center gap-1 justify-end">
            <span className="text-[10px] text-slate-500 uppercase font-bold mr-1 hidden lg:inline">Priority:</span>
            {(["ALL", "HOT", "WARM", "NURTURE"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`px-2 py-1.5 rounded-lg text-[10px] font-extrabold uppercase transition-all ${
                  priorityFilter === p
                    ? p === "HOT"
                      ? "bg-red-500 text-white"
                      : p === "WARM"
                      ? "bg-amber-500 text-slate-950"
                      : p === "NURTURE"
                      ? "bg-slate-600 text-white"
                      : "bg-white text-slate-950"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800"
                }`}
              >
                {p === "ALL" ? "All" : p}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {statusPills.map((pill) => {
            const active = statusFilter === pill.value;
            return (
              <button
                key={pill.value}
                onClick={() => setStatusFilter(pill.value)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all text-xs ${
                  active
                    ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                    : "bg-slate-950 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800/80"
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
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
            <tbody className="divide-y divide-slate-800/80">
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2 text-amber-400" />
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
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => openDrawer(lead.id)}
                    >
                      {/* Col 1: Reference ID & Source */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-amber-400 text-xs">
                          {lead.referenceId}
                        </div>
                        <span className="inline-block px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-slate-400 mt-1">
                          {lead.source}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </div>
                      </td>

                      {/* Col 2: Client Name & Contact */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-200 text-sm">
                          {lead.fullName}
                        </div>
                        <div className="font-mono text-slate-400 text-xs">
                          +{lead.phone}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {lead.city || "India"}
                        </div>
                      </td>

                      {/* Col 3: Debt & Lenders */}
                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-200">
                          {lead.totalDebtRange || "Unspecified"}
                        </div>
                        <div className="text-slate-400 truncate max-w-[170px]" title={lead.lenders || ""}>
                          {lead.lenders || "Multiple Banks"}
                        </div>
                        {lead.overdueStatus && (
                          <div className="text-[10px] text-amber-400/80">
                            Overdue: {lead.overdueStatus}
                          </div>
                        )}
                        {lead.harassmentLevel && (
                          <div className="text-[10px] text-red-400 font-bold flex items-center gap-1 mt-0.5">
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
                              ? "bg-red-500/20 text-red-400 border border-red-500/30"
                              : score.tier === "WARM"
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                              : "bg-slate-700/50 text-slate-400 border border-slate-600/30"
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
                              ? "bg-amber-950/70 text-amber-400 border-amber-800"
                              : lead.status === "CONSULTATION_SCHEDULED"
                              ? "bg-blue-950/70 text-blue-400 border-blue-800"
                              : lead.status === "CONVERTED"
                              ? "bg-emerald-950/70 text-emerald-400 border-emerald-800"
                              : lead.status === "CONTACTED"
                              ? "bg-purple-950/70 text-purple-400 border-purple-800"
                              : lead.status === "FOLLOW_UP"
                              ? "bg-amber-900/60 text-amber-200 border-amber-700"
                              : "bg-slate-800 text-slate-400 border-slate-700"
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

                      {/* Col 6: Follow-Up */}
                      <td className="px-4 py-4">
                        {lead.nextFollowUpAt ? (
                          <div className={isOverdue ? "text-red-400 font-bold" : "text-slate-300"}>
                            <div className="flex items-center gap-1 text-[11px]">
                              <Clock className="h-3 w-3" />
                              <span>{new Date(lead.nextFollowUpAt).toLocaleDateString("en-IN")}</span>
                            </div>
                            <div className="text-[10px] opacity-75">
                              {new Date(lead.nextFollowUpAt).toLocaleTimeString("en-IN", {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                              {isOverdue && " (DUE)"}
                            </div>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500">—</span>
                        )}
                      </td>

                      {/* Col 7: Quick Actions Bar */}
                      <td className="px-4 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Call */}
                          <a
                            href={`tel:${lead.phone}`}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
                            title={`Call +${lead.phone}`}
                          >
                            <Phone className="h-3.5 w-3.5 text-emerald-400" />
                          </a>

                          {/* WhatsApp */}
                          <a
                            href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(
                              `Hello ${lead.fullName}, this is Advocate desk at Debt Support Expert regarding your Case Ref #${lead.referenceId}.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                            title="Open WhatsApp Chat"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                          </a>

                          {/* Open Drawer */}
                          <button
                            type="button"
                            onClick={() => openDrawer(lead.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 transition-colors"
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
                  <td colSpan={7} className="text-center py-12 text-slate-500">
                    No leads matching the selected search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 360° Client Case Drawer */}
      <LeadDrawer
        leadId={selectedLeadId}
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedLeadId(null);
        }}
        staffMembers={staffMembers}
        onLeadUpdated={(updated) => {
          setLeads((prev) =>
            prev.map((l) => (l.id === updated.id ? { ...l, ...updated } : l))
          );
        }}
      />
    </div>
  );
}
