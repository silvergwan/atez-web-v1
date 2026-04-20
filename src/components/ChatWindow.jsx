import { useState, useRef, useEffect } from "react";
import { sendMessageToAPI } from "../api";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const textareaRef = useRef(null);
  const bottomRef = useRef(null);

  // 메시지가 추가될 때마다 자동으로 맨 아래로 스크롤
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleInput = (e) => {
    setInput(e.target.value);
    // textarea 높이 자동 조절
    const el = textareaRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const sendMessage = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = { role: "user", text: input, id: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    textareaRef.current.style.height = "auto";

    setIsTyping(true);
    try {
      const response = await sendMessageToAPI(userMessage.text);
      const botMessage = {
        role: "bot",
        text: response.reply,
        id: Date.now() + 1,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch {
      const errMessage = {
        role: "bot",
        text: "응답을 받지 못했어요. 잠시 후 다시 시도해 주세요.",
        id: Date.now() + 1,
        isError: true,
      };
      setMessages((prev) => [...prev, errMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // * 버튼 클릭 시 커서 위치에 * 삽입
  const insertStar = () => {
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const newVal = input.slice(0, start) + "*" + input.slice(end);
    setInput(newVal);
    // 삽입 후 커서를 * 다음으로 이동
    setTimeout(() => {
      el.selectionStart = start + 1;
      el.selectionEnd = start + 1;
      el.focus();
    }, 0);
  };

  return (
    <>
      {/* 메시지 목록 영역 */}
      <div className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-3">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            text={msg.text}
            isError={msg.isError}
          />
        ))}

        {/* 타이핑 인디케이터 */}
        {isTyping && (
          <div className="self-start bg-[#212122] rounded-[0px_20px_20px_20px] px-4 py-3">
            <div className="flex gap-1 items-center">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* 자동 스크롤 타겟 */}
        <div ref={bottomRef} />
      </div>

      {/* 인풋 영역 */}
      <div className="h-13 flex items-center px-4 gap-2 shrink-0 border-t border-white/10">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요..."
          rows={1}
          className="flex-1 bg-transparent resize-none outline-none text-white text-[14px] placeholder-white/30 leading-relaxed"
          style={{ maxHeight: "40px" }}
        />

        {/* * 버튼 */}
        <button
          onClick={insertStar}
          className="text-[#B3B3B3] text-[16px] font-medium w-8 h-8 flex items-center justify-center hover:text-white transition-colors"
        >
          *
        </button>

        {/* 전송 버튼 */}
        <button
          onClick={sendMessage}
          disabled={isTyping}
          className="w-8 h-8 rounded-full bg-[#6728FF] flex items-center justify-center disabled:opacity-40 transition-opacity"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </>
  );
}
