"use client";

import { useState } from "react";

export default function DeployedCard({ URL }: { URL: string }) {
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    navigator.clipboard.writeText(URL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="max-w-md w-full mx-auto p-6 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-2xl shadow-md transition-colors duration-300">
      <h5 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        Deployment Status
      </h5>

      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Your website has been successfully deployed 🚀
      </p>

      <label className="block mb-2 text-sm font-medium text-gray-800 dark:text-gray-200">
        Deployment URL
      </label>
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
        <span className="text-gray-900 dark:text-gray-100 break-all">{URL}</span>
        <button
          onClick={copyToClipboard}
          className="ml-4 px-3 py-1 text-sm bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      <a
        href={URL}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-100 dark:hover:text-black transition-colors duration-200"
      >
        Visit Website
      </a>
    </div>
  );
}
