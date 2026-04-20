// sendMessageToAPI 함수에 에러 처리를 추가합니다.
// try/catch로 감싸서 네트워크 오류나 서버 오류를 잡아냅니다.
// messages 배열을 함께 전송
export async function sendMessageToAPI(message, history) {
  try {
    const res = await fetch(import.meta.env.VITE_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CLIENT-TOKEN": import.meta.env.VITE_CLIENT_TOKEN,
      },
      body: JSON.stringify({ message, history }), // history 추가
    });

    // HTTP 상태 코드가 200번대가 아니면 에러를 throw합니다.
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);

    return res.json();
  } catch (err) {
    // 에러를 다시 throw해서 호출한 쪽(ChatWindow)에서 처리하게 합니다.
    throw err;
  }
}
