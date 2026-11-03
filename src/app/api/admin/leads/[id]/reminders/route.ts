import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ReminderToggleSchema, ReminderCreateSchema } from "@/lib/validations";

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

    // Strict Scope Resolution: verify lead existence (Pillar 4)
    const leadExists = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true },
    });

    if (!leadExists) {
      return NextResponse.json(
        { success: false, error: "Case file not found." },
        { status: 404 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed JSON payload." }, { status: 400 });
    }

    // Toggle completion of existing reminder (Pillar 2 / 4)
    if (typeof rawJson === "object" && rawJson !== null && "reminderId" in rawJson) {
      const toggleValidation = ReminderToggleSchema.safeParse(rawJson);
      if (!toggleValidation.success) {
        const firstError = toggleValidation.error.issues[0]?.message || "Invalid reminder parameters.";
        return NextResponse.json({ success: false, error: firstError }, { status: 400 });
      }

      const { reminderId, isCompleted } = toggleValidation.data;

      const existingReminder = await prisma.followUpReminder.findFirst({
        where: { id: reminderId, leadId },
      });

      if (!existingReminder) {
        return NextResponse.json(
          { success: false, error: "Reminder not found for this case file." },
          { status: 404 }
        );
      }

      const updatedReminder = await prisma.followUpReminder.update({
        where: { id: existingReminder.id },
        data: { isCompleted },
      });

      await prisma.activityLog.create({
        data: {
          leadId,
          userId: user.userId,
          actorName: user.name,
          action: "REMINDER_UPDATED",
          details: `Reminder marked as ${isCompleted ? "Completed" : "Pending"}`,
        },
      });

      return NextResponse.json({
        success: true,
        reminder: updatedReminder,
      });
    }

    // Create new reminder (Pillar 2)
    const createValidation = ReminderCreateSchema.safeParse(rawJson);
    if (!createValidation.success) {
      const firstError = createValidation.error.issues[0]?.message || "Invalid reminder creation parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { scheduledAt: scheduledAtStr, note } = createValidation.data;
    const scheduledAt = new Date(scheduledAtStr);

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
