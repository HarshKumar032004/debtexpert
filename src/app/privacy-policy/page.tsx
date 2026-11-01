import { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Debt Support Expert",
  description:
    "Privacy Policy and Data Protection standards of Debt Support Expert in compliance with India's DPDP Act 2023 and Information Technology Act.",
  alternates: {
    canonical: `${siteConfig.url}/privacy-policy`,
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-12 md:py-20 bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        <div className="space-y-4 mb-10 border-b border-border pb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Privacy Policy & Data Protection Standards
          </h1>
          <p className="text-xs text-muted-foreground">
            Last Updated: October 2026 • Compliant with Digital Personal Data Protection Act (DPDP Act 2023)
          </p>
        </div>

        <div className="space-y-8 text-sm text-muted-foreground leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">1. Our Confidentiality Commitment</h2>
            <p>
              At <strong>Debt Support Expert</strong> ({siteConfig.legalEntity}), we recognize that
              financial hardship, loan default records, and debt settlement documentation represent
              highly sensitive personal data. We are deeply committed to safeguarding your privacy
              in full compliance with India&apos;s Digital Personal Data Protection Act (DPDP Act 2023),
              the Information Technology Act, 2000, and standard Attorney-Client Privilege norms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">2. Information We Collect</h2>
            <p>
              When you submit a consultation request or engage our legal advocacy network, we may
              collect the following categories of information:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <strong>Identity & Contact Information:</strong> Full legal name, mobile telephone
                number, email address, residential city, and state.
              </li>
              <li>
                <strong>Financial & Debt Documentation:</strong> Loan account numbers, bank name,
                NBFC names, outstanding claimed balances, EMI payment histories, bank legal notices
                (Sec 138 NI Act, Sec 25 PSS Act), and hardship evidence (job separation letters,
                medical treatment records).
              </li>
              <li>
                <strong>Communications:</strong> Call logs, WhatsApp correspondence, and email
                instructions relevant to your settlement dossier.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">3. How We Use Your Data</h2>
            <p>Your data is used solely for the following explicit purposes:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Conducting confidential financial hardship and loan portfolio audits.</li>
              <li>
                Drafting and issuing formal Advocate Representation & Cease-and-Desist Notices to
                lender recovery wings and nodal officers.
              </li>
              <li>
                Negotiating One-Time Settlements (OTS) with authorized banking settlement committees.
              </li>
              <li>Verifying bank settlement letters and securing No Dues Certificates (NDC).</li>
            </ul>
            <p className="font-semibold text-foreground pt-1">
              We NEVER sell, trade, rent, or commercialize your personal or financial data to
              third-party loan brokers, marketing telemarketers, or credit card aggregators.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">4. Data Security & Storage</h2>
            <p>
              All client documents are stored using bank-grade 256-bit SSL encryption at rest and in
              transit. Access is restricted strictly to assigned legal advocates and case managers
              bound by formal non-disclosure agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-foreground">5. Grievance Redressal Officer</h2>
            <p>
              In accordance with the Information Technology Act 2000 and DPDP Rules, the details of
              our designated Grievance Officer are as follows:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border text-xs text-foreground space-y-1">
              <div><strong>Name:</strong> Grievance Redressal Cell</div>
              <div><strong>Entity:</strong> {siteConfig.legalEntity}</div>
              <div><strong>Address:</strong> Level 4, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002</div>
              <div><strong>Email:</strong> {siteConfig.email}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
