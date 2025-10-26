import { NextResponse } from "next/server";

export async function GET(){
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const res = NextResponse.redirect(baseUrl);
    res.cookies.set("session","",{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        path:"/",
        expires: new Date(0) // expire immediately
    });
    return res;
}