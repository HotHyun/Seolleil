"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, ExternalLink, Hotel, MapPin, Search, Shirt, Snowflake } from "lucide-react";
import Link from "next/link";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  getMapPosition,
  getNearbyLodgingsForResort,
  getNearbySummary,
  getResortMapRows
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

declare global {
  interface Window {
    kakao?: {
      maps: {
        LatLng: new (lat: number, lng: number) => unknown;
        Map: new (container: HTMLElement, options: { center: unknown; level: number }) => KakaoMap;
        Marker: new (options: { map: KakaoMap; position: unknown; title?: string }) => KakaoMarker;
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
  const mapRef = useRef<HTMLDivElement | null>(null);
  const kakaoMapRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const selected = rows.find((row) => row.resort.id === selectedId) ?? rows[0];
  const selectedSummary = selected ? getNearbySummary(selected.resort.id, rentalShops) : { rentalCount: 0, lodgingCount: 0 };
  const selectedRentals = selected ? rentalShops.filter((shop) => shop.resortId === selected.resort.id) : [];
  const selectedLodgings = selected ? getNearbyLodgingsForResort(selected.resort.id) : [];
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
      const map = new window.kakao.maps.Map(mapRef.current, { center, level: 12 });
      kakaoMapRef.current = map;
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = rows.flatMap(({ resort, point }) => {
        if (!point || !window.kakao?.maps) return [];
        const marker = new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(point.lat, point.lng),
          title: resort.name
        });
        window.kakao.maps.event.addListener(marker, "click", () => {
          setSelectedId(resort.id);
          setShowNearby(false);
        });
        return [marker];
      });
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
  }, [kakaoKey, rows, selected?.point]);

  useEffect(() => {
    if (!selected?.point || !kakaoMapRef.current || !window.kakao?.maps) return;
    kakaoMapRef.current.setCenter(new window.kakao.maps.LatLng(selected.point.lat, selected.point.lng));
    kakaoMapRef.current.setLevel(showNearby ? 6 : 10);
  }, [selected?.point, showNearby]);

  return (
    <section className="grid min-h-[calc(100vh-4rem)] bg-background lg:grid-cols-[380px_1fr]">
      <aside className="z-20 flex max-h-[calc(100vh-4rem)] flex-col border-r bg-card/95 shadow-xl backdrop-blur max-lg:max-h-none lg:sticky lg:top-16">
        <div className="border-b p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Ski map</p>
          <h1 className="mt-2 text-2xl font-black">국내 스키장</h1>
          <div className="mt-4 flex items-center gap-2 rounded-lg border bg-muted px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="스키장, 지역, 태그 검색"
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="grid gap-2">
            {filteredRows.map(({ resort }) => {
              const isSelected = resort.id === selected?.resort.id;
              const summary = getNearbySummary(resort.id, rentalShops);
              return (
                <button
                  key={resort.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(resort.id);
                    setShowNearby(false);
                  }}
                  className={cn(
                    "rounded-lg border p-3 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isSelected ? "border-primary bg-primary/12 shadow-sm" : "bg-white/[0.04] hover:bg-muted"
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
                    {resort.tags.slice(0, 2).map((tag) => (
                      <StatusBadge key={tag}>{tag}</StatusBadge>
                    ))}
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
      </aside>

      <div className="relative min-h-[560px] lg:min-h-[calc(100vh-4rem)]">
        {kakaoKey ? <div ref={mapRef} className="absolute inset-0 bg-muted" /> : <FallbackMap rows={rows} selectedId={selected?.resort.id} onSelect={setSelectedId} />}

        {selected?.point ? (
          <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-[calc(100%+18px)] rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow-xl shadow-black/20 lg:block">
            {selected.resort.name}
          </div>
        ) : null}

        {selected ? (
          <div className="absolute bottom-4 left-4 right-4 z-20 lg:left-auto lg:w-[390px]">
            <div className="rounded-xl border bg-card/96 p-4 shadow-2xl shadow-black/20 backdrop-blur">
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={selected.resort.operationStatus === "operating" ? "good" : "warn"}>{statusLabel(selected.resort.operationStatus)}</StatusBadge>
                {selected.resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
                {selected.resort.tags.slice(0, 3).map((tag) => <StatusBadge key={tag}>{tag}</StatusBadge>)}
              </div>
              <h2 className="mt-3 text-xl font-black">{selected.resort.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{selected.resort.address}</p>
              <div className="mt-4 grid grid-cols-4 gap-2 text-center">
                <MapStat icon={<Snowflake />} label="초보" value={`${selected.resort.beginnerScore}`} />
                <MapStat icon={<MapPin />} label="접근" value={`${selected.resort.accessScore}`} />
                <MapStat icon={<Shirt />} label="렌탈" value={`${selectedSummary.rentalCount}`} />
                <MapStat icon={<Hotel />} label="숙박" value={`${selectedSummary.lodgingCount}`} />
              </div>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <Button className="flex-1" onClick={() => setShowNearby((value) => !value)}>
                  {showNearby ? "주변 닫기" : "주변 더 둘러보기"}
                </Button>
                <Link href={`/resorts/${selected.resort.id}`} className="flex-1">
                  <Button variant="secondary" className="w-full">상세</Button>
                </Link>
              </div>
              {showNearby ? (
                <NearbyPreview resort={selected.resort} rentals={selectedRentals} lodgings={selectedLodgings} />
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FallbackMap({ rows, selectedId, onSelect }: { rows: ReturnType<typeof getResortMapRows>; selectedId?: string; onSelect: (id: string) => void }) {
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
              "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-xs font-black shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isSelected ? "border-primary bg-primary text-primary-foreground" : "border-white/20 bg-white/[0.14] hover:bg-white/[0.24]"
            )}
            style={getMapPosition(point)}
            onClick={() => onSelect(resort.id)}
          >
            {resort.name.replace(" 리조트", "").replace("스키월드", "")}
          </button>
        );
      })}
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

function NearbyPreview({
  resort,
  rentals,
  lodgings
}: {
  resort: SkiResort;
  rentals: RentalShop[];
  lodgings: ReturnType<typeof getNearbyLodgingsForResort>;
}) {
  return (
    <div className="mt-4 grid gap-3 border-t pt-4">
      <NearbyGroup title="렌탈샵" count={rentals.length}>
        {rentals.slice(0, 4).map((shop) => (
          <NearbyLink key={shop.id} name={shop.name} meta={shop.distanceMinutes === 0 ? "리조트 내" : `약 ${shop.distanceMinutes}분`} href={shop.mapLinks?.naver ?? shop.url} resortId={resort.id} type="map_nearby_rental" />
        ))}
      </NearbyGroup>
      <NearbyGroup title="숙박" count={lodgings.length}>
        {lodgings.slice(0, 3).map((lodging) => (
          <NearbyLink key={lodging.id} name={lodging.name} meta={lodging.distanceMinutes === 0 ? "공식/리조트 숙박" : `약 ${lodging.distanceMinutes}분`} href={lodging.url} resortId={resort.id} type="map_nearby_lodging" />
        ))}
      </NearbyGroup>
    </div>
  );
}

function NearbyGroup({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm font-black">
        <span>{title}</span>
        <span className="text-xs text-muted-foreground">{count}곳</span>
      </div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function NearbyLink({ name, meta, href, resortId, type }: { name: string; meta: string; href?: string; resortId: string; type: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-muted px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-black">{name}</div>
        <div className="text-xs text-muted-foreground">{meta}</div>
      </div>
      {href ? (
        <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }}>
          <Button variant="ghost" className="h-8 px-2">
            <ExternalLink className="h-4 w-4" />
          </Button>
        </AnalyticsLink>
      ) : null}
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
