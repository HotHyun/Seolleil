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
            root: "p-0",
            month_caption: "relative flex h-11 items-center justify-center",
            caption_label: "text-sm font-black",
            nav: "absolute inset-x-0 top-3 flex items-center justify-between px-3",
            button_previous: "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            button_next: "inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border bg-background hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
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
