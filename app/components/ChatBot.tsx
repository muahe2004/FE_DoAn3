import Button from "~/components/Button";

import "../styles/chat-bot.css";
import { useRef } from "react";


export default function ChatBot() {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        const form = formRef.current;
    
        if (textarea && form) {
            textarea.style.height = "auto";
    
            // Nếu người dùng nhập nhiều dòng (ví dụ > 3 dòng)
            if (textarea.scrollHeight > 72) { // khoảng 3 dòng x 24px/dòng
                textarea.style.height = "230px";
                form.style.height = "250px";
            } else {
                // textarea.style.height = "auto";
                form.style.height = "80px"; // chiều cao ban đầu
            }
        }
    };
    
    
  return (
    <div className="chatbot-wrapper">
      <div className="chatbot-inner">
        {/* Header */}
        <div className="chatbot-header">
            <div className="chatbot-logo">
                <h2 className="chatbot-name">MLearning AI</h2>
            </div>

            <div className="chatbot-actions">
                <button className="chatbot-close">
                    <img src="./icons/Close.svg" alt="" />
                </button>
            </div>
        </div>

        {/* Chat box */}
        <div className="chatbot-container">

        </div>

        {/* Form */}
        <form className="chatbot-form" ref={formRef}>
            <div className="chatbot-form__inner">
                {/* <input type="text" className="chatbot-input" /> */}
                <textarea ref={textareaRef} className="chatbot-input" name="" id="" placeholder="Hỏi gì đó đi.." onInput={handleInput} ></textarea>
            </div>

            <div className="chatbot-form__actions">
                <Button className="chatbot-btn" to="">
                    <img src="./icons/Arrow-top.svg" alt="" />
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}

