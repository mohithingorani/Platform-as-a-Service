"use client";
import { useEffect } from "react";
import GetStartedButton from "./components/GetStartedButton";
import NavBar from "./components/NavBar";
import Terminal from "./components/Terminal";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  useEffect(() => {
    async function isAuthenticated() {
      const res = await axios.get("/api/auth/authenticated");
      if (res.data.authenticated) {
        router.push("/home");
      }
    }
    isAuthenticated();
  }, []);

  return (
    <div className="bg-radial-gradient-dark h-screen flex flex-col md:flex-row w-full text-white ">
      <div className="z-50">
        <NavBar />
      </div>
      <div className="md:flex-1 w-full ">
        <div className="flex flex-col md:ml-24 justify-center items-start w-full h-full">
          <div className="font-domaine md:leading-[6rem] animate-fade-in-up md:tracking-wider ml-4 md:ml-0 mt-24 md:mt-0 text-4xl md:text-8xl">
            <div>Deploy your</div>
            <div className="bg-gradient-to-br from-white to-gray-500 via-gray-300 bg-clip-text text-transparent">
              Applications
            </div>
          </div>
          <div className="max-w-sm md:max-w-md text-gray-400 mt-4 ml-4 md:ml-0 text-sm md:text-xl leading-[1.8rem] animate-fade-in-up">
            The best way to deploy at light speed. Deliver applications and
            softwares at scale.
          </div>
          <div className="mt-6 hidden md:inline-block ml-4 md:ml-0 animate-fade-in-up">
            <GetStartedButton />
          </div>
        </div>
      </div>
      <div className="md:flex-1 w-full">
        <div className="md:flex md:justify-center mt-4 md:mt-0 md:items-center md:h-screen animate-fade-in-up">
          <Terminal />
        </div>
      </div>
    </div>
  );
}
