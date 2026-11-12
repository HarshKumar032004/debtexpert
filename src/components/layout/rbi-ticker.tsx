"use client";

import * as React from "react";
import { PhoneCall } from "lucide-react";
import { siteConfig } from "@/config/site";

export function RbiTicker() {
  return (
    <div
      id="rbi-ticker"
      className="bg-slate-900 dark:bg-zinc-950 text-slate-100 border-b border-slate-800 dark:border-zinc-800 w-full"
    >
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-4 text-[10px] sm:text-xs py-1.5 px-2 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-semibold text-emerald-400">
            RBI Advisory Notice:
          </span>
          <span className="text-slate-300">
            Banks and recovery agents cannot harass or threaten you. You have legal consumer rights.
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 text-slate-300">
          <a
            href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
            className="flex items-center gap-1 hover:text-white transition-colors text-slate-200"
          >
            <PhoneCall className="h-3 w-3 text-emerald-400 shrink-0" />
            <span className="font-semibold text-white">{siteConfig.phoneDisplay}</span>
            <span className="text-slate-400 text-[10px] sm:text-[11px]">(9:00 AM - 5:00 PM)</span>
          </a>
        </div>
      </div>
    </div>
  );
}
