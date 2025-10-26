import { WebSocketServer } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const wss = new WebSocketServer({
  port: 8080,
  host: "0.0.0.0",
});

wss.on("connection", async function connection(ws) {
  console.log("client connected");

  const subscriber = createClient({
    url: process.env.REDIS_URL,
  });
  
  await subscriber.connect();

  ws.on("error", (error) => {
    console.log("WebSocket error:", error);
  });

  ws.on("message", async function message(data) {
    console.log("Got a message");
    try {
      const { message } = JSON.parse(data.toString());
      const id = message.id;
      const channel = `logs:${id}`;

      console.log("Subscribing to channel:", channel);
      
      await subscriber.subscribe(channel, (logLine) => {
        console.log("Got PUBSUB:", logLine);
        // Check if WebSocket is still open before sending
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ logs: logLine }));
        }
      });
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", async () => {
    console.log("Client disconnected");
    await subscriber.unsubscribe();
    await subscriber.quit();
  });
});