import { exec } from "child_process";
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
const child = exec(`cd ${projectPath} && npm install && npx vite build`);

    child.stdout?.on("data", async (data) => {
      const log = `[BUILD] ${data.toString()}`;
      console.log(log);
      await publishToRedis(id, log);
    });

    child.stderr?.on("data", async (data) => {
      const log = `[ERROR] ${data.toString()}`;
      console.error(log);
      await publishToRedis(id, log);
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(`Build failed with exit code ${code}.`));
      } else {
        console.log(`Build completed for project ${id}`);
        resolve();
      }
    });

    child.on("error", (err) => {
      console.error("Exec error:", err);
      publishToRedis(id, `[ERROR] ${err.message}`);
      reject(err);
    });
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
