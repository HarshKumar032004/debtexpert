"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle, ShieldCheck } from "lucide-react";
import { FaqJsonLd } from "@/components/seo/json-ld";
import { cn } from "@/lib/utils";

export const topEightHomeFaqs = [
  {
    question: "Is loan settlement legal in India?",
    answer:
      "Yes, 100% legal. The Reserve Bank of India (RBI) explicitly recognizes Compromise Settlements and One-Time Settlements (OTS) in its Master Directions and Prudential Framework for Resolution of Stressed Assets. When a borrower faces genuine, documented financial hardship (such as medical disability, job loss, or business failure), banks and NBFCs are legally empowered to accept a reduced lump-sum payment and write off the remaining balance as a bad debt resolution, issuing a formal No Dues Certificate.",
  },
  {
    question: "How to stop recovery agents from calling family or visiting home?",
    answer:
      "Under the RBI Circular on Recovery Agents (August 2022) and the Right to Privacy, recovery agents are strictly barred from contacting your family members, friends, neighbors, or workplace employers. Furthermore, visits without prior written notice or outside the 8:00 AM to 7:00 PM window are illegal. When Debt Support Expert takes on your case, our empanelled advocates serve a formal Advocate Representation Notice and Cease-and-Desist letter to the bank's Head of Collections and Principal Nodal Officer, requiring all future communications to be routed to our legal office. If violations persist, we file immediate complaints with the RBI Banking Ombudsman (CMS Portal).",
  },
  {
    question: "How much discount can I get in One-Time Settlement (OTS)?",
    answer:
      "Borrowers typically secure waivers between 50% and 75% on their total claimed balance, depending on the age of the default, whether the account has entered Non-Performing Asset (NPA) status (past 90-180 days), and the strength of the hardship dossier. On credit cards, waivers often reach 65% to 75% because a large portion of the balance consists of compounded 42%+ APR finance charges, penal interest, and overlimit fees which banks readily waive during formal compromise discussions.",
  },
  {
    question: "Does loan settlement affect CIBIL score and how to rebuild it?",
    answer:
      "When a loan is settled at a discount, banks report the trade line to credit bureaus (CIBIL, Experian, CRIF High Mark) as 'Settled' or 'Written Off' rather than 'Closed'. This causes a temporary drop in your credit score. However, lingering in indefinite default with continuous late payment reporting and compounding penalties is far more damaging. Once you receive the No Dues Certificate (NDC), you can rebuild your credit score back to 750+ over 12 to 24 months by using secured credit builder cards (backed by fixed deposits) and maintaining pristine repayment discipline.",
  },
  {
    question: "Can police arrest me for personal loan default in India?",
    answer:
      "No. Defaulting on an unsecured personal loan or credit card in India is strictly a civil dispute, NOT a criminal offense. The Supreme Court of India has repeatedly held that inability to repay due to genuine financial distress cannot be treated as a criminal act of cheating. Recovery agents who threaten you with fake police warrants, arrest orders, or imprisonment are committing a punishable offense of criminal intimidation under the Indian Penal Code / Bharatiya Nyaya Sanhita.",
  },
  {
    question: "What should I do if I receive a Section 138 (Cheque Bounce) or Section 25 (NACH Bounce) notice?",
    answer:
      "Do NOT ignore statutory legal notices. When an ECS mandate, NACH debit, or cheque bounces, banks issue a 15-day statutory demand notice under Section 138 of the Negotiable Instruments Act or Section 25 of the Payment and Settlement Systems Act. Our litigation advocates draft pointwise legal replies demonstrating financial hardship and lack of criminal intent. We represent you before the court or Lok Adalat to negotiate a binding One-Time Settlement, which permanently withdraws the criminal complaint.",
  },
  {
    question: "Can banks take away my house or salary for an unsecured personal loan?",
    answer:
      "No. Unsecured personal loans and credit cards have NO collateral, lien, or mortgage attached to them. Banks have no automatic legal right to seize your home, car, or attach your salary without protracted civil court proceedings and a formal decree. Only secured debts (home loans, LAP, or hypothecated business limits) fall under the SARFAESI Act, and even there, borrowers have statutory rights to challenge notices before the Debt Recovery Tribunal (DRT).",
  },
  {
    question: "Why should I hire Debt Support Expert instead of negotiating with the bank alone?",
    answer:
      "When an individual approaches a bank alone, collection agents exploit their lack of legal knowledge by making verbal promises that are never honored, offering minimal 10-15% discounts, or collecting money without issuing a valid No Dues Certificate. Debt Support Expert is backed by Bar Council advocates. We shield you from harassment, negotiate directly with senior bank committees under RBI rules, ensure you pay directly to the bank account (never to any middleman), and verify the official signed settlement letter before you disburse a single rupee.",
  },
];

export function SeoFaqAccordion() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background border-b border-border" id="faq">
      <FaqJsonLd items={topEightHomeFaqs} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
            <HelpCircle className="h-4 w-4" />
            <span>High-Search-Volume Legal Answers</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Frequently Asked Questions on Loan Settlement in India
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Everything you need to know about loan settlement legality, RBI anti-harassment rules,
            CIBIL score impact, and court notice defense.
          </p>
        </div>

        {/* 8 FAQs Accordion */}
        <div className="max-w-3xl mx-auto space-y-3 sm:space-y-3.5">
          {topEightHomeFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleIndex(index)}
                  className="w-full py-4 px-4 sm:py-5 sm:px-6 text-left flex items-center justify-between gap-3 sm:gap-4 font-semibold text-foreground hover:text-primary-600 dark:hover:text-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base md:text-lg font-bold pr-1 sm:pr-2 leading-snug">{faq.question}</span>
                  <div
                    className={cn(
                      "h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 transition-transform duration-200",
                      isOpen
                        ? "rotate-180 bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
                        : "text-muted-foreground"
                    )}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
