import { isTaskComplete } from "@/lib/checklist";

type Task = {
  category: string;
  status: string;
};

export function ProgressSummary({ tasks }: { tasks: Task[] }) {
  const relevant = tasks.filter((task) => task.status !== "not_needed");
  const completed = relevant.filter((task) => isTaskComplete(task.category, task.status));
  const percent = relevant.length ? Math.round((completed.length / relevant.length) * 100) : 0;

  return (
    <div className="glass-panel rounded-xl p-4 text-foreground">
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
        <div className="h-2 rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
