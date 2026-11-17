import { Link } from "react-router-dom";
import { ChatList } from "../ChatList/ChatList";
import s from "./Sidebar.module.css";
import { Plus, SidebarClose } from "lucide-react";
import { UserProfile } from "../UserProfile/UserProfile";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export function Sidebar({ isOpen, onClose }: Props) {
  return (
    <aside className={`${s.sidebar} ${isOpen ? s.open : ""}`}>
      <button
        type="button"
        onClick={onClose}
        className={s.closeBtn}
        aria-label="Close sidebar"
      >
        <SidebarClose color="black" />
      </button>

      <Link to="/" className={s.newChatBtn}>
        <Plus /> New chat
      </Link>
      
      <ChatList />
      
      <div className={s.profile}>
        <UserProfile />
      </div>
    </aside>
  );
}
