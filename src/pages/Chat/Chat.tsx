import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useMessages } from "../../hooks/chat";
import s from "./Chat.module.css";
import { Ring } from "../../components/ring";
import { User, X } from "lucide-react";

export function Chat() {
  const { chatId } = useParams();

  if (!chatId) return <p className={s.status}>Chat ID is missing</p>;

  return <ChatMessages chatId={chatId} />;
}

function ChatMessages({ chatId }: { chatId: string }) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const {
    data: messages,
    isError,
    error,
    isPending,
  } = useMessages(chatId);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isError) return <p className={`${s.status} ${s.error}`}>{error.message}</p>;
  if (isPending) return <p className={s.status}><Ring width={50}/></p>;
  if (!messages.length) return <p className={s.status}><X size={16} strokeWidth={1.5} color="red"/>No messages yet</p>;

  return (
    <div className={s.container}>
      <ul className={s.list}>
        {messages.map((message) => {
          const isUser = message.role === "user";

          return (
            <li
              key={message.id}
              className={`${s.messageRow} ${isUser ? s.userRow : s.aiRow}`}
            >
              <div className={`${s.bubble} ${isUser ? s.userBubble : s.aiBubble}`}>
                <span className={s.sender}>
                  {isUser ? "You" : "CleverAI"}
                </span>
                <p className={s.content}>{message.content}</p>
              </div>
              {isUser && <User className={s.userIcon} size={20} strokeWidth={1.5} /> }
            </li>
          );
        })}
      </ul>
    </div>
  );
}
