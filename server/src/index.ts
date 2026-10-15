import { chatRouter } from "./routes/chat.routes.js";
import { chatsRouter } from "./routes/chats.routes.js";
import express from "express";
import cors from "cors";
import "dotenv/config";
import { requireAuth } from "./middleware/requireAuth.js";

const app = express();

const PORT = Number(process.env.PORT) || 3001;

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "CleverAI backend is running",
  });
});


app.get("/api/auth/me", requireAuth, (_req, res) => {
  const user = res.locals.user;

  res.json({
    id: user.id,
    email: user.email,
  });
});

app.use("/api/chat", chatRouter);

app.use("/api/chats", chatsRouter);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
