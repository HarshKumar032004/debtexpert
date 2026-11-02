import { Check, X, Shield, AlertTriangle, Users } from "lucide-react";

export function ComparisonMatrix() {
  const comparisons = [
    {
      feature: "Official Advocate Legal Notice to Stop Harassment",
      debtSupport: true,
      agents: false,
      alone: false,
    },
    {
      feature: "RBI Fair Practices Code Enforcement (Ombudsman Complaints)",
      debtSupport: true,
      agents: false,
      alone: false,
    },
    {
      feature: "Court Notice Representation (Sec 138 NI Act, Lok Adalat)",
      debtSupport: true,
      agents: false,
      alone: false,
    },
    {
      feature: "Direct Payment to Bank Account Only (Zero Fraud Risk)",
      debtSupport: true,
      agents: false,
      alone: true,
    },
    {
      feature: "Formal Signed Bank Settlement Letter Prior to Payout",
      debtSupport: true,
      agents: false,
      alone: "Difficult",
    },
    {
      feature: "50% to 75% Average Debt Waiver Negotiations",
      debtSupport: true,
      agents: "Unreliable",
      alone: "Low (10-20%)",
    },
    {
      feature: "Guaranteed No Dues Certificate (NDC / NOC) from Bank",
      debtSupport: true,
      agents: false,
      alone: "Difficult",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Shield className="h-4 w-4" />
            <span>Why Choose Legal Advocacy</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight">
            Debt Support Expert vs Other Options
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Why settling your loans through our empanelled legal advocates is the safest, most
            effective path to financial freedom in India.
          </p>
        </div>

        {/* Mobile Stacked Comparison Cards (< md) */}
        <div className="md:hidden space-y-3.5 max-w-lg mx-auto">
          {comparisons.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3"
            >
              <h3 className="font-bold text-xs sm:text-sm text-foreground leading-snug">
                {item.feature}
              </h3>

              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                {/* Debt Support Expert */}
                <div className="p-2.5 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200/70 dark:border-primary-900/50 flex flex-col items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-extrabold tracking-wider text-primary-700 dark:text-primary-300">
                    Debt Expert
                  </span>
                  <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Check className="h-3.5 w-3.5 stroke-[3]" />
                  </div>
                </div>

                {/* Agents */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                    Agents
                  </span>
                  {item.agents === false ? (
                    <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-amber-600 font-bold">{item.agents}</span>
                  )}
                </div>

                {/* Alone */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-between gap-1.5">
                  <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">
                    Alone
                  </span>
                  {item.alone === true ? (
                    <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                  ) : item.alone === false ? (
                    <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
                      <X className="h-3.5 w-3.5 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-[10px] text-slate-500 font-medium leading-tight">{item.alone}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop / Tablet Comparison Table (>= md) */}
        <div className="hidden md:block max-w-4xl mx-auto overflow-x-auto rounded-3xl border border-border bg-card shadow-lg scrollbar-thin snap-x">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/60">
                <th className="py-5 px-6 text-xs font-bold uppercase tracking-wider text-muted-foreground w-1/2">
                  Key Protection & Settlement Pillars
                </th>
                <th className="py-5 px-4 text-center text-xs font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50/50 dark:bg-primary-950/30 border-x border-border">
                  Debt Support Expert
                </th>
                <th className="py-5 px-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Unregulated Agents
                </th>
                <th className="py-5 px-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Handling Alone
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {comparisons.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20">
                  <td className="py-4 px-6 font-medium text-foreground text-xs sm:text-sm">
                    {item.feature}
                  </td>
                  {/* Debt Support Expert */}
                  <td className="py-4 px-4 text-center bg-primary-50/30 dark:bg-primary-950/20 border-x border-border font-bold text-primary-600 dark:text-primary-400">
                    <div className="flex items-center justify-center">
                      <div className="h-7 w-7 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                        <Check className="h-4 w-4 stroke-[3]" />
                      </div>
                    </div>
                  </td>
                  {/* Agents */}
                  <td className="py-4 px-4 text-center text-muted-foreground text-xs">
                    {item.agents === false ? (
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
                          <X className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-amber-600 font-semibold">{item.agents}</span>
                    )}
                  </td>
                  {/* Alone */}
                  <td className="py-4 px-4 text-center text-muted-foreground text-xs">
                    {item.alone === true ? (
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : item.alone === false ? (
                      <div className="flex items-center justify-center">
                        <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center">
                          <X className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-500 font-medium">{item.alone}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
