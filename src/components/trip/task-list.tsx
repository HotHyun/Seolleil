"use client";

import { AlertCircle, ChevronDown, ExternalLink, Plus, Trash2 } from "lucide-react";
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskDetailsAction,
  updateTaskStatusAction
} from "@/app/actions";
import { StatusSelect } from "@/components/trip/status-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { isTaskComplete } from "@/lib/checklist";

declare global {
  interface Window { umami?: { track: (eventName: string, eventData?: Record<string, unknown>) => void } }
}

type Task = {
  id: string;
  category: string;
  title: string;
  status: string;
  memo: string | null;
  externalUrl: string | null;
  isDefault: boolean;
};

const categoryLabels: Record<string, string> = {
  lift_ticket: "예약/구매",
  equipment_rental: "렌탈",
  clothing_rental: "렌탈",
  transport: "교통",
  lodging: "숙박",
  operation_status: "운영 확인",
  gear: "준비물",
  safety: "안전/기타",
  custom: "커스텀"
};

export function TaskList({ tasks, editToken, tripId }: { tasks: Task[]; editToken?: string; tripId?: string }) {
  const groups = tasks.reduce<Record<string, Task[]>>((acc, task) => {
    const label = categoryLabels[task.category] ?? task.category;
    acc[label] = acc[label] ?? [];
    acc[label].push(task);
    return acc;
  }, {});
  const activeTasks = tasks.filter((task) => task.status !== "not_needed");
  const completedTasks = activeTasks.filter((task) => isTaskComplete(task.category, task.status));
  const needsAttention = activeTasks
    .filter((task) => !isTaskComplete(task.category, task.status))
    .slice(0, 3);

  return (
    <div className="space-y-5">
      <section className="glass-panel rounded-xl p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-muted-foreground">이번 트립 준비</div>
            <div className="mt-1 text-2xl font-black">
              {completedTasks.length}/{activeTasks.length} 완료
            </div>
          </div>
          <div className="rounded-full bg-primary/15 px-3 py-1 text-sm font-black text-primary">
            {activeTasks.length ? Math.round((completedTasks.length / activeTasks.length) * 100) : 100}%
          </div>
        </div>
        {needsAttention.length ? (
          <div className="mt-4 grid gap-2">
            {needsAttention.map((task) => (
              <div key={task.id} className="flex items-start gap-2 rounded-md bg-muted px-3 py-2 text-sm">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="font-semibold">{task.title}</div>
                    {task.externalUrl ? (
                      <a
                        href={task.externalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
                      >
                        링크 <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">남은 필수 확인 항목이 없습니다.</p>
        )}
      </section>
      {Object.entries(groups).map(([label, group]) => (
        <section key={label} className="glass-panel rounded-xl">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <div className="font-black">{label}</div>
            <div className="text-xs font-semibold text-muted-foreground">
              {group.filter((task) => task.status !== "not_needed" && isTaskComplete(task.category, task.status)).length}/
              {group.filter((task) => task.status !== "not_needed").length}
            </div>
          </div>
          <div className="divide-y">
            {group.map((task) => (
              <div key={task.id} className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 truncate font-semibold">{task.title}</div>
                <form action={updateTaskStatusAction} onSubmit={() => window.umami?.track("checklist_status_change")}>
                  <AccessFields editToken={editToken} tripId={tripId} />
                  <input type="hidden" name="taskId" value={task.id} />
                  <StatusSelect name="status" defaultValue={task.status} />
                </form>
                </div>
                <details className="group mt-2">
                  <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {task.memo ? "메모 편집" : "메모 추가"}<ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <form action={updateTaskDetailsAction} onSubmit={() => window.umami?.track("checklist_details_update")} className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <AccessFields editToken={editToken} tripId={tripId} />
                  <input type="hidden" name="taskId" value={task.id} />
                  {!task.isDefault ? <Input name="title" defaultValue={task.title} aria-label="체크 항목 이름" /> : <input type="hidden" name="title" value={task.title} />}
                  <Input name="memo" defaultValue={task.memo ?? ""} placeholder="메모…" aria-label={`${task.title} 메모`} />
                  <Button variant="secondary" className="h-11 shrink-0" type="submit">
                    항목 저장
                  </Button>
                  </form>
                  {!task.isDefault ? <form action={deleteTaskAction} className="mt-2"><AccessFields editToken={editToken} tripId={tripId} /><input type="hidden" name="taskId" value={task.id} /><Button variant="ghost" type="submit" className="text-destructive"><Trash2 className="h-4 w-4" /> 항목 삭제</Button></form> : null}
                </details>
              </div>
            ))}
          </div>
        </section>
      ))}
      <form action={addTaskAction} onSubmit={() => window.umami?.track("checklist_item_add")} className="glass-panel grid gap-2 rounded-xl p-4 sm:grid-cols-[1fr_auto]">
        <AccessFields editToken={editToken} tripId={tripId} />
        <Input name="title" placeholder="직접 체크 항목 추가…" aria-label="새 체크 항목 이름" />
        <Button type="submit" className="shrink-0">
          <Plus className="h-4 w-4" /> 항목 추가
        </Button>
      </form>
    </div>
  );
}

function AccessFields({ editToken, tripId }: { editToken?: string; tripId?: string }) {
  return (
    <>
      {editToken ? <input type="hidden" name="editToken" value={editToken} /> : null}
      {tripId ? <input type="hidden" name="tripId" value={tripId} /> : null}
    </>
  );
}
