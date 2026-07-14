"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertCircle, ChevronDown, Compass, ExternalLink, Plus, Trash2 } from "lucide-react";
import {
  addTaskSafeAction,
  deleteTaskSafeAction,
  updateTaskDetailsSafeAction,
  updateTaskStatusSafeAction
} from "@/app/actions";
import { StatusSelect } from "@/components/trip/status-select";
import { announceTaskStatusChange } from "@/components/trip/task-status-events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { isTaskComplete } from "@/lib/checklist";
import { showActionResult } from "@/components/action-result-toast";
import { useRouter } from "next/navigation";

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

export function TaskList({ tasks, editToken, tripId, shareToken, basePath }: { tasks: Task[]; editToken?: string; tripId?: string; shareToken?: string; basePath?: string }) {
  const router = useRouter();
  const addTaskFormRef = useRef<HTMLFormElement>(null);
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  useEffect(() => setVisibleTasks(tasks), [tasks]);
  const groups = visibleTasks.reduce<Record<string, Task[]>>((acc, task) => {
    const label = categoryLabels[task.category] ?? task.category;
    acc[label] = acc[label] ?? [];
    acc[label].push(task);
    return acc;
  }, {});
  const activeTasks = visibleTasks.filter((task) => task.status !== "not_needed");
  const completedTasks = activeTasks.filter((task) => isTaskComplete(task.category, task.status));
  const needsAttention = activeTasks
    .filter((task) => !isTaskComplete(task.category, task.status))
    .slice(0, 3);

  function updateVisibleTaskStatus(taskId: string, status: string) {
    setVisibleTasks(current => current.map(item => item.id === taskId ? { ...item, status } : item));
    announceTaskStatusChange({ taskId, status });
  }

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
        <details key={label} className="group glass-panel rounded-xl">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <div className="font-black">{label}</div>
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
              <span>
                {group.filter((task) => task.status !== "not_needed" && isTaskComplete(task.category, task.status)).length}/
                {group.filter((task) => task.status !== "not_needed").length}
              </span>
              <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
            </div>
          </summary>
          <div className="divide-y border-t">
            {group.map((task) => (
              <div key={task.id} className="p-3 sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1 truncate font-semibold">{task.title}</div>
                <form action={async (formData) => { const result = await updateTaskStatusSafeAction(formData); showActionResult(result); if (!result.ok) router.refresh(); }} onSubmit={() => window.umami?.track("checklist_status_change")}>
                  <AccessFields editToken={editToken} tripId={tripId} shareToken={shareToken} />
                  <input type="hidden" name="background" value="1" />
                  <input type="hidden" name="taskId" value={task.id} />
                  <StatusSelect name="status" defaultValue={task.status} onStatusChange={(status) => updateVisibleTaskStatus(task.id, status)} />
                </form>
                </div>
                {basePath && decisionTarget(task.category, task.title) ? <Link href={`${basePath}?view=decisions#${decisionTarget(task.category, task.title)}`} className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-bold text-primary"><Compass className="h-3.5 w-3.5" /> 선택·예약 도우미 열기</Link> : null}
                <details className="group mt-2">
                  <summary className="inline-flex min-h-9 cursor-pointer list-none items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {task.memo ? "메모 편집" : "메모 추가"}<ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180" />
                  </summary>
                  <form action={async (formData) => { const result = await updateTaskDetailsSafeAction(formData); showActionResult(result); if (result.ok) { const title = String(formData.get("title")); const memo = String(formData.get("memo")); setVisibleTasks(current => current.map(item => item.id === task.id ? { ...item, title, memo } : item)); } }} onSubmit={() => window.umami?.track("checklist_details_update")} className="mt-2 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                  <AccessFields editToken={editToken} tripId={tripId} shareToken={shareToken} />
                  <input type="hidden" name="background" value="1" />
                  <input type="hidden" name="taskId" value={task.id} />
                  {!task.isDefault ? <Input name="title" defaultValue={task.title} aria-label="체크 항목 이름" /> : <input type="hidden" name="title" value={task.title} />}
                  <Input name="memo" defaultValue={task.memo ?? ""} placeholder="메모…" aria-label={`${task.title} 메모`} />
                  <SubmitButton variant="secondary" className="h-11 shrink-0" pendingText="저장 중…">
                    항목 저장
                  </SubmitButton>
                  </form>
                  {!task.isDefault ? <form action={async data => { const result = await deleteTaskSafeAction(data); showActionResult(result); if (result.ok) { setVisibleTasks(current => current.filter(item => item.id !== task.id)); router.refresh(); } }} className="mt-2"><AccessFields editToken={editToken} tripId={tripId} shareToken={shareToken} /><input type="hidden" name="taskId" value={task.id} /><SubmitButton variant="ghost" className="text-destructive" pendingText="삭제 중…"><Trash2 className="h-4 w-4" /> 항목 삭제</SubmitButton></form> : null}
                </details>
              </div>
            ))}
          </div>
        </details>
      ))}
      <form ref={addTaskFormRef} action={async data => { const result = await addTaskSafeAction(data); showActionResult(result); if (result.ok) { addTaskFormRef.current?.reset(); router.refresh(); } }} onSubmit={() => window.umami?.track("checklist_item_add")} className="glass-panel grid gap-2 rounded-xl p-4 sm:grid-cols-[1fr_auto]">
        <AccessFields editToken={editToken} tripId={tripId} shareToken={shareToken} />
        <Input name="title" placeholder="직접 체크 항목 추가…" aria-label="새 체크 항목 이름" />
        <SubmitButton className="shrink-0" pendingText="추가 중…">
          <Plus className="h-4 w-4" /> 항목 추가
        </SubmitButton>
      </form>
    </div>
  );
}

function decisionTarget(category: string, title: string) {
  if (category === "lift_ticket") return "lift";
  if (category === "equipment_rental" || category === "clothing_rental") return "rental";
  if (category === "transport" && (title.includes("이동") || title.includes("셔틀") || title.includes("버스"))) return "transport";
  if (category === "lodging") return "lodging";
  return null;
}

function AccessFields({ editToken, tripId, shareToken }: { editToken?: string; tripId?: string; shareToken?: string }) {
  return (
    <>
      {editToken ? <input type="hidden" name="editToken" value={editToken} /> : null}
      {tripId ? <input type="hidden" name="tripId" value={tripId} /> : null}
      {shareToken ? <input type="hidden" name="shareToken" value={shareToken} /> : null}
    </>
  );
}
