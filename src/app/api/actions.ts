'use server'
import OpenAI from "openai"

const openai = new OpenAI();

export type Params = {role: 'assistant' | 'user', content: string}

export async function sendAnswer(messages: Params[]) {
  // TODO: system message 보강하기
  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "너는 상담사야 꼬리질문을 통해 사용자가 지금 집중해야 할 중요한 한 가지가 뭔지 찾을 수 있도록 도와줘야해. 목표가 있다면 목표를 달성할 수 있도록, 목표가 없다면 현재 할 수 있는일에 최선을 다하도록 이끌어줘야해. 대화를 통해 지금 집중해야 할 단 한 가지 일을 찾아낸다면 격려의 말과 함께 대화를 끝내도록해" },
      {role: 'assistant', content: '당신의 목표는 무엇인가요?'},
      ...messages],
    model: "gpt-4o-mini",
  });
  console.log(completion.choices)
  const result: Params[] = [...messages, {role: 'assistant', content: completion.choices[0].message.content ?? ''}]
  
  return {messages: result}
}