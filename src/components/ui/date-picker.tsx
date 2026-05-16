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
  name,
  required,
  defaultValue,
  placeholder = "날짜 선택"
}: {
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
}) {
  const [date, setDate] = React.useState<Date | undefined>(() => {
    if (!defaultValue) return undefined;
    const parsed = new Date(`${defaultValue}T00:00:00`);
    return Number.isNaN(parsed.getTime()) ? undefined : parsed;
  });

  const value = date ? format(date, "yyyy-MM-dd") : "";

  return (
    <Popover>
      <input type="hidden" name={name} value={value} required={required} />
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="secondary"
          className={cn("w-full justify-start border-input bg-card px-3 text-left font-semibold", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="h-4 w-4" />
          {date ? format(date, "yyyy년 M월 d일", { locale: ko }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto p-3">
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          locale={ko}
          weekStartsOn={0}
          classNames={{
            today: "text-primary",
            selected: "bg-primary text-primary-foreground rounded-md",
            day_button: "h-9 w-9 rounded-md text-sm hover:bg-muted"
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
