"use client";

import { useState } from "react";
import axios from "axios";
import { z } from "zod";

const githubUrlSchema = z.string().url().regex(
  /^https:\/\/github\.com\/[^\/]+\/[^\/]+$/,
  "Must be a valid GitHub repository URL"
);

export default function Card() {
  const [url, setUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  async function deploy() {
    const result = githubUrlSchema.safeParse(url);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setError(null);

    try {
      const deployRepo = await axios.post(`${process.env.NEXT_PUBLIC_UPLOAD_URL}`, {
        repoUrl: url,
      });
      console.log(deployRepo);
    } catch (err) {
      console.error("Deployment failed", err);
      setError("Failed to deploy repository.");
    }
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md transition-colors duration-300">
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
        <p className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      <button
        onClick={deploy}
        className="mt-6 w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-200"
      >
        Deploy
      </button>
    </div>
  );
}
