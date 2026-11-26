import Link from "next/link";
import { ArrowRight, ExternalLink, Info, Tag } from "lucide-react";
import { AnalyticsLink } from "@/components/analytics-link";
import { ConfidenceBadge, ConfidenceDot } from "@/components/confidence-badge";
import { liftPromotions } from "@/data/lift-promotions";
import { buildDiscountCards, getLiftGuideForBoard, getLiftPriceBoard, slotLabelFor, type LiftPriceBoard as Board } from "@/lib/lift-price-board";
import { isPromotionOnSale } from "@/lib/lift-promotions";
import { todayKst } from "@/lib/season-open";
import type { DayType, PriceConfidence } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import type { DiscountRates, LiftDiscount, ResortLiftGuide } from "@/data/lift-discounts";

const columnLabels: Partial<Record<DayType, string>> = { all: "전체", weekday: "주중", friday: "금요일", weekend: "주말", holiday: "공휴일", peak: "성수기" };

function overallConfidence(board: Board): PriceConfidence {
  const order: PriceConfidence[] = ["unavailable", "estimated", "phone_confirmed", "confirmed"];
  const levels = board.rows.flatMap((row) => Object.values(row.cells).map((cell) => cell.confidence));
  return order.find((level) => levels.includes(level)) ?? "confirmed";
}

