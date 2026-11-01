import {
  FileSearch,
  ShieldCheck,
  Scale,
  FileCheck,
  CheckCircle,
} from "lucide-react";

export function ProcessTimeline() {
  const steps = [
    {
      step: "01",
      icon: FileSearch,
      title: "Confidential Hardship Audit",
      desc: "Our financial & legal experts evaluate your loan agreements, outstanding balances, and documented hardships (job loss, medical costs, business slowdown).",
      badge: "Day 1",
    },
    {
      step: "02",
      icon: ShieldCheck,
      title: "Legal Anti-Harassment Shield",
      desc: "We serve formal Advocate Representation notices to banks and NBFCs, requiring recovery agents to cease unlawful intimidation under RBI Fair Practices Code.",
      badge: "Day 2 - 3",
    },
    {
      step: "03",
      icon: Scale,
      title: "Hardship Dossier & OTS Negotiation",
      desc: "Our empanelled legal advocates submit a formal settlement proposal to the bank's Senior Management Settlement Committee to secure maximum waiver.",
      badge: "Month 1 - 3",
    },
    {
      step: "04",
      icon: FileCheck,
      title: "Official Bank Settlement Letter",
      desc: "Lender approves One-Time Settlement (OTS) and issues an official signed settlement letter with agreed reduced amount and milestone schedule.",
      badge: "Resolution",
    },
    {
      step: "05",
      icon: CheckCircle,
      title: "Direct Bank Payout & No Dues Certificate",
      desc: "You transfer the settlement funds directly into your loan account at the bank. The bank issues a clean No Dues Certificate (NDC) closing the debt.",
      badge: "Debt Free",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50 border-b border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/70 border border-blue-200 dark:border-blue-800 text-primary-700 dark:text-blue-300 text-xs font-semibold">
            <Scale className="h-4 w-4" />
            <span>Transparent 5-Stage Protocol</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How Legal Loan Settlement Works in India
          </h2>

          <p className="text-base text-muted-foreground leading-relaxed">
            A 100% legal, structured process designed to protect your dignity while securing the
            lowest possible settlement with your banks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="relative rounded-2xl bg-card border border-border p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-black text-slate-300 dark:text-slate-700">
                      {item.step}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-950 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
                      {item.badge}
                    </span>
                  </div>

                  <div className="h-10 w-10 rounded-xl bg-primary-50 dark:bg-primary-950/80 text-primary-600 dark:text-primary-400 flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-bold text-foreground text-base leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <CheckCircle className="h-3.5 w-3.5" />
                  <span>Guaranteed Legal Compliance</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
