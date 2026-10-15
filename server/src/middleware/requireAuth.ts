
import type { RequestHandler } from "express";
import { supabase } from "../config/supabase.js";

export const requireAuth: RequestHandler = async (
  req,
  res,
  next
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) { // якщо хедер не починається на Bearer
    res.status(401).json({
      error: "Authorization token is required", // повернемо помилку та повідомимо, що токен обов'язковий
    });
    return;
  }

  const token = authHeader.slice(7); // токен починається після 7-о символа

  try {
    const { data, error } =
      await supabase.auth.getUser(token); // передаємо токен для того, щоб перевірити чи існує юзер з таким токеном

    if (error || !data.user) {
      res.status(401).json({
        error: "Invalid or expired token", // повертаємо помилку, якщо отримаємо помилку, або якщо юзера не існує
      });
      return;
    }

    res.locals.user = data.user;
    next();
  } catch {
    res.status(503).json({
      error: "Authentication service unavailable",
    });
  }
};
