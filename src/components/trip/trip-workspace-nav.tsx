"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckSquare2, LayoutDashboard, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { isTaskComplete } from "@/lib/checklist";
import { taskStatusChangedEvent, type TaskStatusChangedDetail } from "@/components/trip/task-status-events";
import type { TripWorkspaceView } from "@/lib/trip-workspace";

const items = [
  { id: "overview", label: "트립 개요", description: "일정과 준비 현황", icon: LayoutDashboard },
  { id: "checklist", label: "준비 체크리스트", description: "예약과 준비 상태", icon: CheckSquare2 },
  { id: "budget", label: "비용·정산", description: "선택과 1/N 비용", icon: ReceiptText }
] as const;

export function TripWorkspaceNav({ basePath, activeView, tasks }: { basePath: string; activeView: TripWorkspaceView; tasks: Array<{ id: string; category: string; status: string }> }) {
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  useEffect(() => setVisibleTasks(tasks), [tasks]);
  useEffect(() => {
    const updateStatus = (event: Event) => {
      const { taskId, status } = (event as CustomEvent<TaskStatusChangedDetail>).detail;
      setVisibleTasks(current => current.map(task => task.id === taskId ? { ...task, status } : task));
    };
    window.addEventListener(taskStatusChangedEvent, updateStatus);
    return () => window.removeEventListener(taskStatusChangedEvent, updateStatus);
  }, []);
  const relevant = visibleTasks.filter(task => task.status !== "not_needed");
  const progress = relevant.length ? Math.round(relevant.filter(task => isTaskComplete(task.category, task.status)).length / relevant.length * 100) : 0;
  return (
    <aside aria-label="트립 기능" className="lg:sticky lg:top-24 lg:self-start">
      <div className="hidden overflow-hidden rounded-2xl border bg-card shadow-sm lg:block">
        <div className="border-b bg-primary/10 px-4 py-4">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Trip workspace</p>
          <p className="mt-1 text-sm font-bold">준비 진행률 {progress}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
        </div>
        <nav className="p-2">
          {items.map(item => <WorkspaceLink key={item.id} {...item} href={`${basePath}?view=${item.id}`} active={activeView === item.id} desktop />)}
        </nav>
      </div>
      <nav className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:hidden" aria-label="트립 기능 탭">
        {items.map(item => <WorkspaceLink key={item.id} {...item} href={`${basePath}?view=${item.id}`} active={activeView === item.id} />)}
      </nav>
    </aside>
  );
}

function WorkspaceLink({ href, label, description, icon: Icon, active, desktop = false }: { href: string; label: string; description: string; icon: typeof LayoutDashboard; active: boolean; desktop?: boolean }) {
  return <Link href={href} aria-current={active ? "page" : undefined} className={cn("group flex min-h-11 items-center gap-3 rounded-xl border px-3 py-2.5 font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring", desktop ? "mb-1 w-full border-transparent" : "shrink-0", active ? "border-primary/30 bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted")}>
    <Icon className="h-4 w-4 shrink-0" />
    <span className="text-left"><span className="block text-sm">{label}</span>{desktop ? <span className={cn("mt-0.5 block text-[11px] font-semibold", active ? "text-primary-foreground/75" : "text-muted-foreground")}>{description}</span> : null}</span>
  </Link>;
}
