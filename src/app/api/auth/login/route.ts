import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { AuthLoginSchema } from "@/lib/validations";
import { authLoginRateLimiter } from "@/lib/rate-limiter";

export async function POST(request: Request) {
  try {
    // Ensure DB is initialized
    await seedDatabaseIfNeeded();

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

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (!user || !user.isActive) {
      const rateCheck = authLoginRateLimiter.recordFailure(clientIp);
      if (rateCheck.blocked) {
        return NextResponse.json(
          {
            success: false,
            error: `Too many failed login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before retrying.`,
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
            error: `Too many failed login attempts. Please wait ${rateCheck.retryAfterSeconds} seconds before retrying.`,
          },
          { status: 429 }
        );
      }
      return NextResponse.json({ success: false, error: genericAuthError }, { status: 401 });
    }

    // Successful authentication: clear rate limiter
    authLoginRateLimiter.reset(clientIp);

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
      maxAge: 8 * 60 * 60, // 8 hours (Pillar 4)
    });

    return response;
  } catch (error) {
    console.error("Login API Error:", error);
    const errorMsg =
      error instanceof Error && (error.message.includes("database") || error.message.includes("connect") || error.message.includes("table"))
        ? "Database connection issue: Please verify DATABASE_URL in Vercel and run 'npx prisma db push'."
        : "Internal server error during authentication.";
    return NextResponse.json(
      { success: false, error: errorMsg },
      { status: 500 }
    );
  }
}
