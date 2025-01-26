import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const accessToken = req.cookies.get("google_access_token")?.value;
  const refreshToken = req.cookies.get("google_refresh_token")?.value;
  const tokenExpiry = req.cookies.get("google_token_expiry")?.value;
  const isAuthenticated = accessToken && refreshToken && tokenExpiry;

  if (req.nextUrl.pathname === "/login" && isAuthenticated) {
    return NextResponse.redirect(new URL("/app", req.url));
  }

  if (!isAuthenticated) return NextResponse.redirect(new URL("/login", req.url));

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/app/:path*",
    "/api/((?!auth).*)",
    "/((?!_next/static|_next/image|favicon.ico|api/auth|terms|privacy|about|contact|public).*)",
    "/login",
  ],
};
