import { WebSocketServer } from "ws";
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const DEBUG = process.env.WS_DEBUG === "1";

const wss = new WebSocketServer({
  port: 8081,
  host: "0.0.0.0",
});

wss.on("connection", async function connection(ws) {
  if (DEBUG) console.log("WebSocket: client connected");

  const subscriber = createClient({
    url: process.env.REDIS_URL,
  });

  try {
    await subscriber.connect();
    if (DEBUG) console.log("WebSocket: Redis subscriber connected");
  } catch (e) {
    console.error("❌ Redis connection failed:", e);
  }

  ws.on("error", (error) => {
    if (DEBUG) console.log("WebSocket error:", error);
  });

  ws.on("message", async function message(data) {
    const rawData = data.toString();
    if (DEBUG) {
      console.log("WebSocket message:", rawData.substring(0, 200));
    }
    try {
      const parsed = JSON.parse(data.toString());
      const id = parsed.message?.id || parsed.id;
      
      if (!id) {
        console.error("No ID found in message");
        return;
      }
      
      const channel = `logs:${id}`;
      const listKey = `logs:list:${id}`;

      const storedLogs = await subscriber.lRange(listKey, 0, -1);
      for (const log of storedLogs) {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ logs: log }));
        }
      }

      await subscriber.subscribe(channel, (logLine) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(JSON.stringify({ logs: logLine }));
        }
      });
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  ws.on("close", async () => {
    if (DEBUG) console.log("WebSocket: client disconnected");
    await subscriber.unsubscribe();
    await subscriber.quit();
  });
});
