"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { JSX } from "react/jsx-runtime";
import ReactMarkdown from "react-markdown";

export default function Chat() {
  const [messages, setMessages] = useState<{ role: string; content: string | JSX.Element }[]>([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null); // Add file preview state
  const [apiEndpoint, setApiEndpoint] = useState("https://b8f2-202-134-10-140.ngrok-free.app");
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Create and set a preview URL for the selected file
      const previewUrl = URL.createObjectURL(selectedFile);
      setFilePreview(previewUrl);
    }
  };

  // Clear file selection
  const clearFileSelection = () => {
    if (filePreview) {
      URL.revokeObjectURL(filePreview); // Clean up the URL object
    }
    setFile(null);
    setFilePreview(null);
  };

  const sendMessage = async () => {
    if (!apiEndpoint.trim()) {
      alert("Please enter a valid API endpoint.");
      return;
    }

    if (!input.trim() && !file) {
      alert("Please provide a message or upload a file.");
      return;
    }

    // Prepare user content immediately
    let userContent: string | JSX.Element;
    
    // Create content based on what's available
    if (input.trim() && file) {
      // If both text and file are present
      userContent = (
        <div>
          <ReactMarkdown>{input}</ReactMarkdown>
          <img src={URL.createObjectURL(file)} alt="Uploaded file" className="max-w-5xl max-h-48 mt-2" />
        </div>
      );
    } else if (file) {
      // If only file is present
      userContent = <img src={URL.createObjectURL(file)} alt="Uploaded file" className="max-w-5xl max-h-48" />;
    } else {
      // If only text is present
      userContent = input; // Will be rendered as Markdown by the existing logic
    }

    // Add user message immediately
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userContent }
    ]);

    // Store input and file for request
    const currentInput = input;
    const currentFile = file;
    
    // Reset input and file immediately
    setInput("");
    clearFileSelection();

    // Set loading state
    setIsLoading(true);

    // Add a temporary loading message
    setMessages(prev => [
      ...prev,
      { role: "assistant", content: "Loading..." }
    ]);

    // Prepare form data
    const formData = new FormData();

    // Add text input if available
    if (currentInput.trim()) {
      formData.append("message", currentInput);
    }

    // Add file if available
    if (currentFile) {
      formData.append("file", currentFile);
    }

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        const data = response.data;
        
        // Replace the loading message with the actual response
        setMessages((prev) => 
          prev.slice(0, -1).concat([
            { role: "assistant", content: data.message || "File processed successfully." }
          ])
        );
      } else {
        // Replace loading with error message
        setMessages((prev) => 
          prev.slice(0, -1).concat([
            { role: "assistant", content: "Error: Failed to get response from server." }
          ])
        );
        console.error("Failed to send message or upload file.");
      }
    } catch (error) {
      // Replace loading with error message
      setMessages((prev) => 
        prev.slice(0, -1).concat([
          { role: "assistant", content: "Error: Could not communicate with the server." }
        ])
      );
      console.error("Error communicating with the backend:", error);
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { // Send only if Enter is pressed without Shift
      e.preventDefault(); // Prevent the default behavior (new line)
      sendMessage();
    }
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (filePreview) {
        URL.revokeObjectURL(filePreview);
      }
    };
  }, [filePreview]);

  return (
    <div
      className="relative w-full h-full flex items-center justify-center mb-4"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Content Layer */}
      <div className="relative flex flex-col items-center justify-center">
        {/* API Endpoint Input */}
        <div className="w-full max-w-6xl mb-4">
          <input
            type="text"
            className="input"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="Enter API endpoint..."
            hidden
          />
        </div>

        {/* Heading */}
        <div className="w-full text-primary text-center py-4 rounded-lg mb-2 mt-2">
          <h1 className="text-4xl font-bold">Agri Buddy</h1>
        </div>

        {/* Chat Container */}
        <div
          ref={chatContainerRef}
          className="w-full max-w-5xl border border-transparent rounded-lg p-4 h-140 overflow-y-auto"
        >
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-5xl px-4 py-2 rounded-lg ${
                  msg.role === "user"
                    ? "bg-primary text-background text-right"
                    : "bg-gray-300 text-gray-800 text-left"
                }`}
              >
                {typeof msg.content === "string" ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Combined Input Section */}
        <div className="flex flex-col w-full max-w-5xl gap-2 mt-4">
          {/* Input and Buttons */}
          <div className="flex w-full gap-2 items-center border border-primary rounded-lg p-2">
            <div className="flex-1 flex flex-col">
              {/* File Preview (shown inline when a file is selected) */}
              {filePreview && (
                <div className="relative mb-2">
                  <img 
                    src={filePreview} 
                    alt="File Preview" 
                    className="max-h-32 max-w-xs rounded"
                  />
                  <button 
                    onClick={clearFileSelection}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                    title="Remove file"
                  >
                    ×
                  </button>
                </div>
              )}
              
              {/* Text Input */}
              <textarea
                className="w-full bg-transparent text-primary placeholder-primary focus:outline-none resize-none overflow-y-auto"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 4 * 24)}px`;
                }}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                rows={1}
                style={{ maxHeight: "96px" }}
                disabled={isLoading}
              />
            </div>
            
            <label
              htmlFor="file-upload"
              className={`cursor-pointer text-gray-400 hover:text-white flex items-center ${isLoading || file ? 'opacity-50 pointer-events-none' : ''}`}
            >
              <i className="fas fa-paperclip text-lg text-primary"></i>
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary disabled:opacity-50"
              onClick={sendMessage}
              disabled={isLoading || (!input.trim() && !file)}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending...
                </div>
              ) : "Send"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}