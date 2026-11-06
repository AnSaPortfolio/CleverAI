import { useChats, type Chat } from "../../hooks/chats";
import { NavLink } from "react-router-dom";
import s from "./ChatList.module.css";
import { MessageCircleMore, SquarePen, Trash } from "lucide-react";
import { useDeleteChat, useEditChatTitle } from "../../hooks/chat";
import { useState } from "react";

export function ChatList() {
  const [editingId, setEditingId] = useState<null | string>(null);
  const [newTitle, setNewTitle] = useState("");

  const { isError, error, isPending, data: chats } = useChats();
  const {
    mutate: deleteChat,
    isError: isDeleteError,
    isPending: isDeletePending,
    error: deleteError,
    variables: deletingChatId,
  } = useDeleteChat();

  const { mutate: editChatTitle, isPending: isEditPending } =
    useEditChatTitle();

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Loading...</p>;

  function handleEditClick(chat: Chat) {
    if (editingId) {
      setEditingId(null);
    }
    setEditingId(chat.id);
    setNewTitle(chat.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setNewTitle("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>, chatId: string) {
    e.preventDefault();

    editChatTitle({
      chatId: chatId,
      title: newTitle,
    });

    setEditingId(null);
    setNewTitle("");
  }

  return (
    <nav>
      <ul className={s.list}>
        {chats.map((chat) => (
          <li className={s.item} key={chat.id}>
            {chat.id === editingId ? (
              <form onSubmit={(e) => handleSubmit(e, chat.id)}>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button disabled={chat.title === newTitle}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
                {isEditPending && <p>Editing title...</p>}
              </form>
            ) : (
              <NavLink
                to={`/chats/${chat.id}`}
                className={({ isActive }) =>
                  isActive ? `${s.active} ${s.link}` : s.link
                }
              >
                <MessageCircleMore className={s.icon} />
                {chat.title}
              </NavLink>
            )}
            <button type="button" className={s.deleteBtn}>
              <Trash
                className={s.deleteIcon}
                onClick={() => deleteChat(chat.id)}
              />
            </button>
            <button type="button" className={s.editBtn}>
              <SquarePen
                className={s.editIcon}
                onClick={() => handleEditClick(chat)}
              />
            </button>
            {isDeletePending && deletingChatId === chat.id && (
              <p>Deleting chat...</p>
            )}

            {isDeleteError && deletingChatId === chat.id && (
              <p>{deleteError.message}</p>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
