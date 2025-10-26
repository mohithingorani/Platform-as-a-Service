import { exec, spawn } from "child_process";
import path, { resolve } from "path";
import { publisher } from "..";
import fs from "fs";

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
  
  // In Docker environment, use the container path directly
  // The downloaded files are already in the container at this path
  const hostPath = containerPath;

  console.log("Container Path:", containerPath);
  console.log("Host Directory:", hostPath);
  
  // Verify the project exists
  if (!fs.existsSync(containerPath)) {
    throw new Error(`Project directory not found: ${containerPath}`);
  }
  
  const packageJsonPath = path.join(containerPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log("Available files:", fs.readdirSync(containerPath));
    throw new Error(`package.json not found in: ${containerPath}`);
  }

  console.log("Files in project directory:", fs.readdirSync(containerPath));

  return new Promise((resolve, reject) => {
    const docker = spawn("docker", [
      "run",
      "--rm",
      "-v",
      `${containerPath}:/app`,  // Mount the specific project directory
      "-w",
      "/app",
      "node:22",
      "sh",
      "-c",
      "npm install && npm run build",
    ]);

    docker.stdout.on("data", (data) => {
      const log = `[BUILD] ${data.toString()}`;
      publishToRedis(id, log);
      console.log(log);
    });
    
    docker.stderr.on("data", (data) => {
      const log = `[ERROR] ${data.toString()}`;
      publishToRedis(id, log);
      console.error(log);
    });

    docker.on("close", (code) => {
      console.log(`Docker exited with code ${code}`);
      if (code !== 0) {
        reject(new Error(`Docker build failed with code ${code}`));
      } else {
        resolve("");
      }
    });

    docker.on("error", (error) => {
      console.error('Docker spawn error:', error);
      const log = `[DOCKER ERROR] ${error.message}`;
      publishToRedis(id, log);
      reject(error);
    });
  });
}