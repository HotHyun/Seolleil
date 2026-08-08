"use client";

import { useState } from "react";
import { CopyPlus, MoreHorizontal, Pencil, Share2, Trash2 } from "lucide-react";
import { deleteTripAction, duplicateTripAction } from "@/app/actions";
import { SharingManagement } from "@/components/trip/sharing-management";
import { TripEditForm } from "@/components/trip/trip-edit-form";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { TripMembership } from "@/lib/trip-collaboration";
import type { TripShareLinkRecord } from "@/lib/trip-store";

type TripFormData = React.ComponentProps<typeof TripEditForm>["trip"];
type Panel = "edit" | "share" | "duplicate" | "delete" | null;

export function TripManagementMenu({ trip, editToken, shareUrl, sharePermission = "read", shareLinks = [], members = [], canManageSharing = true, canManageTrip = true, allowAccountInvites = !editToken }: { trip: TripFormData; editToken?: string; shareUrl?: string; sharePermission?: "read" | "edit"; shareLinks?: TripShareLinkRecord[]; members?: TripMembership[]; canManageSharing?: boolean; canManageTrip?: boolean; allowAccountInvites?: boolean }) {
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
          {canManageTrip ? <DropdownMenuItem onSelect={() => setPanel("edit")}><Pencil className="h-4 w-4" /> 여행 기본 설정</DropdownMenuItem> : null}
          {canManageSharing ? <DropdownMenuItem onSelect={() => setPanel("share")}><Share2 className="h-4 w-4" /> 공유 관리</DropdownMenuItem> : null}
          {canManageTrip && !editToken ? <DropdownMenuItem onSelect={() => setPanel("duplicate")}><CopyPlus className="h-4 w-4" /> 트립 복제</DropdownMenuItem> : null}
          {canManageTrip ? <DropdownMenuSeparator /> : null}
          {canManageTrip ? <DropdownMenuItem className="text-destructive focus:text-destructive" onSelect={() => setPanel("delete")}><Trash2 className="h-4 w-4" /> 트립 삭제</DropdownMenuItem> : null}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={panel !== null} onOpenChange={(open) => { if (!open) setPanel(null); }}>
        <DialogContent className="bottom-0 top-auto max-h-[88svh] max-w-xl translate-y-0 overflow-y-auto rounded-b-none sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 sm:rounded-xl">
          {panel === "edit" ? <><DialogHeader><DialogTitle>여행 기본 설정</DialogTitle><DialogDescription>도착·출발 날짜와 인원, 트립 상태를 관리합니다. 실제 스키 날짜와 렌탈은 선택·예약 메뉴에서 바꿀 수 있어요.</DialogDescription></DialogHeader><TripEditForm trip={trip} editToken={editToken} /></> : null}
          {panel === "share" ? <><DialogHeader><DialogTitle>트립 공유</DialogTitle><DialogDescription>링크와 초대 사용자의 권한을 한곳에서 관리합니다.</DialogDescription></DialogHeader><SharingManagement tripId={trip.id} shareUrl={shareUrl} sharePermission={sharePermission} links={shareLinks} members={members} allowAccountInvites={allowAccountInvites} /></> : null}
          {panel === "duplicate" ? <><DialogHeader><DialogTitle>이 트립을 복제할까요?</DialogTitle><DialogDescription>일정과 체크 항목을 복사하고 완료 상태는 다시 시작할 수 있게 초기화합니다.</DialogDescription></DialogHeader><form action={duplicateTripAction}>{accessField}<SubmitButton className="w-full" type="submit" pendingText="복제 중…"><CopyPlus className="h-4 w-4" /> 트립 복제</SubmitButton></form></> : null}
          {panel === "delete" ? <><DialogHeader><DialogTitle>트립을 삭제할까요?</DialogTitle><DialogDescription>삭제하면 편집 링크와 공유 링크로 다시 열 수 없습니다.</DialogDescription></DialogHeader><form action={deleteTripAction}>{accessField}<SubmitButton variant="danger" className="w-full" type="submit" pendingText="삭제 중…"><Trash2 className="h-4 w-4" /> 트립 삭제</SubmitButton></form></> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
