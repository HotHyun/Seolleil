"use client";

import { useState } from "react";
import { BedDouble, ExternalLink, Moon, WandSparkles } from "lucide-react";
import { PlaceComparisonMap, type PlaceCandidate } from "@/components/place-comparison-map";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { NearbyLodging } from "@/data/resort-map";
import type { TripSkiPlan } from "@/lib/trip-ski-plan";
import { formatCurrency } from "@/lib/utils";

type Props = {
  plan: TripSkiPlan;
  lodgingOptions: NearbyLodging[];
  lodgingSearchUrl?: string;
  access: { name: string; value: string };
  save: (data: FormData) => Promise<void>;
  canEdit: boolean;
};

export function TripLodgingPlan({ plan, lodgingOptions, lodgingSearchUrl, access, save, canEdit }: Props) {
  const [activeDate, setActiveDate] = useState(plan.lodgingNights[0]?.date ?? "");
  const activeNight = plan.lodgingNights.find(night => night.date === activeDate) ?? plan.lodgingNights[0];
  const initialOption = lodgingOptions.find(item => item.name === activeNight?.lodgingName);
  const [lodgingId, setLodgingId] = useState<string | null>(initialOption?.id ?? null);
  const selectedLodging = lodgingOptions.find(item => item.id === lodgingId);
  const savedNights = plan.lodgingNights.filter(night => night.lodgingName).length;
  const savedCost = plan.lodgingNights.reduce((sum, night) => sum + (night.cost ?? 0), 0);

  if (!activeNight) {
    return <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center"><Moon className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-black">당일치기 일정이에요</p><p className="mt-1 text-sm leading-6 text-muted-foreground">출발 날짜가 도착 날짜와 같아 등록할 숙박 밤이 없습니다. 일정이 늘어나면 숙박 밤이 자동으로 생깁니다.</p></div>;
  }

  function chooseNight(date: string) {
    const night = plan.lodgingNights.find(item => item.date === date);
    setActiveDate(date);
    setLodgingId(lodgingOptions.find(item => item.name === night?.lodgingName)?.id ?? null);
  }

  const candidates: PlaceCandidate[] = lodgingOptions.map(item => ({
    id: item.id,
    name: item.name,
    type: "lodging",
    latitude: item.latitude,
    longitude: item.longitude,
    searchQuery: item.name,
    externalMapUrl: item.mapLinks?.kakao ?? item.mapLinks?.naver
  }));

  return <div className="space-y-4">
    <div className="flex items-center justify-between gap-3 rounded-xl border bg-muted/25 p-3">
      <div><p className="text-xs font-black uppercase tracking-wider text-muted-foreground">숙박 진행</p><p className="mt-1 font-black">{savedNights}/{plan.lodgingNights.length}박 선택됨</p></div>
      <div className="text-right"><p className="text-xs text-muted-foreground">입력한 숙박비</p><p className="font-black tabular-nums">{formatCurrency(savedCost)}</p></div>
    </div>
    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="날짜별 숙박 계획">
      {plan.lodgingNights.map((night, index) => <button key={night.date} type="button" role="tab" aria-selected={activeNight.date === night.date} onClick={() => chooseNight(night.date)} className={`min-h-11 shrink-0 cursor-pointer rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeNight.date === night.date ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}><span className="block text-xs font-black">{formatNightDate(night.date)} 숙박</span><span className={`mt-0.5 block text-[11px] ${activeNight.date === night.date ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{index + 1}박 · {night.lodgingName ?? "미정"}</span></button>)}
    </div>
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]">
      <PlaceComparisonMap candidates={candidates} selectedId={lodgingId} onSelect={setLodgingId} />
      <div className="space-y-3">
        <div className="grid max-h-52 gap-2 overflow-y-auto pr-1">
          <button type="button" onClick={() => setLodgingId(null)} className={`min-h-11 cursor-pointer rounded-xl border p-3 text-left transition-colors ${lodgingId === null ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">다른 숙소 직접 입력</span><span className="mt-1 block text-xs text-muted-foreground">외부에서 찾은 숙소도 이 밤에 기록할 수 있어요.</span></button>
          {lodgingOptions.map(item => <button key={item.id} type="button" onClick={() => setLodgingId(item.id)} className={`min-h-11 cursor-pointer rounded-xl border p-3 text-left transition-colors ${lodgingId === item.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">공식 숙박 · {item.category === "resort_hotel" ? "호텔" : "콘도"}</span></button>)}
        </div>
        <form key={`${activeNight.date}:${lodgingId ?? "custom"}`} action={save} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name={access.name} value={access.value} />
          <input type="hidden" name="decision" value="lodging_night" />
          <input type="hidden" name="stayDate" value={activeNight.date} />
          <Field label="숙소 이름"><Input name="lodgingName" required maxLength={120} defaultValue={selectedLodging?.name ?? activeNight.lodgingName ?? ""} readOnly={Boolean(selectedLodging)} placeholder="예약하거나 검토 중인 숙소" /></Field>
          <Field label="이 밤의 숙박비"><Input name="lodgingCostInput" type="number" min="0" max="100000000" step="1000" defaultValue={activeNight.cost ?? ""} placeholder="1박 금액" /></Field>
          <Field label="예약·숙소 링크"><Input name="lodgingUrl" type="url" defaultValue={selectedLodging?.url ?? activeNight.lodgingUrl ?? ""} readOnly={Boolean(selectedLodging)} placeholder="https://" /></Field>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border bg-muted/25 px-3 text-sm font-bold"><input type="checkbox" name="applyToAllNights" value="true" className="h-4 w-4 accent-primary" /><WandSparkles className="h-4 w-4 text-primary" />모든 숙박 밤에 적용</label>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">{canEdit ? <SubmitButton pendingText="숙박 저장 중…">{formatNightDate(activeNight.date)} 숙박 저장</SubmitButton> : null}{selectedLodging?.url ? <ExternalButton href={selectedLodging.url}>공식 원문</ExternalButton> : lodgingSearchUrl ? <ExternalButton href={lodgingSearchUrl}>주변 숙소</ExternalButton> : null}</div>
          <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">여러 밤의 숙소나 가격이 같다면 한 번에 적용한 뒤, 달라지는 밤만 다시 선택해 수정하세요.</p>
        </form>
      </div>
    </div>
  </div>;
}

function formatNightDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <a href={href} target="_blank" rel="noreferrer"><Button type="button" variant="secondary" className="h-9 px-3 text-xs">{children}<ExternalLink className="h-3.5 w-3.5" /></Button></a>;
}
