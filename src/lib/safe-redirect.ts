// 로그인·이메일 인증 뒤에 돌아갈 주소는 같은 사이트의 경로만 허용한다(open redirect 방지).
// "//evil.com", "/\\evil.com", 제어 문자, 외부 origin으로 해석되는 값은 모두 기본 경로로 바꾼다.
export function safeCallbackPath(value: string | null | undefined, fallback = "/my-trips") {
  if (!value || value.length > 512) return fallback;
  if (!value.startsWith("/") || value.startsWith("//")) return fallback;
  if (/[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  try {
    const base = "https://callback.invalid";
    const url = new URL(value, base);
    if (url.origin !== base) return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
