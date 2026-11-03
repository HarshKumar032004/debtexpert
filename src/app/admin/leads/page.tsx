import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeadsTableView, LeadTableRow } from "@/components/admin/leads-table-view";

export const dynamic = "force-dynamic";

export default async function AdminLeadsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [leadsRaw, total, staffMembers] = await Promise.all([
    prisma.lead.findMany({
      take: 50,
      orderBy: { updatedAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    }),
    prisma.lead.count(),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: true },
    }),
  ]);

  const initialLeads: LeadTableRow[] = leadsRaw.map((l) => ({
    id: l.id,
    referenceId: l.referenceId,
    fullName: l.fullName,
    phone: l.phone,
    email: l.email,
    city: l.city,
    source: l.source,
    legalIssue: l.legalIssue,
    lenders: l.lenders,
    totalDebtRange: l.totalDebtRange,
    overdueStatus: l.overdueStatus,
    harassmentLevel: l.harassmentLevel,
    status: l.status,
    assignedToId: l.assignedToId,
    assignedTo: l.assignedTo,
    nextFollowUpAt: l.nextFollowUpAt ? l.nextFollowUpAt.toISOString() : null,
    unreadCount: l.unreadCount,
    lastMessageAt: l.lastMessageAt.toISOString(),
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <LeadsTableView
      initialLeads={initialLeads}
      initialTotal={total}
      staffMembers={staffMembers}
    />
  );
}
