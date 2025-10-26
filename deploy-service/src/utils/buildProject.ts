import { spawn } from "child_process";

import path from "path";
import fs from "fs";
import { publisher } from "..";
import { copyFinalDist } from "./aws"; // your existing S3 utils

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}

export async function buildProject(id: string) {
  const projectPath = path.join(__dirname, "../output", id);

  // Verify project directory exists
  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project directory not found: ${projectPath}`);
  }

  // Verify package.json exists
  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log("Available files:", fs.readdirSync(projectPath));
    throw new Error(`package.json not found in project: ${projectPath}`);
  }

  console.log("Starting build for project:", projectPath);

  await new Promise<void>((resolve, reject) => {
  const child = spawn("npm", ["install"], { cwd: projectPath, shell: true });

  child.stdout.on("data", async (data) => {
    const log = `[INSTALL] ${data.toString()}`;
    console.log(log);
    await publishToRedis(id, log);
  });

  child.stderr.on("data", async (data) => {
    const log = `[INSTALL ERROR] ${data.toString()}`;
    console.error(log);
    await publishToRedis(id, log);
  });

  child.on("close", (code) => {
    if (code !== 0) return reject(new Error(`npm install failed with code ${code}`));

    // After install, run build
    const build = spawn("npx", ["vite", "build"], { cwd: projectPath, shell: true });

    build.stdout.on("data", async (data) => {
      const log = `[BUILD] ${data.toString()}`;
      console.log(log);
      await publishToRedis(id, log);
    });

    build.stderr.on("data", async (data) => {
      const log = `[BUILD ERROR] ${data.toString()}`;
      console.error(log);
      await publishToRedis(id, log);
    });

    build.on("close", (buildCode) => {
      if (buildCode !== 0) return reject(new Error(`Build failed with code ${buildCode}`));
      resolve();
    });

    build.on("error", (err) => reject(err));
  });

  child.on("error", (err) => reject(err));
});
  // Verify that dist folder exists after build
  const distPath = path.join(projectPath, "dist");
  if (!fs.existsSync(distPath)) {
    console.log("Available files after build:", fs.readdirSync(projectPath));
    throw new Error(
      `Dist folder not found at: ${distPath}. Build likely failed.`
    );
  }

  // Copy the final build to S3
  await copyFinalDist(id);
  console.log(`Build and upload complete for project ${id}`);
}
