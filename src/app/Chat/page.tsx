"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios"; // Import axios for file upload
import { JSX } from "react/jsx-runtime";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string | JSX.Element }[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [apiEndpoint, setApiEndpoint] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!apiEndpoint.trim()) {
      alert("Please enter a valid API endpoint.");
      return;
    }

    if (!input.trim() && !file) {
      alert("Please provide a message or upload a file.");
      return;
    }

    const formData = new FormData();

    // Add text input if available
    if (input.trim()) {
      formData.append("message", input);
    }

    // Add file if available
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data;

        // Handle the response and update the messages
        const userMessage = {
          role: "user",
          content: input || (file && <img src={URL.createObjectURL(file)} alt="Uploaded file" className="max-w-xs max-h-48" />),
        };

        setMessages((prev) => [
          ...prev,
          userMessage,
          { role: "assistant", content: data.message || "File processed successfully." },
        ]);

        // Reset input and file
        setInput("");
        setFile(null);
      } else {
        console.error("Failed to send message or upload file.");
      }
    } catch (error) {
      console.error("Error communicating with the backend:", error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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
      ></div>

      {/* Content Layer */}
      <div className="relative flex flex-col items-center justify-center">
        {/* API Endpoint Input */}
        <div className="w-full max-w-2xl mb-4">
          <input
            type="text"
            className="input"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="Enter API endpoint..."
          />
        </div>

        {/* Heading */}
        <div className="w-full max-w-2xl text-primary text-center py-4 rounded-lg mb-2">
          <h1 className="text-4xl font-bold">Agri Buddy</h1>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="w-full max-w-2xl border border-transparent rounded-lg p-4 h-100 overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-background text-right"
                    : "bg-gray-300 text-gray-800 text-left"
                }`}
              >
                {typeof msg.content === "string" ? <p>{msg.content}</p> : msg.content}
              </div>
            </div>
          ))}
        </div>

        {/* Combined Input Section */}
        <div className="flex w-full max-w-2xl gap-2 mt-4 items-center border border-primary rounded-lg p-2">
          <textarea
            className="flex-1 bg-transparent text-primary  placeholder-primary focus:outline-none resize-none overflow-y-auto"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto"; // Reset height
              e.target.style.height = `${Math.min(e.target.scrollHeight, 4 * 24)}px`; // Adjust height up to 4 lines
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            rows={1} // Start with a single row
            style={{ maxHeight: "96px" }} // Limit height to 4 lines (24px per line)
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer text-gray-400 hover:text-white flex items-center"
          >
            <i className="fas fa-paperclip text-lg text-primary"></i> {/* Font Awesome icon */}
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}