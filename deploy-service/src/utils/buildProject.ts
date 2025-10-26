import { exec } from "child_process";
import path from "path";
import { publisher } from "..";

async function publishToRedis(id: string, log: string) {
  console.log("Pushed to redis for id", id);
  await publisher.publish(`logs:${id}`, log);
}

export function buildProject(id: string) {
  return new Promise((resolve) => {
    const dir = path.join(__dirname, "../", `output/${id}`);
    console.log("Path =", dir);

    const child = exec(`cd ${dir} && npm install && npm run build`);

    child.stdout?.on("data", async (data) => {
      const log = "[BUILD] " + data.toString();
      console.log(log);
      await publishToRedis(id, log);
    });

    child.stderr?.on("data", async (data) => {
      const log = "[BUILD][ERROR] " + data.toString();
      console.error(log);
      await publishToRedis(id, log);
    });

    child.on("close", async (code) => {
      const log = `[BUILD] process exited with code ${code}`;
      console.log(log);
      await publishToRedis(id, log);
      resolve("");
    });
  });
}
