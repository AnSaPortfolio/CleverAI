import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

type EditTitleInput = {
  chatId: string;
  title: string;
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

export function useDeleteChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (chatId: string) => api.delete(`/chats/${chatId}`),

    onSuccess: (_, chatId) => {
      queryClient.invalidateQueries({
        queryKey: ["chats"],
      });

      queryClient.removeQueries({
        queryKey: ["messages", chatId],
      });
    },
  });
}

export function useEditChatTitle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ chatId, title }: EditTitleInput) => {
      const { data } = await api.patch(`/chat/${chatId}/title`, {
        title: title,
      });
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chats"]
      })
    }
  });
}
