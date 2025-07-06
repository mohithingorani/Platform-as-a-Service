import { createClient } from "redis";
import { downloadFromS3 } from "./utils/aws";

const subscriber = createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

async function main() {
  await subscriber.connect();  
  while (true) {
    const response = await subscriber.brPop("build-queue", 0);
    console.log(response);

    const id = response?.element;
    await downloadFromS3(`output/${id}`);  
    console.log("Downloaded");
  }
}

main();
