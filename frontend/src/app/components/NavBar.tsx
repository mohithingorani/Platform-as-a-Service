"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import GetStartedButton from "./GetStartedButton";

const options = [
  { name: "Deployments" },
  { name: "Help" },
  { name: "About" },
  { name: "Contact" },
];

export default function NavBar() {
  return (
    <div className="text-white fixed top-0 w-full">
      <div className="flex justify-around p-4 items-center">
        <div className="flex-1">
<div className="flex justify-center">            
          <Image
            src={"/voltex-logo-complete.svg"}
            alt="logo"
            width={"80"}
            height={"40"}
          />
          </div>
        </div>
        <div className="flex-1 ">
          <div className="hidden md:flex justify-around items-center w-full ">
            {options.map((option, index) => {
              return (
                <button className="opacity-50 hover:opacity-90" key={index}>
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="md:flex-1">
          <div className="flex justify-center gap-2 md:gap-8  items-center">
            <button className="opacity-50 text-xs md:text-sm hover:opacity-100">
                Login
            </button>

            <GetStartedButton/>
          </div>
        </div>
      </div>
    </div>
  );
}
