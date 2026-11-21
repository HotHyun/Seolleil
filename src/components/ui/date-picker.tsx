"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DatePickerCalendar = dynamic(() => import("@/components/ui/date-picker-calendar"), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[22rem] w-[19.5rem] max-w-full" />
});

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
  placeholder = "날짜 선택",
  className
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
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(defaultValue ?? "");
  const selectedValue = value ?? internalValue;
  const date = parseDate(selectedValue);
  const minDate = parseDate(min);
  const maxDate = parseDate(max);

  function selectDate(next: Date | undefined) {
    const nextValue = next ? toIsoDate(next) : "";
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
          className={cn("min-h-11 w-full justify-start border-input bg-card px-3 text-left font-semibold", !date && "text-muted-foreground", className)}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? koreanDateLabel(date) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto max-w-[calc(100vw-2rem)] p-3">
        <DatePickerCalendar date={date} onSelect={selectDate} minDate={minDate} maxDate={maxDate} />
      </PopoverContent>
    </Popover>
  );
}

function toIsoDate(date: Date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function koreanDateLabel(date: Date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function parseDate(value?: string) {
  if (!value) return undefined;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed;
}
