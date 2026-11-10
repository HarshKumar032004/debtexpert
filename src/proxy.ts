import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecretKey(): Uint8Array | null {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) return null;
  return new TextEncoder().encode(secret);
}

const AUTH_COOKIE_NAME = "dse_admin_token";

export async function proxy(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;
    const secretKey = getSecretKey();

    // 1. Allow login page unconditionally
    if (pathname === "/admin/login") {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
      if (token && secretKey) {
        try {
          await jwtVerify(token, secretKey);
          // Already authenticated, redirect to CRM overview
          return NextResponse.redirect(new URL("/admin", request.url));
        } catch {
          // Invalid or expired token, allow login
        }
      }
      return NextResponse.next();
    }

    // 2. Protect all other /admin routes and /api/admin routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
      const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

      if (!token || !secretKey) {
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { success: false, error: "Authentication required." },
            { status: 401 }
          );
        }
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("from", pathname);
        return NextResponse.redirect(loginUrl);
      }

      try {
        const { payload } = await jwtVerify(token, secretKey);
        // Valid session, pass user info in request headers for downstream server components
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", String(payload.userId || ""));
        requestHeaders.set("x-user-role", String(payload.role || ""));
        requestHeaders.set("x-user-email", String(payload.email || ""));

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch {
        // Invalid / expired token
        if (pathname.startsWith("/api/admin")) {
          return NextResponse.json(
            { success: false, error: "Session expired or invalid token." },
            { status: 401 }
          );
        }
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("error", "session_expired");
        const res = NextResponse.redirect(loginUrl);
        res.cookies.delete(AUTH_COOKIE_NAME);
        return res;
      }
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Critical error in proxy/middleware:", err);
    // Graceful fallback: Redirect to login rather than crashing with 500
    if (request.nextUrl.pathname.startsWith("/admin") && request.nextUrl.pathname !== "/admin/login") {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
