import axios from "axios";
import { supabase } from "../lib/supabase";

export const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession(); // дістаємо поточну сессію користувача

  if (data.session?.access_token) { // якщо токен пристуній
    config.headers.set( 
      "Authorization",
      `Bearer ${data.session.access_token}` // автоматично додаємо його до голови запиту
    ); 
  }

  return config;
});
