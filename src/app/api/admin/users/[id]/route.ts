import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { UpdateUserSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/users/[id]
 * Updates a staff member's RBAC role or suspends/reactivates account access.
 * Strictly restricted to SUPER_ADMIN.
 */
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to modify staff permissions." },
        { status: 403 }
      );
    }

    const { id: targetUserId } = await params;
    if (!targetUserId) {
      return NextResponse.json(
        { success: false, error: "User ID parameter is required." },
        { status: 400 }
      );
    }

    // Verify target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, error: "Staff member not found." },
        { status: 404 }
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

    const validation = UpdateUserSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid update payload.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { role, isActive } = validation.data;

    // Self-Protection Guards for the operating Super Administrator
    if (currentUser.userId === targetUserId) {
      if (isActive === false) {
        return NextResponse.json(
          { success: false, error: "Self-revocation blocked: You cannot suspend your own active administrator account." },
          { status: 400 }
        );
      }
      if (role && role !== "SUPER_ADMIN") {
        return NextResponse.json(
          { success: false, error: "Self-demotion blocked: You cannot demote your own Super Administrator role." },
          { status: 400 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: {
        ...(role !== undefined ? { role } : {}),
        ...(isActive !== undefined ? { isActive } : {}),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            leadsAssigned: true,
          },
        },
      },
    });

    // Write audit record
    try {
      await prisma.activityLog.create({
        data: {
          userId: currentUser.userId,
          actorName: currentUser.name,
          action: "STAFF_UPDATED",
          details: `Modified staff account ${updatedUser.name} (${updatedUser.email}): role=${updatedUser.role}, isActive=${updatedUser.isActive}`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for staff update:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Staff member permissions updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("PATCH /api/admin/users/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating staff permissions." },
      { status: 500 }
    );
  }
}
