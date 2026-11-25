"use client";

import { useMemo, useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { ConfidenceDot } from "@/components/confidence-badge";
import { LiftPromoNote } from "@/components/lift-promo-note";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { AnalyticsLink } from "@/components/analytics-link";
import { timeSlotLabels } from "@/lib/constants";
import { liftSlotOptions } from "@/lib/lift-slots";
import { liftTicketSavings, resolveLiftPrice } from "@/lib/pricing";
import { optionAppliesToDay, type SkiDayPlan } from "@/lib/trip-ski-plan";
import type { RentalPriceRule, RentalShop, TimeSlot } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type Access = { name: string; value: string };
type Group = { shop: RentalShop; options: RentalPriceRule[] };

// 한 날짜의 리프트권을 공식권과 렌탈샵 할인권 중에서 비교해 고른다.
export function LiftChoices({ resortId, day, groups, peopleCount, access, save, canEdit, liftUrl, onDone }: {
  resortId: string;
  day: SkiDayPlan;
  groups: Group[];
  peopleCount: number;
  access: Access;
  save: (data: FormData) => Promise<boolean>;
  canEdit: boolean;
  liftUrl?: string;
  onDone: () => void;
}) {
  const [slot, setSlot] = useState<TimeSlot>(day.timeSlot);
  const officialApplied = !day.liftTicketOptionId;
  const official = resolveLiftPrice(resortId, slot, day.date);
  const officialPrice = official?.adultPrice ?? official?.priceMin;
  const deals = useMemo(() => groups.flatMap(({ shop, options }) => options
    .filter(option => option.itemType === "lift_ticket" && optionAppliesToDay(option, day))
    .map(option => ({ shop, option, savings: liftTicketSavings(option, day.date) })))
    .sort((left, right) => (right.savings?.savedPerPerson ?? 0) - (left.savings?.savedPerPerson ?? 0) || (left.option.representativePrice ?? Infinity) - (right.option.representativePrice ?? Infinity)), [day, groups]);

  async function submit(data: FormData) {
    if (await save(data)) onDone();
  }

  return <>
    <section className={cn("rounded-2xl border p-3.5", officialApplied ? "border-foreground/30 bg-muted/60" : "")} aria-label="공식 리조트 리프트권">
      <div className="flex items-start justify-between gap-3">
        <div><h3 className="font-semibold">공식 리조트권</h3><p className="mt-0.5 text-xs text-muted-foreground">리조트가 직접 판매하는 시간권</p></div>
        {officialApplied ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200"><Check aria-hidden="true" className="h-3.5 w-3.5" />적용 중</span> : null}
      </div>
      <form action={submit} className="mt-3 space-y-3">
        <input type="hidden" name={access.name} value={access.value} />
        <input type="hidden" name="decision" value="lift_day" />
        <input type="hidden" name="skiDate" value={day.date} />
        <SelectField name="liftTicketTimeSlot" ariaLabel={`${day.date} 공식 리프트권 시간`} value={slot} onValueChange={value => setSlot(value as TimeSlot)} options={liftSlotOptions(resortId, day.date, day.timeSlot)} />
        <p className="flex items-center gap-2 text-sm font-semibold" aria-live="polite">{officialPrice ? <><ConfidenceDot confidence={official?.confidence ?? "unavailable"} />{formatCurrency(officialPrice)}<span className="text-xs font-normal text-muted-foreground">/인{official?.referenceSeason ? " · 25/26 참고가" : ""}{peopleCount > 1 ? ` · ${peopleCount}명 ${formatCurrency(officialPrice * peopleCount)}` : ""}</span></> : <span className="text-xs font-medium text-muted-foreground">이 시간권의 공식 가격이 아직 공개되지 않았어요</span>}</p>
        {slot !== day.timeSlot ? <p className="text-xs text-muted-foreground">시간권을 바꾸면 이 날짜의 렌탈 상품 가격도 새 이용 시간에 맞춰 다시 확인해요.</p> : null}
        <LiftPromoNote resortId={resortId} timeSlot={slot} visitDate={day.date} />
        <div className="flex gap-2">
          {canEdit ? <SubmitButton className="h-11 flex-1" variant={officialApplied && slot === day.timeSlot ? "secondary" : "primary"} pendingText="저장 중…">이 날짜에 공식권 적용</SubmitButton> : null}
          {liftUrl ? <AnalyticsLink href={liftUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "decision_source" }}><Button type="button" variant="secondary" className="h-11 px-3">공식 판매처 <ExternalLink aria-hidden="true" className="h-4 w-4" /></Button></AnalyticsLink> : null}
        </div>
      </form>
    </section>

    <section className="rounded-2xl border p-3.5" aria-label="렌탈샵 할인 리프트권">
      <h3 className="font-semibold">렌탈샵 할인권</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{timeSlotLabels[day.timeSlot]} 기준으로 판매 중인 할인권이에요. 다른 시간권은 공식 시간을 바꾸면 보여요.</p>
      {deals.length ? <ul className="mt-3 space-y-2">{deals.map(({ shop, option, savings }) => {
        const applied = day.liftTicketOptionId === option.id;
        return <li key={option.id} className={cn("rounded-xl border p-3", applied ? "border-foreground/30 bg-muted/60" : "bg-background")}>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0"><p className="truncate text-sm font-semibold">{shop.name}</p><p className="mt-0.5 text-xs text-muted-foreground">{option.label}</p></div>
            <div className="shrink-0 text-right">
              <p className="flex items-center justify-end gap-1.5 text-sm font-semibold"><ConfidenceDot confidence={option.confidence} />{option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}</p>
              {savings ? <p className="text-xs text-muted-foreground"><span className="line-through">{formatCurrency(savings.officialPrice)}</span> <span className="font-semibold text-emerald-700 dark:text-emerald-300">-{savings.discountRate}%</span></p> : null}
            </div>
          </div>
          {savings ? <p className="mt-2 rounded-lg bg-emerald-500/10 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 dark:text-emerald-200">1인 {formatCurrency(savings.savedPerPerson)} 절감{peopleCount > 1 ? ` · ${peopleCount}명 ${formatCurrency(savings.savedPerPerson * peopleCount)}` : ""}</p> : <p className="mt-2 text-xs text-muted-foreground">같은 시간대 공식 가격이 확인된 경우에만 절감액을 표시해요.</p>}
          {canEdit ? <form action={submit} className="mt-2">
            <input type="hidden" name={access.name} value={access.value} />
            <input type="hidden" name="decision" value="discounted_lift_day" />
            <input type="hidden" name="skiDate" value={day.date} />
            <input type="hidden" name="selectedLiftTicketOptionId" value={option.id} />
            <SubmitButton className="h-10 w-full" variant={applied ? "secondary" : "primary"} pendingText="저장 중…">{applied ? <><Check aria-hidden="true" className="h-4 w-4" />적용 중 · 다시 적용</> : "이 할인권 적용"}</SubmitButton>
          </form> : null}
        </li>;
      })}</ul> : <p className="mt-3 rounded-xl border border-dashed p-4 text-center text-xs leading-5 text-muted-foreground">선택한 날짜·시간에 공개된 할인권이 없어요. 공식권을 선택해 주세요.</p>}
    </section>
  </>;
}
