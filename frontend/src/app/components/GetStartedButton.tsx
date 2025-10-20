"use client";

import { useRouter } from "next/navigation";

export default function GetStartedButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/signup");
      }}
      className=" px-4 hover:bg-white hover:text-black transition duration-300  outline-none py-2  bg-white bg-opacity-10 border rounded-xl border-white border-opacity-30"
    >
      Get Started
    </button>
  );
}
