import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return (
      NextResponse.json({
        error: "Missing Code",
      },
      { status: 400 })
    );
  }

  // EXCHANGE CODE FOR TOKEN
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      grant_type: "authorization_code",
      code,
    }),
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    console.error("Failed to get google access token");
    return (
      NextResponse.json({
        error: "Failed to get access token",
      },
      { status: 400 })
    );
  }
  const accessToken = tokenData.access_token;

  // Get user info from google
  const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const user = await userRes.json();
try{

  await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
    username: user.email,
    name: user.name,
    profilePicture: user.picture,
  });
}catch(err){
  console.log(err);
  
}

  // 3️⃣ Create session cookie
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  const res = NextResponse.redirect(`${baseUrl}/home`);

  res.cookies.set(
    "session",
    JSON.stringify({
      id: user.id,
      name: user.name,
      username: user.email,
      picture: user.picture,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
    }
  );

  return res;
}
