"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarRange, Clock3 } from "lucide-react";
import { updateTripSkiScheduleSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { Field } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { timeSlotLabels } from "@/lib/constants";
import {
  enumerateTripDates,
  toDateOnly,
  tripDayTypeLabel,
  type TripSkiPlan
} from "@/lib/trip-ski-plan";
import type { TimeSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

type ScheduleTrip = {
  id: string;
  visitDate: Date;
  endDate: Date;
  skiPlan: TripSkiPlan;
};

const timeOptions = Object.entries(timeSlotLabels)
  .filter(([value]) => value !== "all")
  .map(([value, label]) => ({ value, label }));

export function TripSkiPlanEditor({ trip, editToken, shareToken, canEdit = true }: {
  trip: ScheduleTrip;
  editToken?: string;
  shareToken?: string;
  canEdit?: boolean;
}) {
  const router = useRouter();
  const [startDate, setStartDate] = useState(toDateOnly(trip.visitDate));
  const [endDate, setEndDate] = useState(toDateOnly(trip.endDate));
  const [days, setDays] = useState(() => new Map(trip.skiPlan.days.map(day => [day.date, day.timeSlot])));
  const range = useMemo(() => enumerateTripDates(startDate, endDate), [endDate, startDate]);
  const rangeIsComplete = range.length > 0 && range.at(-1) === endDate;

  function toggleDay(date: string) {
    setDays(current => {
      const next = new Map(current);
      if (next.has(date)) next.delete(date);
      else next.set(date, trip.skiPlan.days.find(day => day.date === date)?.timeSlot ?? "4h");
      return next;
    });
  }

  async function saveSchedule(formData: FormData) {
    const skiDays = range
      .filter(date => days.has(date))
      .map(date => ({ date, timeSlot: days.get(date) }));
    formData.set("skiDays", JSON.stringify(skiDays));
    const result = await updateTripSkiScheduleSafeAction(formData);
    showActionResult(result);
    if (result.ok) router.refresh();
  }

  return (
    <form action={saveSchedule} className="space-y-4">
      <input type="hidden" name={editToken ? "editToken" : shareToken ? "shareToken" : "tripId"} value={editToken ?? shareToken ?? trip.id} />
      <input type="hidden" name="skiDays" value="[]" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="도착 날짜">
          <DatePicker name="startDate" required value={startDate} onValueChange={value => { setStartDate(value); if (endDate < value) setEndDate(value); }} ariaLabel="여행 도착 날짜" />
        </Field>
        <Field label="출발 날짜">
          <DatePicker name="endDate" required min={startDate} value={endDate} onValueChange={setEndDate} ariaLabel="여행 출발 날짜" />
        </Field>
      </div>
      {!rangeIsComplete ? <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm font-semibold text-destructive">여행 기간은 도착일부터 최대 14일까지 선택해 주세요.</p> : null}
      {rangeIsComplete ? <div className="space-y-2" aria-label="날짜별 스키 일정">
        {range.map((date, index) => {
          const selected = days.has(date);
          const label = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
          return <div key={date} className={cn("rounded-xl border p-3 transition-colors", selected ? "border-primary/40 bg-primary/5" : "bg-muted/30")}>
            <div className="flex items-center gap-3">
              <button type="button" role="checkbox" aria-checked={selected} onClick={() => toggleDay(date)} className={cn("flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", selected ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground")}>
                {selected ? <Clock3 className="h-4 w-4" /> : <CalendarRange className="h-4 w-4" />}
              </button>
              <button type="button" onClick={() => toggleDay(date)} className="min-h-11 min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <span className="block font-black">{label}</span>
                <span className="mt-0.5 block text-xs font-semibold text-muted-foreground">{tripDayTypeLabel(date)} 가격 · 여행 {index + 1}일차</span>
              </button>
              {selected ? <div className="w-32 shrink-0 max-[390px]:w-28"><SelectField ariaLabel={`${label} 이용 시간`} value={days.get(date)} onValueChange={value => setDays(current => new Map(current).set(date, value as TimeSlot))} options={timeOptions} /></div> : null}
            </div>
          </div>;
        })}
      </div> : null}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 p-3">
        <p className="text-xs leading-5 text-muted-foreground">기간을 바꾸면 스키 날짜뿐 아니라 가는 길·돌아오는 길과 숙박 밤도 함께 조정됩니다.</p>
        {canEdit ? <SubmitButton disabled={!rangeIsComplete || !range.some(date => days.has(date))} pendingText="일정 저장 중…">스키 일정 저장</SubmitButton> : null}
      </div>
    </form>
  );
}
