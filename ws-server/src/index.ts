import { WebSocketServer } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv"
dotenv.config();
const wss = new WebSocketServer({
  port: 8080,
});

const subscriber = createClient({
  url: process.env.REDIS_URL as string,
});
subscriber.connect();

wss.on("connection", function connection(ws) {
  console.log("client connected");
  ws.on("error", (error) => {
    console.log(error);
  });

  ws.on("message",async function message(data) {
    const message = JSON.parse(data.toString());
    const id = message.id;

    await subscriber.subscribe(`logs:${id}`, (logLine) => {
      console.log(logLine);
      ws.send(logLine);
    });
  });

  ws.send("something");
});
