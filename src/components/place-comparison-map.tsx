"use client";

import { useEffect, useRef, useState } from "react";
import { ExternalLink, LoaderCircle, MapPin, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export type PlaceCandidate = {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  searchQuery: string;
  externalMapUrl?: string;
  type?: "rental" | "lodging";
};

type Point = { lat: number; lng: number };
type MapInstance = { setCenter: (point: unknown) => void; setLevel: (level: number) => void };
type MarkerInstance = { setMap: (map: MapInstance | null) => void };
type SearchResult = { x: string; y: string };

export function PlaceComparisonMap({ candidates, selectedId, onSelect }: { candidates: PlaceCandidate[]; selectedId: string | null; onSelect: (id: string) => void }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<MapInstance | null>(null);
  const markersRef = useRef<MarkerInstance[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready" | "unavailable" | "error">("idle");
  const [points, setPoints] = useState<Record<string, Point>>({});
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;

  useEffect(() => {
    if (!key) { setState("unavailable"); return; }
    if (!containerRef.current) return;
    setState("loading");
    const start = () => window.kakao?.maps.load(() => setState(window.kakao?.maps.services ? "ready" : "error"));
    if (window.kakao?.maps) { start(); return; }
    const existing = document.querySelector<HTMLScriptElement>("script[data-kakao-map='true']");
    if (existing) {
      existing.addEventListener("load", start, { once: true });
      existing.addEventListener("error", () => setState("error"), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false&libraries=services`;
    script.async = true;
    script.dataset.kakaoMap = "true";
    script.addEventListener("load", start, { once: true });
    script.addEventListener("error", () => setState("error"), { once: true });
    document.head.appendChild(script);
  }, [key]);

  useEffect(() => {
    if (state !== "ready" || !window.kakao?.maps.services) return;
    let cancelled = false;
    const geocoder = new window.kakao.maps.services.Geocoder();
    const places = new window.kakao.maps.services.Places();
    const resolve = (candidate: PlaceCandidate) => new Promise<[string, Point] | null>((done) => {
      if (candidate.latitude !== undefined && candidate.longitude !== undefined) {
        done([candidate.id, { lat: candidate.latitude, lng: candidate.longitude }]);
        return;
      }
      const callback = (results: SearchResult[], status: string) => {
        if (status !== window.kakao?.maps.services.Status.OK || !results[0]) { done(null); return; }
        done([candidate.id, { lat: Number(results[0].y), lng: Number(results[0].x) }]);
      };
      if (candidate.address) geocoder.addressSearch(candidate.address, callback);
      else places.keywordSearch(candidate.searchQuery, callback);
    });
    Promise.all(candidates.map(resolve)).then((entries) => {
      if (cancelled) return;
      setPoints(Object.fromEntries(entries.filter((entry): entry is [string, Point] => Boolean(entry))));
    });
    return () => { cancelled = true; };
  }, [candidates, state]);

  useEffect(() => {
    if (state !== "ready" || !containerRef.current || !window.kakao?.maps) return;
    const first = (selectedId && points[selectedId]) || Object.values(points)[0];
    if (!first) return;
    const center = new window.kakao.maps.LatLng(first.lat, first.lng);
    const map = mapRef.current ?? new window.kakao.maps.Map(containerRef.current, { center, level: 5 });
    map.setCenter(center);
    map.setLevel(selectedId ? 4 : 5);
    mapRef.current = map;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = candidates.flatMap((candidate) => {
      const point = points[candidate.id];
      if (!point || !window.kakao?.maps) return [];
      const isSelected = candidate.id === selectedId;
      const size = isSelected ? 40 : 32;
      const color = candidate.type === "lodging" ? "2563eb" : "f97316";
      const label = candidate.type === "lodging" ? "H" : "R";
      const svg = encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40"><circle cx="20" cy="20" r="17" fill="#${color}" stroke="${isSelected ? "white" : "#111827"}" stroke-width="${isSelected ? 4 : 2}"/><text x="20" y="25" text-anchor="middle" font-family="Arial,sans-serif" font-size="15" font-weight="900" fill="white">${label}</text></svg>`);
      const image = new window.kakao.maps.MarkerImage(`data:image/svg+xml;charset=UTF-8,${svg}`, new window.kakao.maps.Size(size, size), { offset: new window.kakao.maps.Point(size / 2, size / 2) });
      const marker = new window.kakao.maps.Marker({ map, position: new window.kakao.maps.LatLng(point.lat, point.lng), title: candidate.name, image });
      window.kakao.maps.event.addListener(marker, "click", () => onSelect(candidate.id));
      return [marker];
    });
  }, [candidates, onSelect, points, selectedId, state]);

  const selected = candidates.find((candidate) => candidate.id === selectedId);
  if (state === "unavailable" || state === "error") return <MapFallback candidate={selected ?? candidates[0]} error={state === "error"} />;
  return <div className="relative h-[300px] overflow-hidden rounded-2xl border bg-muted sm:h-[360px] lg:h-[520px]" data-testid="trip-place-map">
    <div ref={containerRef} className="absolute inset-0" />
    {state !== "ready" || !Object.keys(points).length ? <div className="absolute inset-0 flex items-center justify-center bg-card/90"><div className="text-center"><LoaderCircle className="mx-auto h-6 w-6 animate-spin text-primary motion-reduce:animate-none" /><p className="mt-3 text-sm font-bold">정확한 위치를 확인하고 있어요</p></div></div> : null}
    {state === "ready" && candidates.length > Object.keys(points).length ? <div className="absolute bottom-3 left-3 right-3 rounded-xl border bg-card/95 px-3 py-2 text-xs font-semibold text-muted-foreground shadow-lg">주소를 찾은 {Object.keys(points).length}곳만 지도에 표시했어요. 모든 후보는 목록에서 비교할 수 있습니다.</div> : null}
  </div>;
}

function MapFallback({ candidate, error }: { candidate?: PlaceCandidate; error: boolean }) {
  return <div className="flex h-[260px] items-center justify-center rounded-2xl border bg-[radial-gradient(circle_at_top,hsl(var(--primary)/0.13),transparent_55%),hsl(var(--muted))] p-5 sm:h-[320px]" data-testid="trip-place-map-fallback"><div className="max-w-sm text-center"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-card text-primary shadow"><TriangleAlert className="h-5 w-5" /></span><p className="mt-4 font-black">{error ? "지도를 불러오지 못했어요" : "지도 연결 전에도 비교할 수 있어요"}</p><p className="mt-2 text-sm leading-6 text-muted-foreground">목록에서 서비스와 가격을 비교하고 선택할 수 있습니다. 위치는 외부 지도에서 정확히 확인해 주세요.</p>{candidate?.externalMapUrl ? <a href={candidate.externalMapUrl} target="_blank" rel="noreferrer"><Button type="button" variant="secondary" className="mt-4">외부 지도에서 보기 <ExternalLink className="h-4 w-4" /></Button></a> : null}</div></div>;
}
