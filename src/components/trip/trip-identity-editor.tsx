"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageSquarePlus, Pencil } from "lucide-react";
import { updateTripDetailsSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";

export function TripIdentityEditor({ tripId, editToken, name, memo, canEdit }: { tripId: string; editToken?: string; name: string; memo: string | null; canEdit: boolean }) {
  const [panel, setPanel] = useState<"name" | "memo" | null>(null);
  const router = useRouter();
  const access = editToken ? <input type="hidden" name="editToken" value={editToken} /> : <input type="hidden" name="tripId" value={tripId} />;
  async function save(data: FormData) { const result = await updateTripDetailsSafeAction(data); showActionResult(result); if (result.ok) { setPanel(null); router.refresh(); } }
  return <>
    <div className="flex items-center gap-2"><h1 className="min-w-0 truncate text-2xl font-black sm:text-3xl">{name}</h1>{canEdit ? <Button type="button" variant="ghost" className="h-9 w-9 shrink-0 p-0" aria-label="트립 이름 수정" onClick={() => setPanel("name")}><Pencil className="h-4 w-4" /></Button> : null}</div>
    {memo ? <button type="button" disabled={!canEdit} onClick={() => setPanel("memo")} className="mt-3 w-full whitespace-pre-wrap rounded-xl bg-muted p-4 text-left text-sm leading-6 text-muted-foreground disabled:cursor-default">{memo}</button> : canEdit ? <Button type="button" variant="ghost" className="mt-2 px-0 text-muted-foreground" onClick={() => setPanel("memo")}><MessageSquarePlus className="h-4 w-4" /> 메모 추가</Button> : null}
    <Dialog open={panel !== null} onOpenChange={open => { if (!open) setPanel(null); }}><DialogContent>
      <DialogHeader><DialogTitle>{panel === "name" ? "트립 이름 수정" : memo ? "트립 메모 수정" : "트립 메모 추가"}</DialogTitle><DialogDescription>{panel === "name" ? "한 시즌의 여러 트립을 쉽게 구분할 수 있는 이름을 붙여보세요." : "동행자와 일정에서 기억할 내용을 자유롭게 적어두세요."}</DialogDescription></DialogHeader>
      <form action={save} className="space-y-4">{access}<input type="hidden" name={panel === "name" ? "tripMemo" : "tripName"} value={panel === "name" ? memo ?? "" : name} />
        {panel === "name" ? <Field label="트립 이름"><Input name="tripName" required maxLength={80} defaultValue={name} /></Field> : <Field label="트립 메모"><Textarea name="tripMemo" maxLength={1000} defaultValue={memo ?? ""} autoFocus /></Field>}
        <SubmitButton className="w-full" pendingText="저장 중…">저장하기</SubmitButton>
      </form>
    </DialogContent></Dialog>
  </>;
}
