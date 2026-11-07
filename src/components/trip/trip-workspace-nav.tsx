"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, BedDouble, BusFront, CheckSquare2, LayoutDashboard, Menu, PanelLeftClose, PanelLeftOpen, ReceiptText, Shirt } from "lucide-react";
import { cn } from "@/lib/utils";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { isTaskComplete } from "@/lib/checklist";
import { taskStatusChangedEvent, type TaskStatusChangedDetail } from "@/components/trip/task-status-events";
import type { TripWorkspaceView } from "@/lib/trip-workspace";

const items = [
  { id: "overview", label: "트립 개요", description: "일정과 준비 현황", icon: LayoutDashboard },
  { id: "rental_lift", label: "스키 일정 & 렌탈", description: "날짜·장비·의류·리프트", icon: Shirt },
  { id: "lodging", label: "숙박", description: "숙소 비교와 기록", icon: BedDouble },
  { id: "transport", label: "교통", description: "이동수단과 셔틀", icon: BusFront },
  { id: "checklist", label: "준비 체크리스트", description: "예약과 준비 상태", icon: CheckSquare2 },
  { id: "budget", label: "비용·정산", description: "선택과 1/N 비용", icon: ReceiptText }
] as const;

const sidebarStorageKey = "korean-ski-trip-sidebar-collapsed";
const focusStorageKey = "korean-ski-trip-workspace-focus";

