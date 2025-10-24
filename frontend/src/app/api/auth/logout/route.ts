import { NextResponse } from "next/server";

export async function GET(){
    const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/`);
    res.cookies.set("session","",{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        path:"/",
        expires: new Date(0) // expire immediately
    });
    return res;
}