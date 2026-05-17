"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Hotel, MapPin, Shirt, Snowflake } from "lucide-react";
import Link from "next/link";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getMapPosition, getNearbySummary, getResortMapRows } from "@/data/resort-map";
import type { RentalShop, SkiResort } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ResortMapExplorer({ resorts, rentalShops }: { resorts: SkiResort[]; rentalShops: RentalShop[] }) {
  const rows = useMemo(() => getResortMapRows(resorts), [resorts]);
  const [selectedId, setSelectedId] = useState(rows[0]?.resort.id ?? "");
  const selected = rows.find((row) => row.resort.id === selectedId) ?? rows[0];
  const selectedSummary = selected ? getNearbySummary(selected.resort.id, rentalShops) : { rentalCount: 0, lodgingCount: 0 };

  return (
    <section className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="relative min-h-[430px] overflow-hidden rounded-xl border bg-zinc-950 text-white shadow-2xl shadow-black/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_16%,rgba(255,122,26,0.18),transparent_30rem),linear-gradient(145deg,rgba(255,255,255,0.08),transparent_42%)]" />
        <div className="absolute inset-x-8 bottom-10 top-8 rounded-[45%] border border-white/10 bg-white/[0.04]" />
        <div className="absolute inset-x-14 bottom-16 top-14 rounded-[42%] border border-white/10" />
        <div className="absolute left-[43%] top-[10%] h-[78%] w-[18%] rounded-full border border-white/10 bg-white/[0.03] blur-[1px]" />

        {rows.map(({ resort, point }) => {
          if (!point) return null;
          const position = getMapPosition(point);
          const isSelected = resort.id === selected?.resort.id;
          return (
            <button
              key={resort.id}
              type="button"
              className={cn(
                "absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 text-xs font-black shadow-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground shadow-primary/30"
                  : "border-white/20 bg-white/14 text-white hover:bg-white/24"
              )}
              style={position}
              onClick={() => setSelectedId(resort.id)}
              aria-label={`${resort.name} 선택`}
            >
              {resort.name.replace(" 리조트", "").replace("스키월드", "")}
            </button>
          );
        })}

        <div className="absolute left-4 top-4 rounded-lg border border-white/12 bg-black/40 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-black">
            <MapPin className="h-4 w-4 text-primary" />
            국내 스키장 지도
          </div>
          <p className="mt-1 text-xs text-white/60">핀을 눌러 스키장과 주변 정보를 확인하세요.</p>
        </div>
      </div>

      {selected ? (
        <div className="rounded-xl border bg-card p-5 shadow-sm">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone={selected.resort.operationStatus === "operating" ? "good" : "warn"}>
              {statusLabel(selected.resort.operationStatus)}
            </StatusBadge>
            {selected.resort.nightSkiAvailable ? <StatusBadge>야간</StatusBadge> : null}
            {selected.resort.tags.slice(0, 3).map((tag) => (
              <StatusBadge key={tag}>{tag}</StatusBadge>
            ))}
          </div>
          <h2 className="mt-4 text-2xl font-black">{selected.resort.name}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{selected.resort.region} · {selected.resort.address}</p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <InfoTile icon={<Shirt />} label="렌탈 후보" value={`${selectedSummary.rentalCount}곳`} />
            <InfoTile icon={<Hotel />} label="숙박 후보" value={`${selectedSummary.lodgingCount}곳`} />
            <InfoTile icon={<Snowflake />} label="초보 점수" value={`${selected.resort.beginnerScore}`} />
            <InfoTile icon={<MapPin />} label="접근 점수" value={`${selected.resort.accessScore}`} />
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link href={`/resorts/${selected.resort.id}`} className="flex-1">
              <Button className="w-full">상세 보기</Button>
            </Link>
            {selected.resort.mapLinks.naver ? (
              <AnalyticsLink
                href={selected.resort.mapLinks.naver}
                target="_blank"
                rel="noreferrer"
                eventName="external_link_click"
                eventData={{ type: "naver_map", resortId: selected.resort.id }}
              >
                <Button variant="secondary" className="w-full sm:w-auto">
                  네이버 지도 <ExternalLink className="h-4 w-4" />
                </Button>
              </AnalyticsLink>
            ) : null}
          </div>

          {selected.point ? (
            <p className="mt-4 text-xs leading-5 text-muted-foreground">
              위치 데이터: {selected.point.sourceName} · {selected.point.lastCheckedAt}
            </p>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function InfoTile({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="mb-2 text-muted-foreground [&_svg]:h-4 [&_svg]:w-4">{icon}</div>
      <div className="text-xs font-bold text-muted-foreground">{label}</div>
      <div className="mt-1 text-xl font-black">{value}</div>
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
