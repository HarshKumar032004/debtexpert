"use client";

import * as React from "react";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { ServiceFaq } from "@/types/service";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

interface ServiceFaqSectionProps {
  faqs: ServiceFaq[];
  serviceName: string;
}

export function ServiceFaqSection({ faqs, serviceName }: ServiceFaqSectionProps) {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="space-y-6 pt-8 border-t border-border" id="service-faqs">
      <FaqJsonLd items={faqs} />

      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
          <HelpCircle className="h-3.5 w-3.5" />
          <span>Legal Knowledge Base</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Frequently Asked Questions About {serviceName}
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Critical legal answers regarding RBI regulations, CIBIL score implications, recovery defense, and settlement procedures in India.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          const faqId = `service-faq-${index}`;
          const panelId = `service-faq-panel-${index}`;

          return (
            <div
              key={index}
              className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 shadow-sm"
            >
              <button
                type="button"
                id={faqId}
                aria-controls={panelId}
                aria-expanded={isOpen}
                onClick={() => toggleIndex(index)}
                className="w-full py-4 sm:py-5 px-5 sm:px-6 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <h3 className="text-sm sm:text-base font-bold pr-2 text-foreground">
                  {faq.question}
                </h3>
                <div
                  className={cn(
                    "h-7 w-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200",
                    isOpen
                      ? "rotate-180 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                      : "text-muted-foreground"
                  )}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {isOpen && (
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={faqId}
                  className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 animate-accordion-down"
                >
                  <p className="leading-relaxed">{faq.answer}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
