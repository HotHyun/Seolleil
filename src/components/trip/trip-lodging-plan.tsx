"use client";

import { AffiliateNotice } from "@/components/affiliate-notice";
import { AnalyticsLink } from "@/components/analytics-link";
import { NearbyPlaceHelp } from "@/components/nearby-place-help";
import { StatusBadge } from "@/components/status-badge";
import { createMap, createPin, resortPin, useKakaoMapSdk, usePlacePoints } from "@/components/trip/kakao-place-map";
import { getResort } from "@/data/resorts";
import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, ExternalLink, List, LoaderCircle, MapPin, Moon, PencilLine, WandSparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { Field, Input } from "@/components/ui/field";
import { SubmitButton } from "@/components/ui/submit-button";
import { getOfficialLodgingSalesForResort } from "@/data/official-lodging-sales";
import { getResortMapPoint, type NearbyLodging } from "@/data/resort-map";
import { labelKakaoMapLinks } from "@/lib/kakao-map-a11y";
import type { TripSkiPlan } from "@/lib/trip-ski-plan";
import { cn, formatCurrency } from "@/lib/utils";

type LodgingFilter = "all" | "resort_lodging" | "hotel" | "nearby_stay";

type Props = {
  resortId: string;
  plan: TripSkiPlan;
  lodgingOptions: NearbyLodging[];
  lodgingSearchUrl?: string;
  access: { name: string; value: string };
  save: (data: FormData) => Promise<boolean>;
  canEdit: boolean;
};

