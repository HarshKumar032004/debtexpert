"use client";

import * as React from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

export const homeFaqs = [
  {
    question: "Is debt settlement legal in India under Reserve Bank of India (RBI) guidelines?",
    answer:
      "Yes, 100% legal. The Reserve Bank of India (RBI) has issued clear guidelines on Compromise Settlements and One-Time Settlements (OTS) under the Prudential Framework for Resolution of Stressed Assets and Fair Practices Code. When a borrower faces genuine financial distress (illness, business failure, job loss), banks and NBFCs are authorized to negotiate and accept a reduced lump sum settlement to close the non-performing asset (NPA).",
  },
  {
    question: "Will my CIBIL score be affected after settling a loan?",
    answer:
      "When a loan is settled, the lender will report the status to credit bureaus (CIBIL, Experian, Equifax, CRIF High Mark) as 'Settled' or 'Written Off' rather than 'Closed'. While this reduces your credit score in the short term, remaining in indefinite default with compounding late fees and non-payment reports is significantly worse. Once the No Dues Certificate is issued, you can gradually rebuild your credit score to 750+ over 12-24 months through secured credit builder products.",
  },
  {
    question: "Can recovery agents visit my house or call my family and employer?",
    answer:
      "No. Under the RBI August 2022 Circular on Recovery Agents, lenders and their recovery agencies are strictly prohibited from contacting anyone other than the borrower (including friends, family members, or workplace employers). Furthermore, visits without prior notice, visits outside 8:00 AM to 7:00 PM, and any abusive or threatening behavior are illegal violations. Debt Support Expert issues immediate Advocate Representation Notices to halt unlawful recovery actions.",
  },
  {
    question: "Can a bank file a criminal police case against me or arrest me for loan default?",
    answer:
      "Defaulting on an unsecured personal loan or credit card in India is strictly a civil dispute, NOT a criminal offense. Police cannot arrest you for inability to repay a loan due to financial hardship. However, if an ECS/NACH mandate or cheque bounces, banks may initiate proceedings under Section 138 of the Negotiable Instruments Act or Section 25 of the Payment and Settlement Systems Act. Our empanelled advocates represent you to reply to such notices, handle Lok Adalat summons, and resolve the matter through formal settlement.",
  },
  {
    question: "What is an official No Dues Certificate (NDC) and why is it crucial?",
    answer:
      "A No Dues Certificate (NDC), also known as a No Objection Certificate (NOC), is the formal legal document issued by the bank confirming that the loan has been settled in full satisfaction and no further claims remain. Without this official document, unauthorized recovery agents or debt buyers might try to claim remaining balances in the future. We ensure that you pay settlement amounts directly into the bank's account and obtain a verified NDC.",
  },
  {
    question: "How much waiver or discount can I realistically expect?",
    answer:
      "Depending on the duration of default, whether the account has entered NPA status, and the evidence of hardship provided, borrowers typically achieve waivers between 50% and 75% on the total claimed balance. Credit cards often secure higher waivers as substantial parts of the balance consist of compounded 42%+ APR finance charges, penal interest, and late charges.",
  },
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
      <FaqJsonLd items={homeFaqs} />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
            <HelpCircle className="h-4 w-4" />
            <span>Legal Insights & Frequently Asked Questions</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Clear Answers to Your Legal & Debt Questions
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            Everything you need to know about loan settlement legality, recovery rules, credit
            scores, and legal notices in India.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {homeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full py-5 px-6 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg">{faq.question}</span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200",
                      isOpen ? "rotate-180 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400" : "text-muted-foreground"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/50 animate-in fade-in duration-150">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
