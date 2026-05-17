import { ExternalLink, Hotel, Shirt } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { getNearbyLodgingsForResort } from "@/data/resort-map";
import type { RentalShop, SkiResort } from "@/lib/types";

export function ResortNearbyPanel({ resort, rentalShops }: { resort: SkiResort; rentalShops: RentalShop[] }) {
  const lodgings = getNearbyLodgingsForResort(resort.id);

  return (
    <section className="grid gap-3 lg:grid-cols-2">
      <NearbyGroup title="숙박" icon={<Hotel className="h-4 w-4" />} count={lodgings.length}>
        {lodgings.map((lodging) => (
          <NearbyItem
            key={lodging.id}
            name={lodging.name}
            meta={lodging.distanceMinutes === 0 ? "리조트/공식 숙박" : `약 ${lodging.distanceMinutes}분`}
            href={lodging.url ?? lodging.mapLinks?.naver}
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
    <div className="rounded-lg border bg-background p-3">
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
