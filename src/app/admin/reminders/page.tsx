import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RemindersView, ReminderItem } from "@/components/admin/reminders-view";

export const dynamic = "force-dynamic";

export default async function AdminRemindersPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const [remindersRaw, staffMembers] = await Promise.all([
    prisma.followUpReminder.findMany({
      orderBy: { scheduledAt: "asc" },
      include: {
        lead: {
          select: {
            id: true,
            referenceId: true,
            fullName: true,
            phone: true,
          },
        },
        assignedTo: {
          select: { name: true },
        },
      },
    }),
    prisma.user.findMany({
      where: { isActive: true },
      select: { id: true, name: true, role: true },
    }),
  ]);

  const initialReminders: ReminderItem[] = remindersRaw.map((r) => ({
    id: r.id,
    leadId: r.leadId,
    leadReferenceId: r.lead.referenceId,
    clientName: r.lead.fullName,
    clientPhone: r.lead.phone,
    scheduledAt: r.scheduledAt.toISOString(),
    note: r.note,
    isCompleted: r.isCompleted,
    assignedAdvisorName: r.assignedTo?.name,
  }));

  return (
    <RemindersView
      initialReminders={initialReminders}
      staffMembers={staffMembers}
    />
  );
}
