"use client";

import * as React from "react";
import { MessageCircle } from "lucide-react";
import { siteConfig } from "@/config/site";

export function FloatingWhatsApp() {
  const [showTooltip, setShowTooltip] = React.useState(false);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    siteConfig.whatsappMessage
  )}`;

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-40 flex items-center gap-3">
      {/* Tooltip on hover/initial display */}
      <div
        className={`hidden sm:flex items-center px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold shadow-lg border border-slate-700 transition-opacity duration-200 ${
          showTooltip ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <span>Chat with Legal Advisor</span>
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label="Chat on WhatsApp with Debt Support Expert Legal Advisor"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 hover:scale-105 active:scale-95 transition-all duration-200"
      >
        {/* Radar ping animation */}
        <span className="absolute -inset-1 rounded-full bg-emerald-400 opacity-40 animate-ping" />
        <MessageCircle className="relative h-7 w-7 fill-white text-white" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>
    </div>
  );
}
