import { siteConfig } from "@/config/site";

export interface LeadData {
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  totalDebt?: string;
  totalDebtRange?: string;
  loanType?: string;
  legalIssue?: string;
  harassmentLevel?: string;
  facingHarassment?: boolean;
  banks?: string;
  lenders?: string;
  overdueStatus?: string;
  settlementReadiness?: string;
  consultationMode?: string;
  consultationSlot?: string;
  preferredCallbackTime?: string;
  message?: string;
  source?: string;
  honeypot?: string;
  website?: string;
  consentGiven?: boolean;
}

export interface LeadResponse {
  success: boolean;
  referenceId: string;
  whatsappUrl: string;
  isExisting?: boolean;
  error?: string;
}

/**
 * Validates a 10-digit Indian Mobile Number
 * Handles prefixes like +91, 91, 0, spaces, and hyphens.
 * Indian mobiles start with 6, 7, 8, or 9.
 */
export function validateIndianPhone(input: string): {
  isValid: boolean;
  cleaned: string;
  error?: string;
} {
  if (!input || !input.trim()) {
    return { isValid: false, cleaned: "", error: "Mobile number is required" };
  }

  // Remove any non-digit characters except leading plus if any
  let digits = input.replace(/\D/g, "");

  // If prefixed with 91 (like 919876543210) and has 12 digits, strip country code
  if (digits.length === 12 && digits.startsWith("91")) {
    digits = digits.slice(2);
  }

  // If prefixed with 0 (like 09876543210) and has 11 digits, strip 0
  if (digits.length === 11 && digits.startsWith("0")) {
    digits = digits.slice(1);
  }

  if (digits.length !== 10) {
    return {
      isValid: false,
      cleaned: digits,
      error: "Please enter a valid 10-digit mobile number",
    };
  }

  // Must begin with 6, 7, 8, or 9
  if (!/^[6-9]/.test(digits)) {
    return {
      isValid: false,
      cleaned: digits,
      error: "Indian mobile numbers must start with 6, 7, 8, or 9",
    };
  }

  return {
    isValid: true,
    cleaned: digits,
  };
}

/**
 * Generates an official-looking Case Reference ID
 * Example: DSE-8492X1
 */
export function generateReferenceId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let suffix = "";
  for (let i = 0; i < 6; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DSE-${suffix}`;
}

/**
 * Human-friendly labels for debt, loan types, and harassment
 */
export function formatLoanTypeLabel(raw?: string): string {
  if (!raw) return "Unsecured Loan / Credit Card";
  const map: Record<string, string> = {
    personal: "Personal Loan",
    "personal-loan": "Personal Loan (Unsecured)",
    "credit-card": "Credit Card Outstanding",
    cards: "Credit Card Debt",
    multiple: "Multiple Loans & Cards",
    business: "Business / MSME Loan",
    "business-loan": "Business Loan (MSME/OD)",
    "anti-harassment": "Anti-Harassment Legal Shield",
  };
  return map[raw] || raw;
}

export function formatHarassmentLabel(level?: string, facing?: boolean): string {
  if (level) {
    const map: Record<string, string> = {
      none: "No active harassment (Proactive Settlement)",
      moderate: "Moderate (10-20 calls/day + threatening notices)",
      critical: "CRITICAL EMERGENCY (30+ calls/day, home visits, relatives contacted)",
    };
    return map[level] || level;
  }
  if (facing === true) {
    return "URGENT (Facing recovery calls/doorstep threats)";
  }
  if (facing === false) {
    return "None (Seeking amicable settlement)";
  }
  return "Assessing Legal Protection";
}

/**
 * Formats a structured WhatsApp message for senior advocate desk
 */
export function formatWhatsAppLeadMessage(
  lead: LeadData & { referenceId: string }
): string {
  const lines = [
    `⚖️ *LEGAL CASE EVALUATION INITIATED*`,
    `📁 *Case Ref:* ${lead.referenceId}`,
    `----------------------------------------`,
    `👤 *Client Name:* ${lead.fullName.trim()}`,
    `📱 *Mobile:* +91 ${lead.phone}`,
  ];

  if (lead.email) {
    lines.push(`📧 *Email:* ${lead.email.trim()}`);
  }
  if (lead.city) {
    lines.push(`📍 *City / State:* ${lead.city.trim()}`);
  }
  if (lead.totalDebt || lead.totalDebtRange) {
    lines.push(`💰 *Total Unsecured Debt:* ${lead.totalDebt || lead.totalDebtRange}`);
  }
  if (lead.loanType || lead.legalIssue) {
    lines.push(`📑 *Loan Type:* ${formatLoanTypeLabel(lead.loanType || lead.legalIssue)}`);
  }

  const harassment = formatHarassmentLabel(lead.harassmentLevel, lead.facingHarassment);
  lines.push(`🚨 *Harassment Status:* ${harassment}`);

  const banks = lead.banks || lead.lenders;
  if (banks && banks.trim()) {
    lines.push(`🏦 *Lending Institutions:* ${banks.trim()}`);
  }
  if (lead.overdueStatus) {
    lines.push(`🕒 *Overdue:* ${lead.overdueStatus}`);
  }
  if (lead.consultationSlot) {
    lines.push(`🗓️ *Requested Slot:* ${lead.consultationSlot}`);
  }
  if (lead.message && lead.message.trim()) {
    lines.push(`📝 *Case Notes:* ${lead.message.trim()}`);
  }

  lines.push(`----------------------------------------`);
  lines.push(`_Submitted via Debt Support Expert Legal Portal_`);
  lines.push(`_I request an advocate to review my file and stop recovery harassment._`);

  return lines.join("\n");
}

/**
 * Submits lead data to Next.js API route /api/leads
 */
export async function submitLead(data: LeadData): Promise<LeadResponse> {
  const phoneValidation = validateIndianPhone(data.phone);
  if (!phoneValidation.isValid) {
    return {
      success: false,
      referenceId: "",
      whatsappUrl: "",
      error: phoneValidation.error || "Invalid mobile number",
    };
  }

  let finalRefId = generateReferenceId();
  let isExisting = false;

  const payload = {
    ...data,
    phone: phoneValidation.cleaned,
  };

  try {
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.referenceId) {
        finalRefId = json.referenceId;
      }
      isExisting = Boolean(json.isExisting);
    } else {
      console.warn("API lead submission responded with non-200 status:", res.status);
    }
  } catch (err) {
    // We log but do not block the user from proceeding to WhatsApp
    console.error("Error submitting lead to /api/leads:", err);
  }

  const whatsappMessage = formatWhatsAppLeadMessage({
    ...payload,
    referenceId: finalRefId,
  });

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return {
    success: true,
    referenceId: finalRefId,
    whatsappUrl,
    isExisting,
  };
}
