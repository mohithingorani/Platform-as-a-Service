import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="h-screen bg-[url('/background-auth.webp')] bg-cover w-full flex justify-center items-center">
      <div className="fixed top-8 left-8 text-gray-400 hover:text-gray-200">
        <Link href={"/home"}>
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
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="1.5"
              ></path>
            </svg>
            <div className="text-sm">Home</div>
          </div>
        </Link>
      </div>
      
      <div className="flex flex-col gap-1 justify-center items-center ">
      <div className="bg-black px-2 rounded mb-4 ">

      <Image src={"/voltex-logo.svg"} width={"30"} height={"30"} alt="logo"/>
      </div>
        <h1 className=" text-3xl">Create a Vortex Account</h1>
        <div className="flex mb-4 ">
          <div className="text-gray-500 mr-2">Already have an account?</div>
          <button>Login.</button>
        </div>
        <div className="flex gap-4">
          <SignInButton name="Google" image="/google.svg" />
          <SignInButton name="Github" image="/github.svg" />
        </div>
        <div></div>
        <div className="w-full flex justify-center items-center gap-2 my-4 ">
          <hr className="border-0.5  border-gray-600 opacity-50 w-full" />
          <div className="text-gray-400">or</div>
          <hr className="border-0.5  border-gray-600 opacity-50 w-full" />
        </div>
        <div className="w-full text-sm">Email</div>
        <input
          type="text"
          className="px-4 mb-2 text-sm outline-none py-2 w-full  bg-white bg-opacity-10 border rounded-xl border-white border-opacity-30"
        />

        <div className="w-full text-sm">Password</div>
        <input
          type="password"
          className="px-4 mb-4 outline-none text-sm py-2 w-full bg-white bg-opacity-10 border rounded-xl border-white border-opacity-30"
        />

        <button className=" px-4 mt-4 opacity-30 hover:opacity-100 hover:bg-white hover:text-black transition duration-300  outline-none py-2 w-full bg-white bg-opacity-10 border rounded-xl border-white border-opacity-30">
          Create Account
        </button>
      </div>
    </div>
  );
}

function SignInButton({ image, name }: { image: string; name: string }) {
  return (
    <button className="flex group backdrop-filter backdrop-blur-sm bg-opacity-20 border border-gray-100
 gap-3 px-6 py-3 bg-white hover:bg-opacity-100 transition duration-300  rounded-xl  border-opacity-30">
      <Image
        className="group-hover:invert transition duration-300"
        src={image}
        width={"20"}
        height={"20"}
        alt="asdf"
      />
      <div className="group-hover:text-black transition duration-300">
        Login with {name}
      </div>
    </button>
  );
}
