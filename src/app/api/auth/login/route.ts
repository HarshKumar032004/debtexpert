import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";
import { seedDatabaseIfNeeded } from "@/lib/seed";

export async function POST(request: Request) {
  try {
    // Ensure DB is initialized
    await seedDatabaseIfNeeded();

    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const cleanEmail = String(email).trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials or inactive account." },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials. Please verify your password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    });

    // Log login activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        actorName: user.name,
        action: "USER_LOGIN",
        details: `Successful login as ${user.role} from admin portal.`,
      },
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Authentication successful.",
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}
