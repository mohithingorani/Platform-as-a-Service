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
    const router = useRouter();
  return (
    <div className="text-white fixed top-0 w-full">
      <div className="flex justify-around pt-4 items-center">
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
        <div className="flex-1">
          <div className=" flex justify-around items-center w-full ">
            {options.map((option, index) => {
              return (
                <button className="opacity-50 hover:opacity-90" key={index}>
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex-1">
          <div className="flex justify-center gap-8  items-center">
            <button className="opacity-50 hover:opacity-100">
                Login
            </button>

            <GetStartedButton/>
          </div>
        </div>
      </div>
    </div>
  );
}
