import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateIndianPhone, generateReferenceId } from "@/lib/lead";
import { sendAdminLeadNotification, sendClientWelcomeMessage } from "@/lib/whatsapp";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { LeadSubmissionSchema } from "@/lib/validations";

// In-memory rate limiting map: ip -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 15;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();

  // Prune expired entries to prevent memory leaks (SEC-12)
  if (rateLimitMap.size > 200) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function POST(request: Request) {
  try {
    // 0. Ensure Database is seeded if cold start
    await seedDatabaseIfNeeded();

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // 1. IP Rate Limiting Check
    if (!checkRateLimit(clientIp)) {
      return NextResponse.json(
        { success: false, error: "Too many inquiries submitted. Please wait 60 seconds." },
        { status: 429 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload." },
        { status: 400 }
      );
    }

    // 2. Strict Zod Schema Validation (SEC-07)
    const validationResult = LeadSubmissionSchema.safeParse(rawJson);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid submission parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const body = validationResult.data;

    // 3. Honeypot Anti-Spam Check (silent rejection of bots)
    if (body.honeypot || body.website || body.companyFax) {
      console.warn(`[Lead Ingestion] Bot detected via honeypot from IP: ${clientIp}`);
      return NextResponse.json(
        {
          success: true,
          referenceId: generateReferenceId(),
          message: "Inquiry processed successfully.",
        },
        { status: 200 }
      );
    }

    const {
      fullName,
      phone,
      email,
      city,
      totalDebt,
      totalDebtRange,
      loanType,
      legalIssue,
      harassmentLevel,
      facingHarassment,
      banks,
      lenders,
      overdueStatus,
      settlementReadiness,
      consultationMode,
      consultationSlot,
      preferredCallbackTime,
      message,
      source,
    } = body;

    // 4. Validate Indian Mobile Phone format
    const phoneValidation = validateIndianPhone(phone || "");
    if (!phoneValidation.isValid) {
      return NextResponse.json(
        { success: false, error: phoneValidation.error || "Please enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    // Normalized to E.164: 91XXXXXXXXXX
    const normalizedPhone = `91${phoneValidation.cleaned}`;

    // Normalize Source
    let normalizedSource = "WEBSITE_INQUIRY";
    if (source) {
      const srcUpper = String(source).toUpperCase().replace(/[\s-:]+/g, "_");
      if (srcUpper.includes("HERO")) normalizedSource = "HERO_QUICK_FORM";
      else if (srcUpper.includes("SIDEBAR")) normalizedSource = "SERVICE_SIDEBAR";
      else if (srcUpper.includes("ELIGIBILITY") || srcUpper.includes("WIZARD")) normalizedSource = "ELIGIBILITY_WIZARD";
      else if (srcUpper.includes("CASE_EVALUATION") || srcUpper.includes("CONTACT_TAB_1")) normalizedSource = "CONTACT_EVALUATION";
      else if (srcUpper.includes("BOOK_CONSULTATION") || srcUpper.includes("CONTACT_TAB_2")) normalizedSource = "CONSULTATION_BOOKING";
      else if (srcUpper.includes("CALCULATOR")) normalizedSource = "CALCULATOR";
      else if (srcUpper.includes("WHATSAPP")) normalizedSource = "WHATSAPP_INBOUND";
      else normalizedSource = srcUpper.slice(0, 50);
    }

    // Resolve Legal Issue & Category
    const resolvedLegalIssue =
      legalIssue ||
      loanType ||
      "Personal Loan / Unsecured Debt";

    const resolvedLenders = lenders || banks || null;
    const resolvedTotalDebt = totalDebtRange || totalDebt || null;
    const resolvedHarassment =
      harassmentLevel ||
      (facingHarassment ? "Harassment Calls / Home Visits" : null);

    // 4. Deduplication Check: Look for active lead with identical phone
    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: normalizedPhone,
        status: { not: "CLOSED" },
      },
      orderBy: { updatedAt: "desc" },
    });

    let leadRecord;
    let isExisting = false;

    if (existingLead) {
      // Deduplicate & Enrich Existing Active Lead
      isExisting = true;
      const updatedNotes = message
        ? existingLead.message
          ? `${existingLead.message}\n---\n[Update from ${normalizedSource}]: ${message}`
          : message
        : existingLead.message;

      leadRecord = await prisma.lead.update({
        where: { id: existingLead.id },
        data: {
          fullName: fullName.trim() || existingLead.fullName,
          email: email?.trim() || existingLead.email,
          city: city?.trim() || existingLead.city,
          legalIssue: resolvedLegalIssue || existingLead.legalIssue,
          lenders: resolvedLenders || existingLead.lenders,
          totalDebtRange: resolvedTotalDebt || existingLead.totalDebtRange,
          overdueStatus: overdueStatus || existingLead.overdueStatus,
          harassmentLevel: resolvedHarassment || existingLead.harassmentLevel,
          settlementReadiness: settlementReadiness || existingLead.settlementReadiness,
          consultationMode: consultationMode || existingLead.consultationMode,
          consultationSlot: consultationSlot || existingLead.consultationSlot,
          preferredCallbackTime: preferredCallbackTime || existingLead.preferredCallbackTime,
          message: updatedNotes,
          source: `${existingLead.source} -> ${normalizedSource}`,
          unreadCount: { increment: 1 },
          lastMessageAt: new Date(),
          ipAddress: clientIp,
        },
      });

      // Log Lead Updated in ActivityLog
      await prisma.activityLog.create({
        data: {
          leadId: leadRecord.id,
          actorName: "System Ingestion",
          action: "LEAD_UPDATED",
          details: `Re-engaged via ${normalizedSource}. Total debt: ${resolvedTotalDebt || "N/A"}.`,
          ipAddress: clientIp,
        },
      });

      console.log(`♻️ Active Lead updated for +${normalizedPhone} (Ref: ${leadRecord.referenceId})`);
    } else {
      // 5. Create Brand New Lead
      const referenceId = generateReferenceId();

      leadRecord = await prisma.lead.create({
        data: {
          referenceId,
          fullName: fullName.trim(),
          phone: normalizedPhone,
          email: email?.trim() || null,
          city: city?.trim() || null,
          source: normalizedSource,
          legalIssue: resolvedLegalIssue,
          lenders: resolvedLenders,
          totalDebtRange: resolvedTotalDebt,
          overdueStatus: overdueStatus || null,
          harassmentLevel: resolvedHarassment,
          settlementReadiness: settlementReadiness || null,
          consultationMode: consultationMode || null,
          consultationSlot: consultationSlot || null,
          preferredCallbackTime: preferredCallbackTime || null,
          message: message?.trim() || null,
          status: "NEW",
          unreadCount: 1,
          lastMessageAt: new Date(),
          consentGiven: true,
          ipAddress: clientIp,
        },
      });

      // Log Lead Created in ActivityLog
      await prisma.activityLog.create({
        data: {
          leadId: leadRecord.id,
          actorName: "System Ingestion",
          action: "LEAD_CREATED",
          details: `New case file created via ${normalizedSource}. Ref: ${referenceId}`,
          ipAddress: clientIp,
        },
      });

      console.log(`📁 New Case File created: ${referenceId} for ${fullName} (+${normalizedPhone})`);

      // Send Automated Client Welcome WhatsApp Message asynchronously
      sendClientWelcomeMessage({
        id: leadRecord.id,
        referenceId: leadRecord.referenceId,
        fullName: leadRecord.fullName,
        phone: leadRecord.phone,
        source: leadRecord.source,
      }).catch((err) => console.error("Async welcome WhatsApp message failed:", err));
    }

    // 6. Trigger Admin Lead Notification WhatsApp Alert
    sendAdminLeadNotification({
      id: leadRecord.id,
      referenceId: leadRecord.referenceId,
      fullName: leadRecord.fullName,
      phone: leadRecord.phone,
      city: leadRecord.city,
      totalDebtRange: leadRecord.totalDebtRange,
      legalIssue: leadRecord.legalIssue,
      lenders: leadRecord.lenders,
      overdueStatus: leadRecord.overdueStatus,
      harassmentLevel: leadRecord.harassmentLevel,
      settlementReadiness: leadRecord.settlementReadiness,
      source: leadRecord.source,
    }).catch((err) => console.error("Async admin WhatsApp alert failed:", err));

    return NextResponse.json(
      {
        success: true,
        referenceId: leadRecord.referenceId,
        isExisting,
        message: isExisting
          ? "Case file updated with latest inquiry details."
          : "Case file successfully registered with senior advocates.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unhandled error processing lead in /api/leads:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error processing case file." },
      { status: 500 }
    );
  }
}
