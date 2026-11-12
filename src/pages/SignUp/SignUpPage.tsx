import { useEffect, useState, type FormEvent } from "react";
import { useSignUp } from "../../hooks/auth";
import { toast } from "sonner";
import s from "../Login/Login.module.css"

export function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, isSuccess, error } =
    useSignUp();

  useEffect(() => {
    if (isSuccess) {
      toast.success("Successfully signed up!");
    }
  }, [isSuccess]);

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
          placeholder="Create a password"
          minLength={6}
          required
        />
      </label>

      {isError && (
        <p className={s.error} role="alert">
          {error.message}
        </p>
      )}

      <button
        className={s.submitBtn}
        type="submit"
        disabled={isPending}
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}