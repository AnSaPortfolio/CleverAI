import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { SidebarClose, SidebarOpen } from "lucide-react";
import { Sidebar } from "../Sidebar/Sidebar";
import s from "./ChatLayout.module.css";

export function ChatLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    return typeof window !== "undefined" ? window.innerWidth > 767 : false
  });

  useEffect(() => {
  if (typeof window === "undefined") return;

  function handleResize() {
    setIsSidebarOpen(window.innerWidth > 767);
  }

  window.addEventListener("resize", handleResize);
  
  return () => window.removeEventListener("resize", handleResize);
}, []);

  return (
    <div className={s.layout}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className={s.main}>
        {!isSidebarOpen ? (
          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            aria-controls="sidebar"
            className={s.sidebarIcon}
          >
            <SidebarOpen />
          </button>
        ) : (
           <button
            type="button"
            onClick={() => setIsSidebarOpen(false)}
            aria-controls="sidebar"
            className={s.sidebarIcon}
          >
            <SidebarClose />
          </button>
        )}

        <Outlet />
      </main>
    </div>
  );
}