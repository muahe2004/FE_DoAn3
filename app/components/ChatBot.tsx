import Button from "~/components/Button";

import "../styles/chat-bot.css";
import "../styles/Responsive/Components/chat-bot.css";

import { useEffect, useRef, useState } from "react";

type ChatBotProps = {
    isOpen: boolean;
    onClose: () => void;
    className?: string; 
};
  
export default function ChatBot({ isOpen, onClose, className }: ChatBotProps) {

    // Chỉnh size input
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const formRef = useRef<HTMLFormElement | null>(null);

    // Chỉnh chiều cao của input
    const handleInput = () => {
        const textarea = textareaRef.current;
        const form = formRef.current;
    
        if (textarea && form) {
            textarea.style.height = "auto";
    
            if (textarea.scrollHeight > 96) { 
                textarea.style.height = "230px";
                form.style.height = "250px";
            } else {
                form.style.height = "80px"; 
            }
        }
    };

    // Gửi tin nhắn hỏi
    const handleSendMess = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendMessage();
    };
    
    // API chat
    const sendMessage = async () => {
        const form = formRef.current;
        const input = form?.querySelector<HTMLTextAreaElement>('textarea[name="chat-input"]');
    
        if (!input?.value.trim()) {
            console.log("Chưa nhập gì");
            return;
        }
    
        const userMessage = input.value.trim();
    
        // Lấy lịch sử từ localStorage
        let chatHistory: any[] = [];
        const storedHistory = localStorage.getItem("chatHistory");
    
        if (storedHistory) {
            try {
                chatHistory = JSON.parse(storedHistory);
            } catch (e) {
                console.warn("Lỗi khi parse chatHistory, sẽ khởi tạo lại.");
                chatHistory = [];
            }
        }
    
        // Đẩy câu hỏi mới của người dùng vào lịch sử
        chatHistory.push({
            role: "user",
            parts: [{ text: userMessage }]
        });
    
        const body = { contents: chatHistory };

        // Reset chiều cao sau khi gửi
        input.value = ""; 
        if (textareaRef.current && formRef.current) {
            textareaRef.current.style.height = "auto";
            formRef.current.style.height = "80px";
        }
    
        try {
            const res = await fetch("http://localhost:1000/AIChat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
    
            if (res.ok) {
                
                setTimeout(scrollToBottom, 100); 
                const data = await res.json();
    
                const aiReply = data.reply || data.content || "Không có phản hồi";
    
                chatHistory.push({
                    role: "model",
                    parts: [{ text: aiReply }]
                });
    
                // Cập nhật lại localStorage
                localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
                setChatHistory([...chatHistory]);
            } else {
                console.error("Gửi thất bại. Mã lỗi:", res.status);
            }
        } catch (err) {
            console.log("Lỗi: ", err);
        }
    };

    // Lấy chat từ local
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    useEffect(() => {
        const storedChat = localStorage.getItem("chatHistory");

        if (storedChat) {
            try {
                setChatHistory(JSON.parse(storedChat));
            } catch {setChatHistory([]);}
        }
    }, []);
    
    // Click ra ngoài
    const wrapperRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleClickOutSide = (event: MouseEvent) => {
            if (
                isOpen &&
                wrapperRef.current &&
                !wrapperRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutSide);
        return () => {
          document.removeEventListener("mousedown", handleClickOutSide);
        };
      }, [isOpen, onClose]);


    //   Trượt xuống sau khi có res
    const containerRef = useRef<HTMLDivElement | null>(null);
    const scrollToBottom = () => {
    if (containerRef.current) {
        containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: "smooth"
        });
    }
    };

  return (
    <div ref={wrapperRef} className={`chatbot-wrapper ${isOpen ? "open" : "closed"} ${className}`}>
      <div className="chatbot-inner">
        {/* Header */}
        <div className="chatbot-header">
            <div className="chatbot-logo">
                <h2 className="chatbot-name">MLearning AI</h2>
            </div>

            <div className="chatbot-actions">
                <button onClick={onClose} className="chatbot-close">
                    <img src="/icons/Close.svg" alt="" />
                </button>
            </div>
        </div>

        {/* Chat box */}
        <div className="chatbot-container" ref={containerRef}>
            {chatHistory.map((item, index) => (
                <div className={`chat-content ${item.role === "user" ? "chat-item__content" : "chat-item__content--bot"}`}>
                    <div
                        key={index}
                        className={`chat-message ${item.role === "user" ? "user-message" : "bot-message"}`}
                    >
                        {item.parts[0].text}
                    </div>
                </div>
        ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSendMess} className="chatbot-form" ref={formRef}>
            <div className="chatbot-form__inner">
                <textarea
                    ref={textareaRef}
                    className="chatbot-input"
                    name="chat-input"
                    placeholder="Hỏi gì đó đi.."
                    onInput={handleInput}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage(); 
                        }
                    }}
                ></textarea>
            </div>

            <div className="chatbot-form__actions">
                <Button type="submit" className="chatbot-btn" to="" >
                    <img src="/icons/Arrow-top.svg" alt="" />
                </Button>
            </div>
        </form>
      </div>
    </div>
  );
}

