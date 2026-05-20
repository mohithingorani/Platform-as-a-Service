import { exec, spawn, execSync } from "child_process";
import path from "path";
import { publisher } from "..";
import fs from "fs";
import os from "os";

// export function buildProject(id: string) {
//     return new Promise((resolve) => {
//         console.log("Path = ",path.join(__dirname, `output/${id}`));
//         const child = exec(`cd ${path.join(__dirname,'../', `output/${id}`)} && npm install && npm run build`)

//         child.stdout?.on('data', function(data) {
//             console.log('stdout: ' + data);
//         });
//         child.stderr?.on('data', function(data) {
//             console.log('stderr: ' + data);
//         });

//         child.on('close', function(code) {
//            resolve("")
//         });

//     })
// }

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
  await publisher.lPush(`logs:list:${id}`, log);
  await publisher.lTrim(`logs:list:${id}`, 0, 999);
}

function detectHostMountSource(destination: string): string | undefined {
  // deploy-service runs inside Docker, but it shells out to the *host* Docker daemon
  // (via /var/run/docker.sock). For `docker run -v <src>:<dst>`, <src> must be a host path.
  // Discover it by inspecting this container's mounts.
  try {
    const self = os.hostname();
    const raw = execSync(`docker inspect ${self}`, { encoding: "utf8" });
    const info = JSON.parse(raw)?.[0];
    const mounts: Array<{ Destination?: string; Source?: string }> = info?.Mounts || [];
    return mounts.find((m) => m.Destination === destination)?.Source;
  } catch {
    return undefined;
  }
}

// export function buildProject2(id: string) {
//   const dir = path.join(__dirname, `../`, `output/${id}`);
//   return new Promise((resolve) => {
//     const install = spawn("npm", ["install"], { cwd: dir });
//     install.stdout.on("data", (data) => {
//       const log = "[INSTALL] " + data.toString();
//       console.log(log);
//       publishToRedis(id, log);
//     });
//     install.stderr.on("data", (data) => {
//       const log = "[INSTALL] " + data.toString();
//       console.log(log);
//       publishToRedis(id, log);
//     });

//     install.on("close", (code) => {
//       const log = `[INSTALL] exited with code ${code}`;
//       console.log(log);
//       publishToRedis(id, log);

//       const build = spawn("npm", ["run", "build"], { cwd: dir });
//       build.stdout.on("data", (data) => {
//         const log = "[BUILD] " + data.toString();
//         publishToRedis(id, log);
//       });
//       build.stderr.on("data", (data) => {
//         const log = "[BUILD] " + data.toString();
//         console.log(log);
//         publishToRedis(id, log);
//       });

//       build.on("close", (code) => {
//         const log = "[BUILD] exited with code " + code;
//         console.log(log);
//         publishToRedis(id, log);
//         resolve("");
//       });
//     });
//   });
// }
export function buildInDocker(id: string) {
  const containerPath = path.join(__dirname, "../", `output/${id}`);
  const detectedHostBase = detectHostMountSource("/app/dist/output");
  const hostBase = detectedHostBase || process.env.HOST_SHARED_OUTPUT; // e.g., /Users/you/project/shared-output
  const hostPath = hostBase ? path.join(hostBase, id) : undefined;

  console.log("Container Path:", containerPath);
  console.log("Host Directory:", hostPath);

  // hostPath is a host filesystem path (used by the host Docker daemon).
  // It is not visible inside this container, so we cannot fs.existsSync(hostPath) here.

  if (!fs.existsSync(containerPath)) {
    const msg = `build folder not found: ${containerPath}`;
    console.log("Error:", msg);
    publisher.hSet("status", id, "failed");
    publisher.hSet("failureReason", id, msg);
    publisher.hSet("failedAt", id, String(Date.now()));
    return Promise.reject(new Error(msg));
  }

  const files = fs.readdirSync(containerPath);
  console.log("Files:", files);

  return new Promise((resolve, reject) => {
    if (!hostPath) {
      publisher.hSet("status", id, "failed");
      publisher.hSet(
        "failureReason",
        id,
        "could not determine host path for /app/dist/output (HOST_SHARED_OUTPUT misconfigured)"
      );
      publisher.hSet("failedAt", id, String(Date.now()));
      reject(new Error("Missing hostPath for docker bind mount"));
      return;
    }

    const docker = spawn("docker", [
      "run",
      "--rm",
      "-v",
      `${hostPath}:/app`,
      "-w",
      "/app",
      "node:22",
      "bash",
      "-c",
      "npm install && npm run build",
    ]);

    docker.stdout.on("data", (data) => {
      const log = `[BUILD] + ${data.toString()}`
      publishToRedis(id, log);
      console.log(data.toString());
    });
    docker.stderr.on("data", (data) => {
      const log = `[ERROR] + ${data.toString()}`
      publishToRedis(id, log);
      console.error(data.toString());
    });

    docker.on("close", (code) => {
      console.log(`Docker exited with code ${code}`);
      if (code === 0) {
        resolve("");
        return;
      }

      // Mark build as failed; deploy-service main loop should not publish dist.
      publisher.hSet("status", id, "failed");
      publisher.hSet("failureReason", id, `docker exited with code ${code}`);
      publisher.hSet("failedAt", id, String(Date.now()));
      reject(new Error(`Build failed for ${id} (code ${code})`));
    });
  });
}
