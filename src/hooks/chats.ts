import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../api/axios";

export type Chat = {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
};

export function useCreateChat() {
  return useMutation({
    mutationFn: (title: string) =>
      api.post("/chats", { title }),
  });
}

export function useChats() {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const { data } = await api.get<Chat[]>("/chats");
      return data;
    },
    staleTime: 60_000
  });
}