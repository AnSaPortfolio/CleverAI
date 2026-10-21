import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

type SendMessageInput = {
  message: string;
  chatId?: string;
};

type SendMessageResponse = {
  chatId: string;
  title: string;
  answer: string;
  interactionId: string;
};

type Message = {
  id: string;
  chat_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};

export function useSendMessage() {
  return useMutation({
    mutationFn: async (input: SendMessageInput) => {
      const { data } = await api.post<SendMessageResponse>("/chat", input);

      return data;
    },
  });
}

export function useMessages(chatId: string) {
  return useQuery({
    queryKey: ["messages", chatId],
    queryFn: async () => {
      const { data } = await api.get<Message[]>(`/chats/${chatId}/messages`);
      return data;
    },
  });
}
