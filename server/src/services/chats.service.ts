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

  const { error: messagesError } = await db
    .from("messages")
    .delete()
    .eq("chat_id", chatId);

  if (messagesError) throw messagesError;

  const { error: chatError } = await db
    .from("chats")
    .delete()
    .eq("id", chatId);

  if (chatError) throw chatError;
}

export async function getChat(
  accessToken: string,
  chatId: string
) {
  const db = createUserSupabase(accessToken);

  const { data, error } = await db
    .from("chats")
    .select("id, title")
    .eq("id", chatId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

export async function saveMessages(
  accessToken: string,
  chatId: string,
  message: string,
  answer: string
) {
  const db = createUserSupabase(accessToken);

  const { error } = await db.from("messages").insert([
    {
      chat_id: chatId,
      role: "user",
      content: message,
    },
    {
      chat_id: chatId,
      role: "assistant",
      content: answer,
    },
  ]);
if (error) {
  console.error("Messages insert failed:", {
    code: error.code,
    message: error.message,
    details: error.details,
    hint: error.hint,
  });

  throw error;
}

console.log("Messages saved for chat:", chatId);
  const { error: updateError } = await db
    .from("chats")
    .update({ updated_at: new Date().toISOString() })
    .eq("id", chatId);

  if (updateError) throw updateError;
}

export async function editTitle(
  accessToken: string,
  chatId: string,
  title: string
) {
  const db = createUserSupabase(accessToken);

  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    throw new Error("Chat title cannot be empty");
  }

  const { data, error } = await db
    .from("chats")
    .update({
      title: trimmedTitle,
      updated_at: new Date().toISOString(),
    })
    .eq("id", chatId)
    .select()
    .single();

  if (error) throw error;

  return data;
}