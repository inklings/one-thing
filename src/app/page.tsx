"use client";

import {
  ChangeEvent,
  FormEvent,
  Fragment,
  KeyboardEvent,
  useMemo,
  useState,
  useEffect,
} from "react";
import { Params, sendAnswer } from "./api/actions";
import { addRow } from "./api/googleSheet";

export default function Home() {
  const [status, setStatus] = useState<"ready" | "inProgress" | "end">("ready");
  const [answer, setAnswer] = useState("");
  const [histories, setHistories] = useState<Params[]>([]);
  const [loading, setLoading] = useState(false);

  const counselorMessage = useMemo(() => {
    if (histories.length === 0) {
      return "당신의 목표는 무엇인가요?";
    }
    const result = histories[histories.length - 1].content;
    return result.replace("{{END}}", "");
  }, [histories]);

  const sendAnswerHandler = async () => {
    const res = await sendAnswer([
      ...histories,
      { role: "user", content: answer },
    ]);
    return res;
  };

  const onNextClick = async (e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    try {
      setLoading(true);
      const res = await sendAnswerHandler();
      const message = res.messages[res.messages.length - 1].content;
      setHistories(res.messages);

      if (message.includes("{{END}}")) {
        setStatus("end");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      setAnswer("");
    }
  };

  const answerChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(e.target.value);
  };

  const onStartClick = () => {
    setHistories([]);
    setStatus("inProgress");
  };

  const onPressEnter = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) {
      return;
    }
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }
    if (e.key === "Enter" && !loading) {
      e.preventDefault();
      onNextClick();
      return;
    }
  };

  const handleAddRow = async () => {
    try {
      const date = new Date().toLocaleString(); // 현재 날짜
      let conversationSummary = ""; // 질문과 답변을 모아 저장할 문자열

      // 첫 번째 질문을 수동으로 추가
      conversationSummary += `Q: 당신의 목표는 무엇인가요?\n`;
      // histories에서 질문과 답변을 추출하여 하나의 문자열로 합침
      for (let i = 0; i < histories.length - 1; i++) {
        const item = histories[i];

        if (item.role === "user") {
          const userAnswer = item.content;
          conversationSummary += `A: ${userAnswer}\n\n`;
        } else if (item.role === "assistant") {
          const assistantQuestion = item.content;
          conversationSummary += `Q: ${assistantQuestion}\n`;
        }
      }

      // 마지막답변
      const lastItem = histories[histories.length - 1];
      conversationSummary += "Conclustion: " + lastItem.content;

      // Google Sheets에 [질문&답변 모음, 날짜] 형식으로 저장
      await addRow("Query&Answer", [[conversationSummary, date]]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status === "end") {
      handleAddRow(); // 상태가 "end"로 바뀌면 handleAddRow 실행
    }
  }, [status]); // status가 업데이트될 때마다 호출

  return (
    <div className="font-[family-name:var(--font-geist-sans)]">
      {status === "ready" && (
        <div className="flex flex-col items-center">
          <p>
            🤗 당신이 오늘 집중해야 할 한 가지, 그게 무엇인지 함께 찾아봐요! 🙌
          </p>
          <button className="btn" onClick={onStartClick}>
            시작하기
          </button>
        </div>
      )}
      {status === "inProgress" && (
        <Fragment>
          <div className="mt-4 min-h-40">
            🙂
            <p className="mt-0 pl-4">
              {loading ? (
                <span className="loading loading-dots"></span>
              ) : (
                `${counselorMessage}`
              )}
            </p>
          </div>
          {loading ? "😐" : "🤔"}
          <div className="flex items-end gap-x-2">
            <textarea
              value={answer}
              onChange={answerChangeHandler}
              onKeyDown={onPressEnter}
              maxLength={200}
              className="textarea textarea-bordered w-full"
              placeholder="여기에 입력해주세요(200자 이내)"
            />
            <button type="submit" className="btn btn-circle">
              Enter
            </button>
          </div>
        </Fragment>
      )}
      {status === "end" && (
        <div className="flex flex-col items-center">
          <p>😊 {counselorMessage} 🥳</p>
          <button onClick={onStartClick} className="btn">
            다시하기
          </button>
        </div>
      )}
    </div>
  );
}
