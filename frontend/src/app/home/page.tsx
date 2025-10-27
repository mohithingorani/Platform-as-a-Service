"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import LogsCard from "../components/LogsCard";
import NavBar from "../components/NavBar";
import HomeNavBar from "../components/HomeNavBar";
import Link from "next/link";

const githubUrlSchema = z
  .string()
  .url()
  .regex(
    /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
    "Must be a valid GitHub repository URL"
  );

interface UserSessionData {
  id: string;
  name: string;
  username: string;
  picture: string;
}
export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deployedUrl, setDeployedUrl] = useState<string | null>(null);
  const [id, setId] = useState<string>();

  const [userData, setUserData] = useState<UserSessionData | null>(null);
  const [userInformation, setUserInformation] = useState<any>(null);
  useEffect(() => {
    async function getData() {
      const userdata = await axios.get("/api/me");
      setUserData(userdata.data);
    }
    getData();
  }, []);

  async function setUserInfo() {
    const userInfo = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/users?username=${userData?.username}`
    );
    setUserInformation(userInfo.data);
    console.log(userInfo);
  }

  async function deploy() {
    // validate
    const result = githubUrlSchema.safeParse(url);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);
    setLoading(true);
    setDeployedUrl("");

    try {
      const deployRepo = await axios.post(
        `${process.env.NEXT_PUBLIC_UPLOAD_URL}`,
        { repoUrl: url }
      );

      const deploymentId = deployRepo.data.id;
      setId(deploymentId);
      console.log("Created deployment id:", deploymentId);

      const intervalId = setInterval(async () => {
        try {
          const statusRes = await axios.get(
            `${process.env.NEXT_PUBLIC_STATUS_BACKEND}?id=${deploymentId}`
          );
          if (statusRes.data.status === "deployed") {
            clearInterval(intervalId);
            setLoading(false);
            setDeployedUrl(
              `http://${deploymentId}.deploy.mohit-hingorani.tech`
            );
          }
        } catch (err) {
          console.error("Polling error", err);
        }
      }, 1000);
    } catch (err) {
      console.error("Deployment failed", err);
      setError("Failed to deploy repository.");
      setLoading(false);
    }
  }
  return (
    <main className="flex justify-center items-center h-screen bg-black">
      {userData && (
        <HomeNavBar
          name={userData.name.split(" ")[0]}
          username={userData.username}
          picture={userData.picture}
        />
      )}
      <div className="flex flex-col  justify-center items-center mt-24 px-6 md:px-0">
        <div className="max-w-[150px] md:max-w-full">
          <video
            autoPlay
            loop
            playsInline
            height={"200"}
            poster="/3d-react-fallback.jpg"
            src="/3d-react.mp4"
            width={"200"}
          ></video>
        </div>
        <div className="text-2xl md:text-4xl text-center max-w-2xl">
          Build And Deploy <br />
          React Apps At One Click
        </div>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="w-full max-w-2xl px-4 py-2 border border-opacity-60 mt-4  border-gray-300 bg-black  rounded-lg focus:outline-none focus:ring-none  transition-colors"
        />
        <button
          onClick={deploy}
          className={`mt-6 max-w-2xl w-full px-4 py-2 opacity-60 bg-white text-black rounded-lg ${
            !loading && "  hover:opacity-100"
          }   transition-colors duration-200 ${
            loading && "cursor-not-allowed opacity-50 "
          }`}
        >
          {loading ? "Deploying" : "Deploy"}
        </button>
        <div className="my-8">{id && <LogsCard id={id} />}</div>
        {deployedUrl && (
          <div>
            <div>Link To Deployed URL : </div>
            <Link className="text-blue-600 underline cursor-pointer" href={deployedUrl} passHref>{deployedUrl}</Link>
          </div>
        )}
      </div>
    </main>
  );
}
