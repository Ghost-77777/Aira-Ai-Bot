import express from "express";
import Groq from "groq-sdk";

const app = express();

app.use(express.json());

// Serve website
app.use(express.static("."));

const PORT = process.env.PORT || 10000;

// Groq AI
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});


// Website
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "." });
});


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    assistant: "Aira AI Assistant",
    provider: "Groq"
  });
});


// AI CHAT
app.post("/api/chat", async (req, res) => {

  try {

    const { message } = req.body;

    if (!message || typeof message !== "string") {

      return res.status(400).json({
        error: "A valid message is required."
      });

    }


    const completion =
      await groq.chat.completions.create({

        model: "openai/gpt-oss-120b",

        messages: [

          {
            role: "system",
            content: `
You are Aira, a helpful general-purpose AI assistant.

You can help with:
- General questions
- Learning
- Explanations
- Writing
- Rewriting
- Coding
- Planning
- Productivity
- Everyday conversations
- Hindi
- English
- Hinglish

Answer naturally and directly.

Do not use fixed responses.

Generate your answer based on the user's actual message.

If you do not know something, say so instead of inventing facts.

Keep answers useful and easy to understand.
            `
          },

          {
            role: "user",
            content: message
          }

        ],

        temperature: 0.7,

        max_tokens: 2000

      });


    const reply =
      completion.choices?.[0]?.message?.content;


    res.json({
      reply:
        reply || "Sorry, mujhe response generate nahi hua."
    });


  } catch (error) {

    console.error("Groq AI Error:", error);

    res.status(500).json({
      error: "AI response generate nahi ho paya."
    });

  }

});


app.listen(PORT, "0.0.0.0", () => {

  console.log(
    `Aira AI Assistant running on port ${PORT}`
  );

});
