import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const tokenCookie = cookieStore.get("auth_token");

    // OAuth users: a JSON session cookie. Parse defensively — a malformed or
    // stale cookie must not 500 (it used to, which triggered a retry storm).
    if (sessionCookie?.value) {
      try {
        const user = JSON.parse(sessionCookie.value);
        return NextResponse.json(user);
      } catch {
        // Fall through to the token path / 401 below instead of throwing.
      }
    }

    // Email/password users: a JWT in auth_token, verified by the user-backend.
    if (tokenCookie?.value) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${tokenCookie.value}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data.user ?? data);
      }
    }

    return NextResponse.json({ error: "Not Logged In" }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Not Logged In" }, { status: 401 });
  }
}
