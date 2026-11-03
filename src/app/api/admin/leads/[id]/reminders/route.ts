import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id: leadId } = await params;
    const body = await request.json();

    // Toggle completion of existing reminder
    if (body.reminderId) {
      const updatedReminder = await prisma.followUpReminder.update({
        where: { id: body.reminderId },
        data: { isCompleted: Boolean(body.isCompleted) },
      });

      await prisma.activityLog.create({
        data: {
          leadId,
          userId: user.userId,
          actorName: user.name,
          action: "REMINDER_UPDATED",
          details: `Reminder marked as ${body.isCompleted ? "Completed" : "Pending"}`,
        },
      });

      return NextResponse.json({
        success: true,
        reminder: updatedReminder,
      });
    }

    // Create new reminder
    const scheduledAt = body.scheduledAt ? new Date(body.scheduledAt) : null;
    const note = body.note?.trim() || "Follow up with client";

    if (!scheduledAt || isNaN(scheduledAt.getTime())) {
      return NextResponse.json(
        { success: false, error: "Valid scheduled date and time required." },
        { status: 400 }
      );
    }

    const reminder = await prisma.followUpReminder.create({
      data: {
        leadId,
        assignedToId: user.userId,
        scheduledAt,
        note,
        isCompleted: false,
      },
    });

    // Also update lead's nextFollowUpAt
    await prisma.lead.update({
      where: { id: leadId },
      data: { nextFollowUpAt: scheduledAt },
    });

    await prisma.activityLog.create({
      data: {
        leadId,
        userId: user.userId,
        actorName: user.name,
        action: "REMINDER_SET",
        details: `Follow-up set for ${scheduledAt.toLocaleString("en-IN")}: "${note}"`,
      },
    });

    return NextResponse.json({
      success: true,
      reminder,
      message: "Follow-up reminder set successfully.",
    });
  } catch (error) {
    console.error("POST /api/admin/leads/[id]/reminders error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error saving reminder" },
      { status: 500 }
    );
  }
}
