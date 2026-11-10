import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { AuthLoginSchema } from "@/lib/validations";
import { authLoginRateLimiter } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  try {
    // Ensure DB is initialized (fail-safe)
    try {
      await seedDatabaseIfNeeded();
    } catch (seedErr) {
      console.warn("Seed check notice during login:", seedErr);
    }

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Enterprise Bounded Rate Limiting: max 5 failed attempts per 5 minutes per IP (Pillar 5)
    let rawJson: unknown;
    try {
      rawJson = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload." },
        { status: 400 }
      );
    }

    // Strict Zod Contract Validation (Pillar 2: AuthLoginSchema)
    const validationResult = AuthLoginSchema.safeParse(rawJson);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid credentials provided.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { email, password } = validationResult.data;
    const cleanEmail = email.toLowerCase();

    // Standardized generic error to eliminate account enumeration (Pillar 4 / OWASP A07)
    const genericAuthError = "Invalid email or password.";

    const rawDbUrl = process.env.DATABASE_URL;
    if (!rawDbUrl || rawDbUrl.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          error: "DATABASE_URL environment variable is missing. Please configure DATABASE_URL in your deployment environment variables.",
        },
        { status: 500 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      const rateCheck = authLoginRateLimiter.recordFailure(clientIp);
      if (rateCheck.blocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed authentication attempts. Account temporarily locked for ${rateCheck.retryAfterSeconds} seconds.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ success: false, error: genericAuthError }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      const rateCheck = authLoginRateLimiter.recordFailure(clientIp);
      if (rateCheck.blocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed authentication attempts. Account temporarily locked for ${rateCheck.retryAfterSeconds} seconds.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ success: false, error: genericAuthError }, { status: 401 });
    }

    // Clear failed attempts upon successful authentication
    authLoginRateLimiter.reset(clientIp);

    // Create secure 8-hour JWT session token
    const token = await createSessionToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role as UserRole,
    });

    // Record login in audit log asynchronously (non-blocking)
    try {
      await prisma.activityLog.create({
        data: {
          userId: user.id,
          actorName: user.name,
          action: "STAFF_LOGIN",
          details: `Staff member authenticated successfully from IP ${clientIp}`,
          ipAddress: clientIp,
        },
      });
    } catch (auditErr) {
      console.error("Non-fatal: Failed to write audit log entry for staff login:", auditErr);
    }

    // Return response with HTTP-only, SameSite=Strict, Secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 8 * 60 * 60, // 8 hours in seconds
    });

    return response;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Critical unhandled error in POST /api/auth/login:", error);
    return NextResponse.json(
      {
        success: false,
        error: `Authentication error: ${errorMsg}`,
      },
      { status: 500 }
    );
  }
}
