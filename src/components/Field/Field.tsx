import { useState, type FormEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { useSendMessage } from "../../hooks/chat";
import s from "./Field.module.css";

export function Field() {
  const [question, setQuestion] = useState("");
  const { chatId } = useParams<{ chatId: string }>();
  const sendMessage = useSendMessage();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const message = question.trim();

    if (!message || sendMessage.isPending) return;

    sendMessage.mutate(
      { message, chatId },
      {
        onSuccess: (data) => {
          setQuestion("");

          queryClient.invalidateQueries({
            queryKey: ["messages", data.chatId],
          });

          queryClient.invalidateQueries({
            queryKey: ["chats"],
          });

          if (!chatId) {
            navigate(`/chats/${data.chatId}`);
          }
        },
      },
    );
  }

  return (
    <div className="container">
      <div className={s.wrapper}>
        <form className={s.form} onSubmit={handleSubmit}>
          <input
            type="text"
            className={s.field}
            onChange={(e) => setQuestion(e.target.value)}
            value={question}
            placeholder="Ask CleverAI"
            disabled={sendMessage.isPending}
            maxLength={10000}
          />

          <button
            type="submit"
            className={s.btn}
            disabled={!question.trim() || sendMessage.isPending}
          >
            <Send className={s.sendIcon} />
          </button>
        </form>

        {sendMessage.isPending && <p>CleverAI is thinking...</p>}

        {sendMessage.isError && <p role="alert">{sendMessage.error.message}</p>}
      </div>
    </div>
  );
}
