"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { sendAnswer } from "./api/actions";

export default function Home() {
  const [question, setQuestion] = useState("1. 당신의 목표는 무엇인가요?");
  const [answer, setAnswer] = useState('');
  const [histories, setHistories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const sendAnswerHandler = async (answer: string) => {
    const res = await sendAnswer(answer, histories)
    return res
  }

  const onNextClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await sendAnswerHandler(answer)
      setQuestion(res.question)
      setHistories(res.histories)
      setAnswer('')
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  };

  const answerChangeHandler = (e:ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value)
  }
  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {loading && "로딩중입니다..."}
      <form onSubmit={onNextClick}>
        <label htmlFor="answer">{question}</label>
        <textarea
          value={answer}
          onChange={answerChangeHandler}
          name="answer"
          id="answer"
          maxLength={200}
          className="w-full px-3 py-2 mb-7 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          placeholder="여기에 입력해주세요(200자 이내)"
        />
        <button type="submit" className="border rounded px-3">다음</button>
        {histories.length > 0 && (
          histories.map((history) => <div key={history}>{history}</div>)
        )}
      </form>
    </div>
  );
}
