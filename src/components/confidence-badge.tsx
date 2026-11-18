import type { PriceConfidence } from "@/lib/types";
import { cn } from "@/lib/utils";

// Single source for how price confidence is labelled and drawn.
// Solid dot = confirmed, hollow dot + dashed border = not confirmed.
export const confidenceMeta: Record<PriceConfidence, { label: string; note: string; dot: string; ring: string }> = {
  confirmed: { label: "확인됨", note: "공식 판매처에서 확인한 가격", dot: "bg-emerald-500", ring: "border-emerald-500/40" },
  phone_confirmed: { label: "전화확인", note: "매장에 전화로 확인한 가격", dot: "bg-sky-500", ring: "border-sky-500/40" },
  estimated: { label: "추정", note: "전년 가격 등을 바탕으로 한 추정치", dot: "border-2 border-amber-500 bg-transparent", ring: "border-dashed border-amber-500/60" },
  unavailable: { label: "확인필요", note: "새 시즌 가격이 아직 공개되지 않았어요", dot: "border-2 border-muted-foreground bg-transparent", ring: "border-dashed border-border" }
};

export const confidenceOrder: PriceConfidence[] = ["confirmed", "phone_confirmed", "estimated", "unavailable"];

export function ConfidenceBadge({ confidence, className }: { confidence: PriceConfidence; className?: string }) {
  const meta = confidenceMeta[confidence];
  return (
    <span title={meta.note} className={cn("inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border bg-card px-2.5 py-1 text-xs font-bold text-foreground", meta.ring, className)}>
      <span aria-hidden="true" className={cn("h-2.5 w-2.5 shrink-0 rounded-full", meta.dot)} />
      {meta.label}
      <span className="sr-only">: {meta.note}</span>
    </span>
  );
}