export function TripWorkspaceNav({ basePath, activeView, tasks, children, backHref }: { basePath: string; activeView: TripWorkspaceView; tasks: Array<{ id: string; category: string; status: string }>; children: React.ReactNode; backHref?: string }) {
  const [visibleTasks, setVisibleTasks] = useState(tasks);
  const [collapsed, setCollapsed] = useState(false);
  const contentRef = useRef<HTMLElement>(null);
  useEffect(() => setVisibleTasks(tasks), [tasks]);
  useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(sidebarStorageKey) === "true");
    } catch {}
  }, []);
  useEffect(() => {
    const updateStatus = (event: Event) => {
      const { taskId, status } = (event as CustomEvent<TaskStatusChangedDetail>).detail;
      setVisibleTasks(current => current.map(task => task.id === taskId ? { ...task, status } : task));
    };
    window.addEventListener(taskStatusChangedEvent, updateStatus);
    return () => window.removeEventListener(taskStatusChangedEvent, updateStatus);
  }, []);
  useEffect(() => {
    let requestedHref: string | null = null;
    try {
      requestedHref = sessionStorage.getItem(focusStorageKey);
      if (!requestedHref) return;
      const requestedUrl = new URL(requestedHref, window.location.origin);
      if (requestedUrl.pathname !== basePath || requestedUrl.searchParams.get("view") !== activeView) return;
      sessionStorage.removeItem(focusStorageKey);
    } catch {
      return;
    }
    window.requestAnimationFrame(() => {
      const requestedUrl = new URL(requestedHref!, window.location.origin);
      const anchorTarget = requestedUrl.hash ? contentRef.current?.querySelector<HTMLElement>(requestedUrl.hash) : null;
      const scrollTarget = anchorTarget ?? contentRef.current;
      scrollTarget?.scrollIntoView({ behavior: "auto", block: "start" });
      (anchorTarget?.querySelector<HTMLElement>("[data-trip-workspace-anchor-title]") ?? contentRef.current?.querySelector<HTMLElement>("[data-trip-workspace-title]"))?.focus({ preventScroll: true });
    });
  }, [activeView, basePath]);
  const prepareWorkspaceNavigation = (href: string) => {
    try {
      sessionStorage.setItem(focusStorageKey, href);
    } catch {}
  };
  const prepareLinkedWorkspaceNavigation = (event: React.MouseEvent<HTMLElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    const url = new URL(anchor.href);
    const view = url.searchParams.get("view");
    if (url.pathname !== basePath || !view) return;
    prepareWorkspaceNavigation(`${basePath}?view=${view}${url.hash}`);
  };
  const toggleSidebar = () => {
    setCollapsed(current => {
      const next = !current;
      try {
        localStorage.setItem(sidebarStorageKey, String(next));
      } catch {}
      return next;
    });
  };
  const relevant = visibleTasks.filter(task => task.status !== "not_needed");
  const progress = relevant.length ? Math.round(relevant.filter(task => isTaskComplete(task.category, task.status)).length / relevant.length * 100) : 0;
  return (
    <>
      <div className="lg:hidden">
        <Drawer>
          <DrawerTrigger asChild>
            <button type="button" aria-label="트립 메뉴 열기" style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 1rem)" }} className="fixed right-4 z-40 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary text-primary-foreground shadow-[0_12px_32px_hsl(var(--foreground)/.28)] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Menu aria-hidden="true" className="h-6 w-6" />
            </button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-xl font-black">트립 메뉴</DrawerTitle>
              <DrawerDescription className="text-sm leading-6 text-muted-foreground">필요한 계획 화면으로 바로 이동하세요.</DrawerDescription>
            </DrawerHeader>
            <nav className="grid grid-cols-2 gap-2" aria-label="트립 기능">
              {items.map(item => <DrawerClose key={item.id} asChild><WorkspaceLink {...item} href={`${basePath}?view=${item.id}`} active={activeView === item.id} onNavigate={prepareWorkspaceNavigation} /></DrawerClose>)}
            </nav>
            {backHref ? <div className="mt-4 border-t pt-3"><DrawerClose asChild><Link href={backHref} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ArrowLeft aria-hidden="true" className="h-4 w-4" /> 내 트립으로 돌아가기</Link></DrawerClose></div> : null}
          </DrawerContent>
        </Drawer>
      </div>
      <div className={cn("grid min-w-0 gap-3 px-3 pb-24 transition-[grid-template-columns] duration-300 motion-reduce:transition-none sm:px-4 lg:grid lg:gap-0 lg:px-0 lg:pb-0", collapsed ? "lg:grid-cols-[76px_minmax(0,1fr)]" : "lg:grid-cols-[248px_minmax(0,1fr)]")}>
        <aside aria-label="트립 기능" className="sticky top-16 hidden h-[calc(100svh-4rem)] self-start border-r bg-card lg:flex lg:flex-col">
          <div className={cn("border-b bg-primary/10 py-5", collapsed ? "px-3" : "px-5")}>
            {collapsed ? <p className="text-center text-sm font-black text-primary" aria-label={`준비 진행률 ${progress}%`}>{progress}%</p> : <>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Trip workspace</p>
              <p className="mt-1 text-sm font-bold">준비 진행률 {progress}%</p>
            </>}
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${progress}%` }} /></div>
          </div>
          <nav className="flex-1 p-2">
            {items.map(item => <WorkspaceLink key={item.id} {...item} href={`${basePath}?view=${item.id}`} active={activeView === item.id} desktop collapsed={collapsed} onNavigate={prepareWorkspaceNavigation} />)}
          </nav>
          <div className="border-t p-2">
            <ButtonLike onClick={toggleSidebar} collapsed={collapsed} />
          </div>
        </aside>
        <section ref={contentRef} onClickCapture={prepareLinkedWorkspaceNavigation} className="min-w-0 scroll-mt-16 animate-in fade-in duration-200 motion-reduce:animate-none lg:px-5 lg:py-4 lg:pb-6">{children}</section>
      </div>
    </>
  );
}

function WorkspaceLink({ href, label, description, icon: Icon, active, desktop = false, collapsed = false, onNavigate }: { href: string; label: string; description: string; icon: typeof LayoutDashboard; active: boolean; desktop?: boolean; collapsed?: boolean; onNavigate?: (href: string) => void }) {
  return <Link href={href} scroll={false} onClick={event => { if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) onNavigate?.(href); }} aria-current={active ? "page" : undefined} aria-label={collapsed ? label : undefined} title={collapsed ? label : undefined} className={cn("group flex min-h-11 items-center rounded-xl border py-2.5 font-bold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring", collapsed ? "justify-center px-2" : "gap-3 px-3", desktop ? "mb-1 w-full border-transparent" : "w-full", active ? "border-primary/30 bg-primary text-primary-foreground shadow-sm" : "border-border bg-card text-foreground hover:border-primary/30 hover:bg-muted")}>
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed ? <span className="text-left"><span className="block text-sm">{label}</span>{desktop ? <span className={cn("mt-0.5 block text-[11px] font-semibold", active ? "text-primary-foreground/75" : "text-muted-foreground")}>{description}</span> : null}</span> : null}
  </Link>;
}

function ButtonLike({ onClick, collapsed }: { onClick: () => void; collapsed: boolean }) {
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;
  return <button type="button" onClick={onClick} aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"} title={collapsed ? "사이드바 펼치기" : undefined} className={cn("flex min-h-11 w-full items-center rounded-xl px-3 text-sm font-bold text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring", collapsed ? "justify-center" : "gap-3")}>
    <Icon className="h-4 w-4 shrink-0" />
    {!collapsed ? <span>사이드바 접기</span> : null}
  </button>;
}
