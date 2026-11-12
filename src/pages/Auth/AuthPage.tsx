import { useState } from "react";
import { Login } from "../Login/LoginPage";
import { SignUp } from "../SignUp/SignUpPage";
import { useUserStore } from "../../zustand/user";
import type { UserState } from "../../zustand/user";
import { useSignOut } from "../../hooks/auth";
import s from "./Auth.module.css";

type Mode = "Login" | "Sign Up";

export function Auth() {
  const [mode, setMode] = useState<Mode>("Sign Up");

  const isLoggedIn = useUserStore(
    (state: UserState) => state.isLoggedIn
  );

  const { mutate, isPending } = useSignOut();

  function toggleMode() {
    setMode((prev) =>
      prev === "Login" ? "Sign Up" : "Login"
    );
  }

  const isLogin = mode === "Login";

  return (
    <main className={s.authPage}>
      {isLoggedIn && <p>You are logged in </p>}
      <div className={s.authCard}>
        <div className={s.authHeader}>
          <div className={s.logo}>C</div>

          <h1 className={s.title}>
            {isLogin ? "Welcome back" : "Welcome to CleverAI"}
          </h1>

          <p className={s.subtitle}>
            {isLogin
              ? "Log in to continue your conversations"
              : "Create an account to get started"}
          </p>
        </div>

        {isLogin ? <Login /> : <SignUp />}

        <div className={s.switchContainer}>
          <span className={s.switchText}>
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}
          </span>

          <button
            type="button"
            className={s.switchBtn}
            onClick={toggleMode}
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>

        {isLoggedIn && (
          <button
            type="button"
            className={s.signOutBtn}
            onClick={() => mutate()}
            disabled={isPending}
          >
            {isPending ? "Signing out..." : "Sign Out"}
          </button>
        )}
      </div>
    </main>
  );
}