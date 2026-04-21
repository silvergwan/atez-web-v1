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
      const history = [...messages, userMessage].map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.text,
      }));

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
      <div className="h-13.25 flex items-center gap-1.5 border-t border-t-white/10 px-2 shrink-0">
        <div className="flex h-auto! flex-row items-end gap-1.5 flex-1">
          <div className="flex flex-1 flex-row items-center overflow-hidden rounded-[20px] bg-[rgba(40,40,41,0.80)] pl-3">
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
              className="flex flex-row items-center justify-center p-1 transition-colors disabled:cursor-not-allowed disabled:text-white/50 my-1 size-7 shrink-0 self-end pr-2.5 outline-none hover:text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 16 16"
                class="size-4 text-gray-300 hover:text-white"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.382"
                  d="M8.195 2v12M3 5l10.39 6M3 11l10.39-6"
                ></path>
              </svg>
            </button>
          </div>

          {/* 전송 버튼 */}
          <button
            onClick={sendMessage}
            disabled={isTyping}
            className="group flex min-w-max flex-row items-center justify-center font-medium text-white transition-colors disabled:cursor-not-allowed disabled:text-white/20 bg-primary-400 hover:bg-primary-500 bg-[#6728FF] body14 my-0.5 size-8 shrink-0 rounded-full p-0 disabled:bg-gray-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="size-4 text-white"
            >
              <path
                fill="currentColor"
                d="M6 4.566c0-1.562 1.71-2.52 3.043-1.706l12.164 7.433c1.277.78 1.277 2.634 0 3.414L9.043 21.14C7.71 21.956 6 20.997 6 19.435z"
              ></path>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
