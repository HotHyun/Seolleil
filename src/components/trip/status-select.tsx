"use client";

import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const statusOptions = [
  ["not_needed", "필요 없음"],
  ["needs_check", "확인 필요"],
  ["planned", "예정"],
  ["reserved", "예약 완료"],
  ["paid", "결제 완료"],
  ["prepared", "준비 완료"]
];

export function StatusSelect({ name, defaultValue }: { name: string; defaultValue: string }) {
  const rootRef = React.useRef<HTMLDivElement>(null);

  return (
    <div ref={rootRef}>
      <Select
        name={name}
        defaultValue={defaultValue}
        onValueChange={() => {
          window.requestAnimationFrame(() => {
            rootRef.current?.closest("form")?.requestSubmit();
          });
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map(([value, label]) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
