
import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";

import {
  getChats,
  createChat,
  getMessages,
  deleteChat,
  updateChatPin,
} from "../services/chats.service.js";

export const chatsRouter = Router();

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

chatsRouter.use(requireAuth);

// Get all chats
chatsRouter.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization!.slice(7);

    const chats = await getChats(token);

    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch chats",
    });
  }
});

// Create chat
chatsRouter.post("/", async (req, res) => {
  const { title } = req.body ?? {};

  if (
    title !== undefined &&
    (typeof title !== "string" ||
      !title.trim() ||
      title.length > 200)
  ) {
    res.status(400).json({
      error: "Invalid chat title",
    });
    return;
  }

  try {
    const token = req.headers.authorization!.slice(7);
    const userId = res.locals.user.id;

    const chat = await createChat(
      token,
      userId,
      title?.trim() ?? "New Chat"
    );

    res.status(201).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to create chat",
    });
  }
});

// Get messages
chatsRouter.get("/:chatId/messages", async (req, res) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const chatId = String(req.params.chatId);

    const messages = await getMessages(token, chatId);

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to fetch messages",
    });
  }
});

// Delete chat
chatsRouter.delete("/:chatId", async (req, res) => {
  try {
    const token = req.headers.authorization!.slice(7);
    const chatId = String(req.params.chatId);

    await deleteChat(token, chatId);

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Failed to delete chat",
    });
  }
});

chatsRouter.patch("/:chatId/pin", async (req, res) => {
    console.log("PARAMS:", req.params);
  console.log("CHAT ID:", req.params.chatId);
  console.log("VALID:", UUID_PATTERN.test(String(req.params.chatId)));
  const { chatId } = req.params;
  const { isPinned } = req.body ?? {};

  if (
    typeof chatId !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(chatId)
  ) {
    res.status(400).json({
      error: "Invalid chat ID",
    });
    return;
  }

  if (typeof isPinned !== "boolean") {
    res.status(400).json({
      error: "isPinned must be a boolean",
    });
    return;
  }

  try {
    const token = req.headers.authorization!.slice(7);
    const userId = res.locals.user.id;

    const chat = await updateChatPin(
      token,
      chatId,
      userId,
      isPinned
    ); 

    if (!chat) {
      res.status(404).json({
        error: "Chat not found",
      });
      return;
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error("Failed to update chat pin:", error);

    res.status(500).json({
      error: "Failed to update chat pin",
    });
  }
});
