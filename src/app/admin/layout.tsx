import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { AdminLayoutClient } from "@/components/admin/admin-layout-client";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await seedDatabaseIfNeeded();
  } catch (err) {
    console.warn("Database seed notice:", err);
  }

  let user = null;
  try {
    user = await getCurrentUser();
  } catch (err) {
    console.warn("User session check notice:", err);
  }

  // If unauthenticated (e.g. visiting /admin/login), render children directly without admin chrome
  if (!user) {
    return <>{children}</>;
  }

  // Fetch pending count and unread WhatsApp count for sidebar badges with defensive fallback
  let pendingLeadsCount = 0;
  let unreadWhatsAppCount = 0;
  try {
    const [pCount, uCount] = await Promise.all([
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count({ where: { unreadCount: { gt: 0 } } }),
    ]);
    pendingLeadsCount = pCount;
    unreadWhatsAppCount = uCount;
  } catch (dbErr) {
    console.warn("Sidebar badge query notice (database may still be initializing):", dbErr);
  }

  return (
    <AdminLayoutClient
      user={user}
      pendingCount={pendingLeadsCount}
      unreadWhatsAppCount={unreadWhatsAppCount}
    >
      {children}
    </AdminLayoutClient>
  );
}
