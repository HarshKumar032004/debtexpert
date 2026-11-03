import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { sendAdminLeadNotification } from "@/lib/whatsapp";

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

    return NextResponse.json({
      success: true,
      result: testResult,
      message: testResult.simulated
        ? "Simulated WhatsApp alert logged to server console (Local Dev mode)."
        : "Live Meta WhatsApp Cloud API alert dispatched to Admin phone.",
    });
  } catch (error) {
    console.error("Test WhatsApp API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to dispatch test notification" },
      { status: 500 }
    );
  }
}
