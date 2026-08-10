import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE_NAME, isValidSessionToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isStudioPage = pathname.startsWith("/studio") && pathname !== "/studio/login";
  const isStudioApi = pathname.startsWith("/api/queue") || pathname.startsWith("/api/agent");

  if (!isStudioPage && !isStudioApi) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (await isValidSessionToken(token)) {
    return NextResponse.next();
  }

  if (isStudioApi) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const loginUrl = new URL("/studio/login", request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/studio/:path*", "/api/queue/:path*", "/api/agent/:path*"],
};
