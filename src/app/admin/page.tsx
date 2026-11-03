import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import {
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Phone,
  MessageCircle,
  Scale,
  Shield,
  LogOut,
  Building2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await seedDatabaseIfNeeded();

  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  // Fetch summary statistics
  const [totalLeads, newLeads, scheduledLeads, harassmentLeads, recentLeads] = await Promise.all([
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { status: "CONSULTATION_SCHEDULED" } }),
    prisma.lead.count({
      where: {
        harassmentLevel: { not: null },
      },
    }),
    prisma.lead.findMany({
      take: 10,
      orderBy: { updatedAt: "desc" },
      include: {
        assignedTo: true,
        whatsAppMessages: {
          take: 1,
          orderBy: { createdAt: "desc" },
        },
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
                  Debt Support Expert
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Legal CRM v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Senior Advocate Lead Ingestion & Meta WhatsApp Cloud Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-bold text-slate-200">{user.name}</span>
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                {user.role}
              </span>
            </div>

            <form action="/api/auth/logout" method="POST">
              <button
                type="submit"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Welcome Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-primary-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Welcome back, {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Official legal intake portal actively listening for leads across all website funnels and Meta WhatsApp Cloud API.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/50 border border-emerald-800/80 text-emerald-400 text-xs font-semibold">
            <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Meta WhatsApp API: Active (v21.0 Cloud Engine)</span>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Ingested Leads</span>
              <Users className="h-4 w-4 text-primary-400" />
            </div>
            <div className="text-3xl font-extrabold text-white">{totalLeads}</div>
            <p className="text-[11px] text-slate-500">Across all 5 website funnels</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Action Needed (New)</span>
              <Clock className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-extrabold text-amber-400">{newLeads}</div>
            <p className="text-[11px] text-slate-500">Uncontacted within 30 min SLA</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Consultations Booked</span>
              <Calendar className="h-4 w-4 text-blue-400" />
            </div>
            <div className="text-3xl font-extrabold text-blue-400">{scheduledLeads}</div>
            <p className="text-[11px] text-slate-500">Phone & Google Meet calls</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-bold uppercase tracking-wider">Harassment Emergencies</span>
              <AlertTriangle className="h-4 w-4 text-red-400" />
            </div>
            <div className="text-3xl font-extrabold text-red-400">{harassmentLeads}</div>
            <p className="text-[11px] text-slate-500">Legal Shield notice required</p>
          </div>
        </div>

        {/* Lead Table */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
          <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">
                Live Ingested Case Files (Recent 10)
              </h3>
              <p className="text-xs text-slate-400">
                Synchronized with Prisma SQLite DB, deduplication rules, and Meta WhatsApp
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400">
              DB: <span className="text-emerald-400 font-bold">CONNECTED</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-5 py-3.5 font-bold">Ref ID / Client</th>
                  <th className="px-4 py-3.5 font-bold">Contact / City</th>
                  <th className="px-4 py-3.5 font-bold">Debt Portfolio</th>
                  <th className="px-4 py-3.5 font-bold">Source Funnel</th>
                  <th className="px-4 py-3.5 font-bold">Harassment / Issue</th>
                  <th className="px-4 py-3.5 font-bold">Status</th>
                  <th className="px-4 py-3.5 font-bold text-right">WhatsApp Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {recentLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-mono font-bold text-amber-400">
                        {lead.referenceId}
                      </div>
                      <div className="font-semibold text-slate-200 text-sm">
                        {lead.fullName}
                      </div>
                      {lead.assignedTo && (
                        <div className="text-[10px] text-slate-500">
                          Adv: {lead.assignedTo.name.split(" ")[0]}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-mono text-slate-300">
                        +{lead.phone}
                      </div>
                      <div className="text-slate-500">
                        {lead.city || "Not specified"}
                      </div>
                      {lead.email && (
                        <div className="text-[10px] text-slate-600 truncate max-w-[140px]">
                          {lead.email}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-200">
                        {lead.totalDebtRange || "N/A"}
                      </div>
                      <div className="text-slate-500 truncate max-w-[160px]" title={lead.lenders || ""}>
                        {lead.lenders || "Multiple Banks"}
                      </div>
                      {lead.overdueStatus && (
                        <div className="text-[10px] text-amber-400/80">
                          Overdue: {lead.overdueStatus}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-mono text-[10px] text-slate-300">
                        {lead.source}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-300">
                        {lead.legalIssue}
                      </div>
                      {lead.harassmentLevel ? (
                        <div className="inline-flex items-center gap-1 text-[10px] text-red-400 font-bold mt-0.5">
                          <AlertTriangle className="h-3 w-3" />
                          <span>{lead.harassmentLevel}</span>
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500">No active threats</div>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          lead.status === "NEW"
                            ? "bg-amber-950/70 text-amber-400 border border-amber-800"
                            : lead.status === "CONSULTATION_SCHEDULED"
                            ? "bg-blue-950/70 text-blue-400 border border-blue-800"
                            : lead.status === "CONVERTED"
                            ? "bg-emerald-950/70 text-emerald-400 border border-emerald-800"
                            : lead.status === "CONTACTED"
                            ? "bg-purple-950/70 text-purple-400 border border-purple-800"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-right">
                      <a
                        href={`https://wa.me/${lead.phone}?text=${encodeURIComponent(
                          `Hello ${lead.fullName}, this is Advocate desk at Debt Support Expert regarding your Case Ref #${lead.referenceId}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 transition-colors"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Chat</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
