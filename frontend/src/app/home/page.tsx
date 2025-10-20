import GetStartedButton from "../components/GetStartedButton";
import NavBar from "../components/NavBar"
import Terminal from "../components/Terminal";

export default function Home() {
  return (
    
    <div className="bg-black h-screen flex w-full text-white">
    <NavBar/>
      <div className="flex-1 w-full ">
        <div className="flex flex-col ml-24 justify-center items-start w-full h-full">
            <div className="font-domaine leading-[6rem] tracking-wider text-8xl">
              <div>Deploy your</div>
              <div className="bg-gradient-to-br from-white to-gray-500 via-gray-300 bg-clip-text text-transparent">
                Applications
              </div>
            </div>
            <div className="max-w-md text-gray-400 mt-4 text-xl leading-[1.8rem]">
                The best way to deploy at light speed. Deliver applications and softwares at scale.
            </div>
            <div className="mt-6">
             <GetStartedButton/>
            </div>
          </div>
      </div>
      <div className="flex-1 w-full">
        <div className="flex justify-center items-center h-screen">
        <Terminal/>
        </div>
      </div>
    </div>
  );
}
