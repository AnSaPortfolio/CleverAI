import { Link } from "react-router-dom";
import { ChatList } from "../ChatList/ChatList";
import s from "./Sidebar.module.css";
import { Plus } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: Props) {
  return (
    <aside className={`${s.sidebar} ${isOpen ? s.open : ""}`}>
      <Link to="/" onClick={onClose} className={s.newChatBtn}><Plus /> New chat</Link>
      <ChatList />
    </aside>
  );
}
