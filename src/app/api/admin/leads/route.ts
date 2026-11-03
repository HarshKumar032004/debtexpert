import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export const dynamic = "force-dynamic";

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
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.LeadWhereInput = {};

    // Status filter
    if (status !== "ALL") {
      where.status = status;
    }

    // Issue filter
    if (issue !== "ALL") {
      where.legalIssue = { contains: issue };
    }

    // Harassment emergency filter
    if (harassmentOnly) {
      where.harassmentLevel = {
        not: null,
      };
    }

    // Search query across name, phone, email, city, refId
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search.replace(/\D/g, "") || search } },
        { email: { contains: search } },
        { city: { contains: search } },
        { referenceId: { contains: search } },
        { lenders: { contains: search } },
      ];
    }

    const [total, leads] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: "desc" },
        include: {
          assignedTo: {
            select: { id: true, name: true, email: true, role: true },
          },
          notes: {
            orderBy: { createdAt: "desc" },
            take: 3,
          },
          reminders: {
            where: { isCompleted: false },
            orderBy: { scheduledAt: "asc" },
            take: 1,
          },
          whatsAppMessages: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching leads" },
      { status: 500 }
    );
  }
}
