import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/admin/settings-view";
import { env } from "@/lib/env";
import { getSystemHealth } from "@/lib/system-health";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  // Strictly enforce SUPER_ADMIN role for administrative settings & roster inspection
  if (user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  const [staffUsersRaw, templatesRaw, autoAssignSetting, initialHealth] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        _count: {
          select: {
            leadsAssigned: true,
          },
        },
      },
    }),
    prisma.whatsAppTemplate.findMany({
      orderBy: { createdAt: "asc" },
    }),
    prisma.systemSetting.findUnique({
      where: { key: "AUTO_ASSIGN_LEADS" },
    }),
    getSystemHealth(),
  ]);

  const staffUsers = staffUsersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    leadsAssignedCount: u._count.leadsAssigned,
  }));

  const templates = templatesRaw.map((t) => ({
    id: t.id,
    title: t.title,
    content: t.content,
    isActive: t.isActive,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
  }));

  const autoAssignLeads = autoAssignSetting?.value === "true";

  const configState = {
    dbProvider: initialHealth.database.provider,
    hasMetaToken: Boolean(env.META_ACCESS_TOKEN),
    hasPhoneNumberId: Boolean(env.META_PHONE_NUMBER_ID),
    adminWhatsAppNumber: env.ADMIN_WHATSAPP_NUMBER,
    appUrl: env.NEXT_PUBLIC_APP_URL,
    nodeEnv: env.NODE_ENV,
  };

  return (
    <SettingsView
      currentUser={{
        id: user.userId,
        name: user.name,
        email: user.email,
        role: user.role,
      }}
      staffUsers={staffUsers}
      templates={templates}
      autoAssignLeads={autoAssignLeads}
      configState={configState}
      initialHealth={initialHealth}
    />
  );
}
