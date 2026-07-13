"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Link2, MailPlus, ShieldCheck, Trash2, UserRound } from "lucide-react";
import { createShareLinkSafeAction, inviteTripMemberSafeAction, removeTripMemberAction, revokeShareLinkAction, updateTripMemberAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { ShareLinkBox } from "@/components/share-link-box";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TripMembership } from "@/lib/trip-collaboration";
import type { TripShareLinkRecord } from "@/lib/trip-store";

export function SharingManagement({ tripId, editToken, shareUrl, sharePermission, links, members, allowAccountInvites }: { tripId: string; editToken?: string; shareUrl?: string; sharePermission: "read" | "edit"; links: TripShareLinkRecord[]; members: TripMembership[]; allowAccountInvites: boolean }) {
  const router = useRouter();
  const [latestShare, setLatestShare] = useState(shareUrl ? { path: shareUrl, permission: sharePermission } : null);
  const activeLinks = links.filter(link => !link.revokedAt);
  async function run(action: (data: FormData) => Promise<Parameters<typeof showActionResult>[0]>, formData: FormData) {
    const result = await action(formData); showActionResult(result); if (result.ok) router.refresh();
  }
  return <div className="space-y-7">
    <section className="space-y-3">
      <div className="flex items-start gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary"><Link2 className="h-4 w-4" /></span><div><h3 className="font-black">링크가 있는 사용자</h3><p className="mt-1 text-xs text-muted-foreground">로그인 없이 링크별 권한으로 접근합니다.</p></div></div>
      {latestShare ? <ShareLinkBox sharePath={latestShare.path} permission={latestShare.permission} /> : null}
      <form action={async data => { const result = await createShareLinkSafeAction(data); showActionResult(result); if (result.ok && result.data) { setLatestShare({ path: result.data.sharePath, permission: result.data.permission }); router.refresh(); } }} className="grid gap-3 sm:grid-cols-[1fr_auto]"><AccessFields tripId={tripId} editToken={editToken} /><Select name="permission" defaultValue="read"><SelectTrigger aria-label="새 링크 권한"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="read">보기만 가능</SelectItem><SelectItem value="edit">편집 가능</SelectItem></SelectContent></Select><Button variant="secondary"><Link2 className="h-4 w-4" /> 새 링크</Button></form>
      <div className="divide-y rounded-xl border">
        {activeLinks.length ? activeLinks.map(link => <div key={link.id} className="flex items-center gap-3 p-3"><ShieldCheck className="h-4 w-4 text-primary" /><div className="min-w-0 flex-1"><p className="text-sm font-bold">{link.permission === "edit" ? "편집 링크" : "보기 링크"}</p><p className="text-xs text-muted-foreground">{new Intl.DateTimeFormat("ko-KR", { dateStyle: "medium" }).format(link.createdAt)} 생성 · 원문 주소는 보안상 다시 표시하지 않음</p></div><form action={data => run(revokeShareLinkAction, data)}><AccessFields tripId={tripId} editToken={editToken} /><input type="hidden" name="linkId" value={link.id} /><Button type="submit" variant="ghost" className="text-destructive" aria-label={`${link.permission === "edit" ? "편집" : "보기"} 링크 비활성화`}><Trash2 className="h-4 w-4" /></Button></form></div>) : <p className="p-3 text-sm text-muted-foreground">활성 공유 링크가 없습니다.</p>}
      </div>
    </section>
    {allowAccountInvites ? <section className="space-y-3 border-t pt-6">
      <div className="flex items-start gap-3"><span className="rounded-lg bg-primary/10 p-2 text-primary"><UserRound className="h-4 w-4" /></span><div><h3 className="font-black">초대된 사용자</h3><p className="mt-1 text-xs text-muted-foreground">가입 계정별 권한을 변경하거나 접근을 제거합니다.</p></div></div>
      <form action={data => run(inviteTripMemberSafeAction, data)} className="grid gap-3"><input type="hidden" name="tripId" value={tripId} /><input className="h-11 rounded-md border bg-background px-3" name="email" type="email" placeholder="동행자 이메일" aria-label="동행자 이메일" required /><div className="grid gap-3 sm:grid-cols-[1fr_auto]"><Select name="permission" defaultValue="read"><SelectTrigger aria-label="초대 권한"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="read">보기</SelectItem><SelectItem value="edit">편집</SelectItem></SelectContent></Select><Button><MailPlus className="h-4 w-4" /> 초대 메일</Button></div></form>
      <div className="divide-y rounded-xl border">
        {members.length ? members.map(member => <div key={member.$id} className="grid gap-3 p-3 sm:grid-cols-[1fr_150px_auto] sm:items-center"><div className="min-w-0"><p className="truncate text-sm font-bold">{member.userName || member.userEmail || "초대 사용자"}</p><p className="truncate text-xs text-muted-foreground">{member.userEmail} · {member.confirm ? "참여 중" : "수락 대기"}</p></div>{member.roles.includes("owner") ? <span className="text-xs font-bold text-muted-foreground">소유자</span> : <><form id={`member-${member.$id}`} action={data => run(updateTripMemberAction, data)}><input type="hidden" name="tripId" value={tripId} /><input type="hidden" name="membershipId" value={member.$id} /><Select name="permission" defaultValue={member.roles.includes("editor") ? "edit" : "read"} onValueChange={() => window.requestAnimationFrame(() => (document.getElementById(`member-${member.$id}`) as HTMLFormElement | null)?.requestSubmit())}><SelectTrigger aria-label={`${member.userEmail} 권한`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="read">보기</SelectItem><SelectItem value="edit">편집</SelectItem></SelectContent></Select></form><form action={data => run(removeTripMemberAction, data)}><input type="hidden" name="tripId" value={tripId} /><input type="hidden" name="membershipId" value={member.$id} /><Button variant="ghost" className="text-destructive" aria-label={`${member.userEmail} 내보내기`}><Trash2 className="h-4 w-4" /></Button></form></>}</div>) : <p className="p-3 text-sm text-muted-foreground">초대된 사용자가 없습니다.</p>}
      </div>
    </section> : null}
  </div>;
}

function AccessFields({ tripId, editToken }: { tripId: string; editToken?: string }) {
  return <><input type="hidden" name="tripId" value={tripId} />{editToken ? <input type="hidden" name="editToken" value={editToken} /> : null}</>;
}
