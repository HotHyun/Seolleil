import type { Priority, TimeSlot } from "@/lib/types";

export const CURRENT_SEASON = "2025-2026";
export const REFERENCE_PRICE_SEASON = "25/26 시즌";

export const priorityLabels: Record<Priority, string> = {
  close: "가까움",
  cheap: "저렴함",
  beginner: "초보 친화",
  night: "야간 가능",
  transport: "셔틀/버스",
  facilities: "시설 좋음",
  scale: "규모/코스",
  rental: "렌탈 편의"
};

export const timeSlotLabels: Record<TimeSlot, string> = {
  "2h": "2시간권",
  "3h": "3시간권",
  "4h": "4시간권",
  "5h": "5시간권",
  "6h": "6시간권",
  "7h": "7시간권",
  night: "야간권",
  full_day: "종일권",
  all: "전체"
};
