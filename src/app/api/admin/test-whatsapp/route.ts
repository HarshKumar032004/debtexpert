import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendAdminLeadNotification } from "@/lib/whatsapp";
import { getSystemHealth } from "@/lib/system-health";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required for API diagnostics." },
        { status: 403 }
      );
    }

    const testResult = await sendAdminLeadNotification({
      id: "test-id",
      referenceId: "DSE-TEST99",
      fullName: "Diagnostic Test Lead",
      phone: "919876543210",
      city: "New Delhi",
      totalDebtRange: "₹15,00,000",
      legalIssue: "System Diagnostics & WhatsApp API Ping",
      source: "ADMIN_SETTINGS_DIAGNOSTIC",
    });

    if (!testResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: testResult.error || "Meta WhatsApp Cloud API rejected the message dispatch.",
          result: testResult,
        },
        { status: 400 }
      );
    }

    // Check if Meta WABA has outbound delivery restrictions
    let deliveryWarning: string | undefined;
    try {
      const health = await getSystemHealth();
      if (health.meta.canSendMessage === "BLOCKED") {
        const topIssue = health.meta.healthErrors?.[0]?.description || "Business Account locked";
        deliveryWarning = `Outbound delivery is currently BLOCKED by Meta (${topIssue}). Complete Business Info and add Payment Method in Meta Business Suite.`;
      }
    } catch {
      // Non-blocking diagnostic check
    }

    return NextResponse.json({
      success: true,
      result: testResult,
      warning: deliveryWarning,
      message: deliveryWarning
        ? `⚠️ Meta accepted the message, but delivery is BLOCKED by Meta policy: ${deliveryWarning}`
        : testResult.simulated
        ? "Simulated WhatsApp alert logged to server console (Local Dev mode)."
        : `Live Meta alert accepted by Meta (Message ID: ${testResult.waMessageId || "OK"}).`,
    });
  } catch (error) {
    console.error("Test WhatsApp API Error:", error);
    const msg = error instanceof Error ? error.message : "Failed to dispatch test notification";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}
