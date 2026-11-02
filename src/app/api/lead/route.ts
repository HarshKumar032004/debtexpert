import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";
import {
  formatWhatsAppLeadMessage,
  generateReferenceId,
  validateIndianPhone,
} from "@/lib/lead";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      fullName,
      phone,
      email,
      city,
      totalDebt,
      loanType,
      harassmentLevel,
      facingHarassment,
      banks,
      message,
      source,
      referenceId: providedRefId,
    } = body;

    // 1. Validation
    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Please enter your full legal name." },
        { status: 400 }
      );
    }

    const phoneCheck = validateIndianPhone(phone || "");
    if (!phoneCheck.isValid) {
      return NextResponse.json(
        { success: false, error: phoneCheck.error || "Invalid 10-digit mobile number." },
        { status: 400 }
      );
    }

    // 2. Generate or use reference ID
    const referenceId = providedRefId || generateReferenceId();

    const leadRecord = {
      referenceId,
      fullName: fullName.trim(),
      phone: phoneCheck.cleaned,
      email: email ? email.trim() : undefined,
      city: city ? city.trim() : undefined,
      totalDebt: totalDebt || "Not specified",
      loanType: loanType || "personal-loan",
      harassmentLevel,
      facingHarassment,
      banks: banks ? banks.trim() : undefined,
      message: message ? message.trim() : undefined,
      source: source || "website-form",
      timestamp: new Date().toISOString(),
    };

    // 3. Log to server console (observable in Next.js logs)
    console.log("==========================================");
    console.log("📁 NEW LEAD RECEIVED [DEBT SUPPORT EXPERT]");
    console.log(`Ref ID:    ${leadRecord.referenceId}`);
    console.log(`Client:    ${leadRecord.fullName} (+91 ${leadRecord.phone})`);
    console.log(`City:      ${leadRecord.city || "N/A"}`);
    console.log(`Debt:      ${leadRecord.totalDebt}`);
    console.log(`Category:  ${leadRecord.loanType}`);
    console.log(`Source:    ${leadRecord.source}`);
    console.log("==========================================");

    // 4. Webhook / Email integration ready
    // If client configures an external webhook (Google Sheets, Make, Zapier, Web3Forms, Slack)
    const webhookUrl = process.env.LEAD_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(leadRecord),
        });
      } catch (webhookErr) {
        console.error("Failed to forward lead to webhook:", webhookErr);
      }
    }

    // 5. Generate formatted WhatsApp URL
    const whatsappMessage = formatWhatsAppLeadMessage(leadRecord);
    const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    return NextResponse.json(
      {
        success: true,
        referenceId,
        whatsappUrl,
        message: "Case file successfully registered with senior advocates.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unhandled error processing lead in /api/lead:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error processing case file." },
      { status: 500 }
    );
  }
}
