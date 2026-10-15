import { useState } from "react";
import { Login } from "../Login/LoginPage";
import { SignUp } from "../SignUp/SignUpPage";
import { useUserStore } from "../../zustand/user";
import type { UserState } from "../../zustand/user";
import { useSignOut } from "../../hooks/auth";

type Mode = "Login" | "Sign Up";

export function Auth() {
  const [mode, setMode] = useState<Mode>("Sign Up");
  const isLoggedIn = useUserStore((state: UserState) => state.isLoggedIn);
  const { mutate, isPending, isError, error } = useSignOut();

  function toggleMode() {
    setMode((prev) => (prev === "Login" ? "Sign Up" : "Login"));
  }

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Signing out...</p>;

  return (
    <>
      {mode === "Login" ? <Login /> : <SignUp />}
      
      <button onClick={toggleMode}>
        {mode === "Login" ? "Sign Up" : "Login"}
      </button>
      
      {isLoggedIn && (
        <button onClick={() => mutate()}>Sign Out</button>
      )}
    </>
  );
}
