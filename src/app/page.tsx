"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { Params, sendAnswer } from "./api/actions";

export default function Home() {
  const [question, setQuestion] = useState("1. 당신의 목표는 무엇인가요?");
  const [answer, setAnswer] = useState('');
  const [histories, setHistories] = useState<Params[]>([]);
  const [loading, setLoading] = useState(false);

  const sendAnswerHandler = async () => {
    const res = await sendAnswer([...histories, {role: 'user', content: answer}])
    return res
  }

  const onNextClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setLoading(true)
      const res = await sendAnswerHandler()
      setQuestion(res.messages[res.messages.length-1].content ?? '')
      setHistories(res.messages)
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
      </form>
    </div>
  );
}
