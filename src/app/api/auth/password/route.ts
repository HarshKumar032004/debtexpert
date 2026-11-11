import { NextResponse } from "next/server";
import { getCurrentUser, verifyPassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ChangePasswordSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * PATCH /api/auth/password
 * Self-service password modification endpoint.
 * Allows any authenticated user to update their own credentials after validating current password.
 */
export async function PATCH(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Please log in to update your password." },
        { status: 401 }
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

    const validation = ChangePasswordSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid password parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { currentPassword, newPassword } = validation.data;

    // Fetch user with existing passwordHash
    const dbUser = await prisma.user.findUnique({
      where: { id: currentUser.userId },
    });

    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User account could not be located in database." },
        { status: 404 }
      );
    }

    // Verify current password against stored bcrypt hash
    const isCurrentValid = await verifyPassword(currentPassword, dbUser.passwordHash);
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: "Incorrect current password." },
        { status: 400 }
      );
    }

    // Ensure new password is not identical to current
    const isSamePassword = await verifyPassword(newPassword, dbUser.passwordHash);
    if (isSamePassword) {
      return NextResponse.json(
        { success: false, error: "New password must be different from your current password." },
        { status: 400 }
      );
    }

    // Hash new password using bcryptjs (salt rounds: 10)
    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: currentUser.userId },
      data: {
        passwordHash: newPasswordHash,
      },
    });

    // Write audit record
    try {
      await prisma.activityLog.create({
        data: {
          userId: currentUser.userId,
          actorName: currentUser.name,
          action: "PASSWORD_CHANGED",
          details: `User credentials successfully modified for ${dbUser.email}`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for password update:", auditErr);
    }

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("PATCH /api/auth/password error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating password." },
      { status: 500 }
    );
  }
}
