"use client";

import * as React from "react";
import {
  Building2,
  ShieldAlert,
  ChevronRight,
  ExternalLink,
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  AlertCircle,
  Scale,
  Award,
  Sparkles,
  FileCheck,
} from "lucide-react";

interface BankEscalationData {
  id: string;
  name: string;
  shortName: string;
  level1: {
    title: string;
    phone: string;
    email: string;
    tat: string;
    note: string;
  };
  level2: {
    title: string;
    designation: string;
    email: string;
    tat: string;
  };
  level3: {
    title: string;
    designation: string;
    email: string;
    address: string;
    tat: string;
  };
  level4: {
    title: string;
    authority: string;
    portal: string;
    portalUrl: string;
    tollFree: string;
    rule: string;
  };
}

const BANKS_DATA: BankEscalationData[] = [
  {
    id: "sbi",
    name: "State Bank of India",
    shortName: "SBI",
    level1: {
      title: "Branch Manager & Customer Care",
      phone: "1800 1234 / 1800 2100",
      email: "customercare@sbi.co.in",
      tat: "Resolution within 7 - 10 working days",
      note: "Generate a Service Request (SR) number upon raising your complaint.",
    },
    level2: {
      title: "Network Nodal Officer (Circle)",
      designation: "General Manager (Network)",
      email: "nodalofficer@sbi.co.in",
      tat: "Resolution within 7 working days of escalation",
    },
    level3: {
      title: "Principal Nodal Officer (PNO)",
      designation: "Chief General Manager (Customer Service)",
      email: "gm.customer@sbi.co.in",
      address: "State Bank Bhavan, 16th Floor, Madam Cama Road, Nariman Point, Mumbai 400021",
      tat: "Resolution within 7 working days",
    },
    level4: {
      title: "RBI Ombudsman (CRPC)",
      authority: "Reserve Bank of India Integrated Ombudsman Scheme",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448 (Toll-Free, 9:30 AM to 5:15 PM)",
      rule: "Eligible if bank does not resolve complaint within 30 days or rejects settlement arbitrarily.",
    },
  },
  {
    id: "hdfc",
    name: "HDFC Bank Ltd",
    shortName: "HDFC",
    level1: {
      title: "Customer Support & Grievance Form",
      phone: "1800 1600 / 1800 2600",
      email: "support@hdfcbank.com",
      tat: "Resolution within 7 working days",
      note: "Keep the Ticket / Incident Reference number for Level 2 tracking.",
    },
    level2: {
      title: "Grievance Redressal Officer (GRO)",
      designation: "Senior Vice President (Grievance Cell)",
      email: "grievance.redressal@hdfcbank.com",
      tat: "Resolution within 7 working days",
    },
    level3: {
      title: "Principal Nodal Officer (PNO)",
      designation: "Executive Vice President - Principal Nodal Officer",
      email: "pno@hdfcbank.com",
      address: "HDFC Bank Ltd, 5th Floor, Tower B, Peninsula Business Park, Lower Parel, Mumbai 400013",
      tat: "Final bank response within 7 working days",
    },
    level4: {
      title: "RBI Integrated Ombudsman",
      authority: "Reserve Bank - Centralised Receipt and Processing Centre",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448",
      rule: "Escalate for unresolved credit card disputes, unlawful recovery threats, or delayed NDC issuance.",
    },
  },
  {
    id: "icici",
    name: "ICICI Bank Ltd",
    shortName: "ICICI",
    level1: {
      title: "Phone Banking & Service Request",
      phone: "1800 1080",
      email: "customer.care@icicibank.com",
      tat: "Resolution within 4 - 7 working days",
      note: "Submit through ICICI Internet Banking or branch with formal stamp.",
    },
    level2: {
      title: "Head of Customer Service",
      designation: "General Manager - Service Quality",
      email: "headcustomerservice@icicibank.com",
      tat: "Resolution within 5 working days",
    },
    level3: {
      title: "Principal Nodal Officer (PNO)",
      designation: "Principal Nodal Officer, ICICI Bank",
      email: "pno@icicibank.com",
      address: "ICICI Bank Towers, Bandra-Kurla Complex, Bandra (East), Mumbai 400051",
      tat: "Resolution within 7 working days",
    },
    level4: {
      title: "RBI Ombudsman Scheme",
      authority: "Reserve Bank of India Banking Ombudsman",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448",
      rule: "Covers recovery harassment under the August 2022 Circular and interest gouging.",
    },
  },
  {
    id: "axis",
    name: "Axis Bank Ltd",
    shortName: "Axis",
    level1: {
      title: "Customer Service Helpdesk",
      phone: "1860 419 5555 / 1860 500 5555",
      email: "nodal.officer@axisbank.com",
      tat: "Resolution within 7 working days",
      note: "Register via mobile app or Branch Service Desk.",
    },
    level2: {
      title: "Circle Nodal Officer (Zonal)",
      designation: "Circle Nodal Officer (Respective Zone)",
      email: "circle.nodal@axisbank.com",
      tat: "Resolution within 7 working days",
    },
    level3: {
      title: "Principal Nodal Officer (PNO)",
      designation: "Executive VP - Principal Nodal Officer",
      email: "pno@axisbank.com",
      address: "Axis Bank Ltd, Corporate Office, Bombay Dyeing Mills Compound, Pandurang Budhkar Marg, Worli, Mumbai 400025",
      tat: "Resolution within 7 working days",
    },
    level4: {
      title: "RBI Integrated Ombudsman",
      authority: "Office of the Banking Ombudsman (RBI)",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448",
      rule: "Mandatory escalation if settlement letter terms are breached or CIBIL status un-updated.",
    },
  },
  {
    id: "kotak",
    name: "Kotak Mahindra Bank",
    shortName: "Kotak",
    level1: {
      title: "Kotak Customer Care",
      phone: "1860 266 2666",
      email: "service.bank@kotak.com",
      tat: "Resolution within 7 working days",
      note: "Service request tracking number issued via SMS/email.",
    },
    level2: {
      title: "Nodal Officer",
      designation: "Nodal Officer - Grievance Cell",
      email: "nodalofficer@kotak.com",
      tat: "Resolution within 5 working days",
    },
    level3: {
      title: "Principal Nodal Officer",
      designation: "Principal Nodal Officer, Kotak Mahindra Bank",
      email: "pno@kotak.com",
      address: "Kotak Infiniti, 4th Floor, Building No. 21, Infinity Park, Off Western Express Highway, Malad (East), Mumbai 400097",
      tat: "Resolution within 7 working days",
    },
    level4: {
      title: "RBI Ombudsman Scheme",
      authority: "Reserve Bank of India Ombudsman Cell",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448",
      rule: "Protects against abusive third-party telecallers and illegal repo agent threats.",
    },
  },
  {
    id: "bajaj",
    name: "Bajaj Finserv / Bajaj Finance Ltd",
    shortName: "Bajaj Finserv",
    level1: {
      title: "Experia Portal & Customer Helpline",
      phone: "086980 10101",
      email: "wecare@bajajfinserv.in",
      tat: "Resolution within 7 working days",
      note: "Raise ticket via Bajaj Finserv App or web customer portal.",
    },
    level2: {
      title: "Grievance Redressal Officer (GRO)",
      designation: "Grievance Redressal Team Lead",
      email: "grievanceredressalteam@bajajfinserv.in",
      tat: "Resolution within 7 working days",
    },
    level3: {
      title: "National Nodal Officer (NNO)",
      designation: "National Nodal Officer (NBFC Division)",
      email: "nationalnodalofficer@bajajfinserv.in",
      address: "4th Floor, Bajaj Finserv Corporate Office, Off Pune-Ahmednagar Road, Viman Nagar, Pune 411014",
      tat: "Resolution within 7 working days",
    },
    level4: {
      title: "RBI NBFC Ombudsman",
      authority: "Reserve Bank of India NBFC Ombudsman Scheme",
      portal: "cms.rbi.org.in",
      portalUrl: "https://cms.rbi.org.in",
      tollFree: "14448",
      rule: "NBFCs must follow RBI Digital Lending & Fair Practice Code; zero tolerance for third-party contact harassment.",
    },
  },
];

