import Link from "next/link";
import {
  Scale,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  Lock,
  FileCheck,
  Award,
  ArrowRight,
} from "lucide-react";
import { siteConfig } from "@/config/site";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80">
      {/* Pre-footer Trust & Reassurance Banner */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                100% Anti-Harassment Shield
              </h4>
              <p className="text-xs text-slate-400">
                Formal legal notices issued under RBI August 2022 Circular guidelines.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <FileCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                Official No Dues Certificate
              </h4>
              <p className="text-xs text-slate-400">
                Direct settlement letters issued by banks with valid legal closure.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-800/30 border border-slate-800">
            <div className="h-12 w-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <Lock className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">
                Strict Privacy & Confidentiality
              </h4>
              <p className="text-xs text-slate-400">
                Attorney-client privilege standards for your financial data.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto py-14 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600 text-white shadow-md">
                <Scale className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-white leading-tight">
                  Debt Support <span className="text-blue-400">Expert</span>
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase text-emerald-400">
                  Legal Advisory & Loan Settlement
                </span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India&apos;s leading legal advisory and debt relief consultancy. We represent
              distressed borrowers to negotiate legal settlements, eliminate abusive
              harassment, and restore financial peace of mind.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Level 4, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href={`tel:${siteConfig.phone.replace(/[^0-9+]/g, "")}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.phoneDisplay} (Mon-Sat, 9:30 AM - 7:00 PM)
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-400 shrink-0" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="hover:text-white transition-colors"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Settlement Services */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Relief Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services/personal-loan-settlement"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Personal Loan Settlement
                </Link>
              </li>
              <li>
                <Link
                  href="/services/credit-card-settlement"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Credit Card Debt Relief
                </Link>
              </li>
              <li>
                <Link
                  href="/services/anti-harassment"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Stop Recovery Harassment
                </Link>
              </li>
              <li>
                <Link
                  href="/services/business-loan-settlement"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  MSME & Business Restructure
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 transition-colors pt-1"
                >
                  All Services <ArrowRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools & Resources */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Resources & Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/calculator"
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>Settlement Calculator</span>
                  <span className="text-[10px] px-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Free
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  RBI Guidelines & Rules
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  About Our Legal Advocates
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Schedule Free Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Legal & Compliance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <a
                  href="#legal-disclaimer"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Regulatory Disclosures
                </a>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Grievance Officer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Detailed Legal Disclaimer as required for Financial & Legal Consultancies in India */}
        <div
          id="legal-disclaimer"
          className="mt-12 pt-8 border-t border-slate-800/80 text-xs text-slate-500 leading-relaxed space-y-3"
        >
          <div className="font-semibold text-slate-400 uppercase tracking-wider">
            Important Legal & Regulatory Disclaimer:
          </div>
          <p>
            Debt Support Expert ({siteConfig.legalEntity}) operates strictly as an independent legal
            and financial advisory consultancy. We are NOT a bank, Non-Banking Financial Company
            (NBFC), lender, or government authority, and we do NOT issue loans, provide credit, or
            fund settlements.
          </p>
          <p>
            Loan settlement (One-Time Settlement or OTS) is a formal negotiation between the
            borrower and the lending financial institution under the guidelines of the Reserve Bank
            of India (RBI Fair Practices Code). Settlement approvals, waivers, and reductions
            depend strictly upon individual financial distress, proof of insolvency, and lender
            credit policy. Past settlement results (e.g. 50% to 75% waiver) represent historical
            case outcomes and do not constitute a universal guarantee. Debt settlement may reflect on
            CIBIL / credit bureau reports as &apos;Settled&apos; or &apos;Written Off&apos; as mandated by credit reporting
            regulations.
          </p>
        </div>

        {/* Bottom copyright row */}
        <div className="mt-8 pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {currentYear} {siteConfig.legalEntity}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-slate-400 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-slate-400 transition-colors">
              Terms
            </Link>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Pan-India Legal Network</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
