import { ConfidenceDot } from "@/components/confidence-badge";
import type { MissingPart, ShopComparison } from "@/lib/rental-shop-comparison";
import { cn, formatCurrency } from "@/lib/utils";

const missingLabels: Record<MissingPart, string> = { lift: "리프트권", equipment: "장비", clothing: "의류" };

export function missingText(missing: MissingPart[]) {
  return missing.map(part => missingLabels[part]).join(" · ");
}

export function savingsHeadline(result: ShopComparison) {
  const { savings } = result;
  if (result.isOfficial) return { tone: "neutral" as const, text: "공식 기준가" };
  if (!savings) return { tone: "muted" as const, text: "공식 가격이 없어 비교할 수 없어요" };
  if (savings.perPerson > 0) return { tone: "good" as const, text: `공식 대비 1인 ${formatCurrency(savings.perPerson)} 저렴${savings.rate ? ` (-${savings.rate}%)` : ""}` };
  if (savings.perPerson === 0) return { tone: "neutral" as const, text: "공식과 같은 가격" };
  return { tone: "warn" as const, text: `공식보다 1인 ${formatCurrency(-savings.perPerson)} 비싸요` };
}

const basisText = { all: "", lift_only: "리프트권 기준으로 비교했어요", rental_only: "장비·의류 기준으로 비교했어요" } as const;

type Row = { key: string; label: string; amount: number | null };

function breakdownRows(result: ShopComparison, needs: { equipment: boolean; clothing: boolean }): Row[] {
  const rows: Row[] = [{ key: "lift", label: result.usesShopLift ? "리프트권 (샵 할인권)" : "리프트권 (공식권)", amount: result.missing.includes("lift") ? null : result.lift }];
  if (result.bundle > 0) rows.push({ key: "bundle", label: "장비+의류 패키지", amount: result.bundle });
  if (needs.equipment && (result.equipment > 0 || result.bundle === 0)) rows.push({ key: "equipment", label: "장비 렌탈", amount: result.missing.includes("equipment") ? null : result.equipment });
  if (needs.clothing && (result.clothing > 0 || result.bundle === 0)) rows.push({ key: "clothing", label: "의류 렌탈", amount: result.missing.includes("clothing") ? null : result.clothing });
  return rows;
}

// 샵 하나의 리프트권·장비·의류 가격과 예상 총액, 공식 대비 절약액을 보여 준다. 지도 카드와 확인 시트가 함께 쓴다.
export function ShopPriceBreakdown({ result, people, needs }: { result: ShopComparison; people: number; needs: { equipment: boolean; clothing: boolean } }) {
  const rows = breakdownRows(result, needs);
  const headline = savingsHeadline(result);
  return <div>
    <ul className="divide-y rounded-xl border text-sm">
      {rows.map(row => <li key={row.key} className="flex items-center justify-between gap-3 px-3 py-2">
        <span className="text-muted-foreground">{row.label}</span>
        <span className={cn("font-semibold tabular-nums", row.amount === null && "text-xs font-medium text-muted-foreground")}>{row.amount === null ? "가격 미확인" : formatCurrency(row.amount)}</span>
      </li>)}
    </ul>
    <p className="mt-1 text-right text-xs text-muted-foreground">1인 기준{result.reference ? " · 25/26 참고가 포함" : ""}</p>
    {result.complete ? <div className="mt-1 rounded-xl bg-muted/60 p-3">
      <p className="flex items-baseline justify-between gap-3"><span className="text-sm font-semibold">예상 총액</span><span className="flex items-center gap-1.5 text-xl font-semibold tabular-nums"><ConfidenceDot confidence={result.confidence} />{formatCurrency(result.total!)}</span></p>
      <p className="mt-0.5 text-right text-xs text-muted-foreground">{people}명 · 1인 {formatCurrency(result.perPerson!)}</p>
      <p className={cn("mt-2 text-sm font-semibold", headline.tone === "good" && "text-emerald-700 dark:text-emerald-300", headline.tone === "warn" && "text-amber-700 dark:text-amber-300", headline.tone === "muted" && "text-muted-foreground")}>
        {headline.text}
        {result.savings && result.savings.perPerson > 0 && people > 1 ? <span className="font-normal text-muted-foreground"> · {people}명 {formatCurrency(result.savings.total)} 절약</span> : null}
      </p>
      {result.savings && basisText[result.savings.basis] && !result.isOfficial ? <p className="text-xs text-muted-foreground">{basisText[result.savings.basis]}</p> : null}
    </div> : <p className="mt-1 rounded-xl bg-muted/60 p-3 text-xs leading-5 text-muted-foreground">{missingText(result.missing)} 가격을 확인하지 못해 총액과 절약액은 계산하지 않았어요. 업체에 확인한 뒤 확정 현황에서 직접 고를 수 있어요.</p>}
  </div>;
}
