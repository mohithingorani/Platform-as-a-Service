"use client";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function HomeNavBar({
  username,
  picture,
  name,
}: {
  username: string;
  picture: string;
  name: string;
}) {
  const router = useRouter();

  async function logout() {
    try {
      await axios.get("/api/auth/logout");
      router.push("/");
      console.log("logged out");
    } catch (error) {
      console.log(error);
    }
  }
  const options = [
    { name: "Deployments", onClick: () => {} },
    { name: "Help", onClick: () => {} },
    { name: "About", onClick: () => {} },
    {
      name: "Logout",
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <div className="text-white fixed top-0 w-full">
      <div className="flex justify-between p-6 items-center">
        <div className="md:flex-1">
          <div className="flex justify-start   items-center">
            <button className={"cursor-pointer mr-3 md:mr-6 relative group"}>
              <Image
                className="rounded-full w-full h-full "
                src={picture}
                width={"40"}
                height={"40"}
                alt="profile picture"
              />

              <div className="absolute     w-full mt-3 hidden group-hover:block ">
                  {/* <div className="w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-red-500 "></div> */}

                  <div className=" bg-white text-black px-2 py-1 rounded-md w-fit">{username}</div>
              </div>
            </button>
            <div>{name}</div>
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
                <button
                  onClick={option.onClick}
                  className="opacity-50 hover:opacity-90"
                  key={index}
                >
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
