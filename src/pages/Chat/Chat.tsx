import { useParams } from "react-router-dom";
import { useMessages } from "../../hooks/chat";

export function Chat() {
  const { chatId } = useParams();

  if (!chatId) return <p>Chat ID is missing</p>;

  return <ChatMessages chatId={chatId} />;
}

function ChatMessages({ chatId }: { chatId: string }) {
  const {
    data: messages,
    isError,
    error,
    isPending,
  } = useMessages(chatId);

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Loading...</p>;
  if (!messages.length) return <p>No messages yet</p>;

  return (
    <ul>
      {messages.map((message) => (
        <li key={message.id}>
          <strong>
            {message.role === "user" ? "You" : "CleverAI"}
          </strong>
          <p style={{ whiteSpace: "pre-wrap" }}>
            {message.content}
          </p>
        </li>
      ))}
    </ul>
  );
}