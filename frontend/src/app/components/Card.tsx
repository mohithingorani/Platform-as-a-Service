"use client";

import { useState } from "react";
import axios from "axios";
import { z } from "zod";
import DeployedCard from "./DeploymentCard";
import LogsCard from "./LogsCard";

const githubUrlSchema = z
  .string()
  .url()
  .regex(
    /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
    "Must be a valid GitHub repository URL"
  );

export default function Card() {
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
    <div className="flex max-w-md flex-col gap-4">
      <div className=" w-full mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md transition-colors duration-300">
        <h5 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100">
          Deploy your GitHub Repository
        </h5>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Enter the URL of your GitHub repository to deploy it.
        </p>

        <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
          GitHub Repository URL
        </label>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://github.com/username/repo"
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-colors"
        />
        {error && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        <button
          onClick={deploy}
          className={`mt-6 w-full px-4 py-2 bg-black text-white rounded-lg ${
            !loading &&
            "hover:bg-gray-900 dark:hover:text-black dark:hover:bg-gray-100"
          }   transition-colors duration-200 ${
            loading && "cursor-not-allowed opacity-50 "
          }`}
        >
          {loading ? "Deploying" : "Deploy"}
        </button>
      </div>
      <div>{deployedUrl && <DeployedCard URL={deployedUrl} />}</div>
      {id &&<LogsCard id={"test123"}/>}

    </div>
  );
}
