import { exec } from "child_process";
import path from "path";
import fs from "fs";
import { publisher } from "..";

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}

export function buildProject(id: string) {
  return new Promise((resolve, reject) => {
    const projectPath = path.join(__dirname, "../output", id);

    // Verify project directory exists
    if (!fs.existsSync(projectPath)) {
      return reject(new Error(`Project directory not found: ${projectPath}`));
    }

    // Verify package.json exists
    const packageJsonPath = path.join(projectPath, "package.json");
    if (!fs.existsSync(packageJsonPath)) {
      console.log("Available files:", fs.readdirSync(projectPath));
      return reject(new Error(`package.json not found in project: ${projectPath}`));
    }

    console.log("Building project at:", projectPath);
    console.log("Files:", fs.readdirSync(projectPath));

    const child = exec(`cd ${projectPath} && npm install && npm run build`);

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
      console.log(`Build process exited with code ${code}`);
      resolve(""); // always resolve even if code != 0, or reject if you prefer
    });

    child.on("error", (err) => {
      console.error("Exec error:", err);
      publishToRedis(id, `[ERROR] ${err.message}`);
      reject(err);
    });
  });
}
