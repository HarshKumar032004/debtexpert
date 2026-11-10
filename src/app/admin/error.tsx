"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LogIn, Home, Database } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Admin Error Boundary caught an exception:", error);
  }, [error]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 selection:bg-amber-500 selection:text-slate-950">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl p-8 shadow-2xl space-y-6 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto shadow-inner">
          <AlertTriangle className="h-8 w-8" />
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Admin Workspace Notice
          </h1>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            The CRM dashboard encountered an initialization condition. This typically occurs during initial cloud deployment before database tables are created or environment variables are linked.
          </p>
        </div>

        {/* Diagnostic info if available */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-2 text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <Database className="h-3.5 w-3.5" />
            <span>Deployment Checklist:</span>
          </div>
          <ul className="text-slate-400 space-y-1 list-disc list-inside text-[11px]">
            <li>Verify <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded">DATABASE_URL</code> is set in Vercel Environment Variables.</li>
            <li>Run <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded">npx prisma db push</code> against your cloud database.</li>
            <li>Verify <code className="text-slate-200 bg-slate-900 px-1 py-0.5 rounded">JWT_SECRET</code> is configured.</li>
          </ul>
          {error.message && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-red-400 font-mono truncate">
              Detail: {error.message}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-2.5 px-4 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/admin/login"
            className="flex-1 py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            <span>Admin Sign In</span>
          </Link>

          <Link
            href="/"
            className="p-2.5 rounded-xl text-slate-400 hover:text-slate-200 bg-slate-800/40 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-center"
            title="Go to Website Home"
          >
            <Home className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
