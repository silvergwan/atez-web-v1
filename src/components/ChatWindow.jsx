import { useState } from "react";
import { sendMessageToAPI } from "../api";
import MessageBubble from "./MessageBubble";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const myMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, myMessage]);
    setInput("");

    setIsTyping(true);

    const response = await sendMessageToAPI(input);

    setIsTyping(false);

    const botMessage = { role: "bot", text: response.reply };
    setMessages((prev) => [...prev, botMessage]);
  };

  return (
    <>
      <div className="messages-area">
        {messages.map((msg, i) => (
          <MessageBubble key={i} role={msg.role} text={msg.text} />
        ))}

        {isTyping && (
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </div>

      <div className="input-area">
        <input
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>전송</button>
      </div>
    </>
  );
}
