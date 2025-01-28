// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   const accessToken = req.cookies.get("google_access_token")?.value;
//   const refreshToken = req.cookies.get("google_refresh_token")?.value;
//   const tokenExpiry = req.cookies.get("google_token_expiry")?.value;
//   const isAuthenticated = accessToken && refreshToken && tokenExpiry;

//   if (req.nextUrl.pathname === "/login" && isAuthenticated) {
//     return NextResponse.redirect(new URL("/app", req.url));
//   }

//   if (!isAuthenticated) return NextResponse.redirect(new URL("/login", req.url));

//   return NextResponse.next();
// }

// export const config = {
//   matcher: [
//     "/app/:path*",
//     "/api/((?!auth).*)",
//     "/((?!_next/static|_next/image|favicon.ico|api/auth|terms|privacy|about|contact|public).*)",
//     "/login",
//   ],
// };

import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const protectedPaths = ["/app"];
  const isProtected = protectedPaths.some((path) => nextUrl.pathname.startsWith(path));

  if (isProtected && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  if (nextUrl.pathname === "/login" && isLoggedIn) {
    return NextResponse.redirect(new URL("/app", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
