"use client";
import Image from "next/image";

const options = [
  { name: "Deployments" },
  { name: "Help" },
  { name: "About" },
  { name: "Logout" },
];

export default function HomeNavBar({
  username,
  picture,
}: {
  username: string;
  picture: string;
}) {
  return (
    <div className="text-white fixed top-0 w-full">
      <div className="flex justify-between p-6 items-center">
        <div className="md:flex-1">
          <div className="flex justify-start   items-center">
            <Image
            className="rounded-full mr-3 md:mr-6"
              src={picture}
              width={"40"}
              height={"40"}
              alt="profile picture"
            />
            <div>{username}</div>
          </div>
        </div>
        <div className="md:flex-1 w-full">
          <div className="flex max-w-[800px] justify-end md:justify-center">
            <Image
              src={"/voltex-logo-complete.svg"}
              alt="logo"
              width={"80"}
              height={"40"}
            />
          </div>
        </div>
        <div className="md:flex-1 ">
          <div className="hidden md:flex justify-between items-center w-full ">
            {options.map((option, index) => {
              return (
                <button className="opacity-50 hover:opacity-90" key={index}>
                  {option.name}
                </button>
              );
            })}
          </div>
        </div>
        
      </div>
    </div>
  );
}
