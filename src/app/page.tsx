"use client";

import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { Params, sendAnswer } from "./api/actions";
import { addRow } from "./api/googleSheet";
import Ready from "./components/ready";

export default function Home() {
  const messageEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null) 
  const [status, setStatus] = useState<"ready" | "inProgress" | "end">('ready');
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

  const onNextClick = async (e?: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault()
    textareaRef.current?.focus()
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

  const scrollToBottom = () => {
    if(messageEndRef.current) {
      messageEndRef.current?.scrollIntoView({behavior:'smooth'})
    }
  }

  useEffect(() => {
    if (status === "end") {
      handleAddRow(); // 상태가 "end"로 바뀌면 handleAddRow 실행
    }
  }, [status]); // status가 업데이트될 때마다 호출

  useEffect(() => {
    if(histories.length > 0){
      scrollToBottom()
    }
  },[histories, loading])

  return (
    <>
        {status === "ready" && (
          <Ready onClick={onStartClick}/>
        )}
        {status === "inProgress" && (
          <>
            <div className="flex-1 overflow-y-auto">
              <p>🙂 당신의 목표는 무엇인가요?</p>
              {histories.map(({content, role}, index) => {
                if(role === 'assistant'){
                  return (
                    <p className="pr-4" key={index}>🙂 {content}</p>
                  )
                }
                return <div className="flex justify-end" key={index}><p className="bg-gray-100 px-4 rounded-lg">{content}</p></div>
              })} 
              {loading && <span className="ml-5 loading loading-dots"></span>}
              <div ref={messageEndRef}></div>
            </div>
            <div className="flex bg-white flex-col sticky bottom-0">
            {loading ? "😐" : "🤔"}
            <div className="flex items-end gap-2 pb-4">
              <textarea
                ref={textareaRef}
                value={answer}
                onChange={answerChangeHandler}
                onKeyDown={onPressEnter}
                maxLength={200}
                className="textarea textarea-bordered w-full text-base"
                placeholder="여기에 입력해주세요(200자 이내)"
              />
              <button onClick={onNextClick} className="btn btn-circle">
                Enter
              </button>
            </div>
            </div>
          </>
        )}
        {status === "end" && (
          <div className="flex flex-col items-center">
            <p>😊 {counselorMessage} 🥳</p>
            <button onClick={onStartClick} className="btn">
              다시하기
            </button>
          </div>
        )}
    </>
  );
}
