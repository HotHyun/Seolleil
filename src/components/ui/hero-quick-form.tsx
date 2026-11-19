"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { SelectField } from "@/components/ui/select-field";
import { departureLocations } from "@/data/resorts";
import { todayKst } from "@/lib/season-open";

const hiddenDefaults: Array<[string, string]> = [
  ["peopleCount", "2"], ["tripDuration", "same_day"], ["transportType", "car"], ["skillLevel", "beginner"],
  ["rideType", "ski"], ["ownsEquipment", "false"], ["ownsClothing", "false"], ["priority1", "beginner"],
  ["priority2", "close"], ["priority3", "rental"], ["liftTicketTimeSlot", "4h"]
];

const fieldClass = "h-11 min-h-11 rounded-lg border-white/20 bg-[#071225]/70 px-3 text-sm font-semibold text-white shadow-none hover:translate-y-0 hover:bg-[#071225]/90 focus-visible:ring-white focus-visible:ring-offset-0 data-[placeholder]:text-white/60";

// Quick start form on the home hero. A GET form to /recommendations with the
// same defaults as the full plan flow; the date is the only required input.
export function HeroQuickForm() {
  const [visitDate, setVisitDate] = useState("");
  return (
    <form action="/recommendations" method="get" className="hero-reveal hero-delay-4 mt-6 grid max-w-xl gap-2 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur-xl sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div className="grid gap-1">
        <span className="text-xs font-bold text-white/75">방문 날짜</span>
        <DatePicker name="visitDate" min={todayKst()} value={visitDate} onValueChange={setVisitDate} ariaLabel="방문 날짜" className={`${fieldClass} ${visitDate ? "text-white" : "text-white/60"}`} />
      </div>
      <div className="grid gap-1">
        <span className="text-xs font-bold text-white/75">출발지</span>
        <SelectField name="departureLocation" defaultValue="seoul-gangnam" ariaLabel="출발지" className={fieldClass} options={departureLocations.map(location => ({ value: location.id, label: location.label }))} />
      </div>
      {hiddenDefaults.map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <button type="submit" disabled={!visitDate} className="h-11 rounded-lg bg-[#b8f23d] px-5 text-sm font-black text-[#071225] transition hover:bg-[#c8ff52] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50">바로 추천 보기</button>
      <p className="text-xs font-medium text-white/60 sm:col-span-3">{visitDate ? "2명·당일·자차·초보 기준으로 계산해요." : "방문 날짜를 고르면 바로 추천을 볼 수 있어요."} 조건을 직접 정하려면 위의 “내 스키 여행 시작하기”를 눌러 주세요.</p>
    </form>
  );
}
