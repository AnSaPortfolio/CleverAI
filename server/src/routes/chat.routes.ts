import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { generateResponse } from "../services/gemini.service.js";
import {
  createChat,
  editTitle,
  getChat,
  getMessages,
  saveMessages,
} from "../services/chats.service.js";

export const chatRouter = Router();

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;


chatRouter.post("/", requireAuth, async (req, res) => {
  const { message, chatId } = req.body ?? {};

  // якщо ми надіслали не стрінг або лише пробіли
  if (typeof message !== "string" || !message.trim()) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  // якщо написали більше 10000 символів
  if (message.length > 10000) {
    res.status(400).json({ error: "Message is too long" });
    return;
  }

  // 
  if (
    chatId !== undefined &&
    (typeof chatId !== "string" || !UUID_PATTERN.test(chatId))
  ) {
    res.status(400).json({ error: "Invalid chat ID" });
    return;
  }

  try {
    const token = req.headers.authorization!.slice(7); // токен
    const userId = res.locals.user.id; // айді користувача
    const text = message.trim(); // видаляємо пробіли на початку та в кінці рядка
    const isNewChat = chatId === undefined; // перевірка на те чи було передано айді чату

    const existingChat = isNewChat
      ? null 
      : await getChat(token, chatId); // отримаємо існуючий чат

    // якщо ми передали айді чату, але його не знайшли
    if (!isNewChat && !existingChat) {
      res.status(404).json({ error: "Chat not found" });
      return;
    }

    // отримаємо історію чату, якщо він уснує, а якщо ні, то повернемо порожній масив
    const history = existingChat
      ? await getMessages(token, existingChat.id)
      : [];

    // історія чату з ролями(користувач або ШІ) та поточне повідомлення
    const input = existingChat
      ? JSON.stringify({
          task: "Продовж розмову, відповівши на currentMessage. " +
            "history містить попередні повідомлення розмови.",
          history: history.map(({ role, content }) => ({
            role,
            content,
          })),
          currentMessage: text,
        })
      : text;

    const result = await generateResponse(input);

    const chat =
      existingChat ??
      (await createChat(token, userId, result.title));

console.log("Calling saveMessages:", chat.id);

await saveMessages(token, chat.id, text, result.answer);
    res.status(isNewChat ? 201 : 200).json({
      chatId: chat.id,
      title: chat.title,
      answer: result.answer,
      interactionId: result.interactionId,
    });
  } catch (error) {
    console.error("Chat request failed:", error);

    const isRateLimit =
      typeof error === "object" &&
      error !== null &&
      "status" in error &&
      Number(error.status) === 429;

    res.status(isRateLimit ? 429 : 500).json({
      error: isRateLimit
        ? "AI rate limit exceeded" // якщо ліміт вичерпано
        : "Failed to process message",  
    });
  }
});

chatRouter.patch("/:chatId/title", requireAuth, async (req, res) => {
  const { chatId } = req.params;
  const { title } = req.body ?? {};

  if (typeof chatId !== "string" || !UUID_PATTERN.test(chatId)) {
    res.status(400).json({ error: "Invalid chat ID" });
    return;
  }

  if (typeof title !== "string" || !title.trim()) {
    res.status(400).json({ error: "Title is required" });
    return;
  }

  if (title.trim().length > 100) {
    res.status(400).json({ error: "Title is too long" });
    return;
  }

  try {
    const token = req.headers.authorization!.slice(7);

    const updatedChat = await editTitle(
      token,
      chatId,
      title
    );

    res.status(200).json(updatedChat);
  } catch (error) {
    console.error("Failed to update chat title:", error);

    res.status(500).json({
      error: "Failed to update chat title",
    });
  }
});