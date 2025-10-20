"use client";
import { useState } from "react";
import Card from "./components/Card";
import LogsCard from "./components/LogsCard";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
export default function Home() {
  return (
    <main className=" flex justify-center items-center min-h-screen w-full bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4">
      <div className="absolute top-4 right-4">
      <ThemeSwitcher />

      </div>

      <Card />
    </main>
  );
}
