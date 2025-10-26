import { createClient } from "redis";
import { copyFinalDist, downloadFromS3 } from "./utils/aws";
import dotenv from "dotenv";
import { buildProject, buildProject2 } from "./utils/buildProject";
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
    await downloadFromS3(`output/${id}`);
    console.log("Downloaded");

    await buildProject(id);
    await copyFinalDist(id);
    // await buildProject2(id);
    console.log("Build complete for:", id);

    await copyFinalDist(id);
    publisher.hSet("status", id, "deployed");
  }
}

main();
