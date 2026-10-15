import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateResponse } from "../services/gemini.service.js";

export const chatRouter = Router();

chatRouter.post("/", requireAuth, async (req, res) => {
  const { message } = req.body ?? {};

  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({
      error: "Message is required",
    });
    return;
  }

  if (message.length > 10000) {
    res.status(400).json({
      error: "Message is too long",
    });
    return;
  }

  try {
    const result = await generateResponse(message.trim());

    res.status(200).json(result);
  } catch (error) {
    console.error("Gemini generation failed:", error);

    const status =
      typeof error === "object" &&
      error !== null &&
      "status" in error
        ? Number(error.status)
        : undefined;

    if (status === 429) {
      res.status(429).json({
        error: "AI rate limit exceeded",
      });
      return;
    }

    res.status(502).json({
      error: "Failed to generate AI response",
    });
  }
});
