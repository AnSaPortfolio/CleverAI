import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import { Field } from "./components/Field/Field";
import { Toaster } from "sonner";
import { Auth } from "./pages/Auth/AuthPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Chat } from "./pages/Chat/Chat";
import { ChatLayout } from "./components/ChatLayout/ChatLayout";

const queryClient = new QueryClient();

function App() {

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />

      <BrowserRouter>
        <Routes>
          <Route element={<ChatLayout />}>
            <Route index element={<Field />} />
            <Route path="/login" element={<Auth />} />

            <Route
              path="chats/:chatId"
              element={
                <>
                  <Chat />
                  <Field />
                </>
              }
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
