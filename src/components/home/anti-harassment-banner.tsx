import Link from "next/link";
import {
  ShieldAlert,
  Clock,
  UserX,
  Scale,
  PhoneOff,
  AlertOctagon,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export function AntiHarassmentBanner() {
  const violations = [
    {
      icon: Clock,
      title: "Calls Before 8 AM or After 7 PM",
      desc: "RBI explicitly restricts recovery calls strictly to 8:00 AM – 7:00 PM. Any call outside this window is an illegal violation.",
    },
    {
      icon: UserX,
      title: "Contacting Family, Friends or Boss",
      desc: "Agents are strictly prohibited from calling your contacts, employer, or relatives. This is a punishable breach of privacy.",
    },
    {
      icon: AlertOctagon,
      title: "Abusive Language & Threat of Arrest",
      desc: "Loan default is a civil matter in India, NOT a criminal offense. Threats of police arrest or jail are fraudulent and actionable.",
    },
    {
      icon: PhoneOff,
      title: "Harassment by Third-Party Collectors",
      desc: "Lenders cannot outsource recovery to unauthorized brute squads. We compel banks to route all communications through legal counsel.",
    },
  ];

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Red/amber warning ambient glow */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-950/80 border border-red-800 text-red-400 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>Emergency Protection Against Recovery Harassment</span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            Facing Aggressive Recovery Agents?{" "}
            <span className="text-red-400">Know Your RBI Consumer Rights.</span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Under the Reserve Bank of India (RBI) Circular on Loan Recovery (August 2022),
            borrowers have strong statutory rights. Our legal team serves formal Legal Notices
            to bank grievance cells to immediately stop unannounced visits and abusive calls.
          </p>
        </div>

        {/* 4 RBI Violations Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {violations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition-colors space-y-3"
              >
                <div className="h-10 w-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-bold text-white text-base">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Action Callout */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-red-950/50 via-slate-800/80 to-blue-950/50 border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle className="h-4 w-4" />
              <span>Immediate Advocate Intervention</span>
            </div>
            <p className="text-xs text-slate-300">
              We draft and issue an Advocate Representation & Cease-and-Desist Notice within 24 hours.
            </p>
          </div>

          <Link
            href="/services/anti-harassment"
            className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30"
          >
            <Scale className="h-4 w-4" />
            <span>Stop Harassment Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
