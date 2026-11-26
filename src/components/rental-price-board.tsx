import { ExternalLink, Info } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { ConfidenceBadge } from "@/components/confidence-badge";
import type { RentalGuideItem } from "@/data/lift-discounts";
import { buildRentalDiscountCards, buildTripExamples, getLiftGuideForBoard, getLiftPriceBoard } from "@/lib/lift-price-board";
import { formatCurrency } from "@/lib/utils";

function Heading({ children, meta }: { children: React.ReactNode; meta?: React.ReactNode }) {
  return <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><h2 className="text-lg font-semibold">{children}</h2>{meta}</div>;
}

function ItemList({ title, items, basis }: { title: string; items: RentalGuideItem[]; basis?: string }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{title}{basis ? <span className="ml-1.5 font-normal">· {basis}</span> : null}</h3>
      <ul className="divide-y rounded-xl border bg-card">
        {items.map((item) => (
          <li key={item.id} className="px-3.5 py-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="min-w-0">
                <p className="font-semibold">{item.label}</p>
                {item.detail ? <p className="text-xs leading-5 text-muted-foreground">{item.detail}</p> : null}
              </div>
              <p className="flex flex-wrap gap-x-4 text-right tabular-nums">
                {item.prices.map((entry) => <span key={entry.label} className="font-semibold"><span className="mr-1 text-xs font-normal text-muted-foreground">{entry.label}</span>{formatCurrency(entry.price)}</span>)}
              </p>
            </div>
            {item.discountable ? <p className="mt-1.5 text-xs font-medium text-primary">우대 할인 적용 가능</p> : <p className="mt-1.5 text-xs text-muted-foreground">우대 할인 없음</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}

// 장비·의류·보호장구 렌탈 요금과 우대 할인가, 리프트권까지 합친 1인 비용 예시.
export function RentalPriceBoard({ resortId }: { resortId: string }) {
  const board = getLiftPriceBoard(resortId);
  const guide = board ? getLiftGuideForBoard(resortId, board) : undefined;
  const rental = guide?.rental;
  if (!board || !guide || !rental) return <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">등록된 렌탈 요금이 없어요. 공식 판매처에서 확인하세요.</p>;

  const discountCards = buildRentalDiscountCards(guide);
  const examples = buildTripExamples(board, guide);
  const verified = guide.discounts.filter((discount) => discount.group === "verified" && discount.rates.rental);

  return (
    <div className="space-y-8">
      <section aria-label="렌탈 요금" className="space-y-4">
        <Heading meta={<span className="flex items-center gap-2 text-xs text-muted-foreground"><ConfidenceBadge confidence="confirmed" />· 확인 {guide.lastCheckedAt}</span>}>{board.seasonLabel} 렌탈 요금</Heading>
        <ItemList title="장비 렌탈" items={rental.equipment} basis={rental.equipmentBasis} />
        <ItemList title="의류 렌탈" items={rental.clothing} />
        <ItemList title="보호장구" items={rental.protective} />
        <p className="text-xs leading-5 text-muted-foreground">성인 기준 1인 요금이에요. 렌탈 표 자체에는 시즌 표기가 없어 현재 게시된 공식 요금을 26/27 요금으로 보여 줘요.</p>
      </section>

      {discountCards.length ? <section aria-label="렌탈 할인 적용 시 가격">
        <Heading>장비 렌탈, 할인받으면 얼마?</Heading>
        <div className="grid gap-3 sm:grid-cols-3">
          {discountCards.map(({ discount, rows }) => (
            <div key={discount.id} className="rounded-xl border bg-card p-4">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="font-semibold">{discount.title}</h3>
                <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">렌탈 {discount.rates.rental}%</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{discount.target}</p>
              {rows.map(({ item, prices }) => (
                <div key={item.id} className="mt-3">
                  <p className="text-xs text-muted-foreground">{item.label} · {rental.equipmentBasis}</p>
                  <p className="mt-1 flex flex-wrap gap-x-4 tabular-nums">
                    {prices.map((entry) => <span key={entry.label} className="font-semibold"><span className="mr-1 text-xs font-normal text-muted-foreground">{entry.label}</span>{formatCurrency(entry.price)}</span>)}
                  </p>
                </div>
              ))}
              <ul className="mt-3 space-y-1 border-t pt-3 text-xs leading-5 text-muted-foreground">
                {discount.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {verified.length ? <p className="mt-3 text-xs leading-5 text-muted-foreground">현장 구매·증빙 할인: {verified.map((discount) => `${discount.title} ${discount.rates.rental}%`).join(" · ")}</p> : null}
        <p className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-muted-foreground"><Info aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 shrink-0" />부분 렌탈(플레이트·데크, 부츠 단품)은 우대 할인을 받을 수 없어요. 할인가는 공식 할인율로 계산한 참고값이에요.</p>
      </section> : null}

      {examples.length ? <section aria-label="1인 비용 예시">
        <Heading>리프트권까지 합치면 1인 얼마?</Heading>
        <p className="mb-3 text-sm leading-6 text-muted-foreground">4시간권 + 장비 풀세트 + 의류 풀세트(4시간 이하)를 한 번에 빌리는 경우예요. 의류는 할인 없이 계산했어요.</p>
        <ul className="divide-y rounded-xl border bg-card">
          {examples.map((example) => (
            <li key={example.title} className="px-3.5 py-3">
              <p className="font-semibold">{example.title}</p>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                {([["weekday", "주중"], ["weekend", "주말"]] as const).map(([key, label]) => {
                  const cell = example[key];
                  return cell ? (
                    <div key={key}>
                      <p className="flex items-baseline justify-between gap-2"><span className="text-xs text-muted-foreground">{label}</span><span className="text-lg font-semibold tabular-nums">{formatCurrency(cell.total)}</span></p>
                      <p className="mt-0.5 text-right text-xs leading-5 text-muted-foreground">리프트 {formatCurrency(cell.lift)} · 장비 {formatCurrency(cell.equipment)} · 의류 {formatCurrency(cell.clothing)}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </li>
          ))}
        </ul>
      </section> : null}

      <section aria-label="이용 방법과 위치" className="grid gap-6 sm:grid-cols-2">
        <div>
          <Heading>이용 방법</Heading>
          <ol className="space-y-2 text-sm leading-6 text-muted-foreground">
            {rental.howTo.map((step, index) => <li key={step} className="flex gap-2"><span className="font-semibold text-foreground">{index + 1}.</span><span>{step}</span></li>)}
          </ol>
        </div>
        <div>
          <Heading>위치·운영</Heading>
          <dl className="divide-y rounded-xl border bg-card text-sm">
            {rental.location.map((row) => <div key={row.label} className="flex items-baseline justify-between gap-3 px-3 py-2.5"><dt className="shrink-0 text-muted-foreground">{row.label}</dt><dd className="text-right font-medium">{row.value}</dd></div>)}
          </dl>
        </div>
      </section>

      <ul className="space-y-1.5 text-sm leading-6 text-muted-foreground">
        {rental.notices.map((notice) => <li key={notice} className="flex gap-2"><span aria-hidden="true">·</span><span>{notice}</span></li>)}
      </ul>

      <p className="text-xs text-muted-foreground">
        출처: <AnalyticsLink href={guide.sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "guide_rental_price_source", resortId }} className="inline-flex min-h-9 items-center gap-1 font-medium text-primary underline-offset-4 hover:underline">{guide.sourceName} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></AnalyticsLink>
      </p>
    </div>
  );
}
