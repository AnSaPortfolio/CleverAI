import { useChats, usePinChat, type Chat } from "../../hooks/chats";
import { NavLink } from "react-router-dom";
import s from "./ChatList.module.css";
import { Check, MessageCircleMore, Pin, SquarePen, Trash, X } from "lucide-react";
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

  const { mutate: pinChat } = usePinChat();

  if (isError) return <p className={s.statusText}>{error.message}</p>;
  if (isPending) return <p className={s.statusText}>Loading...</p>;

  function handleEditClick(chat: Chat) {
    setEditingId(chat.id);
    setNewTitle(chat.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setNewTitle("");
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>, chatId: string) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    editChatTitle({
      chatId,
      title: newTitle.trim(),
    });

    setEditingId(null);
    setNewTitle("");
  }

  function handlePinChatClick(chat: Chat) {
    pinChat({
      chatId: chat.id,
      isPinned: !chat.is_pinned,
    });
  }

  return (
    <nav className={s.nav}>
      <ul className={s.list}>
        {chats.map((chat) => {
          const isDeleting = isDeletePending && deletingChatId === chat.id;

          return (
            <li
              className={`${s.item} ${isDeleting ? s.deleting : ""}`}
              key={chat.id}
            >
              {chat.id === editingId ? (
                <form
                  className={s.editForm}
                  onSubmit={(e) => handleSubmit(e, chat.id)}
                >
                  <input
                    type="text"
                    className={s.editInput}
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    autoFocus
                    disabled={isEditPending}
                  />
                  <div className={s.editActions}>
                    <button
                      type="submit"
                      className={s.saveBtn}
                      disabled={chat.title === newTitle || !newTitle.trim()}
                      title="Save"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      type="button"
                      className={s.cancelBtn}
                      onClick={cancelEditing}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <NavLink
                    to={`/chats/${chat.id}`}
                    className={({ isActive }) =>
                      isActive ? `${s.link} ${s.active}` : s.link
                    }
                  >
                    <MessageCircleMore className={s.icon} />
                    <span className={s.title}>{chat.title}</span>
                  </NavLink>

                  <div
                    className={`${s.actions} ${
                      chat.is_pinned ? s.hasPinned : ""
                    }`}
                  >
                    <button
                      type="button"
                      className={`${s.actionBtn} ${
                        chat.is_pinned ? s.pinnedActive : ""
                      }`}
                      onClick={() => handlePinChatClick(chat)}
                      title={chat.is_pinned ? "Unpin" : "Pin"}
                    >
                      <Pin size={14} />
                    </button>
                    <button
                      type="button"
                      className={s.actionBtn}
                      onClick={() => handleEditClick(chat)}
                      title="Rename"
                    >
                      <SquarePen size={14} />
                    </button>
                    <button
                      type="button"
                      className={`${s.actionBtn} ${s.deleteBtn}`}
                      onClick={() => deleteChat(chat.id)}
                      title="Delete"
                    >
                      <Trash size={14} />
                    </button>
                  </div>
                </>
              )}

              {isDeleteError && deletingChatId === chat.id && (
                <p className={s.errorText}>{deleteError.message}</p>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
