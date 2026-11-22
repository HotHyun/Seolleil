"use client";

import { useState } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import { SelectField } from "@/components/ui/select-field";
import { departureLocations } from "@/data/departure-locations";
import { todayKst } from "@/lib/kst-date";

const hiddenDefaults: Array<[string, string]> = [
  ["peopleCount", "2"], ["tripDuration", "same_day"], ["transportType", "car"], ["skillLevel", "beginner"],
  ["rideType", "ski"], ["ownsEquipment", "false"], ["ownsClothing", "false"], ["priority1", "beginner"],
  ["priority2", "close"], ["priority3", "rental"], ["liftTicketTimeSlot", "4h"]
];

const departureOptions = departureLocations.map(location => ({ value: location.id, label: location.label }));

const fieldClass = "h-11 min-h-11 w-full rounded-lg bg-card px-3 text-sm font-medium shadow-none hover:bg-card";

// 홈 히어로의 빠른 시작 폼. /recommendations로 보내는 GET 폼이며 날짜만 필수다.
// 나머지는 전체 플랜 흐름과 같은 기본값(2명·당일·자차·초보)을 쓴다.
export function HeroQuickForm() {
  const [visitDate, setVisitDate] = useState("");
  return (
    <form action="/recommendations" method="get" className="hero-reveal hero-delay-2 mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
      <div className="grid gap-2">
        <span className="text-xs font-medium text-muted-foreground">방문 날짜</span>
        <DatePicker name="visitDate" min={todayKst()} value={visitDate} onValueChange={setVisitDate} ariaLabel="방문 날짜" className={`${fieldClass} ${visitDate ? "" : "text-muted-foreground"}`} />
      </div>
      <div className="grid gap-2">
        <span className="text-xs font-medium text-muted-foreground">출발지</span>
        <SelectField name="departureLocation" defaultValue="seoul-gangnam" ariaLabel="출발지" options={departureOptions} className={fieldClass} />
      </div>
      {hiddenDefaults.map(([name, value]) => <input key={name} type="hidden" name={name} value={value} />)}
      <button type="submit" disabled={!visitDate} className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50">추천 보기</button>
      <p className="text-xs text-muted-foreground sm:col-span-3">{visitDate ? "2명·당일·자차·초보 기준으로 계산해요" : "날짜를 고르면 추천을 볼 수 있어요"}</p>
    </form>
  );
}
