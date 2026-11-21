// 모든 응답에 붙이는 보안 헤더. next.config.ts에서 사용한다.
// CSP는 Next.js 인라인 스크립트 때문에 script-src에 'unsafe-inline'을 두지만, 허용 출처·프레임·폼 전송·base를 제한해 피해 범위를 줄인다.
// 카카오 지도 SDK가 eval을 쓰므로 'unsafe-eval'은 지도를 그리는 경로에만 허용하고, 로그인·약관·관리자 화면 등은 허용하지 않는다.
const kakao = ["https://dapi.kakao.com", "https://*.kakao.com", "https://*.daumcdn.net", "https://*.kakaocdn.net"];
// 로컬(http://localhost)에서는 카카오 SDK가 http 주소로 본 스크립트와 타일을 받는다. 운영은 https라 열지 않는다.
const kakaoDevHttp = process.env.NODE_ENV === "production" ? [] : ["http://dapi.kakao.com", "http://*.kakao.com", "http://*.daumcdn.net", "http://*.kakaocdn.net"];
const umami = "https://umami.hothyun.com";
const cloudflareInsights = ["https://static.cloudflareinsights.com", "https://cloudflareinsights.com"];
const sentryIngest = ["https://*.ingest.us.sentry.io", "https://*.ingest.sentry.io"];
const googleAuth = ["https://apis.google.com", "https://www.gstatic.com", "https://accounts.google.com", "https://www.googleapis.com", "https://*.googleapis.com", "https://korean-ski.firebaseapp.com", "https://*.firebaseapp.com"];
const recaptcha = ["https://www.google.com", "https://www.recaptcha.net"];

// React 개발 모드는 콜스택 복원에 eval을 쓴다. 운영 빌드에서는 지도 경로(allowEval)에만 허용한다.
const isDev = process.env.NODE_ENV === "development";

export function buildContentSecurityPolicy({ allowEval }: { allowEval: boolean }) {
  const evalSource = allowEval || isDev ? " 'unsafe-eval'" : "";
  return [
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline'${evalSource} ${[...kakao, ...kakaoDevHttp, umami, "https://apis.google.com", "https://www.gstatic.com", ...recaptcha, ...cloudflareInsights].join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    `img-src 'self' data: blob: https:${kakaoDevHttp.length ? " http:" : ""}`,
    "font-src 'self' data:",
    `connect-src 'self' ${[...kakao, ...kakaoDevHttp, umami, ...googleAuth, ...recaptcha, ...cloudflareInsights, ...sentryIngest].join(" ")}`,
    `frame-src ${["https://korean-ski.firebaseapp.com", "https://*.firebaseapp.com", "https://accounts.google.com", ...recaptcha].join(" ")}`,
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join("; ");
}

// 카카오 지도를 쓰는 경로(스키장 지도·트립·공유). 나머지는 모두 eval 없이 서비스한다.
export const mapPageSources = ["/resorts/:path*", "/trips/:path*", "/my-trips/:tripId/:path*", "/share/:path*"];
export const strictPageSource = "/:path((?!resorts|trips|share|my-trips/).*)";

export const baseSecurityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()" }
];
