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
      `✊✊✊: জিয়ার সৈনিক, মাইর খায় দৈনিক `,
      `😡😡😡: বাড়ী কোথায়, গোপালী??`,
      `💀💀💀: শেখ হাসিনা পালায় না`,
      `☝️☝️☝️: এই চ্যাটের ১০% আমার`,
      `🧠🧠🧠: নাতিরে লন্ডনে পাঠায়, দেশে কয় স্বাধীনতা`,
      `👞👞👞: হাওয়া ভবন খুলছে কবে?`,
      `🔥🔥🔥: কসম মুজিবের, পিছু হটবি না`,
      `📢📢📢: হোক আন্দোলন, গদি ছাড় ভাই`,
      `😤😤😤: প্যাকেট দিয়া ভোট কিনে, এখন কয় জনতার নেতা?`,
      `💼💼💼: সাহেব আসে Prado তে, ভোট চায় ভ্যানে`,
      `🧃🧃🧃: রাজনীতি করে চাচা, মাল খায় ভাগ্নে`,
      `📦📦📦: উন্নয়নের চাপে, রেশনেই নাই চাল`,
      `😮‍💨😮‍💨😮‍💨: ভাইরে ভাই, হাওয়া গ্যাছে হাওয়ায়`,
      `🪙🪙🪙: চা-ওয়ালার গল্প, এখন ব্যাংক ব্যালেন্সে`,
      `🧳🧳🧳: আন্দোলন করবে, আগে কাতার থেইকা আয়`,
      `🫵🫵🫵: খালেদার মুক্তি চায়, খালেদা জানে না`,
      `🫥🫥🫥: সত্য বললে, হয়ে যাই রাজাকার?`,
      `🙌🙌🙌: শেখ হাসিনা নাম শুনলে, ঘাম দেয় হাওয়া ভবনে`,
        `😤😤😤: বঙ্গবন্ধু বলে গেছেন, লড়াই করেই বাঁচতে হবে`,
        `🕊️🕊️🕊️: বঙ্গবন্ধু স্বপ্ন দেখায়, আমরা ঘুমাই`,
        `🏠🏠🏠: আয়নাঘরে পাঠিয়ে দিবো`,
        `😎😎😎: বদমাইশ সারজিস`
    ];
    const randomReply = dialouges[Math.floor(Math.random() * dialouges.length)];
    res.status(200).json({ reply: randomReply });
  }
}