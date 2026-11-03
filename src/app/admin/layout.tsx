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

  // Fetch pending count for sidebar badge
  const pendingLeadsCount = await prisma.lead.count({
    where: { status: "NEW" },
  });

  return (
    <div className="min-h-screen flex bg-slate-950 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Collapsible Sidebar */}
      <AdminSidebar pendingCount={pendingLeadsCount} />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <AdminTopbar user={user} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950/95">
          {children}
        </main>
      </div>
    </div>
  );
}
