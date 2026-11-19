// 검색 결과에 나오면 안 되는 경로(개인 트립·공유/초대 토큰·인증·운영·API). robots.txt와 X-Robots-Tag에 같이 쓴다.
export const privatePathPrefixes = [
  "/trips",
  "/share",
  "/invite",
  "/my-trips",
  "/login",
  "/forgot-password",
  "/verify-email",
  "/auth",
  "/admin",
  "/api",
  "/plan",
  "/recommendations"
] as const;
