import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  console.log("Request URL:", request.url);

  const session = request.cookies.get("session");

  if (!session) {
    return NextResponse.redirect(new URL("/signup", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/home/:path*"],
};