function PriceTable({ board, guide }: { board: Board; guide?: ResortLiftGuide }) {
  const showChild = board.rows.some((row) => Object.values(row.cells).some((cell) => cell.childPrice !== undefined));
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <table className="w-full text-sm">
        <caption className="sr-only">{board.seasonLabel} 리프트권 정상가</caption>
        <thead className="bg-muted/50 text-xs text-muted-foreground">
          <tr>
            <th scope="col" className="px-3 py-2 text-left font-medium">시간권</th>
            {board.columns.map((column) => <th key={column} scope="col" className="px-3 py-2 text-right font-medium">{columnLabels[column] ?? column}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y">
          {board.rows.map((row) => (
            <tr key={row.slot}>
              <th scope="row" className="px-3 py-3 text-left font-semibold">{slotLabelFor(guide, row.slot)}</th>
              {board.columns.map((column) => {
                const cell = row.cells[column];
                return (
                  <td key={column} className="px-3 py-3 text-right tabular-nums">
                    {cell ? <>
                      <span className="inline-flex items-center justify-end gap-1.5 font-semibold">{cell.confidence !== "confirmed" ? <ConfidenceDot confidence={cell.confidence} /> : null}{formatCurrency(cell.price)}</span>
                      {showChild && cell.childPrice !== undefined ? <span className="block text-xs text-muted-foreground">소인 {formatCurrency(cell.childPrice)}</span> : null}
                    </> : <span className="text-muted-foreground">-</span>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function rateText(weekday?: number, weekend?: number) {
  return weekend !== undefined && weekend !== weekday ? `주중 ${weekday}% · 주말 ${weekend}%` : `${weekday}%`;
}

function weekendRateOf(discount: LiftDiscount, index: number) {
  return index === 0 ? discount.rates.weekend?.lift : discount.altRates?.weekend?.lift;
}

function RateChip({ label, rate, note }: { label: string; rate?: number; note?: string }) {
  if (!rate) return null;
  return <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-1 text-xs font-medium">{label} <strong className="font-semibold text-primary">{rate}%</strong>{note ? <span className="text-muted-foreground">({note})</span> : null}</span>;
}

function DiscountCards({ board, guide }: { board: Board; guide: ResortLiftGuide }) {
  const cards = buildDiscountCards(board, guide);
  if (!cards.length) return null;
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ discount, periods }) => (
        <div key={discount.id} className="rounded-xl border bg-card p-4">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-semibold">{discount.title}</h3>
            {periods.length === 1 ? <span className="rounded-md bg-primary/10 px-2 py-0.5 text-sm font-semibold text-primary">리프트 {rateText(discount.rates.lift, discount.rates.weekend?.lift)}</span> : null}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{discount.target}</p>
          {periods.map((period, index) => {
            const rate = index === 0 ? discount.rates.lift : discount.altRates?.lift;
            return (
              <div key={period.label ?? "all"} className="mt-3">
                {period.label ? <p className="flex items-baseline justify-between gap-2 text-xs"><span className="font-semibold">{period.label}<span className="ml-1.5 font-normal text-muted-foreground">{period.range}</span></span><span className="rounded-md bg-primary/10 px-1.5 py-0.5 font-semibold text-primary">리프트 {rateText(rate, weekendRateOf(discount, index))}</span></p> : null}
                <ul className="mt-1.5 space-y-1.5 text-sm">
                  {period.rows.map((row) => (
                    <li key={row.slot} className="flex items-baseline justify-between gap-2">
                      <span className="text-muted-foreground">{slotLabelFor(guide, row.slot)}</span>
                      <span className="text-right font-semibold tabular-nums">
                        {row.single !== undefined ? formatCurrency(row.single) : <>
                          {row.weekday !== undefined ? <span><span className="mr-1 text-xs font-normal text-muted-foreground">주중</span>{formatCurrency(row.weekday)}</span> : null}
                          {row.weekend !== undefined ? <span className="ml-2"><span className="mr-1 text-xs font-normal text-muted-foreground">주말</span>{formatCurrency(row.weekend)}</span> : null}
                        </>}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
          {discount.weekdayOnly ? <p className="mt-2 text-xs text-muted-foreground">주중에만 적용돼요.</p> : null}
          <ul className="mt-3 space-y-1 border-t pt-3 text-xs leading-5 text-muted-foreground">
            {discount.notes.map((note) => <li key={note}>{note}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function DiscountList({ discounts, title, guide }: { discounts: LiftDiscount[]; title: string; guide: ResortLiftGuide }) {
  if (!discounts.length) return null;
  const columns: { key: Exclude<keyof DiscountRates, "weekend">; label: string }[] = [{ key: "lift", label: "리프트" }, { key: "rental", label: "장비렌탈" }, { key: "lesson", label: "강습" }, { key: "sled", label: "눈썰매장" }];
  return (
    <div>
      <h3 className="text-sm font-semibold text-muted-foreground">{title}</h3>
      <ul className="mt-2 divide-y rounded-xl border bg-card">
        {discounts.map((discount) => (
          <li key={discount.id} className="px-3.5 py-3">
            <p className="font-semibold">{discount.title}</p>
            <p className="text-xs leading-5 text-muted-foreground">{discount.target}</p>
            <div className="mt-2 space-y-1.5">
              {(guide.periods && discount.altRates ? [{ label: guide.periods[0].label, rates: discount.rates }, { label: guide.periods[1].label, rates: discount.altRates }] : [{ label: undefined, rates: discount.rates }]).map((period) => (
                <div key={period.label ?? "all"} className="flex flex-wrap items-center gap-1.5">
                  {period.label ? <span className="w-16 shrink-0 text-xs font-medium text-muted-foreground">{period.label}</span> : null}
                  {columns.map((column) => {
                    const weekend = column.key === "lift" || column.key === "rental" ? period.rates.weekend?.[column.key] : undefined;
                    const rate = period.rates[column.key];
                    return weekend !== undefined && weekend !== rate
                      ? <span key={column.key} className="inline-flex items-center gap-1.5"><RateChip label={`${column.label} 주중`} rate={rate} /><RateChip label="주말" rate={weekend} /></span>
                      : <RateChip key={column.key} label={column.label} rate={rate} note={column.key === "lesson" ? discount.lessonNote : undefined} />;
                  })}
                </div>
              ))}
            </div>
            {discount.notes.length && !discount.highlight ? <ul className="mt-2 space-y-0.5 text-xs leading-5 text-muted-foreground">{discount.notes.map((note) => <li key={note}>{note}</li>)}</ul> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

type PromoPrice = (typeof liftPromotions)[number]["prices"][number];

// 주중·주말 가격이 같으면 한 묶음으로 보여 준다.
function promotionGroups(prices: PromoPrice[]) {
  const weekday = prices.filter((price) => price.dayType === "weekday");
  const weekend = prices.filter((price) => price.dayType === "weekend");
  const key = (list: PromoPrice[]) => JSON.stringify(list.map((price) => [price.timeSlot, price.adultPrice, price.withRentalPrice]));
  if (weekday.length && key(weekday) === key(weekend)) return [{ label: "주중·주말 동일", prices: weekday }];
  return [{ label: "주중", prices: weekday }, { label: "주말", prices: weekend }].filter((group) => group.prices.length);
}

function ActivePromotions({ resortId, guide }: { resortId: string; guide?: ResortLiftGuide }) {
  const today = todayKst();
  const active = liftPromotions.filter((promotion) => promotion.resortId === resortId && isPromotionOnSale(promotion, today));
  if (!active.length) return null;
  return (
    <div className="space-y-3">
      {active.map((promotion) => (
        <div key={promotion.id} className="rounded-xl border border-primary/30 bg-primary/[0.04] p-4" data-testid="lift-promotion">
          <p className="flex items-center gap-2 font-semibold"><Tag aria-hidden="true" className="h-4 w-4 text-primary" />{promotion.title}<span className="text-xs font-normal text-muted-foreground">{promotion.channel} · {promotion.salesTo.slice(5).replace("-", "/")}까지 판매</span></p>
          <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {promotionGroups(promotion.prices).map((group) => (
              <li key={group.label}>
                <p className="text-xs font-semibold text-muted-foreground">{group.label}</p>
                {group.prices.map((price) => (
                  <p key={price.timeSlot} className="flex items-baseline justify-between gap-2">
                    <span className="text-muted-foreground">{slotLabelFor(guide, price.timeSlot)}</span>
                    <span className="font-semibold tabular-nums">{formatCurrency(price.adultPrice)}{price.withRentalPrice !== undefined ? <span className="ml-2 text-xs font-normal text-muted-foreground">장비 포함 {formatCurrency(price.withRentalPrice)}</span> : null}</span>
                  </p>
                ))}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{promotion.condition} 예상 총액에는 반영하지 않았어요.</p>
          <AnalyticsLink href={promotion.sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "lift_promotion", resortId, promotionId: promotion.id }} className="mt-1 inline-flex min-h-9 items-center gap-1 text-xs font-medium text-primary underline-offset-4 hover:underline">공식 공지 보기 <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></AnalyticsLink>
        </div>
      ))}
    </div>
  );
}

function Heading({ children, meta }: { children: React.ReactNode; meta?: React.ReactNode }) {
  return <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><h2 className="text-lg font-semibold">{children}</h2>{meta}</div>;
}

// 리프트권 정상가 표와 할인·우대 안내. 가이드(full)와 스키장 상세(compact)가 같은 데이터를 쓴다.
export function LiftPriceBoard({ resortId, variant = "full", guideHref }: { resortId: string; variant?: "full" | "compact"; guideHref?: string }) {
  const board = getLiftPriceBoard(resortId);
  if (!board) return <p className="rounded-xl border border-dashed p-4 text-sm text-muted-foreground">등록된 리프트권 가격이 없어요. 공식 판매처에서 확인하세요.</p>;
  const guide = getLiftGuideForBoard(resortId, board);
  const confidence = overallConfidence(board);
  const source = guide ?? { sourceUrl: board.sourceUrl, sourceName: board.sourceName, lastCheckedAt: board.checkedAt };
  const meta = <span className="flex items-center gap-2 text-xs text-muted-foreground"><ConfidenceBadge confidence={confidence} />· 확인 {source.lastCheckedAt}</span>;

  if (variant === "compact") {
    const cards = guide ? buildDiscountCards(board, guide) : [];
    return (
      <div className="space-y-3">
        {board.isReference ? <p className="flex items-start gap-2 rounded-lg border bg-muted/50 p-3 text-xs leading-5 text-muted-foreground"><Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />{board.seasonLabel} 가격을 참고가로 보여 줘요. 26/27 공식 가격이 게시되면 바뀌어요.</p> : null}
        <div><Heading meta={meta}><span className="text-sm font-semibold">{board.seasonLabel} 정상가</span></Heading><PriceTable board={board} guide={guide} /></div>
        {cards.length ? (
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
            할인
            {cards.map(({ discount }) => <RateChip key={discount.id} label={discount.title} rate={discount.rates.lift} note={discount.altRates?.lift && guide?.periods ? `${guide.periods[1].label} ${discount.altRates.lift}%` : undefined} />)}
          </p>
        ) : null}
        {guideHref ? <Link href={guideHref} className="inline-flex min-h-9 items-center gap-1 text-sm font-semibold text-primary">할인·우대 전체 보기 <ArrowRight aria-hidden="true" className="h-4 w-4" /></Link> : null}
      </div>
    );
  }

  const anyone = guide?.discounts.filter((discount) => discount.group === "anyone") ?? [];
  const verified = guide?.discounts.filter((discount) => discount.group === "verified") ?? [];

  return (
    <div className="space-y-8">
      {board.isReference ? <p className="flex items-start gap-2 rounded-xl border bg-muted/50 p-4 text-sm leading-6 text-muted-foreground"><Info aria-hidden="true" className="mt-1 h-4 w-4 shrink-0" />26/27 공식 가격이 아직 게시되지 않아 {board.seasonLabel} 가격을 참고가로 보여 줘요. 공식 가격이 게시되면 바뀌어요.</p> : null}

      <section aria-label="정상가">
        <Heading meta={meta}>{board.seasonLabel} 리프트권 정상가</Heading>
        <PriceTable board={board} guide={guide} />
        <p className="mt-2 text-xs leading-5 text-muted-foreground">대인 1인 요금이에요(소인 가격이 있으면 함께 표시).{guide?.discounts.length ? " 아래 할인가는 공식 할인율로 계산한 참고값이며, 실제 결제 금액은 판매처에서 확인하세요." : " 실제 결제 금액은 판매처에서 확인하세요."}</p>
      </section>

      {guide && buildDiscountCards(board, guide).length ? <section aria-label="할인 적용 시 가격">
        <Heading>할인받으면 얼마?</Heading>
        <DiscountCards board={board} guide={guide} />
      </section> : null}

      <ActivePromotions resortId={resortId} guide={guide} />

      {guide?.discounts.length ? <section aria-label="우대 할인율" className="space-y-4">
        <Heading>우대(할인)율 한눈에</Heading>
        <DiscountList discounts={anyone} title="누구나 받을 수 있어요" guide={guide} />
        <DiscountList discounts={verified} title="현장 구매 · 증빙이 필요해요" guide={guide} />
      </section> : null}

      {guide ? <section aria-label="알아두세요">
        <Heading>알아두세요</Heading>
        <ul className="space-y-1.5 text-sm leading-6 text-muted-foreground">
          {guide.notices.map((notice) => <li key={notice} className="flex gap-2"><span aria-hidden="true">·</span><span>{notice}</span></li>)}
        </ul>
        {guide.extras.length ? <dl className="mt-4 divide-y rounded-xl border bg-card text-sm">
          {guide.extras.map((extra) => (
            <div key={extra.label} className="px-3 py-2.5">
              <div className="flex items-baseline justify-between gap-3"><dt className="text-muted-foreground">{extra.label}</dt><dd className="font-semibold tabular-nums">{extra.value}</dd></div>
              {extra.note ? <p className="mt-0.5 text-xs text-muted-foreground">{extra.note}</p> : null}
            </div>
          ))}
        </dl> : null}
      </section> : null}

      {source.sourceUrl ? <p className="text-xs text-muted-foreground">
        출처: <AnalyticsLink href={source.sourceUrl} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "guide_lift_source", resortId }} className={cn("inline-flex min-h-9 items-center gap-1 font-medium text-primary underline-offset-4 hover:underline")}>{source.sourceName ?? "공식 요금 안내"} <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></AnalyticsLink>
      </p> : null}
    </div>
  );
}
