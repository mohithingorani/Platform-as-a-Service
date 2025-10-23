import { NextResponse } from "next/server";

export async function GET(){
    const params = new URLSearchParams({
        client_id:process.env.GITHUB_CLIENT_ID!,
        redirect_uri:`${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback`,
        scope:"read:user user:email"
    });
    return NextResponse.redirect(`https://github.com/login/oauth/authorize?${params.toString()}`);
}