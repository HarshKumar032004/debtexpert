import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms and Conditions | Debt Support Expert",
  description:
    "Terms of service, client advisory scope, and legal regulatory disclosures for Debt Support Expert.",
  alternates: {
    canonical: `${siteConfig.url}/terms`,
  },
};

export default function TermsPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="space-y-4 mb-10 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Terms of Service & Advisory Disclosures
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2026 • Governing Legal Scope & Regulatory Information
          </p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Scope of Engagement</h2>
            <p>
              <strong>Debt Support Expert</strong> ({siteConfig.legalEntity}) acts as an independent
              legal advisory and loan settlement consultancy. We provide legal guidance, draft formal
              representation and cease-and-desist notices to banking grievance departments, and
              negotiate compromise settlements on behalf of distressed borrowers under the Reserve
              Bank of India (RBI) Fair Practices Code.
            </p>
            <p>
              We are <strong>NOT</strong> a bank, NBFC, financial institution, or government agency.
              We do not issue credit, refinance debt, or disburse settlement funds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Lender Discretion & No Guarantee Clause</h2>
            <p>
              Compromise Settlement (One-Time Settlement - OTS) is a consensual agreement between the
              borrowing citizen and the lending financial institution. While our advocates leverage
              demonstrable financial hardship to negotiate the highest possible waiver (historically
              between 50% and 75%), final approval, concession percentage, and installment terms
              remain subject to the credit committee and board policies of each specific lender.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. Direct Settlement Payment Mandate</h2>
            <p>
              To ensure 100% transparency and eliminate any risk of financial fraud:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                All agreed settlement sums must be paid by the client <strong>DIRECTLY</strong> into
                the client&apos;s designated loan account at the lending bank or NBFC.
              </li>
              <li>
                Debt Support Expert will NEVER accept, request, or hold client settlement funds in any
                escrow or company account.
              </li>
              <li>
                No payment should be made by the client until our legal advocates have verified the
                authenticity of the official bank settlement letter.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Credit Bureau & CIBIL Reporting</h2>
            <p>
              Borrowers are explicitly advised that under Credit Information Companies (Regulation)
              Act (CICRA), when a loan is closed through a compromise settlement at a discount, the
              lending bank will report the trade line as &apos;Settled&apos; or &apos;Written Off&apos;
              to credit rating agencies (CIBIL, Experian, Equifax, CRIF High Mark). This status will
              temporarily impact the borrower&apos;s credit score. We provide our clients with a
              structured rehabilitation roadmap to rebuild credit scores following settlement closure.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Governing Law & Jurisdiction</h2>
            <p>
              These Terms and any dispute arising from the use of our services shall be governed by
              and construed in accordance with the laws of India. The courts of competent
              jurisdiction in Gurugram / New Delhi shall have exclusive jurisdiction.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
