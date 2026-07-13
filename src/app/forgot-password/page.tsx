import { requestPasswordRecoveryAction } from "@/app/auth-actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/field";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ sent?: string }> }) { const { sent } = await searchParams; return <main className="page-shell grid min-h-[70vh] place-items-center py-10"><Card className="w-full max-w-md"><CardHeader><CardTitle>비밀번호 설정·재설정</CardTitle></CardHeader><CardContent>{sent ? <p className="text-sm text-muted-foreground">해당 이메일 계정이 있다면 재설정 링크를 보냈습니다.</p> : <form action={requestPasswordRecoveryAction} className="space-y-3"><p className="text-sm text-muted-foreground">초대로 자동 생성된 계정도 여기서 처음 비밀번호를 설정할 수 있습니다.</p><Input name="email" type="email" aria-label="이메일" placeholder="이메일" required /><SubmitButton className="w-full" pendingText="메일 요청 중…">재설정 메일 보내기</SubmitButton></form>}</CardContent></Card></main>; }
