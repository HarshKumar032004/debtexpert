import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { WhatsAppTemplateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * 1. GET /api/admin/templates
 * Fetches all WhatsApp quick-reply templates.
 * Supports ?activeOnly=true for counsel chat view.
 */
export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("activeOnly") === "true";

    const where = activeOnly ? { isActive: true } : {};

    const templates = await prisma.whatsAppTemplate.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      templates,
    });
  } catch (error) {
    console.error("GET /api/admin/templates error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching templates." },
      { status: 500 }
    );
  }
}

/**
 * 2. POST /api/admin/templates
 * Creates a new WhatsApp quick-reply template.
 * Strictly restricted to SUPER_ADMIN.
 */
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to create templates." },
        { status: 403 }
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

    const validation = WhatsAppTemplateSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid template parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { title, content, isActive } = validation.data;

    const newTemplate = await prisma.whatsAppTemplate.create({
      data: {
        title,
        content,
        isActive: isActive !== undefined ? isActive : true,
      },
    });

    // Write audit log
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.userId,
          actorName: user.name,
          action: "TEMPLATE_CREATED",
          details: `Created WhatsApp quick-reply template: "${newTemplate.title}"`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for template creation:", auditErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Template created successfully.",
        template: newTemplate,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/templates error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error creating template." },
      { status: 500 }
    );
  }
}
