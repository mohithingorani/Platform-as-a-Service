"use client"
import { useRouter } from "next/navigation";
export default function HomeButton() {
    const router = useRouter();
  return (
    <button onClick={()=>{router.push("/")}}>
      <div className="flex items-center">
        <svg
          fill="none"
          height="24"
          viewBox="0 0 24 24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.25 8.75L9.75 12L13.25 15.25"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          ></path>
        </svg>
        <div className="text-sm">Home</div>
      </div>
    </button>
  );
}
