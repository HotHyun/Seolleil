import { ExternalLink, Hotel, MapPin, Shirt } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getMapPosition, getNearbyLodgingsForResort, getResortMapPoint } from "@/data/resort-map";
import type { RentalShop, SkiResort } from "@/lib/types";

export function ResortNearbyPanel({ resort, rentalShops }: { resort: SkiResort; rentalShops: RentalShop[] }) {
  const point = getResortMapPoint(resort.id);
  const lodgings = getNearbyLodgingsForResort(resort.id);

  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <div className="relative min-h-[320px] overflow-hidden rounded-xl border bg-zinc-950 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(255,122,26,0.2),transparent_16rem),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)]" />
        <div className="absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-white/[0.04]" />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        {point ? (
          <div className="absolute z-10 -translate-x-1/2 -translate-y-1/2" style={getMapPosition(point)}>
            <div className="rounded-full bg-primary px-3 py-1 text-xs font-black text-primary-foreground shadow-lg shadow-primary/30">
              {resort.name}
            </div>
          </div>
        ) : null}
        <div className="absolute bottom-4 left-4 right-4 rounded-lg border border-white/12 bg-black/42 p-3 backdrop-blur">
          <div className="flex items-center gap-2 text-sm font-black">
            <MapPin className="h-4 w-4 text-primary" />
            주변 정보 지도
          </div>
          <p className="mt-1 text-xs leading-5 text-white/62">
            스키장 위치를 중심으로 숙박과 렌탈 후보를 함께 확인합니다. 실제 길찾기는 네이버/카카오 지도 링크에서 확인하세요.
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        <NearbyGroup title="숙박" icon={<Hotel className="h-4 w-4" />} count={lodgings.length}>
          {lodgings.map((lodging) => (
            <NearbyItem
              key={lodging.id}
              name={lodging.name}
              meta={lodging.distanceMinutes === 0 ? "리조트/공식 숙박" : `약 ${lodging.distanceMinutes}분`}
              href={lodging.url}
              resortId={resort.id}
              type="nearby_lodging"
            />
          ))}
        </NearbyGroup>

        <NearbyGroup title="렌탈샵" icon={<Shirt className="h-4 w-4" />} count={rentalShops.length}>
          {rentalShops.map((shop) => (
            <NearbyItem
              key={shop.id}
              name={shop.name}
              meta={`${shop.id.endsWith("official-rental") ? "공식 렌탈" : "외부 렌탈샵"}${shop.distanceMinutes !== undefined ? ` · 약 ${shop.distanceMinutes}분` : ""}`}
              href={shop.mapLinks?.naver ?? shop.url}
              resortId={resort.id}
              type="nearby_rental"
              tags={shop.recommendationTags}
            />
          ))}
        </NearbyGroup>
      </div>
    </section>
  );
}

function NearbyGroup({
  title,
  icon,
  count,
  children
}: {
  title: string;
  icon: React.ReactNode;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-black">
          <span className="text-primary">{icon}</span>
          {title}
        </div>
        <StatusBadge>{count}곳</StatusBadge>
      </div>
      <div className="grid gap-2">{children}</div>
    </div>
  );
}

function NearbyItem({
  name,
  meta,
  href,
  resortId,
  type,
  tags
}: {
  name: string;
  meta: string;
  href?: string;
  resortId: string;
  type: string;
  tags?: string[];
}) {
  return (
    <div className="rounded-lg border bg-white/7 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-black">{name}</div>
          <div className="mt-1 text-xs text-muted-foreground">{meta}</div>
        </div>
        {href ? (
          <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type, resortId }}>
            <Button variant="ghost" className="h-8 px-2">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </AnalyticsLink>
        ) : null}
      </div>
      {tags?.length ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.slice(0, 3).map((tag) => (
            <span key={tag} className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
