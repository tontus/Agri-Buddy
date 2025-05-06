import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages } = req.body;

  try {
    // Replace this with your backend API call
    const response = await fetch("https://your-backend-api.com/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response from backend");
    }

    const data = await response.json();
    res.status(200).json({ reply: data.reply });
  } catch (error) {
    console.error("Error:", error);

    // Return the error message as a reply
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const dialouges = [
      'Sorry, I couldn\'t process your request.',
    ];
    const randomReply = dialouges[Math.floor(Math.random() * dialouges.length)];
    res.status(200).json({ reply: randomReply });
  }
}