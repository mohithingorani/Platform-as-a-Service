"use client"
import {useRouter} from "next/navigation"

export default function LoginButton(){
   const router = useRouter();
   return <button onClick(()=>router.push("/login) className="opacity-50 text-xs md:text-sm hover:opacity-100">
                Login
            </button>
}
