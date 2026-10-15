import { createUserSupabase } from "../utils/userSupabase.js";

export async function getChats(accessToken: string) {
  const db = createUserSupabase(accessToken);

  const { data, error } = await db
    .from("chats")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) throw error;

  return data;
}

export async function createChat(
  accessToken: string,
  userId: string,
  title: string
) {
  const db = createUserSupabase(accessToken);

  const { data, error } = await db
    .from("chats")
    .insert({
      user_id: userId,
      title,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function getMessages(
  accessToken: string,
  chatId: string
) {
  const db = createUserSupabase(accessToken);

  const { data, error } = await db
    .from("messages")
    .select("*")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return data;
}

export async function deleteChat(
  accessToken: string,
  chatId: string
) {
  const db = createUserSupabase(accessToken);

  const { error } = await db
    .from("chats")
    .delete()
    .eq("id", chatId);

  if (error) throw error;
}
