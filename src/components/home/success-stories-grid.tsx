"use client";

import { motion } from "framer-motion";
import {
  FileCheck2,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  Building,
  UserCheck,
  Star,
  Quote,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function SuccessStoriesGrid() {
  const stories = [
    {
      name: "Rahul S.",
      city: "Delhi NCR",
      profession: "Senior Software Engineer",
      lenders: "HDFC Bank & SBI Card",
      loanType: "Personal Loan & Credit Cards",
      originalAmount: 1200000,
      settledAmount: 420000,
      savingsPct: "65%",
      timeline: "4 Months",
      harassmentStatus: "Calls ceased within 48h of legal notice",
      testimonial:
        "After losing my tech job, I was bombarded with 40+ calls daily. Recovery agents threatened to call my HR. Debt Support Expert served an Advocate Notice immediately and negotiated a clean OTS from ₹12L down to ₹4.2L.",
    },
    {
      name: "Priya M.",
      city: "Bengaluru, Karnataka",
      profession: "Corporate HR Manager",
      lenders: "Bajaj Finserv & ICICI Bank",
      loanType: "Personal Loans & Instant Credits",
      originalAmount: 1850000,
      settledAmount: 610000,
      savingsPct: "67%",
      timeline: "5 Months",
      harassmentStatus: "Unannounced home visits stopped with police complaint warning",
      testimonial:
        "Compounding interest turned my medical loan into an insurmountable mountain. Agents actually visited my apartment. The legal team intervened under RBI guidelines, stopped all home visits, and secured an official signed NDC.",
    },
    {
      name: "Vikram T.",
      city: "Mumbai, Maharashtra",
      profession: "Manufacturing MSME Owner",
      lenders: "Axis Bank & Kotak Mahindra",
      loanType: "Business OD & Unsecured Credit",
      originalAmount: 2800000,
      settledAmount: 1050000,
      savingsPct: "62%",
      timeline: "6 Months",
      harassmentStatus: "SARFAESI Sec 13(2) notice replied with legal objection",
      testimonial:
        "When business receivables got stuck, the bank served a 60-day demand notice. Debt Support Expert's senior banking advocate filed a comprehensive objection under Sec 13(3A) and negotiated a structured compromise settlement.",
    },
    {
      name: "Anil K.",
      city: "Hyderabad, Telangana",
      profession: "Pharma Sales Executive",
      lenders: "Standard Chartered & RBL Bank",
      loanType: "Revolving Credit Card Debt",
      originalAmount: 780000,
      settledAmount: 240000,
      savingsPct: "69%",
      timeline: "3 Months",
      harassmentStatus: "All interest calculations frozen permanently",
      testimonial:
        "Paying the minimum due for 2 years had barely reduced my ₹5L principal, and late fees pushed it to ₹7.8L. The team froze the interest calculation immediately and closed both cards for ₹2.4 Lakhs total.",
    },
    {
      name: "Suresh N.",
      city: "Pune, Maharashtra",
      profession: "Automobile Engineer",
      lenders: "IDFC FIRST & IndusInd Bank",
      loanType: "Unsecured Personal Loans",
      originalAmount: 1500000,
      settledAmount: 520000,
      savingsPct: "65%",
      timeline: "4 Months",
      harassmentStatus: "Section 138 cheque bounce settled in Lok Adalat",
      testimonial:
        "Received a court summons for bounced NACH. I was terrified of going to jail. The advocate represented me in Lok Adalat, explained my hardship, and finalized the OTS. No criminal liability remained.",
    },
    {
      name: "Meera J.",
      city: "Chennai, Tamil Nadu",
      profession: "Government School Educator",
      lenders: "Piramal Finance & Tata Capital",
      loanType: "Multiple NBFC & Instant App Loans",
      originalAmount: 920000,
      settledAmount: 310000,
      savingsPct: "66%",
      timeline: "3 Months",
      harassmentStatus: "Illegal contact-harvesting threats neutralized",
      testimonial:
        "Unregulated recovery agents threatened to circulate morphed images to my contacts. Debt Support Expert served emergency Cease & Desist notices and filed complaints on the RBI CMS portal. The harassment ended overnight.",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-10 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <FileCheck2 className="h-4 w-4" />
            <span>Verified Settlement Case Studies</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Real Clients. Real Bank Waivers. Real Relief.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Every case below concluded with an authentic signed bank settlement letter and
            irrevocable No Dues Certificate (NDC). Client identities are protected for legal
            confidentiality.
          </p>
        </div>

        {/* 6 Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-7 max-w-6xl mx-auto">
          {stories.map((item, idx) => {
            const savings = item.originalAmount - item.settledAmount;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-3xl border border-border bg-card p-5 sm:p-6 lg:p-7 flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Header row */}
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold text-xs">
                        {item.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground">{item.name}</div>
                        <div className="text-[10px] text-muted-foreground">{item.city}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.savingsPct} Saved
                    </span>
                  </div>

                  {/* Financial Comparison Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">
                        Original Balance
                      </div>
                      <div className="text-sm font-bold text-red-600 dark:text-red-400 line-through">
                        {formatINR(item.originalAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                        Legal OTS Settled
                      </div>
                      <div className="text-sm font-extrabold text-foreground">
                        {formatINR(item.settledAmount)}
                      </div>
                    </div>
                  </div>

                  {/* Lenders & Protection */}
                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span><strong>Lenders:</strong> {item.lenders}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Protection:</strong> {item.harassmentStatus}</span>
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <div className="pt-2 text-xs text-muted-foreground leading-relaxed italic relative">
                    <Quote className="h-4 w-4 text-primary-500/30 absolute -top-1 -left-1" />
                    <p className="pl-3">&ldquo;{item.testimonial}&rdquo;</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground text-[11px]">Timeline: {item.timeline}</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                    Net Savings: {formatINR(savings)}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
