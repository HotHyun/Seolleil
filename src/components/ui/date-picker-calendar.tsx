"use client";

import { ko } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";

// 달력 라이브러리(react-day-picker·date-fns)는 날짜 팝업을 열 때만 불러온다. 홈 첫 화면 번들에서 뺀다.
export default function DatePickerCalendar({ date, onSelect, minDate, maxDate }: { date?: Date; onSelect: (next: Date | undefined) => void; minDate?: Date; maxDate?: Date }) {
  return (
    <DayPicker
      mode="single"
      navLayout="around"
      selected={date}
      onSelect={onSelect}
      disabled={minDate || maxDate ? [
        ...(minDate ? [{ before: minDate }] : []),
        ...(maxDate ? [{ after: maxDate }] : [])
      ] : undefined}
      locale={ko}
      weekStartsOn={0}
      fixedWeeks
      classNames={{
        root: "relative p-0 [--rdp-nav_button-height:45px] [--rdp-nav_button-width:45px] [--rdp-accent-color:hsl(var(--foreground))]",
        month: "relative",
        month_caption: "relative flex h-11 items-center justify-center px-11",
        caption_label: "calendar-caption pointer-events-none text-sm font-semibold",
        nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between",
        button_previous: "calendar-previous absolute shrink-0 min-h-[45px] min-w-[45px] left-0 top-0 z-10 inline-flex h-[45px] w-[45px] touch-manipulation cursor-pointer items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        button_next: "calendar-next absolute shrink-0 min-h-[45px] min-w-[45px] right-0 top-0 z-10 inline-flex h-[45px] w-[45px] touch-manipulation cursor-pointer items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-11 py-2 text-center text-xs font-medium text-muted-foreground",
        week: "mt-1 flex w-full",
        day: "relative h-11 w-11 p-0 text-center",
        day_button: "h-11 w-11 cursor-pointer rounded-lg text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        today: "text-primary",
        selected: "rounded-lg bg-primary text-primary-foreground hover:bg-primary",
        outside: "text-muted-foreground/40",
        disabled: "cursor-not-allowed text-muted-foreground/30 opacity-50"
      }}
    />
  );
}
