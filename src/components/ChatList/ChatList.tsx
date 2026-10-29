import { useChats } from "../../hooks/chats";
import { NavLink } from "react-router-dom";
import s from "./ChatList.module.css";
import { MessageCircleMore } from "lucide-react";

export function ChatList() {
  const { isError, error, isPending, data: chats } = useChats();

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Loading...</p>;

  return (
    <nav>
      <ul className={s.list}>
        {chats.map((chat) => (
          <li className={s.item} key={chat.id}>
            <NavLink
              to={`/chats/${chat.id}`}
              className={({ isActive }) =>
                isActive ? `${s.active} ${s.link}` : s.link
              }
            >
                          <MessageCircleMore className={s.icon}/>
              {chat.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
