import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/admin/settings-view";
import { env } from "@/lib/env";

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

  const staffUsersRaw = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    include: {
      _count: {
        select: {
          leadsAssigned: true,
        },
      },
    },
  });

  const staffUsers = staffUsersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
    leadsAssignedCount: u._count.leadsAssigned,
  }));

  const configState = {
    dbProvider: "Neon Serverless PostgreSQL (AWS us-east-2)",
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
      configState={configState}
    />
  );
}
