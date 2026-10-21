import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Field } from "./components/Field/Field";
import { Toaster } from "sonner";
import { Auth } from "./pages/Auth/AuthPage";
import { useUserStore, type UserState } from "./zustand/user";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from "./pages/Chat/Chat";
import { Chats } from "./components/Chats/Chats";

const queryClient = new QueryClient();

function App() {
  const isLoggedIn = useUserStore(
    (state: UserState) => state.isLoggedIn
  );

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Field />} />
          <Route path="/chats" element={<Chats />} />
          <Route
            path="/chats/:chatId"
            element={
              <>
                <Chat />
                <Field />
              </>
            }
          />
        </Routes>
      </BrowserRouter>

      {isLoggedIn && <Auth />}
    </QueryClientProvider>
  );
}

export default App;
