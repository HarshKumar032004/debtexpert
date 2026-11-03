import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReferenceId, validateIndianPhone } from "@/lib/lead";

export const dynamic = "force-dynamic";

const VERIFY_TOKEN = process.env.META_WEBHOOK_VERIFY_TOKEN || "dse_legal_webhook_secret_2026";

/**
 * 1. Meta Webhook Verification Handler (GET)
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ [Meta Webhook Verification] Successfully verified challenge.");
    return new Response(challenge || "", {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  }

  console.warn("❌ [Meta Webhook Verification] Token mismatch or invalid mode.");
  return new Response("Forbidden", { status: 403 });
}

/**
 * 2. Meta Inbound Messages & Delivery Status Handler (POST)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if it's a WhatsApp webhook event
    if (body.object === "whatsapp_business_account" || body.entry) {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // a) Process Delivery Status Updates (sent, delivered, read, failed)
          if (value.statuses && Array.isArray(value.statuses)) {
            for (const statusObj of value.statuses) {
              const waMessageId = statusObj.id;
              const rawStatus = (statusObj.status || "").toLowerCase();

              let mappedStatus: "SENT" | "DELIVERED" | "READ" | "FAILED" = "SENT";
              if (rawStatus === "delivered") mappedStatus = "DELIVERED";
              else if (rawStatus === "read") mappedStatus = "READ";
              else if (rawStatus === "failed") mappedStatus = "FAILED";

              const errorMessage = statusObj.errors?.[0]?.message || statusObj.errors?.[0]?.title || null;

              try {
                const updated = await prisma.whatsAppMessage.updateMany({
                  where: { waMessageId },
                  data: {
                    status: mappedStatus,
                    errorMessage,
                  },
                });

                if (updated.count > 0) {
                  console.log(`📡 [WhatsApp Status] ${waMessageId} -> ${mappedStatus}`);
                }
              } catch (dbErr) {
                console.error("Error updating message status in DB:", dbErr);
              }
            }
          }

          // b) Process Inbound Client Messages
          if (value.messages && Array.isArray(value.messages)) {
            for (const msgObj of value.messages) {
              const rawFrom = String(msgObj.from || "").replace(/\D/g, "");
              const phoneValidation = validateIndianPhone(rawFrom);
              const normalizedPhone = phoneValidation.isValid ? `91${phoneValidation.cleaned}` : rawFrom;

              const waMessageId = msgObj.id;
              const msgType = msgObj.type || "text";

              let messageText = "";
              if (msgType === "text") {
                messageText = msgObj.text?.body || "";
              } else if (msgType === "image") {
                messageText = msgObj.image?.caption || "[Image Document Attached]";
              } else if (msgType === "document") {
                messageText = msgObj.document?.filename
                  ? `[Document: ${msgObj.document.filename}]`
                  : "[Legal Document Attached]";
              } else {
                messageText = `[Media / ${msgType}]`;
              }

              // Find matching active lead by phone
              let lead = await prisma.lead.findFirst({
                where: {
                  phone: normalizedPhone,
                  status: { not: "CLOSED" },
                },
                orderBy: { updatedAt: "desc" },
              });

              if (!lead) {
                // If not found in active, try any status
                lead = await prisma.lead.findFirst({
                  where: { phone: normalizedPhone },
                  orderBy: { updatedAt: "desc" },
                });
              }

              if (lead) {
                // Attach inbound message to existing lead
                await prisma.whatsAppMessage.create({
                  data: {
                    leadId: lead.id,
                    waMessageId,
                    direction: "INBOUND",
                    type: msgType,
                    content: messageText,
                    status: "READ",
                  },
                });

                // Increment unread count and bump lastMessageAt
                await prisma.lead.update({
                  where: { id: lead.id },
                  data: {
                    unreadCount: { increment: 1 },
                    lastMessageAt: new Date(),
                  },
                });

                // Log in ActivityLog
                await prisma.activityLog.create({
                  data: {
                    leadId: lead.id,
                    actorName: "Borrower",
                    action: "WHATSAPP_RECEIVED",
                    details: `Inbound WhatsApp: "${messageText.slice(0, 80)}${messageText.length > 80 ? "..." : ""}"`,
                  },
                });

                console.log(`💬 Inbound WhatsApp message recorded for ${lead.fullName} (+${normalizedPhone})`);
              } else {
                // Auto-create new Lead for unknown inbound number
                const newRefId = generateReferenceId();

                const newLead = await prisma.lead.create({
                  data: {
                    referenceId: newRefId,
                    fullName: "WhatsApp Inbound Borrower",
                    phone: normalizedPhone,
                    source: "WHATSAPP_INBOUND",
                    legalIssue: "Pending Review",
                    status: "NEW",
                    unreadCount: 1,
                    lastMessageAt: new Date(),
                    consentGiven: true,
                  },
                });

                await prisma.whatsAppMessage.create({
                  data: {
                    leadId: newLead.id,
                    waMessageId,
                    direction: "INBOUND",
                    type: msgType,
                    content: messageText,
                    status: "READ",
                  },
                });

                await prisma.activityLog.create({
                  data: {
                    leadId: newLead.id,
                    actorName: "System",
                    action: "LEAD_CREATED",
                    details: `New case file initialized via inbound WhatsApp message from +${normalizedPhone}. Ref: ${newRefId}`,
                  },
                });

                console.log(`📁 Auto-created new Lead from inbound WhatsApp: ${newRefId} (+${normalizedPhone})`);
              }
            }
          }
        }
      }
    }

    // Always respond with 200 within 3 seconds
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Unhandled error in WhatsApp webhook POST:", error);
    // Respond with 200 to acknowledge Meta delivery so it doesn't retry indefinitely
    return NextResponse.json({ status: "success", error: "Handled error" }, { status: 200 });
  }
}
