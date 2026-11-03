export type LeadTier = "HOT" | "WARM" | "NURTURE";

export interface LeadScoreResult {
  score: number; // 0 - 100
  tier: LeadTier;
  reasons: string[];
}

export function calculateLeadScore(lead: {
  totalDebtRange?: string | null;
  harassmentLevel?: string | null;
  legalIssue?: string | null;
  overdueStatus?: string | null;
  status?: string | null;
  consultationSlot?: string | null;
  unreadCount?: number | null;
}): LeadScoreResult {
  let score = 20; // baseline
  const reasons: string[] = [];

  const debtStr = (lead.totalDebtRange || "").toLowerCase();
  const harassmentStr = (lead.harassmentLevel || "").toLowerCase();
  const issueStr = (lead.legalIssue || "").toLowerCase();
  const overdueStr = (lead.overdueStatus || "").toLowerCase();

  // 1. Debt Volume Factor (Up to 40 pts)
  if (debtStr.includes("50l") || debtStr.includes("50,00,000") || debtStr.includes("crore")) {
    score += 40;
    reasons.push("High Value Commercial Portfolio (₹50L+)");
  } else if (debtStr.includes("25l") || debtStr.includes("28,50,000") || debtStr.includes("25,00,000")) {
    score += 35;
    reasons.push("Substantial Debt Exposure (₹25L–₹50L)");
  } else if (debtStr.includes("10l") || debtStr.includes("14,20,000") || debtStr.includes("16,00,000")) {
    score += 28;
    reasons.push("Multi-Account Exposure (₹10L–₹25L)");
  } else if (debtStr.includes("5l") || debtStr.includes("8,50,000")) {
    score += 20;
    reasons.push("Mid Tier Exposure (₹5L–₹10L)");
  } else if (debtStr.includes("2l")) {
    score += 10;
    reasons.push("Standard Portfolio (₹2L–₹5L)");
  }

  // 2. Harassment & Criminal Threat Factor (Up to 30 pts)
  if (
    harassmentStr.includes("home visit") ||
    harassmentStr.includes("threat") ||
    harassmentStr.includes("critical") ||
    harassmentStr.includes("emergency")
  ) {
    score += 30;
    reasons.push("Urgent Harassment / Home Visit Threat");
  } else if (harassmentStr.includes("call") || harassmentStr.includes("frequent")) {
    score += 20;
    reasons.push("Recovery Call Intimidation");
  }

  // 3. Legal Notice & Section 138 Statutory Demand (Up to 25 pts)
  if (
    issueStr.includes("138") ||
    issueStr.includes("notice") ||
    issueStr.includes("cheque") ||
    issueStr.includes("arbitration") ||
    harassmentStr.includes("notice")
  ) {
    score += 25;
    reasons.push("Statutory Demand / Section 138 Notice Active");
  }

  // 4. Overdue Aging / NPA Factor (Up to 15 pts)
  if (overdueStr.includes("6+") || overdueStr.includes("npa") || overdueStr.includes("12+")) {
    score += 15;
    reasons.push("6+ Months Hard NPA (High Settlement Readiness)");
  } else if (overdueStr.includes("3–6") || overdueStr.includes("3-6")) {
    score += 10;
    reasons.push("3–6 Months Overdue");
  }

  // 5. Consultation Booking Intent (Up to 15 pts)
  if (lead.consultationSlot || lead.status === "CONSULTATION_SCHEDULED") {
    score += 15;
    reasons.push("1-on-1 Consultation Slot Booked");
  }

  // Unread priority
  if (lead.unreadCount && lead.unreadCount > 0) {
    score += 5;
  }

  // Bound score
  score = Math.min(100, Math.max(0, score));

  let tier: LeadTier = "NURTURE";
  if (score >= 60) tier = "HOT";
  else if (score >= 35) tier = "WARM";

  return {
    score,
    tier,
    reasons,
  };
}
