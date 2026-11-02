import { Check, X, Shield, Scale } from "lucide-react";
import { ComparisonRow } from "@/types/service";

interface ServiceComparisonTableProps {
  rows: ComparisonRow[];
  serviceTitle: string;
}

export function ServiceComparisonTable({
  rows,
  serviceTitle,
}: ServiceComparisonTableProps) {
  return (
    <section className="space-y-6 pt-4" id="comparison">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
          <Scale className="h-3.5 w-3.5" />
          <span>Strategic Legal Advantage</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Handling Banks Alone vs. With Debt Support Expert Legal Team
        </h2>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Why confronting institutional recovery departments without legal representation puts you at severe financial and psychological risk.
        </p>
      </div>

      {/* Mobile Stacked Comparison Cards (< md) */}
      <div className="md:hidden space-y-4">
        {rows.map((row, idx) => (
          <div
            key={idx}
            className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm space-y-3"
          >
            <h3 className="font-bold text-sm text-foreground leading-snug">
              {row.feature}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {/* With Debt Support Expert */}
              <div className="p-3 rounded-xl bg-primary-50/70 dark:bg-primary-950/40 border border-primary-200/70 dark:border-primary-900/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-extrabold tracking-wider text-primary-700 dark:text-primary-300">
                    With Debt Expert
                  </span>
                  {row.debtSupport === true ? (
                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      {row.debtSupport}
                    </span>
                  )}
                </div>
                {row.debtSupportNote && (
                  <p className="text-[11px] font-medium text-foreground leading-relaxed">
                    {row.debtSupportNote}
                  </p>
                )}
              </div>

              {/* Handling Banks Alone */}
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    Handling Alone
                  </span>
                  {row.alone === true ? (
                    <div className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 stroke-[2.5]" />
                    </div>
                  ) : row.alone === false ? (
                    <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center shrink-0">
                      <X className="h-3 w-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300">
                      {row.alone}
                    </span>
                  )}
                </div>
                {row.aloneNote && (
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {row.aloneNote}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop / Tablet Comparison Table (>= md) */}
      <div className="hidden md:block overflow-x-auto rounded-3xl border border-border bg-card shadow-lg scrollbar-thin snap-x">
        <table className="w-full text-left border-collapse min-w-[620px]">
          <thead>
            <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/60">
              <th className="py-4 px-5 text-xs font-bold uppercase tracking-wider text-muted-foreground w-2/5">
                Critical Settlement & Legal Factors
              </th>
              <th className="py-4 px-4 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground w-[30%]">
                Handling Banks Alone
              </th>
              <th className="py-4 px-5 text-center text-xs font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 bg-primary-50/70 dark:bg-primary-950/40 border-l border-border w-[30%]">
                With Debt Support Expert Legal Team
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-xs sm:text-sm">
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50/60 dark:hover:bg-slate-900/30 transition-colors"
              >
                {/* Feature description */}
                <td className="py-4 px-5 font-semibold text-foreground align-top">
                  <div>{row.feature}</div>
                </td>

                {/* Handling Alone */}
                <td className="py-4 px-4 text-center align-top bg-slate-50/20 dark:bg-slate-900/10">
                  <div className="flex flex-col items-center gap-1.5">
                    {row.alone === true ? (
                      <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                    ) : row.alone === false ? (
                      <div className="h-6 w-6 rounded-full bg-red-100 dark:bg-red-950/60 text-red-500 flex items-center justify-center shrink-0">
                        <X className="h-3.5 w-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/60">
                        {row.alone}
                      </span>
                    )}

                    {row.aloneNote && (
                      <span className="text-[11px] text-muted-foreground leading-snug max-w-[200px]">
                        {row.aloneNote}
                      </span>
                    )}
                  </div>
                </td>

                {/* With Debt Support Expert */}
                <td className="py-4 px-5 text-center align-top bg-primary-50/40 dark:bg-primary-950/30 border-l border-border">
                  <div className="flex flex-col items-center gap-1.5">
                    {row.debtSupport === true ? (
                      <div className="h-6 w-6 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {row.debtSupport}
                      </span>
                    )}

                    {row.debtSupportNote && (
                      <span className="text-[11px] font-medium text-foreground leading-snug max-w-[220px]">
                        {row.debtSupportNote}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-border flex items-start gap-3 text-xs text-muted-foreground">
        <Shield className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
        <p>
          <strong className="text-foreground">Legal Representation Notice:</strong> In Indian civil procedure, once an advocate files a Vakalatnama or formal legal notice on your behalf, recovery agencies are legally required to route all communications through counsel, shielding you from psychological intimidation.
        </p>
      </div>
    </section>
  );
}
