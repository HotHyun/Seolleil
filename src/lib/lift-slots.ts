import { timeSlotLabels } from "@/lib/constants";
import { getSellableLiftSlots } from "@/lib/pricing";
import type { TimeSlot } from "@/lib/types";

/**
 * 리프트 시간권 선택지. 스키장이 그 날짜에 판매하는 시간권만 보여 준다.
 * 판매 시간권을 알 수 없으면(요금 자료 없음) 전체를 보여 주고, 이미 저장된 시간권이 판매 목록에 없으면 미판매로 표시해 남겨 둔다.
 */
export function liftSlotOptions(resortId: string | undefined, visitDate: string, current?: TimeSlot) {
  const all = (Object.keys(timeSlotLabels) as TimeSlot[]).filter(slot => slot !== "all");
  const sellable = resortId ? getSellableLiftSlots(resortId, visitDate) : [];
  const slots = sellable.length ? sellable : all;
  const options = slots.map(slot => ({ value: slot, label: timeSlotLabels[slot] }));
  if (current && current !== "all" && !slots.includes(current)) options.push({ value: current, label: `${timeSlotLabels[current]} (미판매)` });
  return options;
}
