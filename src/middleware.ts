import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow the login page itself, and the login/logout API routes, through.
  if (
    pathname === "/admin/login" ||
    pathname.startsWith("/api/auth/")
  ) {
    return NextResponse.next();
  }

  const isProtectedPage = pathname.startsWith("/admin");
  const isProtectedApi =
    pathname.startsWith("/api/") &&
    !pathname.startsWith("/api/contact") &&
    req.method !== "GET"; // public GET endpoints stay open for the public site; writes require auth

  // Public-facing GET API routes (used by the public pages) are intentionally left open.
  // Admin pages and any non-GET API mutation require a valid session.
  if (!isProtectedPage && !isProtectedApi) {
    return NextResponse.next();
  }

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    if (isProtectedApi) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const loginUrl = new URL("/admin/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
