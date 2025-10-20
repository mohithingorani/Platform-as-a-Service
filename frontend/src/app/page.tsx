"use client";
import { useState } from "react";
import Card from "./components/Card";
import LogsCard from "./components/LogsCard";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import axios from "axios";
import { z } from "zod";

const githubUrlSchema = z
  .string()
  .url()
  .regex(
    /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
    "Must be a valid GitHub repository URL"
  );
export default function Home() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [deployedUrl, setDeployedUrl] = useState<string>("");
  const [id, setId] = useState<string>();

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
    <main className="flex justify-center items-center">
      {/* <div className="absolute top-4 right-4"> */}
      {/* <ThemeSwitcher /> */}

      {/* </div> */}

      {/* <Card /> */}
      <div className="flex flex-col  justify-center items-center mt-12">
        <video
          autoPlay
          loop
          playsInline
          height={"200"}
          poster="/3d-react-fallback.jpg"
          src="/3d-react.mp4"
          width={"200"}
        ></video>
        <div className="text-4xl text-center max-w-2xl">
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
      </div>
    </main>
  );
}
