"use client";

import { ConfidenceDot } from "@/components/confidence-badge";
import { CircleCheck, CircleDashed, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DaySummary, DaySummaryLine, DaySummaryLineKind } from "@/lib/trip-day-summary";
import { formatCurrency } from "@/lib/utils";

const kindLabel: Record<DaySummaryLineKind, string> = {
  lift: "리프트권",
  package: "장비+의류 패키지",
  equipment: "장비",
  clothing: "의류",
  accessory: "보호·추가 장비"
};

const dateFormatter = new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" });
export const formatSummaryDate = (date: string) => dateFormatter.format(new Date(`${date}T00:00:00Z`));

export function rentalStateLabel(state: DaySummary["rentalState"]) {
  return state === "items" ? "렌탈 확정" : state === "shop_only" ? "후보 샵만" : "렌탈 미정";
}

// 선택한 렌탈샵 카드에 보여 줄 한 줄 요약(리프트권 제외).
export function savedItemsText(summary: DaySummary) {
  const items = summary.lines.filter(line => line.kind !== "lift");
  if (!items.length) return "상품은 아직 고르지 않았어요";
  return items.map(line => `${kindLabel[line.kind]} ${line.perPerson === null ? "가격 미공개" : formatCurrency(line.perPerson)}`).join(" · ");
}

export function DaySummaryPanel({ summaries, peopleCount, onSelectDay, canEdit }: { summaries: DaySummary[]; peopleCount: number; onSelectDay: (date: string) => void; canEdit: boolean }) {
  if (!summaries.length) return <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">먼저 스키를 탈 날짜를 저장해 주세요.</p>;
  const people = Math.max(1, peopleCount);
  const grandPerPerson = summaries.reduce((sum, summary) => sum + summary.perPersonTotal, 0);
  const anyUnknown = summaries.some(summary => summary.hasUnknownPrice);
  return (
    <div className="space-y-3" data-testid="day-summary-panel">
      <div className="grid gap-3 lg:grid-cols-2">
        {summaries.map(summary => <DayCard key={summary.date} summary={summary} people={people} onSelectDay={onSelectDay} canEdit={canEdit} />)}
      </div>
      {summaries.length > 1 ? (
        <div className="rounded-2xl border border-foreground/20 bg-muted/60 p-4">
          <p className="text-xs font-semibold text-muted-foreground">전체 {summaries.length}일 렌탈·리프트 합계</p>
          <p className="mt-1 text-xl font-semibold">{formatCurrency(grandPerPerson * people)} <span className="text-xs font-semibold text-muted-foreground">1인 {formatCurrency(grandPerPerson)} · {people}명</span></p>
          {anyUnknown ? <p className="mt-1 text-xs text-muted-foreground">가격 미공개 항목은 합계에서 빠져 있어요.</p> : null}
        </div>
      ) : null}
    </div>
  );
}

function DayCard({ summary, people, onSelectDay, canEdit }: { summary: DaySummary; people: number; onSelectDay: (date: string) => void; canEdit: boolean }) {
  const confirmed = summary.rentalState === "items";
  return (
    <article className={`rounded-2xl border p-4 ${confirmed ? "border-emerald-500/40 bg-emerald-500/[0.04]" : "border-dashed"}`}>
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-base font-semibold">{formatSummaryDate(summary.date)}</p>
          <p className="text-xs text-muted-foreground">{summary.dayTypeLabel} · {summary.timeSlotLabel}</p>
        </div>
        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${confirmed ? "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200" : summary.rentalState === "shop_only" ? "bg-muted/60 text-foreground" : "bg-muted text-muted-foreground"}`}>
          {confirmed ? <CircleCheck aria-hidden="true" className="h-4 w-4" /> : <CircleDashed aria-hidden="true" className="h-4 w-4" />}
          {rentalStateLabel(summary.rentalState)}
        </span>
      </header>

      <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm">
        <Store aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
        <div className="min-w-0">
          <p className="text-xs font-medium text-muted-foreground">렌탈샵</p>
          <p className="font-semibold">{summary.shopName ?? "아직 정하지 않았어요"}</p>
          {summary.rentalState === "shop_only" ? <p className="text-xs text-foreground">후보로만 저장됐고 장비·의류 상품은 아직 고르지 않았어요.</p> : null}
        </div>
      </div>

      <ul className="mt-3 divide-y text-sm">
        {summary.lines.map((line, index) => <LineRow key={`${line.kind}-${index}`} line={line} people={people} />)}
      </ul>

      <footer className="mt-3 flex flex-wrap items-end justify-between gap-3 border-t pt-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">이 날 합계</p>
          <p className="text-lg font-semibold">{formatCurrency(summary.total)} <span className="text-xs font-semibold text-muted-foreground">1인 {formatCurrency(summary.perPersonTotal)} · {people}명</span></p>
          {summary.hasUnknownPrice ? <p className="text-xs text-muted-foreground">가격 미공개 항목은 합계에서 빠져 있어요.</p> : null}
        </div>
        {canEdit ? <Button type="button" variant="secondary" className="h-10 px-3 text-xs" onClick={() => onSelectDay(summary.date)}>{confirmed ? "이 날짜 렌탈 바꾸기" : "이 날짜 렌탈 고르기"}</Button> : null}
      </footer>
    </article>
  );
}

function LineRow({ line, people }: { line: DaySummaryLine; people: number }) {
  return (
    <li className="flex items-start justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="font-semibold">{kindLabel[line.kind]}</p>
        <p className="text-xs text-muted-foreground">{line.label}{line.source && line.source !== "공식" && line.kind !== "lift" ? ` · ${line.source}` : ""}</p>
        {line.reference ? <p className="mt-1 text-xs text-muted-foreground">25/26 참고가</p> : null}
      </div>
      <div className="shrink-0 text-right">
        {line.perPerson === null ? <p className="font-semibold text-muted-foreground">가격 미공개</p> : <>
          <p className="flex items-center justify-end gap-2 font-semibold tabular-nums"><ConfidenceDot confidence={line.confidence} />{formatCurrency(line.perPerson)}<span className="text-xs font-normal text-muted-foreground">/인</span></p>
          {people > 1 ? <p className="text-xs text-muted-foreground">{people}명 {formatCurrency(line.perPerson * people)}</p> : null}
        </>}
      </div>
    </li>
  );
}
