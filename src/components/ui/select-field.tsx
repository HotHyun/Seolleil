"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type SelectOption = {
  value: string;
  label: string;
};

export function SelectField({
  name,
  defaultValue,
  value,
  onValueChange,
  ariaLabel,
  options,
  placeholder = "선택"
}: {
  name?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  ariaLabel?: string;
  options: SelectOption[];
  placeholder?: string;
}) {
  return (
    <Select name={name} defaultValue={defaultValue} value={value} onValueChange={onValueChange}>
      <SelectTrigger aria-label={ariaLabel}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
