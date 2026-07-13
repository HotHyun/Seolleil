"use client";

import { useState } from "react";
import { Copy, CopyPlus, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { deleteTripAction, duplicateTripAction, inviteTripMemberAction, regenerateShareLinkAction } from "@/app/actions";
import { ShareLinkBox } from "@/components/share-link-box";
import { TripEditForm } from "@/components/trip/trip-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type TripFormData = React.ComponentProps<typeof TripEditForm>["trip"];
type Panel = "edit" | "share" | "duplicate" | "delete" | null;

export function TripManagementMenu({ trip, editToken, shareUrl, sharePermission = "read" }: { trip: TripFormData; editToken?: string; shareUrl?: string; sharePermission?: "read" | "edit" }) {
  const [panel, setPanel] = useState<Panel>(null);
  const accessField = editToken
    ? <input type="hidden" name="editToken" value={editToken} />
    : <input type="hidden" name="tripId" value={trip.id} />;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="h-10 px-3" aria-label="트립 관리 메뉴">
            <MoreHorizontal className="h-5 w-5" /> <span className="hidden sm:inline">트립 관리</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setPanel("edit")}><Pencil className="h-4 w-4" /> 트립 수정</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setPanel("share")}><Share2 className="h-4 w-4" /> 공유 관리</DropdownMenuItem>
          {!editToken ? <DropdownMenuItem onSelect={() => setPanel("duplicate")}><CopyPlus className="h-4 w-4" /> 트립 복제</DropdownMenuItem> : null}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setPanel("delete")}><Trash2 className="h-4 w-4" /> 트립 삭제</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null); }}>
        <DialogContent className="bottom-0 top-auto max-h-[88svh] max-w-xl translate-y-0 overflow-y-auto rounded-b-none sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          {panel === "edit" ? <><DialogHeader><DialogTitle>트립 수정</DialogTitle><DialogDescription>현재 트립의 일정과 선택 옵션을 변경합니다.</DialogDescription></DialogHeader><TripEditForm trip={trip} editToken={editToken} /></> : null}
          {panel === "share" ? <><DialogHeader><DialogTitle>트립 공유</DialogTitle><DialogDescription>Google Docs처럼 링크 접근과 사용자 초대를 한곳에서 관리합니다.</DialogDescription></DialogHeader><div className="space-y-6"><section className="space-y-3"><div><h3 className="font-black">링크가 있는 사용자</h3><p className="mt-1 text-xs text-muted-foreground">로그인 없이 설정한 권한으로 접근합니다.</p></div>{shareUrl ? <ShareLinkBox sharePath={shareUrl} permission={sharePermission} /> : <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">아직 이 화면에서 만든 공유 링크가 없습니다.</p>}<form action={regenerateShareLinkAction} className="space-y-3">{accessField}<label className="grid gap-1 text-sm font-semibold">링크 권한<Select name="permission" defaultValue="read"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="read">보기만 가능</SelectItem><SelectItem value="edit">체크리스트와 트립 편집 가능</SelectItem></SelectContent></Select></label><Button variant="secondary" className="w-full" type="submit"><Copy className="h-4 w-4" /> 공유 링크 만들기</Button></form><p className="text-xs text-muted-foreground">새 링크를 만들어도 기존 링크는 계속 유효합니다.</p></section>{!editToken ? <section className="space-y-3 border-t pt-5"><div><h3 className="font-black">사용자 초대</h3><p className="mt-1 text-xs text-muted-foreground">이메일로 특정 동행자를 초대합니다.</p></div><form action={inviteTripMemberAction} className="space-y-3"><input type="hidden" name="tripId" value={trip.id} /><label className="grid gap-1 text-sm font-semibold">이메일<input className="h-11 rounded-md border bg-background px-3" name="email" type="email" required /></label><label className="grid gap-1 text-sm font-semibold">초대 권한<Select name="permission" defaultValue="read"><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="read">보기</SelectItem><SelectItem value="edit">편집</SelectItem></SelectContent></Select></label><Button className="w-full" type="submit"><Share2 className="h-4 w-4" /> 초대 메일 보내기</Button></form></section> : null}</div></> : null}
          {panel === "duplicate" ? <><DialogHeader><DialogTitle>이 트립을 복제할까요?</DialogTitle><DialogDescription>일정과 체크 항목을 복사하고 완료 상태는 다시 시작할 수 있게 초기화합니다.</DialogDescription></DialogHeader><form action={duplicateTripAction}>{accessField}<Button className="w-full" type="submit"><CopyPlus className="h-4 w-4" /> 트립 복제</Button></form></> : null}
          {panel === "delete" ? <><DialogHeader><DialogTitle>트립을 삭제할까요?</DialogTitle><DialogDescription>삭제하면 편집 링크와 공유 링크로 다시 열 수 없습니다.</DialogDescription></DialogHeader><form action={deleteTripAction}>{accessField}<Button variant="danger" className="w-full" type="submit"><Trash2 className="h-4 w-4" /> 트립 삭제</Button></form></> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
