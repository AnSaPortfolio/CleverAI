import { useState, type FormEvent } from "react";
import { useSignIn } from "../../hooks/auth";
import { toast } from "sonner";
import { useEffect } from "react";
import s from "./Login.module.css";
import { useUserStore, type UserState } from "../../zustand/user";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, isSuccess, error } = useSignIn();

  const login = useUserStore((state: UserState) => state.login);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully logged in!");
          login();
    }
  }, [isSuccess, login]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ email, password });
  }

  return (
    <form className={s.form} onSubmit={handleSubmit}>
      <label className={s.field}>
        <span className={s.label}>Email address</span>

        <input
          className={s.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </label>

      <label className={s.field}>
        <span className={s.label}>Password</span>

        <input
          className={s.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />
      </label>

      {isError && (
        <p className={s.error} role="alert">
          {error.message}
        </p>
      )}

      <button className={s.submitBtn} type="submit" disabled={isPending}>
        {isPending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
