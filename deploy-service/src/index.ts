import { createClient } from "redis";
import { copyFinalDist, downloadFromS3 } from "./utils/aws";
import { buildInDocker} from "./utils/buildProject";
import dotenv from "dotenv";
dotenv.config();


const subscriber = createClient({ url: process.env.REDIS_URL as string });

export const publisher = createClient({ url: process.env.REDIS_URL as string });

async function main() {
  await subscriber.connect();
  await publisher.connect();
  while (true) {
    const response = await subscriber.brPop("build-queue", 0);
    if(!response) return;
    const id = response.element;
    // Track timings for UI and debugging.
    await publisher.hSet("buildStartedAt", id, String(Date.now()));
    await publisher.hSet("status", id, "building");
    await downloadFromS3(`output/${id}`);
    console.log("Downloaded");

    try {
      await buildInDocker(id);
      // await buildProject2(id);
      console.log("Build complete for:", id);

      await copyFinalDist(id);
      await publisher.hSet("status", id, "deployed");
      await publisher.hSet("deployedAt", id, String(Date.now()));
    } catch (err) {
      console.error("Build failed for:", id, err);
      // buildInDocker already records failure details in Redis.
    }
  }
}

main();
