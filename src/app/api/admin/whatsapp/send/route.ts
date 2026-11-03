import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendAdminChatMessage } from "@/lib/whatsapp";
import { WhatsAppSendSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed JSON payload." }, { status: 400 });
    }

    const validationResult = WhatsAppSendSchema.safeParse(rawJson);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid dispatch parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { leadId, messageText, templateName } = validationResult.data;

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      select: { id: true, phone: true, fullName: true, referenceId: true },
    });

    if (!lead) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    const result = await sendAdminChatMessage({
      leadId: lead.id,
      toPhone: lead.phone,
      text: messageText,
      templateName,
      sentById: user.userId,
    });

    // Fetch the newly created message record
    const savedMessage = await prisma.whatsAppMessage.findFirst({
      where: { leadId: lead.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      result,
      message: savedMessage,
    });
  } catch (error) {
    console.error("POST /api/admin/whatsapp/send error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error sending WhatsApp message" },
      { status: 500 }
    );
  }
}