export function TripLodgingPlan({ resortId, plan, lodgingOptions, lodgingSearchUrl, access, save, canEdit }: Props) {
  const [activeDate, setActiveDate] = useState(plan.lodgingNights[0]?.date ?? "");
  const [filter, setFilter] = useState<LodgingFilter>("all");
  const activeNight = plan.lodgingNights.find(night => night.date === activeDate) ?? plan.lodgingNights[0];
  const [lodgingId, setLodgingId] = useState<string | null>(lodgingOptions.find(item => item.name === activeNight?.lodgingName)?.id ?? null);
  const [listOpen, setListOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [custom, setCustom] = useState(false);
  const selectedLodging = lodgingOptions.find(item => item.id === lodgingId);
  const salesSnapshot = getOfficialLodgingSalesForResort(resortId);
  const counts = {
    resort_lodging: lodgingOptions.filter(item => item.category === "condo").length,
    hotel: lodgingOptions.filter(item => item.category === "resort_hotel").length,
    nearby_stay: lodgingOptions.filter(item => item.category === "nearby_stay").length
  };
  const visibleOptions = useMemo(() => lodgingOptions.filter(item => filter === "all"
    || (filter === "resort_lodging" && item.category === "condo")
    || (filter === "hotel" && item.category === "resort_hotel")
    || (filter === "nearby_stay" && item.category === "nearby_stay")
    || item.id === lodgingId), [filter, lodgingId, lodgingOptions]);
  const savedNights = plan.lodgingNights.filter(night => night.lodgingName).length;
  const savedCost = plan.lodgingNights.reduce((sum, night) => sum + (night.cost ?? 0), 0);

  if (!activeNight) {
    return <div className="rounded-2xl border border-dashed bg-muted/20 p-6 text-center"><Moon className="mx-auto h-6 w-6 text-primary" /><p className="mt-3 font-semibold">당일치기 일정이에요</p><p className="mt-1 text-sm leading-6 text-muted-foreground">귀가 날짜가 도착 날짜와 같아 등록할 숙박 밤이 없습니다. 여행 기간을 늘리면 숙박 밤이 자동으로 생깁니다.</p></div>;
  }

  function chooseNight(date: string) {
    const night = plan.lodgingNights.find(item => item.date === date);
    setActiveDate(date);
    setLodgingId(lodgingOptions.find(item => item.name === night?.lodgingName)?.id ?? null);
  }

  function openForm(isCustom: boolean) {
    setCustom(isCustom);
    if (isCustom) setLodgingId(null);
    setFormOpen(true);
  }

  return <div className="space-y-3">
    <div className="grid grid-cols-2 gap-2" data-testid="lodging-summary">
      <div className="rounded-xl border bg-muted/25 p-3"><p className="text-xs font-semibold text-muted-foreground">숙박 진행</p><p className="mt-1 text-lg font-semibold tabular-nums">{savedNights}/{plan.lodgingNights.length}박 선택</p></div>
      <div className="rounded-xl border bg-muted/25 p-3"><p className="text-xs font-semibold text-muted-foreground">입력한 숙박비</p><p className="mt-1 text-lg font-semibold tabular-nums">{formatCurrency(savedCost)}</p></div>
    </div>

    <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="날짜별 숙박 계획">
      {plan.lodgingNights.map((night, index) => {
        const active = activeNight.date === night.date;
        return <button key={night.date} type="button" role="tab" aria-selected={active} onClick={() => chooseNight(night.date)} className={cn("min-h-12 shrink-0 cursor-pointer rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", active ? "border-foreground/40 bg-muted text-foreground" : "bg-card hover:bg-muted")}>
          <span className="block text-xs font-semibold">{formatNightDate(night.date)} 숙박 · {index + 1}박</span>
          <span className={cn("mt-0.5 block max-w-[10rem] truncate text-xs font-semibold", night.lodgingName ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300")}>{night.lodgingName ? `${night.lodgingName}${night.cost ? ` · ${formatCurrency(night.cost)}` : ""}` : "미정"}</span>
        </button>;
      })}
    </div>

    <LodgingMap
      resortId={resortId}
      options={visibleOptions}
      savedName={activeNight.lodgingName}
      savedCost={activeNight.cost}
      selectedId={lodgingId}
      onSelect={id => { setLodgingId(id); setCustom(false); }}
      filter={filter}
      onFilter={setFilter}
      counts={counts}
      total={lodgingOptions.length}
      canEdit={canEdit}
      onOpenList={() => setListOpen(true)}
      onChoose={() => openForm(false)}
      onCustom={() => openForm(true)}
      searchUrl={lodgingSearchUrl}
    />

    <AffiliateNotice />
    {salesSnapshot ? <details className="group rounded-2xl border bg-muted/15 p-4 sm:p-5">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3">
        <span className="flex flex-wrap items-center gap-2"><span id="official-lodging-sales-title" className="font-semibold">공식 객실 판매 현황</span><span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">{salesSnapshot.statusLabel}</span></span>
        <ChevronDown aria-hidden="true" className="h-4 w-4 shrink-0 transition-transform group-open:rotate-180" />
      </summary>
      <section aria-labelledby="official-lodging-sales-title" className="mt-3 space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <p className="min-w-0 text-sm leading-6 text-muted-foreground">{salesSnapshot.statusSummary}</p>
          <ExternalButton href={salesSnapshot.reservationUrl}>객실 예약·재고 확인</ExternalButton>
        </div>
        {salesSnapshot.offers.length ? <ul className="divide-y rounded-xl border bg-card px-3">
          {salesSnapshot.offers.map((offer) => <li key={offer.title} className="py-3 first:pt-3 last:pb-3">
            <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-semibold">{offer.title}</p><p className="mt-1 text-sm font-semibold tabular-nums text-muted-foreground">{offer.priceSummary}</p></div>{offer.period ? <span className="text-xs text-muted-foreground sm:text-right">{offer.period}</span> : null}</div>
            {offer.note ? <p className="mt-1 text-xs leading-5 text-muted-foreground">{offer.note}</p> : null}
            <AnalyticsLink href={offer.url} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "lodging_offer" }} className="mt-2 inline-flex min-h-9 items-center gap-1 text-xs font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">공식 상품 보기<ExternalLink className="h-4 w-4" /></AnalyticsLink>
          </li>)}
        </ul> : <p className="rounded-xl border border-dashed px-3 py-2 text-sm leading-6 text-muted-foreground">공개된 26/27 겨울 객실 요금은 확인되지 않았습니다. 예약 화면에서 숙박일과 객실을 선택해 확인하세요.</p>}
        <p className="text-xs leading-5 text-muted-foreground">공식 페이지 확인일 {salesSnapshot.checkedAt}. {salesSnapshot.winterPriceStatus === "published" ? "시즌패스 등 상품 조건이 있는 요금입니다." : salesSnapshot.winterPriceStatus === "partial" ? "표시한 가격은 기간·상품 조건이 붙은 참고값이며, 겨울 전체 요금이 아닐 수 있습니다." : "겨울 요금은 날짜별 공식 예약 화면에서 확인하세요."} 예약 가능 객실과 최종 금액은 달라질 수 있습니다.</p>
      </section>
    </details> : null}

    <Drawer open={listOpen} onOpenChange={setListOpen}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">숙소 목록</DrawerTitle>
        <DrawerDescription className="mb-3 mt-1 text-sm text-muted-foreground">고르면 지도에서 위치를 보여 줘요.</DrawerDescription>
        <ul className="space-y-2">
          <li><button type="button" onClick={() => { setListOpen(false); openForm(true); }} className="flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border border-dashed p-3 text-left hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><PencilLine aria-hidden="true" className="h-4 w-4 shrink-0 text-primary" /><span><span className="block font-semibold">다른 숙소 직접 입력</span><span className="block text-xs text-muted-foreground">외부에서 찾은 숙소도 이 밤에 기록할 수 있어요.</span></span></button></li>
          {visibleOptions.map(item => <li key={item.id}><button type="button" aria-pressed={item.id === lodgingId} onClick={() => { setLodgingId(item.id); setCustom(false); setListOpen(false); }} className={cn("flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", item.id === lodgingId ? "border-foreground/40 bg-muted" : "bg-background hover:bg-muted")}>
            <span className="min-w-0"><span className="flex items-center gap-1.5 font-semibold">{item.name === activeNight.lodgingName ? <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600" /> : null}<span className="truncate">{item.name}</span></span><span className="mt-0.5 block text-xs text-muted-foreground">{lodgingTypeLabel(item)}</span></span>
          </button></li>)}
        </ul>
      </DrawerContent>
    </Drawer>

    <Drawer open={formOpen} onOpenChange={setFormOpen}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">{formatNightDate(activeNight.date)} 숙박 기록</DrawerTitle>
        <DrawerDescription className="mb-4 mt-1 text-sm text-muted-foreground">예약했거나 검토 중인 숙소와 1박 금액을 적어 두세요.</DrawerDescription>
        <form key={`${activeNight.date}:${custom ? "custom" : lodgingId ?? "custom"}`} action={async data => { if (await save(data)) setFormOpen(false); }} className="grid gap-3 sm:grid-cols-2">
          <input type="hidden" name={access.name} value={access.value} />
          <input type="hidden" name="decision" value="lodging_night" />
          <input type="hidden" name="stayDate" value={activeNight.date} />
          <Field label="숙소 이름"><Input name="lodgingName" required maxLength={120} defaultValue={custom ? "" : selectedLodging?.name ?? activeNight.lodgingName ?? ""} readOnly={Boolean(selectedLodging) && !custom} placeholder="예약하거나 검토 중인 숙소" /></Field>
          <Field label="이 밤의 숙박비"><Input name="lodgingCostInput" type="number" min="0" max="100000000" step="1000" inputMode="numeric" defaultValue={activeNight.cost ?? ""} placeholder="1박 금액" /></Field>
          <Field label="예약·숙소 링크"><Input name="lodgingUrl" type="url" defaultValue={custom ? "" : selectedLodging?.url ?? activeNight.lodgingUrl ?? ""} readOnly={Boolean(selectedLodging) && !custom} placeholder="https://" /></Field>
          <label className="flex min-h-11 cursor-pointer items-center gap-2 self-end rounded-xl border bg-muted/25 px-3 text-sm font-medium"><input type="checkbox" name="applyToAllNights" value="true" className="h-4 w-4 accent-primary" /><WandSparkles aria-hidden="true" className="h-4 w-4 text-primary" />모든 숙박 밤에 적용</label>
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">{canEdit ? <SubmitButton pendingText="숙박 저장 중…">{formatNightDate(activeNight.date)} 숙박 저장</SubmitButton> : null}{selectedLodging?.url && !custom ? <ExternalButton href={selectedLodging.url}>{selectedLodging.category === "nearby_stay" ? `${selectedLodging.bookingPlatform ?? "예약처"} 예약` : "공식 원문"}</ExternalButton> : null}</div>
          <p className="text-xs leading-5 text-muted-foreground sm:col-span-2">숙박일·인원별 객실 요금과 재고는 예약처에서 확인하세요. 여러 밤의 숙소나 가격이 같다면 한 번에 적용한 뒤, 달라지는 밤만 다시 선택해 수정할 수 있습니다.</p>
        </form>
      </DrawerContent>
    </Drawer>

    <NearbyPlaceHelp resortName={getResort(resortId)?.name ?? "스키장"} kind="lodging" />
  </div>;
}

function LodgingMap({ resortId, options, savedName, savedCost, selectedId, onSelect, filter, onFilter, counts, total, canEdit, onOpenList, onChoose, onCustom, searchUrl }: {
  resortId: string;
  options: NearbyLodging[];
  savedName: string | null;
  savedCost: number | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  filter: LodgingFilter;
  onFilter: (filter: LodgingFilter) => void;
  counts: Record<Exclude<LodgingFilter, "all">, number>;
  total: number;
  canEdit: boolean;
  onOpenList: () => void;
  onChoose: () => void;
  onCustom: () => void;
  searchUrl?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ReturnType<typeof createMap> | null>(null);
  const overlaysRef = useRef<Array<{ setMap: (map: null) => void }>>([]);
  const fittedKeyRef = useRef("");
  const state = useKakaoMapSdk();
  const resortPoint = getResortMapPoint(resortId);
  const queries = useMemo(() => options.map(item => ({ id: item.id, latitude: item.latitude, longitude: item.longitude, query: item.name })), [options]);
  const points = usePlacePoints(state, queries);
  const selected = options.find(item => item.id === selectedId) ?? null;
  const mappedCount = Object.keys(points).length;
  const filters: Array<[LodgingFilter, string]> = [["all", `전체 ${total}`], ["resort_lodging", `리조트 숙소 ${counts.resort_lodging}`], ["hotel", `리조트 호텔 ${counts.hotel}`], ["nearby_stay", `주변 숙소 ${counts.nearby_stay}`]];

  useEffect(() => {
    if (state !== "ready" || !containerRef.current || !window.kakao?.maps) return;
    const maps = window.kakao.maps;
    const first = Object.values(points)[0] ?? resortPoint;
    if (!first) return;
    if (!mapRef.current) {
      mapRef.current = createMap(containerRef.current, first);
      labelKakaoMapLinks(containerRef.current);
    }
    const map = mapRef.current;
    const ids = Object.keys(points).sort().join(",");
    if (ids && fittedKeyRef.current !== ids) {
      fittedKeyRef.current = ids;
      const bounds = new maps.LatLngBounds();
      Object.values(points).forEach(point => bounds.extend(new maps.LatLng(point.lat, point.lng)));
      if (resortPoint) bounds.extend(new maps.LatLng(resortPoint.lat, resortPoint.lng));
      map.setBounds(bounds, 90, 40, 90, 40);
    }
    overlaysRef.current.forEach(overlay => overlay.setMap(null));
    overlaysRef.current = [];
    if (resortPoint) overlaysRef.current.push(new maps.CustomOverlay({ map, position: new maps.LatLng(resortPoint.lat, resortPoint.lng), content: resortPin(), yAnchor: 0.5, xAnchor: 0.5, zIndex: 1 }));
    options.forEach(item => {
      const point = points[item.id];
      if (!point) return;
      const saved = Boolean(savedName) && item.name === savedName;
      const selectedPin = item.id === selectedId;
      const sub = saved && savedCost ? formatCurrency(savedCost) : item.distanceMinutes ? `약 ${item.distanceMinutes}분` : item.category === "nearby_stay" ? null : "리조트 내";
      const element = createPin({ name: item.name, sub, ariaLabel: `${item.name} ${lodgingTypeLabel(item)}${saved ? " 이 밤 선택됨" : ""}`, saved, selected: selectedPin, dashed: item.category === "nearby_stay", onClick: () => onSelect(item.id) });
      overlaysRef.current.push(new maps.CustomOverlay({ map, position: new maps.LatLng(point.lat, point.lng), content: element, yAnchor: 1, xAnchor: 0.5, zIndex: selectedPin ? 30 : saved ? 20 : 10, clickable: true }));
    });
  }, [onSelect, options, points, resortPoint, savedCost, savedName, selectedId, state]);

  useEffect(() => {
    if (!selectedId || !points[selectedId] || !mapRef.current || !window.kakao?.maps) return;
    mapRef.current.panTo(new window.kakao.maps.LatLng(points[selectedId].lat, points[selectedId].lng));
  }, [points, selectedId]);

  const card = selected ? <div className="max-h-[46svh] overflow-y-auto rounded-2xl border bg-card p-3.5 shadow-lg" role="region" aria-label={`${selected.name} 선택 카드`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0"><h3 className="truncate text-base font-semibold">{selected.name}</h3><p className="mt-0.5 text-xs text-muted-foreground">{lodgingTypeLabel(selected)}</p></div>
      <div className="flex shrink-0 items-center gap-1.5">
        {savedName && selected.name === savedName ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200"><Check aria-hidden="true" className="h-3.5 w-3.5" />이 밤 선택됨</span> : null}
        <button type="button" onClick={() => onSelect(null)} aria-label="선택 닫기" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">✕</button>
      </div>
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      <StatusBadge>{selected.category === "nearby_stay" ? "주변 숙소" : selected.category === "resort_hotel" ? "리조트 호텔" : "리조트 숙소"}</StatusBadge>
      {selected.distanceMinutes ? <StatusBadge>차량 약 {selected.distanceMinutes}분</StatusBadge> : null}
      {selected.bookingPlatform ? <StatusBadge>{selected.bookingPlatform}</StatusBadge> : null}
    </div>
    <div className="mt-3 flex gap-2">
      {canEdit ? <Button type="button" className="h-11 flex-1" onClick={onChoose}>{savedName && selected.name === savedName ? "이 밤 숙박 수정" : "이 숙소로 기록하기"}</Button> : null}
      {selected.url ? <AnalyticsLink href={selected.url} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "lodging_reservation" }} aria-label={`${selected.name} 예약처 열기`}><Button type="button" variant="secondary" className="h-11 px-3"><ExternalLink aria-hidden="true" className="h-4 w-4" /><span className="sr-only sm:not-sr-only">예약처</span></Button></AnalyticsLink> : null}
    </div>
  </div> : <div className="flex items-center gap-2 rounded-2xl border bg-card/95 p-2 pl-4 shadow-lg">
    <p className="min-w-0 flex-1 text-sm font-medium"><MapPin aria-hidden="true" className="mr-2 inline h-4 w-4 text-primary" />핀을 눌러 숙소를 고르세요</p>
    {canEdit ? <Button type="button" variant="secondary" className="h-10 shrink-0 gap-1.5 px-3 text-xs" onClick={onCustom}><PencilLine aria-hidden="true" className="h-4 w-4" />직접 입력</Button> : null}
  </div>;

  if (state === "unavailable" || state === "error") {
    return <div className="space-y-3" data-testid="trip-place-map-fallback">
      <p className="rounded-xl border border-dashed p-3 text-sm leading-6 text-muted-foreground">{state === "error" ? "지도를 불러오지 못했어요." : "지도 연결 전이에요."} 목록에서 숙소를 고를 수 있어요. 위치는 외부 지도에서 확인해 주세요.</p>
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="숙소 유형 필터">{filters.map(([value, label]) => <Button key={value} type="button" variant={filter === value ? "selected" : "secondary"} aria-pressed={filter === value} className="h-9 shrink-0 px-3 text-xs hover:translate-y-0" onClick={() => onFilter(value)}>{label}</Button>)}</div>
      <ul className="space-y-2">{options.map(item => <li key={item.id}><button type="button" onClick={() => onSelect(item.id)} aria-pressed={item.id === selectedId} className={cn("min-h-12 w-full cursor-pointer rounded-xl border p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", item.id === selectedId ? "border-foreground/40 bg-muted" : "hover:bg-muted")}><span className="font-semibold">{item.name}</span><span className="mt-0.5 block text-xs text-muted-foreground">{lodgingTypeLabel(item)}</span></button></li>)}</ul>
      {card}
      {searchUrl ? <ExternalButton href={searchUrl}>주변 숙소 검색</ExternalButton> : null}
    </div>;
  }

  return <div className="relative h-[calc(100svh-19rem)] min-h-[440px] max-h-[680px] overflow-hidden rounded-2xl border bg-muted lg:h-[600px] lg:max-h-none" data-testid="trip-place-map">
    <div ref={containerRef} className="absolute inset-0" />
    {state === "loading" || (state === "ready" && options.length > 0 && mappedCount === 0) ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/90"><div className="text-center"><LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary motion-reduce:animate-none" /><p className="mt-3 text-sm font-medium">숙소 위치를 확인하고 있어요</p></div></div> : null}
    <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-2 p-2.5">
      <div className="pointer-events-auto flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1" role="group" aria-label="숙소 유형 필터">
        {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => onFilter(value)} className={cn("min-h-9 shrink-0 cursor-pointer rounded-full border px-3 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", filter === value ? "border-primary bg-primary text-primary-foreground" : "bg-card/95 text-foreground hover:bg-muted")}>{label}</button>)}
      </div>
      <Button type="button" variant="secondary" onClick={onOpenList} className="pointer-events-auto h-9 shrink-0 gap-1.5 bg-card/95 px-3 text-xs shadow-sm"><List aria-hidden="true" className="h-4 w-4" />목록</Button>
    </div>
    {state === "ready" && mappedCount > 0 && options.length > mappedCount ? <p className="pointer-events-none absolute left-3 top-14 z-20 rounded-lg border bg-card/95 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">위치를 찾은 {mappedCount}곳만 표시 · 나머지는 목록에서 확인</p> : null}
    <div className="absolute inset-x-2.5 bottom-2.5 z-20 lg:right-auto lg:w-[400px]">{card}</div>
  </div>;
}

function lodgingTypeLabel(item: NearbyLodging) {
  return item.category === "nearby_stay"
    ? `${item.bookingPlatform ?? "외부 예약처"} · 주변 숙소${item.distanceMinutes !== undefined ? ` · 차량 약 ${item.distanceMinutes}분` : ""}`
    : `리조트 공식 ${item.category === "resort_hotel" ? "호텔" : "숙소"}`;
}

function formatNightDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) {
  return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "lodging_reservation" }}><Button type="button" variant="secondary" className="h-11 px-4">{children}<ExternalLink aria-hidden="true" className="h-4 w-4" /></Button></AnalyticsLink>;
}
