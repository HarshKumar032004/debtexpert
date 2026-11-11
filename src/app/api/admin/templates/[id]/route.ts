import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateWhatsAppTemplateSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * 1. PATCH /api/admin/templates/[id]
 * Modifies an existing WhatsApp quick-reply template or toggles isActive.
 * Strictly restricted to SUPER_ADMIN.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to modify templates." },
        { status: 403 }
      );
    }

    const { id: templateId } = await params;
    if (!templateId) {
      return NextResponse.json({ success: false, error: "Template ID is required." }, { status: 400 });
    }

    const existing = await prisma.whatsAppTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Template not found." }, { status: 404 });
    }

    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json({ success: false, error: "Malformed JSON payload." }, { status: 400 });
    }

    const validation = UpdateWhatsAppTemplateSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid update parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { title, content, isActive } = validation.data;

    const updated = await prisma.whatsAppTemplate.update({
      where: { id: templateId },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(content !== undefined ? { content } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
    });

    // Write audit log
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.userId,
          actorName: user.name,
          action: "TEMPLATE_UPDATED",
          details: `Updated template "${updated.title}": active=${updated.isActive}`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for template update:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Template updated successfully.",
      template: updated,
    });
  } catch (error) {
    console.error("PATCH /api/admin/templates/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating template." },
      { status: 500 }
    );
  }
}

/**
 * 2. DELETE /api/admin/templates/[id]
 * Deletes a WhatsApp quick-reply template.
 * Strictly restricted to SUPER_ADMIN.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to delete templates." },
        { status: 403 }
      );
    }

    const { id: templateId } = await params;
    if (!templateId) {
      return NextResponse.json({ success: false, error: "Template ID is required." }, { status: 400 });
    }

    const existing = await prisma.whatsAppTemplate.findUnique({
      where: { id: templateId },
    });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Template not found." }, { status: 404 });
    }

    await prisma.whatsAppTemplate.delete({
      where: { id: templateId },
    });

    // Write audit log
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.userId,
          actorName: user.name,
          action: "TEMPLATE_DELETED",
          details: `Deleted template "${existing.title}"`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for template deletion:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/admin/templates/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error deleting template." },
      { status: 500 }
    );
  }
}
