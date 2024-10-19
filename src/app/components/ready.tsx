interface ReadyProps {
  onClick: () => void
}
const Ready = ({onClick}: ReadyProps) => {
  return (
    <div className="flex flex-col items-center">
      <p className="text-lg text-center">
        🤗 당신이 오늘 집중해야 할 한 가지!<br/>
        그게 무엇인지 함께 찾아봐요!
      </p>
      <button className="btn" onClick={onClick}>
        시작하기
      </button>
      <p className="text-neutral-500">*성능 향상을 위해 질문과 답변 내용이 수집됩니다</p>
    </div>
  )
}
export default Ready