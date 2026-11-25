"use client";

import { useEffect, useState } from "react";

export type MapPoint = { lat: number; lng: number };
export type MapSdkState = "loading" | "ready" | "unavailable" | "error";
export type PlaceQuery = { id: string; latitude?: number; longitude?: number; address?: string; query: string };

type SearchResult = { x: string; y: string };

// 카카오 지도 SDK를 한 번만 불러오고 준비 상태를 알려 준다.
export function useKakaoMapSdk(): MapSdkState {
  const [state, setState] = useState<MapSdkState>("loading");
  const key = process.env.NEXT_PUBLIC_KAKAO_MAP_APP_KEY;
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loads the Kakao Maps SDK (external system)
    if (!key) { setState("unavailable"); return; }
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
  return state;
}

// 좌표가 있으면 그대로 쓰고, 없으면 주소·장소 검색으로 위치를 찾는다.
export function usePlacePoints(state: MapSdkState, places: PlaceQuery[]) {
  const [points, setPoints] = useState<Record<string, MapPoint>>({});
  useEffect(() => {
    if (state !== "ready" || !window.kakao?.maps.services) return;
    let cancelled = false;
    const geocoder = new window.kakao.maps.services.Geocoder();
    const search = new window.kakao.maps.services.Places();
    const resolve = (place: PlaceQuery) => new Promise<[string, MapPoint] | null>(done => {
      if (place.latitude !== undefined && place.longitude !== undefined) { done([place.id, { lat: place.latitude, lng: place.longitude }]); return; }
      const callback = (results: SearchResult[], status: string) => {
        if (status !== window.kakao?.maps.services.Status.OK || !results[0]) { done(null); return; }
        done([place.id, { lat: Number(results[0].y), lng: Number(results[0].x) }]);
      };
      if (place.address) geocoder.addressSearch(place.address, callback);
      else search.keywordSearch(place.query, callback);
    });
    Promise.all(places.map(resolve)).then(entries => {
      if (!cancelled) setPoints(Object.fromEntries(entries.filter((entry): entry is [string, MapPoint] => Boolean(entry))));
    });
    return () => { cancelled = true; };
  }, [places, state]);
  return points;
}

export function createMap(container: HTMLElement, center: MapPoint) {
  const maps = window.kakao!.maps;
  return new maps.Map(container, { center: new maps.LatLng(center.lat, center.lng), level: 7 });
}

export function resortPin() {
  const dot = document.createElement("div");
  dot.setAttribute("aria-hidden", "true");
  dot.style.cssText = "width:16px;height:16px;border-radius:999px;background:#111827;border:3px solid #fff;box-shadow:0 0 0 4px rgba(17,24,39,.18),0 2px 6px rgba(0,0,0,.3);pointer-events:none";
  return dot;
}

// 이름과 보조 문구(가격·거리 등)를 담은 눌러 볼 수 있는 핀. 선택·저장·미확인 상태를 색과 테두리로 구분한다.
export function createPin({ name, sub, ariaLabel, saved, selected, dashed, onClick }: { name: string; sub?: string | null; ariaLabel: string; saved: boolean; selected: boolean; dashed: boolean; onClick: () => void }) {
  const button = document.createElement("button");
  button.type = "button";
  button.setAttribute("aria-label", ariaLabel);
  button.setAttribute("aria-pressed", String(selected));
  const background = selected ? "hsl(var(--primary))" : saved ? "#059669" : "hsl(var(--card))";
  const color = selected || saved ? "#fff" : "hsl(var(--foreground))";
  const border = selected ? "hsl(var(--primary))" : saved ? "#059669" : "hsl(var(--border))";
  button.style.cssText = [
    "display:flex", "flex-direction:column", "align-items:center", "gap:1px",
    "max-width:132px", "min-height:36px", "padding:5px 10px", "cursor:pointer",
    "border-radius:12px", `border:2px ${dashed && !selected && !saved ? "dashed" : "solid"} ${border}`,
    `background:${background}`, `color:${color}`, "font-family:inherit", "font-size:12px", "font-weight:700", "line-height:1.2",
    `box-shadow:${selected ? "0 6px 16px rgba(0,0,0,.35)" : "0 2px 8px rgba(0,0,0,.25)"}`,
    `transform:${selected ? "scale(1.12)" : "none"}`, "transform-origin:bottom center", "transition:transform .12s"
  ].join(";");
  const title = document.createElement("span");
  title.textContent = `${saved ? "✓ " : ""}${name}`;
  title.style.cssText = "max-width:112px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap";
  button.append(title);
  if (sub) {
    const subLine = document.createElement("span");
    subLine.textContent = sub;
    subLine.style.cssText = "font-size:11px;font-weight:600;opacity:.85";
    button.append(subLine);
  }
  button.addEventListener("click", event => { event.stopPropagation(); onClick(); });
  return button;
}
