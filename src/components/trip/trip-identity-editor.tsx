"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { updateTripDetailsSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function TripIdentityEditor({ tripId, editToken, name, canEdit }: { tripId: string; editToken?: string; name: string; canEdit: boolean }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const access = editToken ? <input type="hidden" name="editToken" value={editToken} /> : <input type="hidden" name="tripId" value={tripId} />;
  async function save(data: FormData) { const result = await updateTripDetailsSafeAction(data); showActionResult(result); if (result.ok) { setOpen(false); router.refresh(); } }
  return <>
    <div className="flex items-center gap-2"><h1 className="min-w-0 truncate text-2xl font-black sm:text-3xl">{name}</h1>{canEdit ? <Button type="button" variant="ghost" className="h-9 w-9 shrink-0 p-0" aria-label="트립 이름 수정" onClick={() => setOpen(true)}><Pencil className="h-4 w-4" /></Button> : null}</div>
    <Dialog open={open} onOpenChange={setOpen}><DialogContent>
      <DialogHeader><DialogTitle>트립 이름 수정</DialogTitle><DialogDescription>한 시즌의 여러 트립을 쉽게 구분할 수 있는 이름을 붙여보세요.</DialogDescription></DialogHeader>
      <form action={save} className="space-y-4">{access}
        <Field label="트립 이름"><Input name="tripName" required maxLength={80} defaultValue={name} autoFocus /></Field>
        <SubmitButton className="w-full" pendingText="저장 중…">저장하기</SubmitButton>
      </form>
    </DialogContent></Dialog>
  </>;
}
