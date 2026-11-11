import { NextResponse } from "next/server";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CreateUserSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

/**
 * 1. GET /api/admin/users
 * Returns list of all counsel and staff accounts with case allocation statistics.
 * Restricted to SUPER_ADMIN.
 */
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
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
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("GET /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error fetching staff roster." },
      { status: 500 }
    );
  }
}

/**
 * 2. POST /api/admin/users
 * Provisions a new counsel or staff account.
 * Strictly restricted to SUPER_ADMIN.
 */
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Super Administrator authority required to create staff accounts." },
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

    const validation = CreateUserSchema.safeParse(rawJson);
    if (!validation.success) {
      const firstError = validation.error.issues[0]?.message || "Invalid staff account parameters.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { name, email, password, role } = validation.data;

    // Check for email collision
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "A staff account with this email address already exists." },
        { status: 409 }
      );
    }

    // Hash password with bcryptjs (salt rounds: 10)
    const passwordHash = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        isActive: true,
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
          action: "STAFF_CREATED",
          details: `Provisioned staff account: ${newUser.name} (${newUser.email}) with role ${newUser.role}`,
        },
      });
    } catch (auditErr) {
      console.warn("Failed to write audit log for staff creation:", auditErr);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Staff account provisioned successfully.",
        user: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/admin/users error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error creating staff account." },
      { status: 500 }
    );
  }
}
