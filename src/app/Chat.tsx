"use client";

import { useState, useRef, useEffect } from "react";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    setInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        console.error("Failed to fetch response from API");
      }
    } catch (error) {
      console.error("Error communicating with the backend:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div
        ref={chatContainerRef}
        className="w-full max-w-2xl border rounded-lg p-4 h-96 overflow-y-auto bg-gray-100"
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-2 ${
              msg.role === "user" ? "text-right text-blue-600" : "text-left text-gray-800"
            }`}
          >
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="flex w-full max-w-2xl gap-2">
        <input
          type="text"
          className="flex-1 border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}