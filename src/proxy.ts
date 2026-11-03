import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { env } from "@/lib/env";

const secretKey = new TextEncoder().encode(env.JWT_SECRET);
const AUTH_COOKIE_NAME = "dse_admin_token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow login page unconditionally
  if (pathname === "/admin/login") {
    const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
    if (token) {
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

    if (!token) {
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
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
