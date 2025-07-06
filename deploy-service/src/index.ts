import { createClient } from "redis";
import { copyFinalDist, downloadFromS3 } from "./utils/aws";
import { buildProject } from "./utils/buildProject";

const subscriber = createClient({ url: "redis://redis:6379" });

const publisher = createClient({ url: "redis://redis:6379" });

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
    
    await buildProject(id);
    console.log("Build complete for:", id);
    
    copyFinalDist(id);
    publisher.hSet("status",id,"deployed");
  }
}

main();
