import {
  FileCheck2,
  TrendingDown,
  Building,
  UserCheck,
  ShieldCheck,
} from "lucide-react";
import { formatINR } from "@/lib/utils";

export function CaseStudies() {
  const cases = [
    {
      borrower: "Senior Software Engineer",
      city: "Bengaluru, Karnataka",
      lender: "HDFC Bank & ICICI Bank",
      loanType: "Unsecured Personal Loans",
      claimed: 1420000,
      settled: 490000,
      savingsPct: "65%",
      timeline: "4 Months",
      harassmentStopped: "Within 48 hours of Advocate Notice",
      story:
        "Suffered sudden salary cuts during tech sector restructuring. Compounding late charges and daily recovery calls made work impossible. Our advocates served notice and secured an official OTS with 65% total relief.",
    },
    {
      borrower: "Retail Business Proprietor",
      city: "Delhi NCR",
      lender: "Bajaj Finserv & Axis Bank",
      loanType: "Business & Personal Loans",
      claimed: 2250000,
      settled: 750000,
      savingsPct: "67%",
      timeline: "5 Months",
      harassmentStopped: "Stop visit notice served to local agency",
      story:
        "Supply chain disruptions led to cash flow insolvency. Agents started visiting residential premises without notice. We intervened with RBI Circular 2022 complaints and negotiated a clean OTS.",
    },
    {
      borrower: "Healthcare Operations Lead",
      city: "Mumbai, Maharashtra",
      lender: "SBI & Standard Chartered",
      loanType: "Credit Card Overdue Debt",
      claimed: 880000,
      settled: 260000,
      savingsPct: "70%",
      timeline: "3 Months",
      harassmentStopped: "Harassment calls routed to counsel",
      story:
        "Accumulated card debt due to family medical crisis. Card APR of 42% caused debt to balloon. We froze all interest calculation and finalized an installment settlement plan.",
    },
  ];

  return (
    <section className="py-20 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
            <FileCheck2 className="h-4 w-4" />
            <span>Verified Settlement Proof</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Real Clients. Real Bank Waivers.
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            Every case below concluded with an official signed bank settlement letter and
            irrevocable No Dues Certificate (NDC).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cases.map((item, idx) => {
            const savings = item.claimed - item.settled;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-border bg-card p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border">
                    <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                      <UserCheck className="h-4 w-4 text-primary-500" />
                      <span>{item.borrower}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground">{item.city}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                      {item.loanType}
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      {item.savingsPct} Saved
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-border/80 grid grid-cols-2 gap-2 text-center">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase font-bold">
                        Claimed Balance
                      </div>
                      <div className="text-sm font-bold text-red-600 dark:text-red-400 line-through">
                        {formatINR(item.claimed)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase font-bold">
                        Settled Amount
                      </div>
                      <div className="text-sm font-extrabold text-foreground">
                        {formatINR(item.settled)}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary-500 shrink-0" />
                      <span><strong>Lenders:</strong> {item.lender}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span><strong>Protection:</strong> {item.harassmentStopped}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed italic pt-1">
                    &ldquo;{item.story}&rdquo;
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Resolution in {item.timeline}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    Net Savings: {formatINR(savings)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
