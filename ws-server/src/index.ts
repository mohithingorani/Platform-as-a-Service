import { WebSocketServer } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv"
dotenv.config();

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", async function connection(ws) {
  console.log("client connected");

  const subscriber = createClient({
    url: process.env.REDIS_URL,
  });
  await subscriber.connect();

  ws.on("error", (error) => {
    console.log(error);
  });

  ws.on("message", async function message(data) {
    const { id } = JSON.parse(data.toString());
    const channel = `logs:${id}`;

    console.log(`Subscribing to ${channel}`);

    await subscriber.subscribe("logs:test123", (logLine) => {
      console.log("Got PUBSUB:",logLine);
      ws.send(JSON.stringify({ logs: logLine }));
    });
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    await subscriber.quit();
  });

  // ws.send("connected");
});