export function BankEscalationFinder() {
  const [selectedBankId, setSelectedBankId] = React.useState<string>("sbi");

  const activeBank = BANKS_DATA.find((b) => b.id === selectedBankId) || BANKS_DATA[0];

  return (
    <section className="py-12 sm:py-16 bg-slate-50/60 dark:bg-slate-900/40 rounded-3xl border border-border p-4 sm:p-8 my-8 sm:my-12">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-50 dark:bg-primary-950/70 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-xs font-semibold">
            <Scale className="h-3.5 w-3.5" />
            <span>Statutory Grievance Protocol</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Official Bank Grievance & RBI Escalation Matrix
          </h2>

          <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Borrowers have a legal right to fair recovery practices under RBI regulations. If recovery agents violate conduct norms or your OTS request is ignored, use this 4-tier statutory escalation chain.
          </p>
        </div>

        {/* Bank Selection Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {BANKS_DATA.map((bank) => (
            <button
              key={bank.id}
              type="button"
              onClick={() => setSelectedBankId(bank.id)}
              className={`py-2 px-3.5 rounded-xl text-xs font-bold border transition-all ${
                selectedBankId === bank.id
                  ? "border-primary bg-primary text-primary-foreground shadow-md"
                  : "border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              {bank.shortName}
            </button>
          ))}
        </div>

        {/* Bank Details Display Card */}
        <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-lg space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-border">
            <div className="flex items-center gap-2.5">
              <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-950 text-primary-600 dark:text-primary-400 flex items-center justify-center font-bold">
                <Building2 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  {activeBank.name}
                </h3>
                <span className="text-[11px] text-muted-foreground">
                  Official 4-Level Statutory Escalation Pathway
                </span>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300">
              RBI Scheme Compliant
            </span>
          </div>

          {/* 4 Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Level 1: Customer Care */}
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 uppercase">
                  Level 1
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeBank.level1.tat}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{activeBank.level1.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span className="font-semibold text-foreground">{activeBank.level1.phone}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono text-[11px]">{activeBank.level1.email}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground italic pt-1 border-t border-border/50">
                {activeBank.level1.note}
              </p>
            </div>

            {/* Level 2: Nodal Officer */}
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 uppercase">
                  Level 2
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeBank.level2.tat}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{activeBank.level2.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{activeBank.level2.designation}</div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-amber-600" />
                  <span className="font-mono text-[11px]">{activeBank.level2.email}</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground pt-1 border-t border-border/50">
                Quote your Level 1 Service Request Number in all correspondence.
              </p>
            </div>

            {/* Level 3: Principal Nodal Officer */}
            <div className="p-4 rounded-xl border border-border bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 uppercase">
                  Level 3
                </span>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {activeBank.level3.tat}
                </span>
              </div>
              <h4 className="text-sm font-bold text-foreground">{activeBank.level3.title}</h4>
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="font-medium text-foreground">{activeBank.level3.designation}</div>
                <div className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-purple-600" />
                  <span className="font-mono text-[11px]">{activeBank.level3.email}</span>
                </div>
                <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground mt-0.5">
                  <MapPin className="h-3 w-3 shrink-0 mt-0.5" />
                  <span className="leading-tight">{activeBank.level3.address}</span>
                </div>
              </div>
            </div>

            {/* Level 4: RBI Ombudsman */}
            <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black px-2 py-0.5 rounded bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200 uppercase">
                  Level 4 • Statutory
                </span>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold">
                  Toll-Free: {activeBank.level4.tollFree}
                </span>
              </div>
              <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                {activeBank.level4.title}
              </h4>
              <p className="text-[11px] text-emerald-800 dark:text-emerald-300 leading-snug">
                {activeBank.level4.rule}
              </p>
              <div className="pt-1">
                <a
                  href={activeBank.level4.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 hover:underline"
                >
                  <span>File Complaint on RBI Portal ({activeBank.level4.portal})</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* RBI ₹100/Day Delay Rule Callout Banner */}
          <div className="p-4 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs space-y-1.5">
            <div className="font-bold flex items-center gap-1.5 text-amber-800 dark:text-amber-300">
              <Award className="h-4 w-4" />
              <span>RBI ₹100 / Day Delay Compensation Statutory Rule:</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Under RBI circulars (effective Oct 2023), Credit Institutions (Banks & NBFCs) and Credit Bureaus (CIBIL, Experian, Equifax, CRIF High Mark) must resolve borrower credit grievances within <strong>30 calendar days</strong>. Failure to update settled accounts or rectify inaccurate negative records past 30 days entitles the borrower to a compensation of <strong>₹100 per calendar day of delay</strong> payable directly by the defaulting bank or bureau.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
