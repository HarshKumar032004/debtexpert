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
    "India's Premier Legal Advisory & Loan Settlement Consultancy. Legally protect yourself against recovery agent harassment and negotiate One-Time Settlement (OTS) for personal loans, credit cards, and business debts under RBI compromise guidelines.",

  // Primary Client Contact (Verified live credentials)
  phone: "+91 79797 89458",
  phoneDisplay: "+91 79797 89458",
  phoneTel: "+917979789458",
  phoneE164: "917979789458",

  // Priority / Emergency Harassment Helpline
  emergencyPhone: "+91 79797 89458",
  emergencyPhoneDisplay: "+91 79797 89458",
  emergencyPhoneTel: "+917979789458",

  // WhatsApp Configuration
  whatsappNumber: "917979789458",
  whatsappMessage:
    "Hello Debt Support Expert, I need legal assistance with loan settlement and recovery calls.",
  getWhatsAppUrl(customMessage?: string): string {
    const text = customMessage || this.whatsappMessage;
    return `https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`;
  },

  // Official Corporate Emails
  email: "support@debtsupportexpert.com",
  infoEmail: "info@debtsupportexpert.com",
  grievanceEmail: "grievance@debtsupportexpert.com",
  financeEmail: "finance@debtsupportexpert.com",
  legalEmail: "support@debtsupportexpert.com",
  emails: {
    primary: "support@debtsupportexpert.com",
    info: "info@debtsupportexpert.com",
    grievance: "grievance@debtsupportexpert.com",
    finance: "finance@debtsupportexpert.com",
  },

  // Corporate Head Office Address
  address: {
    street: "Level 4, Cyber City, DLF Phase 2",
    city: "Gurugram",
    state: "Haryana",
    postalCode: "122002",
    country: "India",
  },
  formattedAddress:
    "Level 4, Cyber City, DLF Phase 2, Gurugram, Haryana - 122002, India",

  // Operating Hours (Monday – Friday, 9:00 AM – 5:00 PM IST)
  operatingHours: "Monday – Friday, 9:00 AM – 5:00 PM IST",
  operatingHoursShort: "Mon–Fri, 9:00 AM–5:00 PM IST",
  emergencyHours: "Mon–Fri, 9:00 AM – 5:00 PM IST",

  // Statutory Disclaimers
  disclaimers: {
    consultancy:
      "Debt Support Expert is a loan settlement consultancy. We do not issue loans, credit cards, or refinancing. We are not a lender, NBFC, or bank.",
    directPayment:
      "All settlement funds must be paid directly by the borrower to their lending bank or NBFC through official banking channels. We never collect or escrow client settlement funds.",
    waiverAuthority:
      "Settlement approvals, waiver amounts, and payment schedules are strictly at the sole discretion of the lending bank/NBFC under its internal board-approved policy.",
  },

  services: [
    {
      title: "Personal Loan Settlement",
      shortTitle: "Personal Loans",
      href: "/services/personal-loan-settlement",
      description:
        "Negotiate One-Time Settlement (OTS) for unsecured bank & NBFC personal loans with legal safeguards.",
      badge: "RBI Compliant OTS",
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
      badge: "8 AM - 7 PM Law",
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
    {
      title: "Legal Notice, Sec 138 & Arbitration Defense",
      shortTitle: "Notice & Sec 138 Defense",
      href: "/services/legal-notice-defense",
      description:
        "Statutory advocate replies for Section 138 cheque bounce, NACH default, and private arbitration ex-parte defense.",
      badge: "Court & Lok Adalat",
      features: [
        "Section 138 NI Act statutory replies",
        "Block ex-parte arbitration awards",
        "Lok Adalat court-recorded compromise",
      ],
    },
  ] as ServiceItem[],

  navLinks: [
    { title: "Home", href: "/" },
    { title: "Services", href: "/services", hasDropdown: true },
    { title: "How It Works", href: "/how-it-works" },
    { title: "Settlement Calculator", href: "/calculator", badge: "Live" },
    { title: "Pricing", href: "/pricing", badge: "Transparent" },
    { title: "About Our Advocates", href: "/about" },
    { title: "Legal Guides", href: "/blog" },
    { title: "Contact Us", href: "/contact" },
  ],

  stats: [
    { value: "₹45+ Cr", label: "Debt Negotiated & Settled" },
    { value: "12,500+", label: "Clients Protected from Harassment" },
    { value: "100%", label: "Direct-to-Bank Payment Security" },
    { value: "100%", label: "RBI Circular Compliance" },
  ],
};
