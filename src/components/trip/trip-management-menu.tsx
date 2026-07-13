"use client";

import { useState } from "react";
import { Copy, CopyPlus, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { deleteTripAction, duplicateTripAction, regenerateShareLinkAction } from "@/app/actions";
import { ShareLinkBox } from "@/components/share-link-box";
import { TripEditForm } from "@/components/trip/trip-edit-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type TripFormData = React.ComponentProps<typeof TripEditForm>["trip"];
type Panel = "edit" | "share" | "duplicate" | "delete" | null;

export function TripManagementMenu({ trip, editToken, shareUrl }: { trip: TripFormData; editToken?: string; shareUrl?: string }) {
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
          {panel === "share" ? <><DialogHeader><DialogTitle>공유 관리</DialogTitle><DialogDescription>동행자는 읽기 전용 링크로 일정과 준비 상태를 확인할 수 있습니다.</DialogDescription></DialogHeader><div className="space-y-3">{shareUrl ? <ShareLinkBox sharePath={shareUrl} /> : <p className="rounded-lg bg-muted p-3 text-sm text-muted-foreground">공유 링크를 새로 만들면 바로 복사해 동행자에게 보낼 수 있어요.</p>}<form action={regenerateShareLinkAction}>{accessField}<Button variant="secondary" className="w-full" type="submit"><Copy className="h-4 w-4" /> 새 공유 링크 만들기</Button></form></div></> : null}
          {panel === "duplicate" ? <><DialogHeader><DialogTitle>이 트립을 복제할까요?</DialogTitle><DialogDescription>일정과 체크 항목을 복사하고 완료 상태는 다시 시작할 수 있게 초기화합니다.</DialogDescription></DialogHeader><form action={duplicateTripAction}>{accessField}<Button className="w-full" type="submit"><CopyPlus className="h-4 w-4" /> 트립 복제</Button></form></> : null}
          {panel === "delete" ? <><DialogHeader><DialogTitle>트립을 삭제할까요?</DialogTitle><DialogDescription>삭제하면 편집 링크와 공유 링크로 다시 열 수 없습니다.</DialogDescription></DialogHeader><form action={deleteTripAction}>{accessField}<Button variant="danger" className="w-full" type="submit"><Trash2 className="h-4 w-4" /> 트립 삭제</Button></form></> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
