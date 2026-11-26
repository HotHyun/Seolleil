"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ExternalLink, List, LoaderCircle, MapPin, Store } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { createMap, createPin, resortPin, useKakaoMapSdk, usePlacePoints } from "@/components/trip/kakao-place-map";
import { ShopPriceBreakdown } from "@/components/trip/rental-compare-parts";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { getResortMapPoint } from "@/data/resort-map";
import { labelKakaoMapLinks } from "@/lib/kakao-map-a11y";
import type { ShopComparison } from "@/lib/rental-shop-comparison";
import type { RentalPriceRule, RentalShop } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

export type RentalMapGroup = { shop: RentalShop; options: RentalPriceRule[] };
export type RentalMapFilter = "all" | "verified" | "pickup" | "clothing" | "lift";

type Overlay = { setMap: (map: null) => void };
type Needs = { equipment: boolean; clothing: boolean };

const filters: Array<[RentalMapFilter, string]> = [["all", "전체"], ["verified", "가격 확인"], ["pickup", "픽업"], ["clothing", "의류"], ["lift", "리프트권"]];

// 렌탈샵 핀마다 예상 총액을 표시하고, 핀을 누르면 리프트권·장비·의류 가격과 총액을 카드로 보여 주는 지도.
export function RentalMapPicker({ resortId, groups, results, people, needs, savedShopId, selectedId, onSelect, filter, onFilter, canEdit, onPick, unpricedToggle }: {
  resortId: string;
  groups: RentalMapGroup[];
  results: Map<string, ShopComparison>;
  people: number;
  needs: Needs;
  savedShopId: string | null;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  filter: RentalMapFilter;
  onFilter: (filter: RentalMapFilter) => void;
  canEdit: boolean;
  onPick: (shopId: string) => void;
  // 가격을 확인하지 못한 샵은 기본으로 숨기고, 원하면 지도에 함께 보이게 하는 칩.
  unpricedToggle?: { count: number; active: boolean; onToggle: () => void };
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<ReturnType<typeof createMap> | null>(null);
  const overlaysRef = useRef<Overlay[]>([]);
  const fittedKeyRef = useRef("");
  const state = useKakaoMapSdk();
  const placeQueries = useMemo(() => groups.map(({ shop }) => ({ id: shop.id, latitude: shop.latitude, longitude: shop.longitude, address: shop.address, query: `${shop.name} 스키 렌탈` })), [groups]);
  const points = usePlacePoints(state, placeQueries);
  const [listOpen, setListOpen] = useState(false);
  const resortPoint = getResortMapPoint(resortId);
  const selected = groups.find(({ shop }) => shop.id === selectedId) ?? null;
  const mappedCount = Object.keys(points).length;

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

    // 필터가 바뀌어 보이는 핀 구성이 달라질 때만 전체가 보이게 맞춘다.
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
    groups.forEach(({ shop }) => {
      const point = points[shop.id];
      if (!point) return;
      const result = results.get(shop.id);
      const isSelected = shop.id === selectedId;
      const saved = shop.id === savedShopId;
      const total = result?.complete ? result.total! : null;
      const element = createPin({
        name: shop.name,
        sub: total !== null ? formatCurrency(total) : "가격 일부 미확인",
        ariaLabel: `${shop.name} ${total !== null ? `예상 총액 ${formatCurrency(total)}` : "가격 일부 미확인"}${saved ? " 선택한 샵" : ""}`,
        saved,
        selected: isSelected,
        dashed: !result?.complete,
        onClick: () => onSelect(shop.id)
      });
      overlaysRef.current.push(new maps.CustomOverlay({ map, position: new maps.LatLng(point.lat, point.lng), content: element, yAnchor: 1, xAnchor: 0.5, zIndex: isSelected ? 30 : saved ? 20 : 10, clickable: true }));
    });
  }, [groups, onSelect, points, resortPoint, results, savedShopId, selectedId, state]);

  useEffect(() => {
    if (!selectedId || !points[selectedId] || !mapRef.current || !window.kakao?.maps) return;
    mapRef.current.panTo(new window.kakao.maps.LatLng(points[selectedId].lat, points[selectedId].lng));
  }, [points, selectedId]);

  const mapAvailable = state !== "unavailable" && state !== "error";
  const card = selected ? <SelectedShopCard shop={selected.shop} result={results.get(selected.shop.id)} people={people} needs={needs} saved={selected.shop.id === savedShopId} canEdit={canEdit} onPick={() => onPick(selected.shop.id)} onClose={() => onSelect(null)} />
    : <p className="rounded-2xl border bg-card/95 px-4 py-3 text-sm font-medium shadow-lg"><MapPin aria-hidden="true" className="mr-2 inline h-4 w-4 text-primary" />{groups.length ? "핀을 눌러 렌탈샵의 예상 총액을 확인하세요" : "조건에 맞는 렌탈샵이 없어요. 필터를 바꿔 보세요."}</p>;

  return <>
    {mapAvailable ? <div className="relative h-[calc(100svh-13rem)] min-h-[480px] max-h-[760px] overflow-hidden rounded-2xl border bg-muted lg:h-[640px] lg:max-h-none" data-testid="trip-place-map">
      <div ref={containerRef} className="absolute inset-0" />
      {state === "loading" || (state === "ready" && groups.length > 0 && mappedCount === 0) ? <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/90"><div className="text-center"><LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary motion-reduce:animate-none" /><p className="mt-3 text-sm font-medium">렌탈샵 위치를 확인하고 있어요</p></div></div> : null}

      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-start gap-2 p-2.5">
        <div className="pointer-events-auto flex min-w-0 flex-1 gap-1.5 overflow-x-auto pb-1" role="group" aria-label="렌탈샵 필터">
          {filters.map(([value, label]) => <button key={value} type="button" aria-pressed={filter === value} onClick={() => onFilter(value)} className={cn("min-h-9 shrink-0 cursor-pointer rounded-full border px-3 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", filter === value ? "border-primary bg-primary text-primary-foreground" : "bg-card/95 text-foreground hover:bg-muted")}>{label}</button>)}
          {unpricedToggle ? <button type="button" aria-pressed={unpricedToggle.active} onClick={unpricedToggle.onToggle} className={cn("min-h-9 shrink-0 cursor-pointer rounded-full border border-dashed px-3 text-xs font-semibold shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", unpricedToggle.active ? "border-primary bg-primary text-primary-foreground" : "bg-card/95 text-foreground hover:bg-muted")}>가격 미확인 {unpricedToggle.count}곳 {unpricedToggle.active ? "숨기기" : "보기"}</button> : null}
        </div>
        <Button type="button" variant="secondary" onClick={() => setListOpen(true)} className="pointer-events-auto h-9 shrink-0 gap-1.5 bg-card/95 px-3 text-xs shadow-sm"><List aria-hidden="true" className="h-4 w-4" />목록 {groups.length}</Button>
      </div>

      {state === "ready" && mappedCount > 0 && groups.length > mappedCount ? <p className="pointer-events-none absolute left-3 top-14 z-20 rounded-lg border bg-card/95 px-2.5 py-1 text-xs font-medium text-muted-foreground shadow-sm">위치를 찾은 {mappedCount}곳만 표시 · 나머지는 목록에서 확인</p> : null}
      <div className="absolute inset-x-2.5 bottom-2.5 z-20 lg:right-auto lg:w-[400px]">{card}</div>
    </div> : <div className="space-y-3" data-testid="trip-place-map-fallback">
      <p className="rounded-xl border border-dashed p-3 text-sm leading-6 text-muted-foreground">{state === "error" ? "지도를 불러오지 못했어요." : "지도 연결 전이에요."} 목록에서 렌탈샵을 비교하고 정할 수 있어요. 위치는 외부 지도에서 확인해 주세요.</p>
      <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="렌탈샵 필터">{filters.map(([value, label]) => <Button key={value} type="button" variant={filter === value ? "selected" : "secondary"} aria-pressed={filter === value} className="h-9 shrink-0 px-3 text-xs hover:translate-y-0" onClick={() => onFilter(value)}>{label}</Button>)}{unpricedToggle ? <Button type="button" variant={unpricedToggle.active ? "selected" : "secondary"} aria-pressed={unpricedToggle.active} className="h-9 shrink-0 border-dashed px-3 text-xs hover:translate-y-0" onClick={unpricedToggle.onToggle}>가격 미확인 {unpricedToggle.count}곳 {unpricedToggle.active ? "숨기기" : "보기"}</Button> : null}</div>
      <ShopList groups={groups} results={results} savedShopId={savedShopId} selectedId={selectedId} onSelect={onSelect} />
      {selected ? card : null}
    </div>}

    <Drawer open={listOpen} onOpenChange={setListOpen}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">렌탈샵 목록</DrawerTitle>
        <DrawerDescription className="mb-3 mt-1 text-sm text-muted-foreground">전체 일정 기준 예상 총액이 낮은 순이에요. 고르면 지도에서 위치를 보여 줘요.</DrawerDescription>
        <ShopList groups={groups} results={results} savedShopId={savedShopId} selectedId={selectedId} onSelect={id => { onSelect(id); setListOpen(false); }} />
      </DrawerContent>
    </Drawer>
  </>;
}

