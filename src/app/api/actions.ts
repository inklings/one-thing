'use server'

export async function sendAnswer(answer: string, histories: string[]) {
  // TODO: answer와 histories를 가지고 chat gpt api를 호출, 받아온 데이터로 새로운 질문과 histories를 반환한다
  console.log(answer, histories)
  return {question: 'new question', histories: ['h1', 'h2']}
}