"use client";

import { useEffect, useRef, useState } from "react";

export default function LogsCard({ id }: { id: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const WS_URL = "ws://localhost:8081/";
  const divRef = useRef<any>(null);

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
          scrollToBottom();
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

  const scrollToBottom = () => {
    if (divRef.current) {
      divRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };



  

  return (
    <div>
      <div>
        <h3 className=" font-bold">id:{id}</h3>
        {/* <div className="text-sm ">
        Status: {isConnected ? "Connected" : "Disconnected"}
      </div> */}
      </div>
      <div
        ref={divRef}
        className=" bg-black  w-[700px] h-[500px] min-h-[500px] overflow-y-scroll text-xs font-commitmono border border-gray-400/40  text-green-600 p-4 rounded-lg"
      >
        <pre className=" whitespace-pre-wrap  font-commitmono">
          {messages.map((message) => (
            <>
              {message.startsWith("[BUILD]") ? (
                <div className="text-green-400">{message}</div>
              ) : (
                <div className="text-red-500">{message}</div>
              )}
            </>
          ))}
        </pre>
      </div>
    </div>
  );
}
