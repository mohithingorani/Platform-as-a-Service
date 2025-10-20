"use client";

import { useEffect, useRef, useState } from "react";

export default function LogsCard({ id }: { id: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const WS_URL = "ws://localhost:8081/";

  useEffect(() => {
    if (!WS_URL || !id) return;

    console.log("Connecting to:", WS_URL);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket open → sending ID:", id);
      setIsConnected(true);
      ws.send(JSON.stringify({ message: { id, type: "start" } }));
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.logs) {
          setMessages((prev) => [...prev, data.logs]);
        }
      } catch (err) {
        console.error("Bad message", err);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setIsConnected(false);
    };
    
    ws.onerror = (err) => {
      console.error("WebSocket error", err);
      setIsConnected(false);
    };

    // cleanup
    return () => {
      console.log("Cleaning up WebSocket for ID:", id);
      if (ws.readyState === WebSocket.OPEN) {
        ws.close();
      }
      wsRef.current = null;
    };
  }, [id]);

  return (
    <div className="text-white bg-green-200 p-4 rounded-lg">
      <h3 className="text-black font-bold">Logs for {id}</h3>
      <div className="text-sm text-gray-600">
        Status: {isConnected ? "Connected" : "Disconnected"}
      </div>
      <pre className="text-black whitespace-pre-wrap">
        {messages.join("\n")}
      </pre>
    </div>
  );
}