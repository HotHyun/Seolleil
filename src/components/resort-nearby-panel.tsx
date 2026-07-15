"use client";

import { useMemo, useRef, useState } from "react";
import { ExternalLink, Hotel, MapPin, Shirt } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getNearbyLodgingsForResort, getNearbyMapItems, type NearbyMapItem } from "@/data/resort-map";
import type { RentalShop, SkiResort } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResortNearbyPanel({ resort, rentalShops }: { resort: SkiResort; rentalShops: RentalShop[] }) {
  const lodgings = getNearbyLodgingsForResort(resort.id);
  const mapItems = useMemo(() => getNearbyMapItems(resort.id, rentalShops), [rentalShops, resort.id]);
  const [selectedId, setSelectedId] = useState(mapItems[0]?.id ?? null);
  const mapRef = useRef<HTMLDivElement>(null);

  function selectOnMap(id: string) {
    setSelectedId(id);
    if (window.matchMedia("(max-width: 1023px)").matches) {
      window.requestAnimationFrame(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  }

  const selected = mapItems.find(item => item.id === selectedId);
  return <div className="space-y-4">
    <div ref={mapRef} data-testid="resort-detail-nearby-map" className="scroll-mt-20 overflow-hidden rounded-2xl border bg-zinc-950 text-white">
      <div className="relative h-[300px] sm:h-[360px]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(255,122,26,0.22),transparent_18rem),linear-gradient(145deg,rgba(255,255,255,0.09),transparent_46%)]" />
        <div className="absolute inset-x-10 bottom-8 top-8 rounded-[45%] border border-white/10 bg-white/[0.04]" />
        <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"><span className="absolute left-1/2 top-1/2 h-12 w-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-sm" /><MapPin className="relative h-7 w-7 text-primary" /><span className="absolute left-1/2 top-8 w-max max-w-40 -translate-x-1/2 text-center text-[11px] font-black">{resort.name}</span></div>
        {mapItems.map(item => <button key={item.id} type="button" aria-label={`${item.name} 지도에서 선택`} onClick={() => setSelectedId(item.id)} style={getLocalPosition(mapItems, item)} className={cn("absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 shadow-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", item.type === "rental" ? "bg-primary" : "bg-white", selectedId === item.id ? "h-6 w-6 border-white shadow-[0_0_0_10px_rgba(255,122,26,0.18)]" : "h-4 w-4 border-zinc-900")} />)}
      </div>
      <div className="flex min-h-20 items-center gap-3 border-t border-white/10 bg-black/35 px-4 py-3 backdrop-blur-md">{selected ? <><span className="rounded-lg bg-white/10 p-2">{selected.type === "rental" ? <Shirt className="h-4 w-4 text-primary" /> : <Hotel className="h-4 w-4" />}</span><div className="min-w-0 flex-1"><p className="truncate font-black">{selected.name}</p><p className="mt-0.5 text-xs text-white/60">{selected.meta}</p></div>{selected.href ? <AnalyticsLink href={selected.href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: `detail_map_${selected.type}`, resortId: resort.id }}><Button className="h-9 px-3 text-xs">지도·예약 <ExternalLink className="h-3.5 w-3.5" /></Button></AnalyticsLink> : null}</> : <p className="text-sm text-white/60">주변 장소를 선택해 위치를 확인하세요.</p>}</div>
    </div>

    <section className="grid gap-3 lg:grid-cols-2">
      <NearbyGroup title="숙박" icon={<Hotel className="h-4 w-4" />} count={lodgings.length}>{lodgings.map(lodging => <NearbyItem key={lodging.id} id={lodging.id} name={lodging.name} meta={lodging.distanceMinutes === 0 ? "리조트/공식 숙박" : `약 ${lodging.distanceMinutes}분`} href={lodging.url ?? lodging.mapLinks?.naver} resortId={resort.id} type="nearby_lodging" selected={lodging.id === selectedId} onSelect={selectOnMap} />)}</NearbyGroup>
      <NearbyGroup title="렌탈샵" icon={<Shirt className="h-4 w-4" />} count={rentalShops.length}>{rentalShops.map(shop => <NearbyItem key={shop.id} id={shop.id} name={shop.name} meta={`${shop.id.endsWith("official-rental") ? "공식 렌탈" : "외부 렌탈샵"}${shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}`} href={shop.url} mapHref={shop.mapLinks?.naver} resortId={resort.id} type="nearby_rental" tags={shop.recommendationTags} selected={shop.id === selectedId} onSelect={selectOnMap} />)}</NearbyGroup>
    </section>
  </div>;
}

function NearbyGroup({ title, icon, count, children }: { title: string; icon: React.ReactNode; count: number; children: React.ReactNode }) { return <div className="rounded-xl border bg-card p-4"><div className="mb-3 flex items-center justify-between gap-3"><div className="flex items-center gap-2 font-black"><span className="text-primary">{icon}</span>{title}</div><StatusBadge>{count}곳</StatusBadge></div><div className="grid gap-2">{children}</div></div>; }

function NearbyItem({ id, name, meta, href, mapHref, resortId, type, tags, selected, onSelect }: { id: string; name: string; meta: string; href?: string; mapHref?: string; resortId: string; type: string; tags?: string[]; selected: boolean; onSelect: (id: string) => void }) { return <div className={cn("rounded-lg border bg-background p-3 transition-colors", selected && "border-primary bg-primary/5")}><button type="button" onClick={() => onSelect(id)} className="w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${name} 지도에서 보기`}><div className="font-black">{name}</div><div className="mt-1 text-xs text-muted-foreground">{meta}</div></button>{tags?.length ? <div className="mt-2 flex flex-wrap gap-1">{tags.slice(0, 3).map(tag => <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">{tag}</span>)}</div> : null}<div className="mt-3 flex flex-wrap gap-2">{href ? <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }}><Button variant="secondary" className="h-8 px-2.5 text-xs">사이트·예약 <ExternalLink className="h-3.5 w-3.5" /></Button></AnalyticsLink> : null}{mapHref ? <AnalyticsLink href={mapHref} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: `${type}_map`, resortId }}><Button variant="ghost" className="h-8 px-2.5 text-xs">지도 <MapPin className="h-3.5 w-3.5" /></Button></AnalyticsLink> : null}</div></div>; }

function getLocalPosition(items: NearbyMapItem[], item: NearbyMapItem) {
  const lats = items.map(value => value.lat); const lngs = items.map(value => value.lng);
  const minLat = Math.min(...lats); const maxLat = Math.max(...lats); const minLng = Math.min(...lngs); const maxLng = Math.max(...lngs);
  const x = 16 + ((item.lng - minLng) / Math.max(0.001, maxLng - minLng)) * 68;
  const y = 18 + (1 - (item.lat - minLat) / Math.max(0.001, maxLat - minLat)) * 64;
  return { left: `${x}%`, top: `${y}%` };
}
