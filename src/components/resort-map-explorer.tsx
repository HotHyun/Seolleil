"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ChevronRight, ExternalLink, Hotel, MapPin, Search, Shirt, Snowflake } from "lucide-react";
import Link from "next/link";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  getMapPosition,
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
  const mapRef = useRef<HTMLDivElement | null>(null);
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
  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  const filteredRows = rows.filter(({ resort }) => {
    const term = query.trim().toLowerCase();
    if (!term) return true;
    return `${resort.name} ${resort.region} ${resort.tags.join(" ")}`.toLowerCase().includes(term);
  });

  useEffect(() => {
    if (!kakaoKey || !mapRef.current || !rows.length) return;

    const initializeMap = () => {
      if (!window.kakao?.maps || !mapRef.current) return;
      const firstPoint = selected?.point ?? rows.find((row) => row.point)?.point;
      if (!firstPoint) return;

      const center = new window.kakao.maps.LatLng(firstPoint.lat, firstPoint.lng);
      const map = kakaoMapRef.current ?? new window.kakao.maps.Map(mapRef.current, { center, level: 12 });
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
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&autoload=false`;
    script.async = true;
    script.dataset.kakaoMap = "true";
    script.addEventListener("load", () => window.kakao?.maps.load(initializeMap), { once: true });
    document.head.appendChild(script);
  }, [kakaoKey, rows, showNearby, nearbyItems, selected?.point]);

  useEffect(() => {
    if (!selected?.point || !kakaoMapRef.current || !window.kakao?.maps) return;
    kakaoMapRef.current.setCenter(new window.kakao.maps.LatLng(selected.point.lat, selected.point.lng));
    kakaoMapRef.current.setLevel(showNearby ? 6 : 10);
  }, [selected?.point, showNearby]);

  useEffect(() => {
    selectedNearbyOverlayRef.current?.setMap(null);
    selectedNearbyOverlayRef.current = null;

    if (!selectedNearby || !kakaoMapRef.current || !window.kakao?.maps) return;

    const position = new window.kakao.maps.LatLng(selectedNearby.lat, selectedNearby.lng);
    kakaoMapRef.current.setCenter(position);
    kakaoMapRef.current.setLevel(4);
    selectedNearbyOverlayRef.current = new window.kakao.maps.CustomOverlay({
      map: kakaoMapRef.current,
      position,
      yAnchor: 1.45,
      content: createSelectedNearbyOverlay(selectedNearby)
    });
  }, [selectedNearby]);

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
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(item.lat, item.lng),
        title: item.name
      });
      window.kakao.maps.event.addListener(marker, "click", () => setSelectedNearbyId(item.id));
      markersRef.current.push(marker);
    });
  }

  function openNearby() {
    setShowNearby(true);
    setSelectedNearbyId(nearbyItems[0]?.id ?? null);
  }

  function closeNearby() {
    setShowNearby(false);
    setSelectedNearbyId(null);
  }

  return (
    <section className="grid min-h-[calc(100vh-4rem)] bg-background lg:grid-cols-[380px_1fr]">
      <aside className="z-20 flex max-h-[calc(100vh-4rem)] flex-col border-r bg-card shadow-xl max-lg:max-h-none lg:sticky lg:top-16">
        {showNearby && selected ? (
          <NearbySidebar resort={selected.resort} items={nearbyItems} selectedId={selectedNearbyId} onBack={closeNearby} onSelect={setSelectedNearbyId} />
        ) : (
          <ResortSidebar
            rows={filteredRows}
            rentalShops={rentalShops}
            query={query}
            selectedId={selected?.resort.id}
            onQueryChange={setQuery}
            onSelect={(id) => {
              setSelectedId(id);
              setSelectedNearbyId(null);
            }}
          />
        )}
      </aside>

      <div className="relative min-h-[560px] lg:min-h-[calc(100vh-4rem)]">
        {kakaoKey ? (
          <div ref={mapRef} className="absolute inset-0 bg-muted" />
        ) : (
          <FallbackMap
            rows={rows}
            nearbyItems={showNearby ? nearbyItems : []}
            selectedId={selected?.resort.id}
            selectedNearbyId={selectedNearbyId}
            onSelect={setSelectedId}
            onNearbySelect={setSelectedNearbyId}
          />
        )}

        {selected ? (
          <div className="absolute bottom-4 left-4 right-4 z-20 lg:left-auto lg:w-[390px]">
            <div className="rounded-xl border bg-card p-4 shadow-2xl shadow-black/25">
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
  onBack,
  onSelect
}: {
  resort: SkiResort;
  items: NearbyMapItem[];
  selectedId: string | null;
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
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function FallbackMap({
  rows,
  nearbyItems,
  selectedId,
  selectedNearbyId,
  onSelect,
  onNearbySelect
}: {
  rows: ReturnType<typeof getResortMapRows>;
  nearbyItems: NearbyMapItem[];
  selectedId?: string;
  selectedNearbyId: string | null;
  onSelect: (id: string) => void;
  onNearbySelect: (id: string) => void;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-zinc-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(255,122,26,0.18),transparent_30rem),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_42%)]" />
      <div className="absolute inset-x-16 bottom-10 top-10 rounded-[45%] border border-white/10 bg-white/[0.04]" />
      <div className="absolute inset-x-24 bottom-20 top-20 rounded-[42%] border border-white/10" />
      {rows.map(({ resort, point }) => {
        if (!point) return null;
        const isSelected = resort.id === selectedId;
        return (
          <button
            key={resort.id}
            type="button"
            className={cn(
              "absolute z-10 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "border-white bg-primary" : "border-white/60 bg-white/40 hover:bg-white"
            )}
            style={getMapPosition(point)}
            onClick={() => onSelect(resort.id)}
            aria-label={`${resort.name} 선택`}
          />
        );
      })}
      {nearbyItems.map((item) => {
        const isSelected = item.id === selectedNearbyId;
        return (
          <div key={item.id} className="absolute z-20 -translate-x-1/2 -translate-y-1/2" style={getMapPosition(item)}>
            {isSelected ? (
              <div className="pointer-events-none absolute left-1/2 top-1/2 h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60 bg-primary/15 shadow-[0_0_28px_hsl(var(--primary)/0.55)]" />
            ) : null}
            <button
              type="button"
              className={cn(
                "relative rounded-full border-2 shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                item.type === "rental" ? "bg-primary" : "bg-white",
                isSelected ? "h-5 w-5 -translate-y-2 border-white shadow-2xl" : "h-3.5 w-3.5 border-zinc-950"
              )}
              onClick={() => onNearbySelect(item.id)}
              aria-label={`${item.name} 선택`}
            />
            {isSelected ? (
              <div className="pointer-events-none absolute left-1/2 top-6 w-max max-w-44 -translate-x-1/2 rounded-lg border border-white/15 bg-zinc-950/90 px-2.5 py-1.5 text-center text-[11px] font-black text-white shadow-xl">
                {item.name}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
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
      <div className="flex flex-wrap gap-2">
        <StatusBadge tone={resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(resort.operationStatus)}</StatusBadge>
        {resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
        {resort.tags.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}
      </div>
      <h2 className="mt-3 text-xl font-black">{resort.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{resort.address}</p>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <MapStat icon={<Snowflake />} label="초보" value={`${resort.beginnerScore}`} />
        <MapStat icon={<MapPin />} label="접근" value={`${resort.accessScore}`} />
        <MapStat icon={<Shirt />} label="렌탈" value={`${summary.rentalCount}`} />
        <MapStat icon={<Hotel />} label="숙박" value={`${summary.lodgingCount}`} />
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Button className="flex-1" onClick={onOpenNearby}>주변 더 둘러보기</Button>
        <Link href={`/resorts/${resort.id}`} className="flex-1">
          <Button variant="secondary" className="w-full">상세</Button>
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
      <h2 className="mt-2 text-xl font-black">{item.name}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{item.meta}</p>
      {item.href ? (
        <AnalyticsLink href={item.href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: `map_${item.type}`, resortId: item.resortId }}>
          <Button className="mt-4 w-full">
            지도/예약 확인 <ExternalLink className="h-4 w-4" />
          </Button>
        </AnalyticsLink>
      ) : null}
    </div>
  );
}

function MapStat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-2">
      <div className="mx-auto mb-1 w-fit text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <div className="text-[11px] font-bold text-muted-foreground">{label}</div>
      <div className="text-sm font-black">{value}</div>
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
