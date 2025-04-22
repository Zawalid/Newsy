import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const isLoggedIn = sessionCookie !== null;
  const { nextUrl } = request;

  const protectedPaths = ["/app"];
  const isProtected = protectedPaths.some((path) =>
    nextUrl.pathname.startsWith(path),
  );

  if (isProtected && !isLoggedIn)
    return NextResponse.redirect(new URL("/signin", nextUrl));

  if (nextUrl.pathname === "/signin" && isLoggedIn)
    return NextResponse.redirect(new URL("/app", nextUrl));

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
