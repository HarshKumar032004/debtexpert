export interface ServiceBreadcrumbItem {
  label: string;
  href: string;
}

export interface EducationalSubsection {
  title: string; // Rendered as H3
  content: string | string[];
  highlightBox?: {
    title: string;
    text: string;
    type?: "alert" | "tip" | "law" | "warning";
  };
  bulletPoints?: string[];
}

export interface EducationalSection {
  id: string;
  title: string; // Rendered as H2
  intro?: string;
  subsections: EducationalSubsection[];
}

export interface ComparisonRow {
  feature: string;
  alone: string | boolean;
  debtSupport: string | boolean;
  aloneNote?: string;
  debtSupportNote?: string;
}

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceStat {
  value: string;
  label: string;
  description?: string;
}

export interface ServiceProcessStep {
  step: string;
  title: string;
  description: string;
  badge?: string;
}

export interface ServicePageData {
  slug: string;
  serviceName: string;
  shortTitle: string;
  badge: string;
  h1Title: string;
  heroSubtitle: string;
  heroHighlights?: string[];
  stats?: ServiceStat[];
  breadcrumbs: ServiceBreadcrumbItem[];
  canonicalUrl: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords?: string[];
  educationalSections: EducationalSection[];
  comparisonRows: ComparisonRow[];
  partnerInstitutionsTitle?: string;
  partnerInstitutions?: string[];
  processTitle?: string;
  processSubtitle?: string;
  processSteps?: ServiceProcessStep[];
  faqs: ServiceFaq[];
  defaultLoanType?: string;
  customWhatsAppMessage?: string;
  urgentNotice?: {
    title: string;
    text: string;
  };
}
