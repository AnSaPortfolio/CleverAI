import { useState, type FormEvent } from "react";
import s from "./Field.module.css";
import { Send } from "lucide-react";

export function Field() {
  const [answerValue, setAnswerValue] = useState("");

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setAnswerValue("");
  }

  function handleChange(text: string) {
    setAnswerValue(text);
  }

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
          <button className={s.btn} disabled={!answerValue}>
            <Send className={s.sendIcon} />
          </button>
        </form>
      </div>
    </div>
  );
}
