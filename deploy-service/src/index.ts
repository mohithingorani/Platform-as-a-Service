import { createClient } from "redis";
import { copyFinalDist, downloadFromS3 } from "./utils/aws";
import { buildInDocker} from "./utils/buildProject";
import dotenv from "dotenv";
dotenv.config();


const subscriber = createClient({ url: process.env.REDIS_URL as string });

export const publisher = createClient({ url: process.env.REDIS_URL as string });

async function main() {
  try {
    await subscriber.connect();
    await publisher.connect();
    
    subscriber.on("error", (err) => {
      console.error("Redis subscriber error:", err);
    });
    
    publisher.on("error", (err) => {
      console.error("Redis publisher error:", err);
    });
    
    console.log("Connected to Redis, waiting for build jobs...");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
  
  while (true) {
    try {
      const response = await subscriber.brPop("build-queue", 0);
      if(!response) continue;
      const id = response.element;
      await downloadFromS3(`output/${id}`);
      console.log("Downloaded");

      await buildInDocker(id);
      // await buildProject2(id);
      console.log("Build complete for:", id);

      await copyFinalDist(id);
      publisher.hSet("status", id, "deployed");
    } catch (error) {
      console.error("Error processing build job:", error);
      // Continue to next job instead of crashing
    }
  }
}

main();
