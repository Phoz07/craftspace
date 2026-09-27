import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login endpoint and login page without authentication
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login"
  ) {
    // If user already has a valid session and visits /admin/login, redirect to /admin
    if (pathname === "/admin/login") {
      const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
      if (sessionCookie && (await verifySessionToken(sessionCookie))) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
    }
    return NextResponse.next();
  }

  // Guard /admin and /api/admin
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = await verifySessionToken(sessionCookie);

    if (!isValid) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json(
          { success: false, error: "Unauthorized access" },
          { status: 401 }
        );
      }

      // Redirect browser to login
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
