export interface ServiceItem {
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  badge?: string;
  features: string[];
}

export const siteConfig = {
  name: "Debt Support Expert",
  shortName: "DebtSupport",
  legalEntity: "Debt Support Expert Legal & Financial Advisory LLP",
  url: "https://debtsupportexpert.com",
  ogImage: "https://debtsupportexpert.com/og-image.jpg",
  description:
    "India's Premier Legal Advisory & Loan Settlement Consultancy. Legally protect yourself against recovery agent harassment and settle personal loans, credit cards, and business debts with up to 50%-75% waiver under RBI guidelines.",
  phone: "+91 98765 43210",
  phoneDisplay: "+91 98765 43210",
  whatsappNumber: "919876543210",
  whatsappMessage:
    "Hello Debt Support Expert, I need urgent legal assistance with loan settlement and recovery calls.",
  email: "support@debtsupportexpert.com",
  address: {
    street: "Level 4, Cyber City, DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    country: "India",
  },
  services: [
    {
      title: "Personal Loan Settlement",
      shortTitle: "Personal Loans",
      href: "/services/personal-loan-settlement",
      description:
        "Negotiate One-Time Settlement (OTS) for unsecured bank & NBFC personal loans with legal safeguards.",
      badge: "Save Up to 70%",
      features: [
        "RBI Fair Practices compliant",
        "Stop recovery harassment",
        "Official No Dues Certificate (NDC)",
      ],
    },
    {
      title: "Credit Card Debt Settlement",
      shortTitle: "Credit Cards",
      href: "/services/credit-card-settlement",
      description:
        "Eliminate compounding 42%+ APR interest, late fees, and settle revolving card debt affordably.",
      badge: "Stop Penalties",
      features: [
        "Freeze compounding interest",
        "Waiver of exorbitant finance charges",
        "Structured one-time or installment settlement",
      ],
    },
    {
      title: "Anti-Harassment & Legal Shield",
      shortTitle: "Stop Harassment",
      href: "/services/anti-harassment",
      description:
        "Immediate legal intervention against abusive recovery agents, unauthorized calls, and home visits.",
      badge: "RBI Compliant",
      features: [
        "Formal Legal Notices to Bank Grievance Cells",
        "Enforcement of RBI Recovery Agent Guidelines 2022",
        "Cease & desist notices to third-party collectors",
      ],
    },
    {
      title: "Business & MSME Loan Restructuring",
      shortTitle: "MSME Loans",
      href: "/services/business-loan-settlement",
      description:
        "Legal advisory for working capital, OD/CC limits, machinery loans, and business debt resolution.",
      badge: "MSME Protected",
      features: [
        "DRT & SARFAESI legal advisory",
        "Restructuring & OTS negotiation",
        "Asset protection guidance",
      ],
    },
  ] as ServiceItem[],
  navLinks: [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services", hasDropdown: true },
    { title: "Settlement Calculator", href: "/calculator", badge: "Free" },
    { title: "About Our Lawyers", href: "/about" },
    { title: "RBI Guides & Blog", href: "/blog" },
    { title: "Contact Us", href: "/contact" },
  ],
  stats: [
    { value: "₹45+ Cr", label: "Debt Settled & Waived" },
    { value: "12,500+", label: "Clients Protected from Harassment" },
    { value: "50% - 75%", label: "Average Settlement Savings" },
    { value: "100%", label: "Legal & RBI Compliant Process" },
  ],
};
