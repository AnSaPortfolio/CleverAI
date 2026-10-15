import { useMutation } from "@tanstack/react-query";
import { api } from "../api/axios";

export function useSendMessage() {
  return useMutation({
    mutationFn: (text: string) =>
      api.post("/chat", { message: text }),

    onSuccess: (response) => {
      console.log(response.data.answer);
    },
  });
}