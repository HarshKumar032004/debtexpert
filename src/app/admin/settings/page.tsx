import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { SettingsView } from "@/components/admin/settings-view";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const staffUsersRaw = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  const staffUsers = staffUsersRaw.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
    createdAt: u.createdAt.toISOString(),
  }));

  const configState = {
    dbProvider: "SQLite (dev.db) / PostgreSQL Compatible",
    hasMetaToken: Boolean(process.env.META_ACCESS_TOKEN),
    hasPhoneNumberId: Boolean(process.env.META_PHONE_NUMBER_ID),
    adminWhatsAppNumber: process.env.ADMIN_WHATSAPP_NUMBER || "917979789458",
    appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
  };

  return (
    <SettingsView
      staffUsers={staffUsers}
      configState={configState}
    />
  );
}
