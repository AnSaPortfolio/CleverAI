import { useState, type FormEvent } from "react";
import { useSignIn } from "../../hooks/auth";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isError, isSuccess, error } = useSignIn();

  function handleChangeEmail(email: string) {
    setEmail(email);
  }

  function handleChangePassword(password: string) {
    setPassword(password);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate({
      email,
      password,
    });
  }

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Loging in.....</p>;
  if (isSuccess) return toast.success("Successfull logged in!");

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <label>
        Email address
        <input
          type="email"
          value={email}
          onChange={(e) => handleChangeEmail(e.target.value)}
          placeholder="thomashartman@example.com"
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => handleChangePassword(e.target.value)}
          placeholder="Enter your password"
        />
      </label>
      <button>Sign Up</button>
    </form>
  );
}
