import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { publisher } from "..";

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}

export function buildInDocker(id: string) {
  const containerPath = path.join(__dirname, "../output", id);
  console.log("Building project at:", containerPath);
  console.log("Files in directory:", fs.readdirSync(containerPath));

  // Verify project directory exists
  if (!fs.existsSync(containerPath)) {
    throw new Error(`Project directory not found: ${containerPath}`);
  }

  const packageJsonPath = path.join(containerPath, "package.json");
  if (!fs.existsSync(packageJsonPath)) {
    console.log("Available files:", fs.readdirSync(containerPath));
    throw new Error(`package.json not found in project: ${containerPath}`);
  }

  console.log("Building project:", containerPath);
  console.log("Files:", fs.readdirSync(containerPath));

  return new Promise((resolve, reject) => {
    const absPath = path.resolve(containerPath);

    const docker = spawn("docker", [
      "run",
      "--rm",
      "-v",
      `${absPath}:/app`,
      "-w",
      "/app",
      "node:22",
      "sh",
      "-c",
      "npm install && npm run build",
    ]);
    docker.stdout.on("data", (data) => {
      const log = `[BUILD] ${data.toString()}`;
      console.log(log);
      publishToRedis(id, log);
    });

    docker.stderr.on("data", (data) => {
      const log = `[ERROR] ${data.toString()}`;
      console.error(log);
      publishToRedis(id, log);
    });

    docker.on("close", (code) => {
      console.log(`Docker exited with code ${code}`);
      if (code !== 0)
        reject(new Error(`Docker build failed with code ${code}`));
      else resolve("");
    });

    docker.on("error", (error) => {
      const log = `[DOCKER ERROR] ${error.message}`;
      console.error(log);
      publishToRedis(id, log);
      reject(error);
    });
  });
}
