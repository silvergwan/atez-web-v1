// dangerouslySetInnerHTML 대신 텍스트를 직접 파싱해서 React 엘리먼트로 렌더링합니다.
// 이렇게 하면 서버 응답에 악성 HTML이 섞여도 그냥 텍스트로 출력돼서 안전합니다.
export default function MessageBubble({ role, text, isError }) {
  const isUser = role === "user";

  // *행동* 패턴을 파싱해서 React 엘리먼트 배열로 만듭니다.
  // "안녕 *웃으며* 반가워" → ["안녕 ", <span>웃으며</span>, " 반가워"]
  const renderText = (raw) => {
    const parts = raw.split(/(\*.*?\*)/g); // *...* 기준으로 split
    return parts.map((part, i) => {
      if (part.startsWith("*") && part.endsWith("*")) {
        // *행동* 부분은 span으로 감싸서 스타일 적용
        return (
          <span key={i} className="action">
            {part.slice(1, -1)} {/* 앞뒤 * 제거 */}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={`bubble ${isUser ? "user" : "bot"} ${isError ? "error" : ""}`}
    >
      {renderText(text)}
    </div>
  );
}
