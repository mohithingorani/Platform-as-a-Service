import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");
    const tokenCookie = cookieStore.get("auth_token");

    if (sessionCookie?.value) {
      const session = JSON.parse(sessionCookie.value);
      return NextResponse.json({ authenticated: true, user: session });
    }

    if (tokenCookie?.value) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${tokenCookie.value}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return NextResponse.json({ authenticated: true, user: data.user });
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch (error) {
    return NextResponse.json({ authenticated: false });
  }
}
