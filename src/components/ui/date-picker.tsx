"use client";

import * as React from "react";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export function DatePicker({
  id,
  name,
  required,
  defaultValue,
  value,
  onValueChange,
  min,
  max,
  disabled,
  ariaLabel,
  placeholder = "날짜 선택"
}: {
  id?: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  ariaLabel?: string;
  placeholder?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const date = parseDate(selectedValue);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);

  function selectDate(next: Date | undefined) {
    const nextValue = next ? format(next, "yyyy-MM-dd") : "";
    if (value === undefined) setInternalValue(nextValue);
    onValueChange?.(nextValue);
    if (next) setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <input type="hidden" name={name} value={selectedValue} required={required} />
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="secondary"
          disabled={disabled}
          aria-label={ariaLabel}
          className={cn("min-h-11 w-full justify-start border-input bg-card px-3 text-left font-semibold", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "yyyy년 M월 d일", { locale: ko }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] p-3">
        <DayPicker
          mode="single"
          navLayout="around"
          selected={date}
          onSelect={selectDate}
          disabled={minDate || maxDate ? [
            ...(minDate ? [{ before: minDate }] : []),
            ...(maxDate ? [{ after: maxDate }] : [])
          ] : undefined}
          locale={ko}
          weekStartsOn={0}
          fixedWeeks
          classNames={{
            root: "relative p-0 [--rdp-nav_button-height:2.75rem] [--rdp-nav_button-width:2.75rem] [--rdp-accent-color:hsl(var(--foreground))]",
            month: "relative",
            month_caption: "relative flex h-11 items-center justify-center px-11",
            caption_label: "calendar-caption pointer-events-none text-sm font-black",
            nav: "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-11 items-center justify-between",
            button_previous: "calendar-previous absolute left-0 top-0 z-10 inline-flex h-11 w-11 touch-manipulation cursor-pointer items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            button_next: "calendar-next absolute right-0 top-0 z-10 inline-flex h-11 w-11 touch-manipulation cursor-pointer items-center justify-center rounded-lg border bg-background text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            month_grid: "w-full border-collapse",
            weekdays: "flex",
            weekday: "w-11 py-2 text-center text-xs font-bold text-muted-foreground",
            week: "mt-1 flex w-full",
            day: "relative h-11 w-11 p-0 text-center",
            day_button: "h-11 w-11 cursor-pointer rounded-lg text-sm font-semibold hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            today: "text-primary",
            selected: "rounded-lg bg-primary text-primary-foreground hover:bg-primary",
            outside: "text-muted-foreground/40",
            disabled: "cursor-not-allowed text-muted-foreground/30 opacity-50"
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

function parseDate(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
