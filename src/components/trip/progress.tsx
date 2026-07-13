"use client";

import { useEffect, useState } from "react";
import { isTaskComplete } from "@/lib/checklist";
import { taskStatusChangedEvent, type TaskStatusChangedDetail } from "@/components/trip/task-status-events";

type Task = {
  id: string;
  category: string;
  status: string;
};

export function ProgressSummary({ tasks }: { tasks: Task[] }) {
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  useEffect(() => setVisibleTasks(tasks), [tasks]);
  useEffect(() => {
    function updateStatus(event: Event) {
      const { taskId, status } = (event as CustomEvent<TaskStatusChangedDetail>).detail;
      setVisibleTasks(current => current.map(task => task.id === taskId ? { ...task, status } : task));
    }
    window.addEventListener(taskStatusChangedEvent, updateStatus);
    return () => window.removeEventListener(taskStatusChangedEvent, updateStatus);
  }, []);

  const relevant = visibleTasks.filter((task) => task.status !== "not_needed");
  const completed = relevant.filter((task) => isTaskComplete(task.category, task.status));
  const percent = relevant.length ? Math.round((completed.length / relevant.length) * 100) : 0;

  return (
    <div className="glass-panel rounded-xl p-4 text-foreground" aria-live="polite">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <div className="text-sm font-semibold text-muted-foreground">준비 진행률</div>
          <div className="text-2xl font-black text-primary">{percent}%</div>
        </div>
        <div className="text-right text-sm font-semibold text-muted-foreground">
          {completed.length}/{relevant.length} 완료
        </div>
      </div>
      <div className="mt-3 h-2 rounded-full bg-muted">
        <div className="h-2 rounded-full bg-primary transition-[width] duration-300 ease-out" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
