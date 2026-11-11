import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SystemSettingUpdateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * 1. GET /api/admin/settings
 * Retrieves all dynamic system settings.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settingsList = await prisma.systemSetting.findMany();
    const settings: Record<string, string> = {};
    settingsList.forEach((s) => {
      settings[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("GET /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching system settings." },
      { status: 500 }
    );
  }
}

/**
 * 2. PATCH /api/admin/settings
 * Modifies or creates a system setting (e.g. AUTO_ASSIGN_LEADS).
 * Strictly restricted to SUPER_ADMIN.
 */
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to modify system settings." },
        { status: 403 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed JSON payload." }, { status: 400 });
    }

    const validation = SystemSettingUpdateSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid setting parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { key, value } = validation.data;

    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });

    // Write audit record
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.userId,
          actorName: user.name,
          action: "SYSTEM_SETTING_UPDATED",
          details: `Updated system setting [${key}] to "${value}"`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for setting update:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "System setting updated successfully.",
      setting,
    });
  } catch (error) {
    console.error("PATCH /api/admin/settings error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating system setting." },
      { status: 500 }
    );
  }
}
