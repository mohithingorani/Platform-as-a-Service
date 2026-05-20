import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) {
  return NextResponse.json({ error: "Missing Code" }, { status: 400 });
}


  // Exchanging code for token
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  const accessToken = tokenData.access_token;

  // GET USER INFO
  const userRes = await fetch("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const user = await userRes.json();

  // Try to fetch the user's primary email (requires `user:email` scope).
  let email: string | undefined;
  try {
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (emailRes.ok) {
      const emails = (await emailRes.json()) as Array<{
        email: string;
        primary?: boolean;
        verified?: boolean;
      }>;
      email =
        emails.find((e) => e.primary && e.verified)?.email ||
        emails.find((e) => e.primary)?.email ||
        emails.find((e) => e.verified)?.email ||
        emails[0]?.email;
    }
  } catch {
    // ignore
  }
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
      name: user.name,
      username: user.login,
      profilePicture: user.avatar_url,
    });
  } catch (err) {
    console.log(err);
  }
  
  console.log(user);
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;

  // CREATE SESSION COOKIE
  const res = NextResponse.redirect(`${baseUrl}/home`);
  res.cookies.set(
    "session",
    encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        username: user.login,
        picture: user.avatar_url,
        email,
        authProvider: "oauth",
      })
    ),
    {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    }
  );
  return res;
}
