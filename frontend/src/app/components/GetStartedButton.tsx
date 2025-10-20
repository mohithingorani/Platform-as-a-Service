"use client";

import { useRouter } from "next/navigation";

export default function GetStartedButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => {
        router.push("/signup");
      }}
      className=" px-2 md:px-4 text-xs md:text-sm w-fit hover:bg-white hover:text-black transition duration-300  outline-none py-2  bg-white bg-opacity-10 border rounded-xl border-white border-opacity-30"
    >
      Get Started
    </button>
  );
}