function SelectedShopCard({ shop, result, people, needs, saved, canEdit, onPick, onClose }: { shop: RentalShop; result?: ShopComparison; people: number; needs: Needs; saved: boolean; canEdit: boolean; onPick: () => void; onClose: () => void }) {
  const mapUrl = shop.mapLinks?.kakao ?? shop.mapLinks?.naver;
  return <div className="max-h-[56svh] overflow-y-auto rounded-2xl border bg-card p-3.5 shadow-lg" role="region" aria-label={`${shop.name} 가격 카드`}>
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="truncate text-base font-semibold">{shop.name}</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">{shop.distanceMinutes !== undefined ? `리조트에서 약 ${shop.distanceMinutes}분` : "외부 지도에서 위치 확인"}</p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        {saved ? <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/15 px-2 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-200"><Check aria-hidden="true" className="h-3.5 w-3.5" />선택한 샵</span> : null}
        <button type="button" onClick={onClose} aria-label="선택 닫기" className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">✕</button>
      </div>
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      {shop.dataStatus === "verified_25_26" ? <StatusBadge tone="good">가격 확인</StatusBadge> : shop.recommendationTags?.includes("가격미확인") ? <StatusBadge tone="warn">가격 미확인</StatusBadge> : <StatusBadge>가격 원문 확인</StatusBadge>}
      {shop.pickupAvailable ? <StatusBadge>픽업</StatusBadge> : null}
      {shop.clothingRentalAvailable ? <StatusBadge>의류</StatusBadge> : null}
      {shop.liftTicketSalesAvailable ? <StatusBadge>리프트권</StatusBadge> : null}
    </div>
    {result ? <div className="mt-3"><ShopPriceBreakdown result={result} people={people} needs={needs} /></div> : null}
    <div className="mt-3 flex gap-2">
      {canEdit ? <Button type="button" className="h-11 flex-1" onClick={onPick}><Store aria-hidden="true" className="h-4 w-4" />{saved ? "이 구성으로 다시 채우기" : "이 샵으로 정하기"}</Button> : null}
      {mapUrl ? <a href={mapUrl} target="_blank" rel="noreferrer" aria-label={`${shop.name} 외부 지도 열기`}><Button type="button" variant="secondary" className="h-11 px-3"><ExternalLink aria-hidden="true" className="h-4 w-4" /><span className="sr-only sm:not-sr-only">지도</span></Button></a> : null}
    </div>
  </div>;
}

