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
    <div
      className="relative w-full h-full flex items-center justify-center"
      style={{
        width: "100vw", // Full width of the viewport
        height: "100vh", // Full height of the viewport
      }}
    >
      {/* Background Layer */}
      <div
        style={{
          backgroundImage: "url('/background.png')",
          backgroundRepeat: "repeat",
          backgroundSize: "50%", // Scale the image to 50% of its original size
          backgroundPosition: "top left",
          opacity: 0.4, // Set the opacity to 50%
        }}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      ></div>

      {/* Content Layer */}
      <div className="relative flex flex-col items-center justify-center">
        {/* Heading */}
        <div className="w-full max-w-2xl bg-gray-800 text-white text-center py-4 rounded-lg mb-2">
          <h1 className="text-4xl font-bold">Agri Buddy</h1>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="w-full max-w-2xl border rounded-lg p-4 h-96 overflow-y-auto bg-gray-800 text-white"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-2 ${
                msg.role === "user" ? "text-right text-blue-400" : "text-left text-gray-300"
              }`}
            >
              <p>{msg.content}</p>
            </div>
          ))}
        </div>

        {/* Input Section */}
        <div className="flex w-full max-w-2xl gap-2 mt-4">
          <input
            type="text"
            className="flex-1 border border-gray-600 rounded-lg p-2 bg-gray-700 text-white placeholder-gray-400"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}