"use client";

import * as React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { UserRole } from "@/lib/auth";

interface AdminLayoutClientProps {
  user: {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
  };
  pendingCount: number;
  unreadWhatsAppCount: number;
  children: React.ReactNode;
}

export function AdminLayoutClient({
  user,
  pendingCount,
  unreadWhatsAppCount,
  children,
}: AdminLayoutClientProps) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);

  // Close mobile sidebar on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && mobileSidebarOpen) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileSidebarOpen]);

  // Prevent background scroll when mobile sidebar is open
  React.useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="h-screen w-screen overflow-hidden flex bg-gray-50 dark:bg-[#09090b] text-gray-900 dark:text-zinc-100 transition-colors duration-200 selection:bg-amber-500 selection:text-white dark:selection:text-zinc-950">
        {/* Mobile Backdrop Overlay */}
        {mobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
            onClick={() => setMobileSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* Sidebar (Persistent on desktop, off-canvas drawer on mobile) */}
        <AdminSidebar
          pendingCount={pendingCount}
          unreadWhatsAppCount={unreadWhatsAppCount}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Workspace Frame */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          <AdminTopbar
            user={user}
            onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          />

          <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-8 bg-gray-100/60 dark:bg-zinc-950/80 transition-colors">
            <div className="max-w-7xl mx-auto space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

