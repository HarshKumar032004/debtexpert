import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { env } from "@/lib/env";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);

export const AUTH_COOKIE_NAME = "dse_admin_token";

export type UserRole = "SUPER_ADMIN" | "LEGAL_ADVISOR" | "SUPPORT_AGENT";

export interface SessionPayload {
  userId: string;
  email: string;
  name: string;
  role: UserRole;
  [key: string]: unknown;
}

/**
 * Hashes a plaintext password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compares plaintext password against a stored bcrypt hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Creates a signed JWT session token strictly valid for 8 hours (Pillar 4)
 */
export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secretKey);
}

/**
 * Verifies a JWT session token and returns the decoded payload
 */
export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secretKey);
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Server-side helper to read the authenticated session in Next.js Server Components / Route Handlers
 */
export async function getCurrentUser(req?: Request): Promise<SessionPayload | null> {
  if (req) {
    try {
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]*)`));
      if (match && match[1]) {
        const payload = await verifySessionToken(decodeURIComponent(match[1]));
        if (payload) return payload;
      }
    } catch {
      // fallback to cookieStore
    }
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;
    return verifySessionToken(token);
  } catch {
    return null;
  }
}

/**
 * Role-based permission hierarchy check
 * SUPER_ADMIN has access to all roles
 * LEGAL_ADVISOR has access to advisor and support agent functions
 * SUPPORT_AGENT has base access
 */
export function hasRequiredRole(userRole: string, allowedRoles: UserRole[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return allowedRoles.includes(userRole as UserRole);
}
