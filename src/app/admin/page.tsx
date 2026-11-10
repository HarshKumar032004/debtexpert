import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { AdminDashboardView } from "@/components/admin/admin-dashboard-view";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

function parseDebtAmount(debtStr?: string | null): number {
  if (!debtStr) return 0;
  const clean = debtStr.replace(/,/g, "");

  // Match Lakhs
  const lakhMatch = clean.match(/(\d+(\.\d+)?)\s*(l|lakh)/i);
  if (lakhMatch) {
    return parseFloat(lakhMatch[1]) * 100000;
  }

  // Match generic numbers e.g. 850000
  const numberMatch = clean.match(/(\d{5,})/);
  if (numberMatch) {
    return parseInt(numberMatch[1], 10);
  }

  return 300000; // default estimate for unspecified active debt
}

function formatINRShort(val: number): string {
  if (val >= 10000000) {
    return `₹${(val / 10000000).toFixed(1)} Cr`;
  }
  if (val >= 100000) {
    return `₹${(val / 100000).toFixed(1)} Lakhs`;
  }
  return `₹${val.toLocaleString("en-IN")}`;
}

export default async function AdminDashboardPage() {
  try {
    await seedDatabaseIfNeeded();
  } catch (err) {
    console.warn("Database seed notice:", err);
  }

  let user = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.warn("Auth check notice:", err);
  }

  if (!user) {
    redirect("/admin/login");
  }

  const now = new Date();

  // 1. Fetch KPI Counts with defensive fallback
  let totalLeads = 0;
  let totalActive = 0;
  let harassmentCount = 0;
  let scheduledCount = 0;
  let convertedCount = 0;
  let activeLeadsWithDebt: { totalDebtRange: string | null }[] = [];
  let staffMembers: { id: string; name: string; role: string }[] = [];
  let recentLeads: { createdAt: Date }[] = [];
  let followUpLeadsRaw: any[] = [];

  try {
    const [
      tl,
      ta,
      hc,
      sc,
      cc,
      ald,
      sm,
    ] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.count({ where: { status: { not: "CLOSED" } } }),
      prisma.lead.count({
        where: {
          OR: [
            { harassmentLevel: { not: null } },
            { legalIssue: { contains: "138" } },
            { legalIssue: { contains: "Notice" } },
            { legalIssue: { contains: "Harassment" } },
          ],
        },
      }),
      prisma.lead.count({
        where: {
          OR: [
            { status: "CONSULTATION_SCHEDULED" },
            { consultationSlot: { not: null } },
          ],
        },
      }),
      prisma.lead.count({ where: { status: "CONVERTED" } }),
      prisma.lead.findMany({
        where: { status: { not: "CLOSED" } },
        select: { totalDebtRange: true },
      }),
      prisma.user.findMany({
        where: { isActive: true },
        select: { id: true, name: true, role: true },
      }),
    ]);
    totalLeads = tl;
    totalActive = ta;
    harassmentCount = hc;
    scheduledCount = sc;
    convertedCount = cc;
    activeLeadsWithDebt = ald;
    staffMembers = sm;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    recentLeads = await prisma.lead.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
      },
      select: { createdAt: true },
    });

    followUpLeadsRaw = await prisma.lead.findMany({
      where: {
        OR: [
          { status: "FOLLOW_UP" },
          { nextFollowUpAt: { lte: now } },
          { status: "NEW" },
        ],
        status: { not: "CLOSED" },
      },
      orderBy: [{ nextFollowUpAt: "asc" }, { updatedAt: "desc" }],
      take: 8,
    });
  } catch (dbErr) {
    console.warn("Database query notice in AdminDashboardPage (database may still be initializing):", dbErr);
  }

  // Compute Pipeline Value
  const totalPipelineAmount = activeLeadsWithDebt.reduce(
    (sum, lead) => sum + parseDebtAmount(lead.totalDebtRange),
    0
  );
  const pipelineValueStr = formatINRShort(totalPipelineAmount);

  // Conversion rate
  const conversionRate =
    totalLeads > 0 ? Math.round((convertedCount / totalLeads) * 100) : 0;

  // 2. Compute 7-Day Ingestion Volume
  const dailyVolume = [];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayLabel = days[d.getDay()];

    const count = recentLeads.filter(
      (l) => l.createdAt.toISOString().slice(0, 10) === dateStr
    ).length;

    dailyVolume.push({
      dayLabel,
      dateStr,
      count,
      isToday: i === 0,
    });
  }

  const initialFollowUps = followUpLeadsRaw.map((l) => ({
    id: l.id,
    referenceId: l.referenceId,
    fullName: l.fullName,
    phone: l.phone,
    city: l.city,
    totalDebtRange: l.totalDebtRange,
    legalIssue: l.legalIssue,
    harassmentLevel: l.harassmentLevel,
    status: l.status,
    nextFollowUpAt: l.nextFollowUpAt ? l.nextFollowUpAt.toISOString() : null,
    lastMessageAt: l.lastMessageAt.toISOString(),
  }));

  return (
    <AdminDashboardView
      kpis={{
        totalActive,
        harassmentCount,
        scheduledCount,
        pipelineValueStr,
        conversionRate,
      }}
      dailyVolume={dailyVolume}
      initialFollowUps={initialFollowUps}
      staffMembers={staffMembers}
    />
  );
}
