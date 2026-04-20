import ChatWindow from "../components/ChatWindow";

export default function ChatPage() {
  return (
    <div className="min-h-screen w-full flex justify-center bg-black">
      <div
        className="w-120 h-screen flex flex-col"
        style={{ backgroundColor: "#151516" }}
      >
        {/* 헤더 */}
        <header className="h-13 flex items-center px-2.5 shrink-0 border-b border-white/10">
          <span className="title16 line-clamp-1 flex h-header flex-row items-center gap-0 text-ellipsis text-white">
            유민아
          </span>
        </header>
        {/* 메시지 영역 - ChatWindow가 채울 예정 */}
        <ChatWindow />
      </div>
    </div>
  );
}
