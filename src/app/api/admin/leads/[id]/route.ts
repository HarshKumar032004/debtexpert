import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
        notes: {
          orderBy: { createdAt: "desc" },
        },
        reminders: {
          orderBy: { scheduledAt: "desc" },
        },
        whatsAppMessages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // Also fetch associated activity logs
    const activityLogs = await prisma.activityLog.findMany({
      where: { leadId: id },
      orderBy: { createdAt: "desc" },
      take: 30,
    });

    return NextResponse.json({
      success: true,
      lead: {
        ...lead,
        activityLogs,
      },
    });
  } catch (error) {
    console.error("GET /api/admin/leads/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    const activities: Array<{ action: string; details: string }> = [];

    // Status change
    if (body.status && body.status !== existingLead.status) {
      updateData.status = body.status;
      activities.push({
        action: "STATUS_UPDATED",
        details: `Status changed from "${existingLead.status}" to "${body.status}".`,
      });
    }

    // Assignment change
    if (body.assignedToId !== undefined && body.assignedToId !== existingLead.assignedToId) {
      updateData.assignedToId = body.assignedToId || null;
      activities.push({
        action: "ADVISOR_ASSIGNED",
        details: body.assignedToId
          ? `Lead assigned to counsel ID: ${body.assignedToId}`
          : "Lead unassigned.",
      });
    }

    // Next follow up time
    if (body.nextFollowUpAt !== undefined) {
      updateData.nextFollowUpAt = body.nextFollowUpAt ? new Date(body.nextFollowUpAt) : null;
      activities.push({
        action: "FOLLOW_UP_SCHEDULED",
        details: body.nextFollowUpAt
          ? `Follow-up scheduled for: ${new Date(body.nextFollowUpAt).toLocaleString("en-IN")}`
          : "Follow-up schedule cleared.",
      });
    }

    // General field updates
    if (body.fullName) updateData.fullName = body.fullName.trim();
    if (body.email !== undefined) updateData.email = body.email ? body.email.trim() : null;
    if (body.city !== undefined) updateData.city = body.city ? body.city.trim() : null;
    if (body.legalIssue) updateData.legalIssue = body.legalIssue;
    if (body.lenders !== undefined) updateData.lenders = body.lenders;
    if (body.totalDebtRange !== undefined) updateData.totalDebtRange = body.totalDebtRange;
    if (body.overdueStatus !== undefined) updateData.overdueStatus = body.overdueStatus;
    if (body.harassmentLevel !== undefined) updateData.harassmentLevel = body.harassmentLevel;
    if (body.message !== undefined) updateData.message = body.message;
    if (body.unreadCount !== undefined) updateData.unreadCount = body.unreadCount;

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: updateData,
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true, role: true },
        },
      },
    });

    // Write activity logs
    for (const act of activities) {
      await prisma.activityLog.create({
        data: {
          leadId: id,
          userId: user.userId,
          actorName: user.name,
          action: act.action,
          details: act.details,
        },
      });
    }

    return NextResponse.json({
      success: true,
      lead: updatedLead,
      message: "Lead updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/admin/leads/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating lead" },
      { status: 500 }
    );
  }
}
