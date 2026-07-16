"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, ExternalLink, Hotel, MapPin, Search, Shirt } from "lucide-react";
import Link from "next/link";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  getNearbyMapItems,
  getNearbySummary,
  getResortMapRows,
  type NearbyMapItem
} from "@/data/resort-map";
import type { RentalShop, SkiResort } from "@/lib/types";
import { cn } from "@/lib/utils";

type KakaoMap = {
  setCenter: (latlng: unknown) => void;
  setLevel: (level: number) => void;
};

type KakaoSearchResult = { x: string; y: string };

type KakaoMarker = {
  setMap: (map: KakaoMap | null) => void;
};

type KakaoCustomOverlay = {
  setMap: (map: KakaoMap | null) => void;
};

declare global {
  interface Window {
    kakao?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMap;
        Marker: new (options: { map: KakaoMap; position: unknown; title?: string }) => KakaoMarker;
        CustomOverlay: new (options: { content: HTMLElement; map?: KakaoMap; position: unknown; yAnchor?: number }) => KakaoCustomOverlay;
        event: {
          addListener: (target: KakaoMarker, type: string, handler: () => void) => void;
        };
        services: {
          Status: { OK: string };
          Geocoder: new () => { addressSearch: (address: string, callback: (results: KakaoSearchResult[], status: string) => void) => void };
          Places: new () => { keywordSearch: (query: string, callback: (results: KakaoSearchResult[], status: string) => void) => void };
        };
        load: (callback: () => void) => void;
      };
    };
  }
}

