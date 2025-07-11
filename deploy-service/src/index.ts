import { createClient } from "redis";
import { copyFinalDist, downloadFromS3 } from "./utils/aws";
import { buildProject, buildProject2 } from "./utils/buildProject";
import dotenv from "dotenv"
dotenv.config();

const subscriber = createClient({ url: process.env.REDIS_URL as string });

export const publisher = createClient({ url: process.env.REDIS_URL as string });

async function main() {
  await subscriber.connect(); 
 await publisher.connect();
  while (true) {
    const response = await subscriber.brPop("build-queue", 0);
    console.log(response);
    
    //@ts-ignore
    const id = response.element;
    await downloadFromS3(`output/${id}`);  
    console.log("Downloaded");
    
    await buildProject2(id);
    console.log("Build complete for:", id);
    
    await copyFinalDist(id);
    publisher.hSet("status",id,"deployed");
  }
}

main();
