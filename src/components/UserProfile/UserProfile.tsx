import { useSession } from "../../hooks/auth";
import s from "./UserProfile.module.css";

export function UserProfile() {
  const { data: session, isError, isPending, error } = useSession();
  if (!session?.user) return null;

  if (isError) return <p>{error.message}</p>;
  if (isPending) return <p>Fetching user session...</p>;
  const email = session?.user.email?.slice(0, 1).toUpperCase();

  return (
    <div className={s.wrapper}>
      <span className={s.email}>{email}</span>
    </div>
  );
}
