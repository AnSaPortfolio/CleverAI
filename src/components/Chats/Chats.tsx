import { useChats } from "../../hooks/chats";
import { Link } from "react-router-dom";

export function Chats() {
  const { isError, error, isPending, data: chats } = useChats();

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Loading...</p>;

  return (
 <ul>
    {chats.map(chat => (
        <li key={chat.id}>
            <Link to={`/chats/${chat.id}`}>{chat.title}</Link>
        </li>
    ))}
 </ul>  
)
}
