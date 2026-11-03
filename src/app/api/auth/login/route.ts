import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSessionToken, AUTH_COOKIE_NAME, UserRole } from "@/lib/auth";
import { seedDatabaseIfNeeded } from "@/lib/seed";
import { LoginSubmissionSchema } from "@/lib/validations";

// IP Rate limiting: max 5 failed attempts per 5 minutes per IP (SEC-09)
const loginRateLimitMap = new Map<string, { attempts: number; blockedUntil: number }>();
const MAX_FAILED_ATTEMPTS = 5;
const BLOCK_DURATION_MS = 5 * 60 * 1000; // 5 minutes

function checkLoginRateLimit(ip: string): { allowed: boolean; remainingSeconds?: number } {
  const now = Date.now();

  // Prune expired entries
  if (loginRateLimitMap.size > 200) {
    for (const [key, val] of loginRateLimitMap.entries()) {
      if (now > val.blockedUntil) {
        loginRateLimitMap.delete(key);
      }
    }
  }

  const record = loginRateLimitMap.get(ip);
  if (!record) return { allowed: true };

  if (now > record.blockedUntil) {
    loginRateLimitMap.delete(ip);
    return { allowed: true };
  }

  if (record.attempts >= MAX_FAILED_ATTEMPTS) {
    const remainingSeconds = Math.ceil((record.blockedUntil - now) / 1000);
    return { allowed: false, remainingSeconds };
  }

  return { allowed: true };
}

function recordFailedLoginAttempt(ip: string) {
  const now = Date.now();
  const record = loginRateLimitMap.get(ip);

  if (!record || now > record.blockedUntil) {
    loginRateLimitMap.set(ip, { attempts: 1, blockedUntil: now + BLOCK_DURATION_MS });
  } else {
    record.attempts += 1;
    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + BLOCK_DURATION_MS;
    }
  }
}

function clearLoginAttempts(ip: string) {
  loginRateLimitMap.delete(ip);
}

export async function POST(request: Request) {
  try {
    // Ensure DB is initialized
    await seedDatabaseIfNeeded();

    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "127.0.0.1";

    // Check rate limit
    const rateLimit = checkLoginRateLimit(clientIp);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please wait ${rateLimit.remainingSeconds || 300} seconds before retrying.`,
        },
        { status: 429 }
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

    // Strict Zod validation (SEC-07)
    const validationResult = LoginSubmissionSchema.safeParse(rawJson);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]?.message || "Invalid credentials provided.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const { email, password } = validationResult.data;
    const cleanEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    // Standardized generic error to eliminate user enumeration (SEC-08)
    const genericAuthError = "Invalid email or password.";

    if (!user || !user.isActive) {
      recordFailedLoginAttempt(clientIp);
      return NextResponse.json(
        { success: false, error: genericAuthError },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      recordFailedLoginAttempt(clientIp);
      return NextResponse.json(
        { success: false, error: genericAuthError },
        { status: 401 }
      );
    }

    // Successful authentication: clear rate limiter
    clearLoginAttempts(clientIp);

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