function ShopList({ groups, results, savedShopId, selectedId, onSelect }: { groups: RentalMapGroup[]; results: Map<string, ShopComparison>; savedShopId: string | null; selectedId: string | null; onSelect: (id: string) => void }) {
  if (!groups.length) return <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">조건에 맞는 업체가 없습니다.</p>;
  return <ul className="space-y-2">{groups.map(({ shop }) => {
    const result = results.get(shop.id);
    return <li key={shop.id}><button type="button" onClick={() => onSelect(shop.id)} aria-pressed={shop.id === selectedId} className={cn("flex min-h-14 w-full cursor-pointer items-center justify-between gap-3 rounded-xl border p-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", shop.id === selectedId ? "border-foreground/40 bg-muted" : "bg-background hover:bg-muted", result && !result.complete && "border-dashed")}>
      <span className="min-w-0"><span className="flex items-center gap-1.5 font-semibold">{shop.id === savedShopId ? <Check aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-600" /> : null}<span className="truncate">{shop.name}</span></span><span className="mt-0.5 block text-xs text-muted-foreground">{shop.distanceMinutes !== undefined ? `약 ${shop.distanceMinutes}분` : "거리 미확인"}{shop.pickupAvailable ? " · 픽업" : ""}{shop.clothingRentalAvailable ? " · 의류" : ""}</span></span>
      <span className="shrink-0 text-right text-sm font-semibold">{result?.complete
        ? <span className="block"><span className="block tabular-nums">{formatCurrency(result.total!)}</span>{result.savings && result.savings.perPerson > 0 ? <span className="block text-xs font-medium text-emerald-700 dark:text-emerald-300">공식보다 -{formatCurrency(result.savings.total)}</span> : null}</span>
        : <span className="text-xs font-medium text-muted-foreground">가격 일부 미확인</span>}</span>
    </button></li>;
  })}</ul>;
}
