import { useState, type FormEvent } from "react";
import s from "./Field.module.css";
import { Send } from "lucide-react";
import { useSendMessage } from "../../hooks/answer";

export function Field() {
  const [answerValue, setAnswerValue] = useState("");
  const { mutate, isPending, error, isError } = useSendMessage()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

   mutate(answerValue)

    setAnswerValue("");
  }

  function handleChange(text: string) {
    setAnswerValue(text);
  }

  if(isPending) return <p>СleverAI is thinking...</p>
  if(isError) return <p>{error.message}</p>

  return (
    <div className="container">
      <div className={s.wrapper}>
        <form className={s.form} onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            className={s.field}
            onChange={(e) => handleChange(e.target.value)}
            value={answerValue}
            placeholder="Ask CleverAI"
          />
          <button className={s.btn} disabled={!answerValue.trim()}>
            <Send className={s.sendIcon} />
          </button>
        </form>
      </div>
    </div>
  );
}
