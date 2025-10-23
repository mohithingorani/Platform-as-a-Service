import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = request.cookies.get("session");
    return NextResponse.json({ authenticated: !!session });
}
