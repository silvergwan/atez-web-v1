import ChatWindow from "../components/ChatWindow";
import "../index.css";
import kmj from "../assets/kmj.png";

export default function ChatPage() {
  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">유민아</div>
        <ChatWindow />
      </div>
    </div>
  );
}
