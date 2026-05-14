import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value?: number) {
  if (typeof value !== "number") return "가격 확인 필요";
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0
  }).format(value);
}

export function formatMinutes(minutes?: number) {
  if (!minutes) return "확인 필요";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!hours) return `${mins}분`;
  if (!mins) return `${hours}시간`;
  return `${hours}시간 ${mins}분`;
}

export function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

