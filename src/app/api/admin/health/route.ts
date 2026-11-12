import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSystemHealth } from "@/lib/system-health";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/health
 * Returns live real-time diagnostics of:
 * - Database connectivity & latency (SELECT 1 + row counts)
 * - Meta WhatsApp Cloud API connectivity & quality status
 * - Security and webhook configuration
 * Strictly restricted to authenticated counsel and staff.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const health = await getSystemHealth();

    return NextResponse.json({
      success: true,
      health,
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Error assessing system health";
    return NextResponse.json(
      { success: false, error: msg },
      { status: 500 }
    );
  }
}

