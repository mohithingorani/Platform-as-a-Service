import { NextResponse } from "next/server"

export async function GET(request: Request){
    const cookie = request.headers.get("cookie")
    const session = cookie?.match(/session=([^;]+)/)?.[1]
    if(!session) return NextResponse.json({error:"Not Logged In"},{status:401})
    
    const user = JSON.parse(decodeURIComponent(session))
    return NextResponse.json(user)
}