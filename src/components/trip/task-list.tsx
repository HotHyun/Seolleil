"use client";

import { Trash2 } from "lucide-react";
import {
  addTaskAction,
  deleteTaskAction,
  updateTaskMemoAction,
  updateTaskStatusAction
} from "@/app/actions";
import { StatusSelect } from "@/components/trip/status-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/field";

type Task = {
  id: string;
  category: string;
  title: string;
  status: string;
  memo: string | null;
  dueDate: Date | null;
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

  return (
    <div className="space-y-5">
      {Object.entries(groups).map(([label, group]) => (
        <section key={label} className="glass-panel rounded-xl">
          <div className="border-b px-4 py-3 font-black">{label}</div>
          <div className="divide-y">
            {group.map((task) => (
              <div key={task.id} className="grid gap-3 p-4 md:grid-cols-[1fr_160px_1fr_auto] md:items-center">
                <div>
                  <div className="font-semibold">{task.title}</div>
                  {task.dueDate ? (
                    <div className="mt-1 text-xs text-muted-foreground">
                      마감: {new Intl.DateTimeFormat("ko-KR").format(new Date(task.dueDate))}
                    </div>
                  ) : null}
                </div>
                <form action={updateTaskStatusAction}>
                  <AccessFields editToken={editToken} tripId={tripId} />
                  <input type="hidden" name="taskId" value={task.id} />
                  <StatusSelect name="status" defaultValue={task.status} />
                </form>
                <form action={updateTaskMemoAction} className="flex gap-2">
                  <AccessFields editToken={editToken} tripId={tripId} />
                  <input type="hidden" name="taskId" value={task.id} />
                  <Input name="memo" defaultValue={task.memo ?? ""} placeholder="메모" />
                  <Button variant="secondary" className="h-11 shrink-0" type="submit">
                    저장
                  </Button>
                </form>
                {!task.isDefault ? (
                  <form action={deleteTaskAction}>
                    <AccessFields editToken={editToken} tripId={tripId} />
                    <input type="hidden" name="taskId" value={task.id} />
                    <Button variant="ghost" type="submit" aria-label="삭제">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ))}
      <form action={addTaskAction} className="glass-panel flex gap-2 rounded-xl p-4">
        <AccessFields editToken={editToken} tripId={tripId} />
        <Input name="title" placeholder="직접 체크 항목 추가" />
        <Button type="submit" className="shrink-0">
          추가
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
