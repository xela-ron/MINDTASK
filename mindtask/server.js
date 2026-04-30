import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import process from "process";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const models = [
  "gemini-2.5-flash-lite",
  "gemini-2.5-flash",
  "gemini-2.5-pro",
];

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ reply: "Please enter a message." });
  }

  const prompt = `
You are MindEase, a supportive mental wellness assistant inside MindTask.

Rules:
- Be kind, calm, and supportive.
- Keep responses short and comforting.
- Suggest simple coping steps.
- Do not diagnose the user.
- If the user mentions self-harm, suicide, or danger, tell them to contact emergency services or a trusted person immediately.

User message: ${message}
`;

  for (const model of models) {
    try {
      console.log("Trying model:", model);

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
      });

      return res.json({ reply: response.text });
    } catch (error) {
      console.log(`${model} failed:`, error.status || error.message);
    }
  }

  return res.status(500).json({
    reply:
      "MindEase is connected, but Gemini is busy right now. Please try again later.",
  });
});

app.listen(5000, () => {
  console.log("Gemini server running on http://localhost:5000");
});