export default function MessageBubble({ role, text, isError }) {
  const isUser = role === "user";

  // *행동* 패턴을 파싱해서 React 엘리먼트 배열로 변환해요.
  // dangerouslySetInnerHTML 안 쓰고 이렇게 하면 XSS 걱정 없어요.
  const renderText = (raw) => {
    // *...* 기준으로 텍스트를 잘라요.
    // 예: "안녕 *웃으며* 반가워" → ["안녕 ", "*웃으며*", " 반가워"]
    const parts = raw.split(/(\*.*?\*)/g);

    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        // *행동* 부분 → 회색으로
        return (
          <span key={i} className="text-[#B3B3B3] italic">
            {part}
          </span>
        );
      }
      // 일반 텍스트 → 흰색
      return (
        <span key={i} className="text-white">
          {part}
        </span>
      );
    });
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`
          max-w-[75%] px-4 py-3 text-[14px] leading-relaxed whitespace-pre-line
          ${
            isUser
              ? "bg-[#644DD6] rounded-[16px_0px_16px_16px]"
              : "bg-[#212122] rounded-[0px_16px_16px_16px]"
          }
          ${isError ? "opacity-50" : ""}
        `}
      >
        {renderText(text)}
      </div>
    </div>
  );
}
