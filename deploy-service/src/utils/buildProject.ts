import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { publisher } from "..";
import { copyFinalDist } from "./aws";

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}

export async function buildProject(id: string) {
  const projectPath = path.join(__dirname, "../output", id);

  if (!fs.existsSync(projectPath)) {
    throw new Error(`Project directory not found: ${projectPath}`);
  }

  const packageJsonPath = path.join(projectPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log("Available files:", fs.readdirSync(projectPath));
    throw new Error(`package.json not found in project: ${projectPath}`);
  }

  console.log("Starting build for project:", projectPath);

  // Step 1: npm install
  await new Promise<void>((resolve, reject) => {
    const install = spawn("npm", ["install", "--force"], { cwd: projectPath, shell: true });

    install.stdout.on("data", async (data) => {
      const log = `[INSTALL] ${data.toString()}`;
      console.log(log);
      await publishToRedis(id, log);
    });

    install.stderr.on("data", async (data) => {
      const log = `[INSTALL ERROR] ${data.toString()}`;
      console.error(log);
      await publishToRedis(id, log);
    });

    install.on("close", (code) => {
      if (code !== 0) return reject(new Error(`npm install failed with code ${code}`));
      resolve();
    });

    install.on("error", (err) => reject(err));
  });

  // Step 2: Run Vite build using local node_modules
  const viteBinary = path.join(projectPath, "node_modules", ".bin", "vite");
  if (!fs.existsSync(viteBinary)) {
    throw new Error(`Vite binary not found at ${viteBinary}. Did npm install fail?`);
  }

  await new Promise<void>((resolve, reject) => {
    const build = spawn(viteBinary, ["build"], { cwd: projectPath, shell: true });

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

    build.on("close", (code) => {
      if (code !== 0) return reject(new Error(`Build failed with code ${code}`));
      resolve();
    });

    build.on("error", (err) => reject(err));
  });

  // Step 3: Verify dist folder exists
  const distPath = path.join(projectPath, "dist");
  if (!fs.existsSync(distPath)) {
    console.log("Available files after build:", fs.readdirSync(projectPath));
    throw new Error(`Dist folder not found at: ${distPath}. Build likely failed.`);
  }

  // Step 4: Upload dist to S3
  await copyFinalDist(id);
  console.log(`Build and upload complete for project ${id}`);
}
