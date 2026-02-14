import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_SESSION_TOKEN = process.env.ADMIN_SESSION_TOKEN ?? "";
const COOKIE_NAME = "admin_session";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (!path.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (path === "/admin/login") {
    const cookie = request.cookies.get(COOKIE_NAME)?.value;
    if (ADMIN_SESSION_TOKEN && cookie === ADMIN_SESSION_TOKEN) {
      return NextResponse.redirect(new URL("/admin/providers", request.url));
    }
    return NextResponse.next();
  }
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!ADMIN_SESSION_TOKEN || cookie !== ADMIN_SESSION_TOKEN) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
