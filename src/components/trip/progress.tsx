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
    <div className="rounded-lg border bg-zinc-950 p-5 text-white">
      <div className="flex items-end justify-between">
        <div>
          <div className="text-sm font-semibold text-zinc-300">준비 진행률</div>
          <div className="mt-1 text-4xl font-black text-lime-300">{percent}%</div>
        </div>
        <div className="text-right text-sm text-zinc-300">
          {completed.length}/{relevant.length} 완료
        </div>
      </div>
      <div className="mt-4 h-2 rounded-full bg-zinc-800">
        <div className="h-2 rounded-full bg-lime-300" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

