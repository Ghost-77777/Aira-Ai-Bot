import express from "express";
import { GoogleGenAI } from "@google/genai";
const app = express();
app.use(express.json());
// Serve index.html and other frontend files
app.use(express.static("."));
const PORT = process.env.PORT || 10000;
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});
// Website
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    assistant: "Aira AI Assistant"
  });
});
// REAL AI CHAT
app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "A valid message is required."
      });
    }
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: message,
      config: {
        systemInstruction: `
You are Aira, a helpful general-purpose daily AI assistant.
You can help with:
- General questions
- Learning and explanations
- Writing and rewriting
- Planning
- Productivity
- Coding
- Everyday conversations
- Hindi, English and Hinglish
Answer naturally and directly.
Do not use fixed responses.
Generate a response based on the user's actual message.
If you do not know something, say so rather than inventing facts.
        `,
        maxOutputTokens: 2000
      }
    });
    res.json({
      reply: response.text
    });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({
      error: "AI response generate nahi ho paya."
    });
  }
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Aira AI Assistant running on port ${PORT}`);
});
