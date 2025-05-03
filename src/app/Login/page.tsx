"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = () => {
    // Replace this with your actual authentication logic
    if (username === "admin" && password === "password") {
      router.push("/Chat"); // Redirect to the Chat page
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background primary ">
      <h1 className="text-4xl font-bold mb-6 text-primary">Welcome</h1>
      <div className="w-full max-w-sm">
        <input
          type="text"
          className="input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="input"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-primary px-4 py-2 rounded-lg text-background hover-bg-primary"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
}