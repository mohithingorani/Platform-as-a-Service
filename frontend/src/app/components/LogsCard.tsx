"use client";

import { useEffect, useRef, useState } from "react";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8081";

export default function LogsCard({ id }: { id: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  useEffect(() => {
    if (!WS_URL || !id) return;

    console.log("Connecting to:", WS_URL);

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket open → sending ID:", id);
      setIsConnected(true);
      setTimeout(() => {
        const msg = JSON.stringify({ message: { id, type: "start" } });
        console.log("Sending:", msg);
        ws.send(msg);
      }, 500);
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
      try {
        ws.close();
      } catch {
        // ignore
      }
      wsRef.current = null;
    };
  }, [id]);



  

  return (
    <div>
      <div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-zinc-500 break-all">{id}</div>
          <div className="text-xs text-zinc-500">
            {isConnected ? "Connected" : "Disconnected"}
          </div>
        </div>
      </div>
      <div className="bg-black w-full h-[420px] md:h-[500px] min-h-[420px] overflow-y-scroll text-xs font-commitmono border border-gray-400/40 text-green-600 p-4 rounded-lg">
        <pre className=" whitespace-pre-wrap  font-commitmono">
          {messages.map((message, idx) =>
            message.startsWith("[BUILD]") ? (
              <div key={idx} className="text-green-400">
                {message}
              </div>
            ) : (
              <div key={idx} className="text-red-500">
                {message}
              </div>
            )
          )}
        </pre>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
