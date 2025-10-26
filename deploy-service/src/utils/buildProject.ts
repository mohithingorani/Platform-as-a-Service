import { spawn } from "child_process";
import path from "path";
import { publisher } from "..";

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}


export function buildProject2(id: string) {
  const dir = path.join(__dirname, `../`, `output/${id}`);
  return new Promise((resolve) => {
    const install = spawn("npm", ["install"], { cwd: dir });
    install.stdout.on("data", (data) => {
      const log = "[INSTALL] " + data.toString();
      console.log(log);
      publishToRedis(id, log);
    });
    install.stderr.on("data", (data) => {
      const log = "[INSTALL] " + data.toString();
      console.log(log);
      publishToRedis(id, log);
    });
install.on("close", (code) => {
      const log = `[INSTALL] exited with code ${code}`;
      console.log(log);
      publishToRedis(id, log);
      const build = spawn("npm", ["run", "build"], { cwd: dir });
      build.stdout.on("data", (data) => {
        const log = "[BUILD] " + data.toString();
        publishToRedis(id, log);
      });
      build.stderr.on("data", (data) => {
        const log = "[BUILD] " + data.toString();
        console.log(log);
        publishToRedis(id, log);
      });   build.on("close", (code) => {
        const log = "[BUILD] exited with code " + code;
        console.log(log);
        publishToRedis(id, log);
        resolve("");
      });
    });
     });
}