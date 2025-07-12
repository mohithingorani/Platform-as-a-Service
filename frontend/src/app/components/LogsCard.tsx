"use client";

import { useEffect, useState } from "react";

export default function LogsCard({ id }: { id: string }) {
  const [messages, setMessages] = useState<string[]>([]);
  const WS_URL = process.env.NEXT_PUBLIC_WS_URL as string;
  useEffect(() => {
    const ws = new WebSocket(WS_URL);
    ws.onopen = () => {
      console.log("connected");
      // if (ws) {
      ws.send(JSON.stringify({ id }));
      // }
    };
    ws.onclose = () => {
      console.log("disconnected");
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const message = data.logs;
      setMessages((messages) => [...messages, message]);
      console.log(message);
    };
  }, []);

  return (
    <div className="text-white bg-green-200">
      {messages.map((message, index) => {
        return <div key={index}>{message}</div>;
      })}
    </div>
  );
}
