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

    const where: Prisma.LeadWhereInput = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search } },
        { phone: { contains: search.replace(/\D/g, "") || search } },
        { referenceId: { contains: search } },
      ];
    }

    const conversations = await prisma.lead.findMany({
      where,
      orderBy: { lastMessageAt: "desc" },
      take: 60,
      select: {
        id: true,
        referenceId: true,
        fullName: true,
        phone: true,
        city: true,
        status: true,
        totalDebtRange: true,
        harassmentLevel: true,
        legalIssue: true,
        unreadCount: true,
        lastMessageAt: true,
        assignedTo: {
          select: { id: true, name: true },
        },
        whatsAppMessages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            content: true,
            direction: true,
            status: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      conversations,
    });
  } catch (error) {
    console.error("GET /api/admin/whatsapp/conversations error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load conversations" },
      { status: 500 }
    );
  }
}
