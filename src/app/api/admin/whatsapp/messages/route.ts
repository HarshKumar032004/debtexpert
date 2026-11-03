import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const leadId = searchParams.get("leadId");

    if (!leadId) {
      return NextResponse.json({ success: false, error: "leadId is required" }, { status: 400 });
    }

    const [lead, messages] = await Promise.all([
      prisma.lead.findUnique({
        where: { id: leadId },
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
          lenders: true,
          consultationSlot: true,
          lastMessageAt: true,
          assignedTo: { select: { id: true, name: true } },
        },
      }),
      prisma.whatsAppMessage.findMany({
        where: { leadId },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // Reset unread count to 0 upon opening the thread
    await prisma.lead.update({
      where: { id: leadId },
      data: { unreadCount: 0 },
    });

    return NextResponse.json({
      success: true,
      lead,
      messages,
    });
  } catch (error) {
    console.error("GET /api/admin/whatsapp/messages error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