export function ResortMapExplorer({ resorts, rentalShops }: { resorts: SkiResort[]; rentalShops: RentalShop[] }) {
  const rows = useMemo(() => getResortMapRows(resorts), [resorts]);
  const [selectedId, setSelectedId] = useState(rows[0]?.resort.id ?? "");
  const [query, setQuery] = useState("");
  const [showNearby, setShowNearby] = useState(false);
  const [selectedNearbyId, setSelectedNearbyId] = useState<string | null>(null);
  const [nearbyFilter, setNearbyFilter] = useState<"all" | "rental" | "lodging" | "pickup" | "priced">("all");
  const [shouldFocusSelectedNearby, setShouldFocusSelectedNearby] = useState(false);
  const [nearbyPoints, setNearbyPoints] = useState<Record<string, { lat: number; lng: number }>>({});
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapSectionRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const selectedNearbyOverlayRef = useRef<KakaoCustomOverlay | null>(null);
  const selected = rows.find((row) => row.resort.id === selectedId) ?? rows[0];
  const selectedSummary = selected ? getNearbySummary(selected.resort.id, rentalShops) : { rentalCount: 0, lodgingCount: 0 };
  const nearbyItems = useMemo(
    () => (selected ? getNearbyMapItems(selected.resort.id, rentalShops) : []),
    [rentalShops, selected]
  );
  const selectedNearby = nearbyItems.find((item) => item.id === selectedNearbyId) ?? null;
  const filteredNearbyItems = nearbyItems.filter((item) => nearbyFilter === "all" || item.type === nearbyFilter || (nearbyFilter === "pickup" && item.pickupAvailable) || (nearbyFilter === "priced" && item.dataStatus === "verified_25_26"));
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const filteredRows = rows.filter(({ resort }) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return `${resort.name} ${resort.region} ${resort.tags.join(" ")}`.toLowerCase().includes(term);
  });

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("resortId");
    if (requested && rows.some((row) => row.resort.id === requested)) setSelectedId(requested);
  }, [rows]);

  useEffect(() => {
    if (!kakaoKey || !mapRef.current || !rows.length) return;

    const initializeMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;
      const firstPoint = selected?.point ?? rows.find((row) => row.point)?.point;
      if (!firstPoint) return;

      const center = new window.kakao.maps.LatLng(firstPoint.lat, firstPoint.lng);
      const map = kakaoMapRef.current ?? new window.kakao.maps.Map(mapRef.current, { center, level: showNearby ? 6 : 10 });
      map.setCenter(center);
      map.setLevel(showNearby ? 6 : 10);
      kakaoMapRef.current = map;
      drawKakaoMarkers(map);
    };

    if (window.kakao?.maps) {
      window.kakao.maps.load(initializeMap);
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-map='true']");
    if (existing) {
      existing.addEventListener("load", () => window.kakao?.maps.load(initializeMap), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false&libraries=services`;
    script.async = true;
    script.dataset.kakaoMap = "true";
    script.addEventListener("load", () => window.kakao?.maps.load(initializeMap), { once: true });
    document.head.appendChild(script);
  }, [kakaoKey, rows, showNearby, nearbyItems, nearbyPoints, selected?.point]);

  useEffect(() => {
    if (!showNearby || !selected || !window.kakao?.maps.services) return;
    let cancelled = false;
    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();
    const resolve = (item: NearbyMapItem) => new Promise<[string, { lat: number; lng: number }] | null>((done) => {
      const callback = (results: KakaoSearchResult[], status: string) => {
        if (status !== window.kakao?.maps.services.Status.OK || !results[0]) return done(null);
        done([item.id, { lat: Number(results[0].y), lng: Number(results[0].x) }]);
      };
      if (item.address) geocoder.addressSearch(item.address, callback);
      else places.keywordSearch(`${selected.resort.name} ${item.name}`, callback);
    });
    Promise.all(nearbyItems.map(resolve)).then((entries) => {
      if (!cancelled) setNearbyPoints(Object.fromEntries(entries.filter((entry): entry is [string, { lat: number; lng: number }] => Boolean(entry))));
    });
    return () => { cancelled = true; };
  }, [nearbyItems, selected, showNearby]);

  useEffect(() => {
    if (!selected?.point || !kakaoMapRef.current || !window.kakao?.maps) return;
    kakaoMapRef.current.setCenter(new window.kakao.maps.LatLng(selected.point.lat, selected.point.lng));
    kakaoMapRef.current.setLevel(showNearby ? 6 : 10);
  }, [selected?.point, showNearby]);

  useEffect(() => {
    selectedNearbyOverlayRef.current?.setMap(null);
    selectedNearbyOverlayRef.current = null;

    if (!selectedNearby || !kakaoMapRef.current || !window.kakao?.maps) return;

    const point = nearbyPoints[selectedNearby.id];
    if (!point) return;
    const position = new window.kakao.maps.LatLng(point.lat, point.lng);
    if (shouldFocusSelectedNearby) {
      kakaoMapRef.current.setCenter(position);
      kakaoMapRef.current.setLevel(4);
    }
    selectedNearbyOverlayRef.current = new window.kakao.maps.CustomOverlay({
      map: kakaoMapRef.current,
      position,
      yAnchor: 1.45,
      content: createSelectedNearbyOverlay(selectedNearby)
    });
  }, [nearbyPoints, selectedNearby, shouldFocusSelectedNearby]);

  function drawKakaoMarkers(map: KakaoMap) {
    if (!window.kakao?.maps) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    selectedNearbyOverlayRef.current?.setMap(null);
    selectedNearbyOverlayRef.current = null;

    const resortMarkers = showNearby && selected ? [{ resort: selected.resort, point: selected.point }] : rows;
    resortMarkers.forEach(({ resort, point }) => {
      if (!point || !window.kakao?.maps) return;
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(point.lat, point.lng),
        title: resort.name
      });
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelectedId(resort.id);
        setShowNearby(false);
        setSelectedNearbyId(null);
      });
      markersRef.current.push(marker);
    });

    if (!showNearby) return;
    nearbyItems.forEach((item) => {
      if (!window.kakao?.maps) return;
      const point = nearbyPoints[item.id];
      if (!point) return;
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(point.lat, point.lng),
        title: item.name
      });
      window.kakao.maps.event.addListener(marker, "click", () => selectNearby(item.id, false));
      markersRef.current.push(marker);
    });
  }

  function selectNearby(id: string | null, focusMap: boolean) {
    setShouldFocusSelectedNearby(focusMap);
    setSelectedNearbyId(id);
  }

  function openNearby() {
    setShowNearby(true);
    selectNearby(nearbyItems[0]?.id ?? null, false);
  }

  function closeNearby() {
    setShowNearby(false);
    selectNearby(null, false);
  }

  return (
    <section className="grid min-h-[calc(100vh-4rem)] bg-background lg:grid-cols-[380px_1fr]">
      <aside className="order-2 z-20 flex min-w-0 w-full flex-col border-t bg-card shadow-xl lg:sticky lg:top-16 lg:order-1 lg:max-h-[calc(100vh-4rem)] lg:border-r lg:border-t-0">
        {showNearby && selected ? (
          <NearbySidebar resort={selected.resort} items={filteredNearbyItems} selectedId={selectedNearbyId} filter={nearbyFilter} onFilter={setNearbyFilter} onBack={closeNearby} onSelect={(id) => selectNearby(id, true)} />
        ) : (
          <ResortSidebar
            rows={filteredRows}
            rentalShops={rentalShops}
            query={query}
            selectedId={selected?.resort.id}
            onQueryChange={setQuery}
            onSelect={(id) => {
              setSelectedId(id);
              selectNearby(null, false);
              if (window.matchMedia("(max-width: 1023px)").matches) {
                window.requestAnimationFrame(() => mapSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
              }
            }}
          />
        )}
      </aside>

      <div ref={mapSectionRef} className="relative order-1 min-w-0 w-full scroll-mt-16 lg:order-2 lg:min-h-[calc(100vh-4rem)]">
        <div data-testid="ski-map-viewport" className="relative h-[460px] w-full sm:h-[540px] lg:absolute lg:inset-0 lg:h-auto">
          {kakaoKey ? (
            <div ref={mapRef} className="absolute inset-0 bg-muted" />
          ) : (
            <MapUnavailable resort={selected?.resort} />
          )}
        </div>

        {selected ? (
          <div data-testid="ski-map-selection" className="relative z-20 mx-3 -mt-10 mb-4 lg:absolute lg:bottom-4 lg:left-auto lg:right-4 lg:mx-0 lg:mb-0 lg:mt-0 lg:w-[390px]">
            <div className="rounded-2xl border bg-card p-3 shadow-2xl shadow-black/25 sm:p-4">
              {selectedNearby && showNearby ? (
                <NearbySelectedCard item={selectedNearby} />
              ) : (
                <SelectedResortCard resort={selected.resort} summary={selectedSummary} onOpenNearby={openNearby} />
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function ResortSidebar({
  rows,
  rentalShops,
  query,
  selectedId,
  onQueryChange,
  onSelect
}: {
  rows: ReturnType<typeof getResortMapRows>;
  rentalShops: RentalShop[];
  query: string;
  selectedId?: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="border-b p-4">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Ski map</p>
        <h1 className="mt-2 text-2xl font-black">국내 스키장</h1>
        <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
            placeholder="스키장, 지역, 태그 검색"
            className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid gap-2">
          {rows.map(({ resort }) => {
            const isSelected = resort.id === selectedId;
            const summary = getNearbySummary(resort.id, rentalShops);
            return (
              <button
                key={resort.id}
                type="button"
                onClick={() => onSelect(resort.id)}
                className={cn(
                  "rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isSelected ? "border-primary bg-primary/12 shadow-sm" : "bg-background hover:bg-muted"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-black">{resort.name}</div>
                    <div className="mt-1 text-xs font-semibold text-muted-foreground">{resort.region}</div>
                  </div>
                  <ChevronRight className={cn("h-4 w-4 shrink-0", isSelected ? "text-primary" : "text-muted-foreground")} />
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>
                  {resort.tags.slice(0, 2).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-bold text-muted-foreground">
                  <span>렌탈 {summary.rentalCount}곳</span>
                  <span>숙박 {summary.lodgingCount}곳</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

function NearbySidebar({
  resort,
  items,
  selectedId,
  filter,
  onFilter,
  onBack,
  onSelect
}: {
  resort: SkiResort;
  items: NearbyMapItem[];
  selectedId: string | null;
  filter: "all" | "rental" | "lodging" | "pickup" | "priced";
  onFilter: (filter: "all" | "rental" | "lodging" | "pickup" | "priced") => void;
  onBack: () => void;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      <div className="border-b p-4">
        <Button variant="ghost" className="mb-3 h-9 px-2" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" /> 스키장 목록
        </Button>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Nearby</p>
        <h1 className="mt-2 text-2xl font-black">{resort.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">주변 렌탈샵과 숙박 후보</p>
        <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">{([ ["all", "전체"], ["rental", "렌탈"], ["lodging", "숙박"], ["pickup", "픽업"], ["priced", "가격 확인"] ] as const).map(([value, label]) => <button key={value} type="button" onClick={() => onFilter(value)} className={cn("min-h-9 shrink-0 rounded-full border px-3 text-xs font-bold", filter === value ? "border-primary bg-primary text-primary-foreground" : "bg-background text-muted-foreground")}>{label}</button>)}</div>
      </div>
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid gap-2">
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={cn(
                "rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                item.id === selectedId ? "border-primary bg-primary/12" : "bg-background hover:bg-muted"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md", item.type === "rental" ? "bg-primary/15 text-primary" : "bg-muted text-foreground")}>
                  {item.type === "rental" ? <Shirt className="h-4 w-4" /> : <Hotel className="h-4 w-4" />}
                </div>
                <div className="min-w-0">
                  <div className="truncate font-black">{item.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{item.meta}</div>
                  <div className="mt-2 flex flex-wrap gap-1">{item.pickupAvailable ? <StatusBadge>픽업</StatusBadge> : null}{item.clothingRentalAvailable ? <StatusBadge>의류</StatusBadge> : null}{item.liftTicketSalesAvailable ? <StatusBadge>리프트권</StatusBadge> : null}{item.dataStatus === "verified_25_26" ? <StatusBadge tone="good">가격 확인</StatusBadge> : null}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function createSelectedNearbyOverlay(item: NearbyMapItem) {
  const wrapper = document.createElement("div");
  wrapper.style.cssText = [
    "position: relative",
    "display: flex",
    "flex-direction: column",
    "align-items: center",
    "gap: 6px",
    "transform: translateY(-10px)",
    "pointer-events: none"
  ].join(";");

  const label = document.createElement("div");
  label.textContent = item.name;
  label.style.cssText = [
    "max-width: 190px",
    "padding: 7px 10px",
    "border-radius: 10px",
    "border: 1px solid rgba(255,255,255,0.22)",
    "background: rgba(9,9,11,0.92)",
    "color: white",
    "font-size: 12px",
    "font-weight: 900",
    "line-height: 1.25",
    "text-align: center",
    "box-shadow: 0 18px 36px rgba(0,0,0,0.35)",
    "backdrop-filter: blur(14px)"
  ].join(";");

  const pin = document.createElement("div");
  pin.style.cssText = [
    "width: 18px",
    "height: 18px",
    "border-radius: 999px",
    "border: 3px solid white",
    `background: ${item.type === "rental" ? "hsl(var(--primary))" : "#ffffff"}`,
    "box-shadow: 0 0 0 10px rgba(255,122,26,0.2), 0 0 32px rgba(255,122,26,0.72), 0 12px 24px rgba(0,0,0,0.45)"
  ].join(";");

  wrapper.append(label, pin);
  return wrapper;
}

function SelectedResortCard({
  resort,
  summary,
  onOpenNearby
}: {
  resort: SkiResort;
  summary: { rentalCount: number; lodgingCount: number };
  onOpenNearby: () => void;
}) {
  return (
    <>
      <div className="flex flex-wrap gap-1.5 sm:gap-2">
        <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>
        {resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
        {resort.tags.slice(0, 3).map((tag) => <span key={tag} className="hidden sm:inline-flex"><StatusBadge>{tag}</StatusBadge></span>)}
      </div>
      <h2 className="mt-2 text-lg font-black sm:mt-3 sm:text-xl">{resort.name}</h2>
      <p className="mt-1 hidden text-sm text-muted-foreground sm:block">{resort.address}</p>
      <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
        {resort.tags.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}
        {resort.nightSkiAvailable ? <StatusBadge>야간 운영</StatusBadge> : null}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm sm:mt-4">
        <MapStat icon={<Shirt />} label="렌탈 후보" value={`${summary.rentalCount}곳`} />
        <MapStat icon={<Hotel />} label="숙박 후보" value={`${summary.lodgingCount}곳`} />
      </div>
      <div className="mt-3 grid grid-cols-3 gap-1.5 sm:mt-4 sm:gap-2">
        <Link href={`/plan?resortId=${resort.id}`}>
          <Button className="h-10 w-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm">트립 만들기</Button>
        </Link>
        <Button variant="secondary" className="h-10 w-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm" onClick={onOpenNearby}>주변 보기</Button>
        <Link href={`/resorts/${resort.id}`} className="flex-1">
          <Button variant="secondary" className="h-10 w-full px-2 text-xs sm:h-11 sm:px-4 sm:text-sm">상세</Button>
        </Link>
      </div>
    </>
  );
}

function NearbySelectedCard({ item }: { item: NearbyMapItem }) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-black text-primary">
        {item.type === "rental" ? <Shirt className="h-4 w-4" /> : <Hotel className="h-4 w-4" />}
        {item.type === "rental" ? "렌탈샵" : "숙박"}
      </div>
      <h2 className="mt-2 text-lg font-black sm:text-xl">{item.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
      {item.tags?.length ? <div className="mt-3 flex flex-wrap gap-1.5">{item.tags.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}</div> : null}
      {item.href ? (
        <AnalyticsLink href={item.href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: `map_${item.type}`, resortId: item.resortId }}>
          <Button className="mt-3 w-full sm:mt-4">
            지도/예약 확인 <ExternalLink className="h-4 w-4" />
          </Button>
        </AnalyticsLink>
      ) : null}
    </div>
  );
}

function MapUnavailable({ resort }: { resort?: SkiResort }) {
  return <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.14),transparent_48%),linear-gradient(145deg,hsl(var(--muted)),hsl(var(--background)))] p-6">
    <div className="max-w-md rounded-2xl border bg-card p-6 text-center shadow-xl">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/12 text-primary"><MapPin className="h-6 w-6" /></span>
      <h2 className="mt-4 text-xl font-black">실제 지도 연결을 준비하고 있어요</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">임의 위치를 지도처럼 보여주지 않습니다. 현재는 정확한 외부 지도에서 위치를 확인해 주세요.</p>
      {resort?.mapLinks.kakao ? <AnalyticsLink href={resort.mapLinks.kakao} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "kakao_map_fallback", resortId: resort.id }}><Button className="mt-5 w-full">카카오맵에서 정확히 보기 <ExternalLink className="h-4 w-4" /></Button></AnalyticsLink> : null}
    </div>
  </div>;
}

function MapStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg bg-muted p-2.5 text-left">
      <div className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background text-primary sm:flex [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <div className="min-w-0">
        <div className="text-[11px] font-bold text-muted-foreground">{label}</div>
        <div className="mt-0.5 text-base font-black">{value}</div>
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  return (
    {
      operating: "운영",
      season_pending: "오픈 예정",
      temporarily_closed: "임시 휴장",
      closed: "폐장",
      unknown: "확인 필요"
    }[status] ?? status
  );
}
