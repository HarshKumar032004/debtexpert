import { prisma } from "@/lib/prisma";

const META_API_VERSION = "v21.0";
const META_PHONE_NUMBER_ID = process.env.META_PHONE_NUMBER_ID;
const META_ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
const ADMIN_WHATSAPP_NUMBER = process.env.ADMIN_WHATSAPP_NUMBER || "917979789458";
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

interface SendMetaMessageParams {
  to: string; // E.164 without +, e.g. 919876543210
  type?: "text" | "template";
  text?: string;
  templateName?: string;
  templateLanguage?: string;
  templateComponents?: unknown[];
}

interface MetaApiResponse {
  messaging_product?: string;
  contacts?: Array<{ input: string; wa_id: string }>;
  messages?: Array<{ id: string }>;
  error?: {
    message: string;
    type: string;
    code: number;
    error_data?: unknown;
  };
}

/**
 * Base dispatcher for Meta WhatsApp Cloud API with automatic mock fallback
 */
export async function sendMetaWhatsAppMessage(
  params: SendMetaMessageParams
): Promise<{ success: boolean; waMessageId?: string; simulated?: boolean; error?: string }> {
  const isConfigured = Boolean(META_PHONE_NUMBER_ID && META_ACCESS_TOKEN);

  // Clean phone number (remove any + or leading spaces)
  const cleanTo = params.to.replace(/\D/g, "");

  if (!isConfigured) {
    const simulatedWamid = `wamid.HBgL${Date.now()}SIMULATED`;
    console.log("--------------------------------------------------");
    console.log("📱 [META WHATSAPP CLOUD API - LOCAL DEV SIMULATION]");
    console.log(`To:          +${cleanTo}`);
    console.log(`Type:        ${params.type || "text"}`);
    if (params.text) {
      console.log(`Message:\n${params.text}`);
    }
    if (params.templateName) {
      console.log(`Template:    ${params.templateName} (${params.templateLanguage || "en_US"})`);
    }
    console.log(`Simulated ID: ${simulatedWamid}`);
    console.log("--------------------------------------------------");

    return {
      success: true,
      waMessageId: simulatedWamid,
      simulated: true,
    };
  }

  const endpoint = `https://graph.facebook.com/${META_API_VERSION}/${META_PHONE_NUMBER_ID}/messages`;

  const payload: Record<string, unknown> = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: cleanTo,
  };

  if (params.type === "template" && params.templateName) {
    payload.type = "template";
    payload.template = {
      name: params.templateName,
      language: { code: params.templateLanguage || "en_US" },
      components: params.templateComponents || [],
    };
  } else {
    payload.type = "text";
    payload.text = { preview_url: false, body: params.text || "" };
  }

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${META_ACCESS_TOKEN}`,
      },
      body: JSON.stringify(payload),
    });

    const data = (await res.json()) as MetaApiResponse;

    if (!res.ok || data.error) {
      console.error("Meta WhatsApp Cloud API Error:", data.error || res.statusText);
      return {
        success: false,
        error: data.error?.message || `HTTP ${res.status}: Failed to dispatch WhatsApp message`,
      };
    }

    const waMessageId = data.messages?.[0]?.id || `wamid.${Date.now()}`;
    return {
      success: true,
      waMessageId,
      simulated: false,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Exception dispatching WhatsApp Cloud API message:", errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}

export interface LeadRecordSummary {
  id: string;
  referenceId: string;
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  totalDebtRange?: string | null;
  legalIssue?: string | null;
  lenders?: string | null;
  overdueStatus?: string | null;
  harassmentLevel?: string | null;
  settlementReadiness?: string | null;
  source: string;
}

/**
 * a) sendAdminLeadNotification(lead):
 * Sends an instant WhatsApp alert to ADMIN_WHATSAPP_NUMBER with comprehensive lead details.
 */
export async function sendAdminLeadNotification(
  lead: LeadRecordSummary
): Promise<{ success: boolean; waMessageId?: string; error?: string }> {
  const alertText = [
    `🚨 *NEW LEGAL CASE INGESTED - DEBT SUPPORT EXPERT*`,
    `----------------------------------------`,
    `📁 *Case File:* ${lead.referenceId}`,
    `👤 *Client Name:* ${lead.fullName}`,
    `📱 *Mobile:* +${lead.phone}`,
    lead.city ? `📍 *City / State:* ${lead.city}` : null,
    lead.totalDebtRange ? `💰 *Total Debt:* ${lead.totalDebtRange}` : null,
    lead.legalIssue ? `📑 *Legal Category:* ${lead.legalIssue}` : null,
    lead.lenders ? `🏦 *Lenders:* ${lead.lenders}` : null,
    lead.overdueStatus ? `🕒 *Overdue Status:* ${lead.overdueStatus}` : null,
    lead.harassmentLevel ? `⚠️ *Harassment Flag:* ${lead.harassmentLevel}` : null,
    lead.settlementReadiness ? `🎯 *Readiness:* ${lead.settlementReadiness}` : null,
    `🌐 *Source:* ${lead.source}`,
    `----------------------------------------`,
    `🔗 *Admin Lead Desk:*`,
    `${APP_URL}/admin/leads/${lead.id}`,
  ]
    .filter(Boolean)
    .join("\n");

  const result = await sendMetaWhatsAppMessage({
    to: ADMIN_WHATSAPP_NUMBER,
    type: "text",
    text: alertText,
  });

  return result;
}

/**
 * b) sendClientWelcomeMessage(lead):
 * Sends an automated WhatsApp acknowledgment message confirming Case Reference ID,
 * working hours, and logs an OUTBOUND record in WhatsAppMessage table.
 */
export async function sendClientWelcomeMessage(
  lead: LeadRecordSummary
): Promise<{ success: boolean; waMessageId?: string; error?: string }> {
  const welcomeText = [
    `⚖️ *Debt Support Expert — Case Registration Confirmation*`,
    `----------------------------------------`,
    `Dear ${lead.fullName},`,
    ``,
    `Thank you for contacting Debt Support Expert. Your confidential legal case file has been formally registered under:`,
    `📁 *Case Reference ID: ${lead.referenceId}*`,
    ``,
    `🛡️ *Immediate Protection Notice:*`,
    `Our Senior Legal Advocate panel is currently reviewing your loan portfolio to prepare a harassment defense strategy and evaluate one-time settlement (OTS) options.`,
    ``,
    `⏰ *Advocate Consultation Hours:*`,
    `Monday – Friday: 9:00 AM – 5:00 PM IST`,
    ``,
    `If you are facing active harassment visits or threatening recovery calls right now, please reply directly to this WhatsApp chat or call our priority legal desk at +91 7979789458.`,
    `----------------------------------------`,
    `_Advocate Office, Debt Support Expert_`,
  ].join("\n");

  const result = await sendMetaWhatsAppMessage({
    to: lead.phone,
    type: "text",
    text: welcomeText,
  });

  // Persist OUTBOUND record in WhatsAppMessage table
  try {
    await prisma.whatsAppMessage.create({
      data: {
        leadId: lead.id,
        waMessageId: result.waMessageId || `sim_${Date.now()}`,
        direction: "OUTBOUND",
        type: "text",
        content: welcomeText,
        status: result.success ? "SENT" : "FAILED",
        errorMessage: result.error,
        sentById: "SYSTEM_AUTO_WELCOME",
      },
    });
  } catch (dbErr) {
    console.error("Failed to persist outbound welcome message in DB:", dbErr);
  }

  return result;
}

/**
 * c) sendAdminChatMessage({ leadId, toPhone, text, templateName, sentById }):
 * Sends a live message or template from Admin Panel to client and records in WhatsAppMessage.
 */
export async function sendAdminChatMessage({
  leadId,
  toPhone,
  text,
  templateName,
  sentById,
}: {
  leadId: string;
  toPhone: string;
  text?: string;
  templateName?: string;
  sentById?: string;
}): Promise<{ success: boolean; waMessageId?: string; error?: string }> {
  const result = await sendMetaWhatsAppMessage({
    to: toPhone,
    type: templateName ? "template" : "text",
    text,
    templateName,
  });

  const contentToStore = text || `[Template: ${templateName}]`;

  try {
    await prisma.whatsAppMessage.create({
      data: {
        leadId,
        waMessageId: result.waMessageId || `sim_${Date.now()}`,
        direction: "OUTBOUND",
        type: templateName ? "template" : "text",
        content: contentToStore,
        status: result.success ? "SENT" : "FAILED",
        errorMessage: result.error,
        sentById: sentById || null,
      },
    });

    // Update lead's lastMessageAt
    await prisma.lead.update({
      where: { id: leadId },
      data: { lastMessageAt: new Date() },
    });

    // Log in ActivityLog
    await prisma.activityLog.create({
      data: {
        leadId,
        userId: sentById || null,
        actorName: sentById ? "Admin Staff" : "System",
        action: "WHATSAPP_SENT",
        details: `Sent ${templateName ? `template "${templateName}"` : "message"} to +${toPhone}`,
      },
    });
  } catch (dbErr) {
    console.error("Failed to store outbound admin chat message:", dbErr);
  }

  return result;
}
