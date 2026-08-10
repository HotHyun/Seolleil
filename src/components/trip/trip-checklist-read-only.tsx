import { CheckCircle2, ClipboardCheck } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { TripTaskRecord } from "@/lib/trip-store";

export function TripChecklistReadOnly({ tasks }: { tasks: TripTaskRecord[] }) {
  const visible = tasks.filter(task => task.status !== "not_needed");
  return <Card data-testid="trip-checklist-read-only">
    <CardHeader><div className="flex items-start gap-3"><span className="rounded-xl bg-muted p-2.5 text-primary"><ClipboardCheck aria-hidden="true" className="h-5 w-5" /></span><div><h1 data-trip-workspace-title tabIndex={-1} className="text-xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">예약·준비 상태</h1><p className="mt-1 text-sm text-muted-foreground">소유자가 공유한 현재 체크리스트 결과입니다.</p></div></div></CardHeader>
    <CardContent>{visible.length ? <div className="divide-y">{visible.map(task => <div key={task.id} className="flex items-start justify-between gap-3 py-3"><p className="min-w-0 break-words font-semibold">{task.title}</p><StatusBadge>{statusLabel(task.status)}</StatusBadge></div>)}</div> : <div className="rounded-xl border border-dashed p-5 text-center"><CheckCircle2 aria-hidden="true" className="mx-auto h-6 w-6 text-primary" /><p className="mt-2 text-sm text-muted-foreground">공유된 준비 항목이 없습니다.</p></div>}</CardContent>
  </Card>;
}

function statusLabel(status: string) {
  return ({ needs_check: "확인 필요", planned: "예정", reserved: "예약 완료", paid: "결제 완료", prepared: "준비 완료" }[status] ?? status);
}
