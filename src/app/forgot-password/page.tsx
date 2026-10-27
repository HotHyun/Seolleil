import { ForgotPasswordForm } from "@/components/auth/firebase-password-recovery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  return <main className="page-shell grid min-h-[70vh] place-items-center py-10"><Card className="w-full max-w-md"><CardHeader><CardTitle>비밀번호 설정·재설정</CardTitle></CardHeader><CardContent><ForgotPasswordForm /></CardContent></Card></main>;
}
