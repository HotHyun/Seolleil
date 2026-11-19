import "server-only";

import { notFound } from "next/navigation";
import { getSession } from "@/lib/session";

export function getAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined, adminEmails = getAdminEmails()) {
  return Boolean(email && adminEmails.includes(email.trim().toLowerCase()));
}

// 운영 화면은 ADMIN_EMAILS에 등록된, 이메일 인증을 마친 로그인 사용자만 볼 수 있다. 그 외에는 존재를 숨기려고 404로 응답한다.
export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user?.emailVerified || !isAdminEmail(session.user.email)) notFound();
}
