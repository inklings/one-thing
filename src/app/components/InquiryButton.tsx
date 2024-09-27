'use client'
import { ChangeEvent, Fragment, useRef, useState } from "react"
import { addRow } from "../api/googleSheet"

export default function InquiryButton () {
  const modalRef = useRef<HTMLDialogElement>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [content, setContent] = useState('')

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  const handleMailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value)
  }
  
  const openModal = () => {
    modalRef.current?.showModal()
  }

  const closeModal = () => {
    setName('')
    setEmail('')
    setContent('')
    modalRef.current?.close()
  }

  const onSubmit = async () => {
    const date = new Date().toLocaleString()
    try{ 
      await addRow('Inquiry', [[name, email, content, date]])
      closeModal()
    } catch(e) {
      console.error(e)
    }
  }

  return (
    <Fragment>
      <button className="btn btn-ghost" onClick={openModal}>문의하기</button>
      <dialog ref={modalRef} id="my_modal_1" className="modal">
        <div className="modal-box">
          <p>개발팀에게 하고싶은 이야기가 있으면 보내주세요!</p>
          <div>
            <div className="label">
              <span className="label-text">이름</span>
            </div>
            <input value={name} onChange={handleNameChange} type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            <div className="label">
              <span className="label-text">이메일</span>
            </div>
            <input value={email} onChange={handleMailChange} type="email" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
            <div className="label">
              <span className="label-text">내용<span className="text-red-500 text-base">*</span></span>
            </div>
            <textarea
              value={content}
              onChange={handleContentChange}
              maxLength={200}
              className="textarea textarea-bordered w-full text-base"
              placeholder="여기에 입력해주세요(200자 이내)"
            />
              <div className="flex justify-center gap-x-2">
                <button onClick={closeModal} className="btn w-20">취소</button>
                <button onClick={onSubmit} className="btn w-20 btn-accent">보내기</button>
              </div>
          </div>
        </div>
     </dialog>
    </Fragment>
  )
}