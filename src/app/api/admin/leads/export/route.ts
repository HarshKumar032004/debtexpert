import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

function escapeCsvField(field: unknown): string {
  if (field === null || field === undefined) return '""';
  const str = String(field).replace(/"/g, '""');
  return `"${str}"`;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status") || "ALL";
    const issue = searchParams.get("issue") || "ALL";
    const harassmentOnly = searchParams.get("harassment") === "true";

    const where: Prisma.LeadWhereInput = {};

    if (status !== "ALL") where.status = status;
    if (issue !== "ALL") where.legalIssue = { contains: issue };
    if (harassmentOnly) where.harassmentLevel = { not: null };
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search.replace(/\D/g, "") || search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { referenceId: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: { select: { name: true } },
      },
    });

    const headers = [
      "Case Reference ID",
      "Full Name",
      "Phone Number",
      "Email Address",
      "City / State",
      "Total Debt Portfolio",
      "Legal Category",
      "Lenders / Banks",
      "Overdue Duration",
      "Harassment Severity",
      "Settlement Readiness",
      "Consultation Mode",
      "Consultation Slot",
      "Lead Status",
      "Ingestion Source",
      "Assigned Counsel",
      "Created At",
      "Last Activity At",
    ];

    const rows = leads.map((l) => [
      escapeCsvField(l.referenceId),
      escapeCsvField(l.fullName),
      escapeCsvField(`+${l.phone}`),
      escapeCsvField(l.email || ""),
      escapeCsvField(l.city || ""),
      escapeCsvField(l.totalDebtRange || ""),
      escapeCsvField(l.legalIssue || ""),
      escapeCsvField(l.lenders || ""),
      escapeCsvField(l.overdueStatus || ""),
      escapeCsvField(l.harassmentLevel || "None"),
      escapeCsvField(l.settlementReadiness || ""),
      escapeCsvField(l.consultationMode || ""),
      escapeCsvField(l.consultationSlot || ""),
      escapeCsvField(l.status),
      escapeCsvField(l.source),
      escapeCsvField(l.assignedTo?.name || "Unassigned"),
      escapeCsvField(l.createdAt.toISOString()),
      escapeCsvField(l.lastMessageAt.toISOString()),
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

    return new Response(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="debtsupportexpert_leads_${new Date().toISOString().slice(0, 10)}.csv"`,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads/export error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error exporting CSV" },
      { status: 500 }
    );
  }
}
