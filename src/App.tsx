import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './App.css'
import { Field } from './components/Field/Field'
import { Toaster } from "sonner"
import { Auth } from './pages/Auth/AuthPage'
import { useUserStore, type UserState } from './zustand/user'

function App() {
  const isLoggedIn = useUserStore((state: UserState) => state.isLoggedIn);
    const queryClient = new QueryClient()

  return (
    <>
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <Field />
      {isLoggedIn &&  <Auth />}
    </QueryClientProvider>
    </>
  )
}

export default App
