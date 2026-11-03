import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await seedDatabaseIfNeeded();

  const user = await getCurrentUser();

  // If unauthenticated (e.g. visiting /admin/login), render children directly without admin chrome
  if (!user) {
    return <>{children}</>;
  }

  // Fetch pending count and unread WhatsApp count for sidebar badges
  const [pendingLeadsCount, unreadWhatsAppCount] = await Promise.all([
    prisma.lead.count({ where: { status: "NEW" } }),
    prisma.lead.count({ where: { unreadCount: { gt: 0 } } }),
  ]);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Collapsible Sidebar */}
      <AdminSidebar
        pendingCount={pendingLeadsCount}
        unreadWhatsAppCount={unreadWhatsAppCount}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/95">
          {children}
        </main>
      </div>
    </div>
  );
}
