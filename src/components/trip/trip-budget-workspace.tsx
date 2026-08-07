"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Plus, ReceiptText, Trash2, Users } from "lucide-react";
import { updateTripBudgetSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { calculateTripBudget, type TripBudgetState, type TripExpenseCategory } from "@/lib/trip-budget";
import type { CostEstimate } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type BudgetTrip = {
  id: string;
  peopleCount: number;
  lodgingName: string | null;
  splitCount: number;
  budgetData: TripBudgetState;
  selectedRecommendation: unknown;
  resortId: string;
  liftTicketTimeSlot: string;
  selectedRentalOptionId: string | null;
  selectedLiftTicketOptionId: string | null;
  transportType: string;
};

const categories: Array<{ value: TripExpenseCategory; label: string }> = [
  { value: "meal", label: "식비" }, { value: "fuel", label: "주유" }, { value: "toll", label: "통행료" },
  { value: "parking", label: "주차" }, { value: "transport", label: "추가 교통" }, { value: "other", label: "기타" }
];
const liftLabels: Record<string, string> = { "2h": "2시간권", "3h": "3시간권", "4h": "4시간권", "6h": "6시간권", night: "야간권", full_day: "종일권" };
const transportLabels: Record<string, string> = { car: "자차", shuttle: "스키장 제휴 셔틀", bus: "고속·시외버스" };
const budgetCostKeys = [
  { key: "lift_ticket", label: "리프트권" },
  { key: "rental", label: "렌탈" },
  { key: "transport", label: "교통비" },
  { key: "lodging", label: "숙박비" }
] as const;

function recommendationCost(value: unknown): CostEstimate | null {
  if (!value || typeof value !== "object" || !("cost" in value)) return null;
  return (value as { cost?: CostEstimate }).cost ?? null;
}

export function TripBudgetWorkspace({ trip, basePath, editToken, shareToken, canEdit = true, rentalOptions }: {
  trip: BudgetTrip; basePath: string; editToken?: string; shareToken?: string; canEdit?: boolean;
  rentalOptions?: Array<{ value: string; label: string }>;
}) {
  const [budget, setBudget] = useState(trip.budgetData);
  const router = useRouter();
  const [splitCount, setSplitCount] = useState(trip.splitCount || trip.peopleCount);
  const [dirty, setDirty] = useState(false);
  const totals = useMemo(() => calculateTripBudget(recommendationCost(trip.selectedRecommendation), budget, splitCount), [trip.selectedRecommendation, budget, splitCount]);
  const rentalLabel = rentalOptions?.find(option => option.value === trip.selectedRentalOptionId)?.label ?? (trip.selectedRentalOptionId ? "선택한 렌탈 상품" : "렌탈하지 않음 / 미정");
  const liftLabel = `${trip.selectedLiftTicketOptionId ? "할인 리프트권" : "공식 리프트권"} · ${liftLabels[trip.liftTicketTimeSlot] ?? trip.liftTicketTimeSlot}`;
  const addExpense = () => {
    setBudget(current => ({ ...current, extras: [...current.extras, { id: crypto.randomUUID(), category: "meal", title: "", amount: 0 }] }));
    setDirty(true);
  };
  useEffect(() => {
    if (!dirty) return;
    const warnBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    const warnBeforeNavigation = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.target === "_blank") return;
      if (window.confirm("저장하지 않은 비용 변경사항이 있습니다. 이 페이지를 떠날까요?")) return;
      event.preventDefault();
      event.stopPropagation();
    };
    window.addEventListener("beforeunload", warnBeforeUnload);
    document.addEventListener("click", warnBeforeNavigation, true);
    return () => {
      window.removeEventListener("beforeunload", warnBeforeUnload);
      document.removeEventListener("click", warnBeforeNavigation, true);
    };
  }, [dirty]);

  async function saveBudget(formData: FormData) {
    formData.set("extras", JSON.stringify(budget.extras));
    const result = await updateTripBudgetSafeAction(formData);
    showActionResult(result);
    if (result.ok) {
      setDirty(false);
      router.refresh();
    }
  }

  return (
    <Card className="overflow-hidden border-primary/20" data-testid="trip-budget-workspace">
      <CardHeader className="bg-gradient-to-br from-primary/15 via-card to-card">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Trip budget</p><h1 data-trip-workspace-title tabIndex={-1} className="mt-2 text-pretty text-xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">비용 확정과 1/N 정산</h1><p className="mt-2 text-sm text-muted-foreground">선택 결과를 기준으로 실제 결제 금액과 추가 비용을 정리하세요.</p></div>
          <ReceiptText className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <form action={saveBudget} onChange={() => setDirty(true)} className="space-y-6">
          <input type="hidden" name={editToken ? "editToken" : shareToken ? "shareToken" : "tripId"} value={editToken ?? shareToken ?? trip.id} />
          <input type="hidden" name="extras" value={JSON.stringify(budget.extras)} />

          <section aria-labelledby="budget-choices-title">
            <div className="mb-3"><h2 id="budget-choices-title" className="font-black">현재 선택</h2><p className="mt-1 text-xs text-muted-foreground">선택을 바꾸려면 해당 작업공간으로 이동하세요.</p></div>
            <div className="grid gap-2 sm:grid-cols-2">
              <ChoiceSummary label="리프트권" value={liftLabel} href={`${basePath}?view=rental_lift#lift`} />
              <ChoiceSummary label="렌탈샵·상품" value={rentalLabel} href={`${basePath}?view=rental_lift`} />
              <ChoiceSummary label="교통" value={transportLabels[trip.transportType] ?? trip.transportType} href={`${basePath}?view=transport`} />
              <ChoiceSummary label="숙소" value={trip.lodgingName ?? "아직 정하지 않았어요"} href={`${basePath}?view=lodging`} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-black">예상 비용을 실제 금액으로 확정</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {budgetCostKeys.map(({ key, label }) => { const item = totals.items.find(candidate => candidate.key === key); return (
                <Field key={key} label={`${label} · ${budget.overrides[key] !== undefined ? "확정" : item ? `예상 ${formatCurrency(item.amount)}` : "직접 입력"}`}>
                  <Input name={`${key}Override`} type="number" min={0} inputMode="numeric" defaultValue={budget.overrides[key]} placeholder={item ? String(item.amount) : "0"} onChange={event => setBudget(current => ({ ...current, overrides: { ...current.overrides, [key]: event.target.value === "" ? undefined : Number(event.target.value) } }))} />
                </Field>
              ); })}
            </div>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3"><div><h2 className="font-black">추가 비용</h2><p className="text-xs text-muted-foreground">식비, 기름값, 주차비처럼 여행마다 달라지는 비용을 더하세요.</p></div>{canEdit ? <Button type="button" variant="secondary" className="h-9 px-3" onClick={addExpense}><Plus className="h-4 w-4" /> 추가</Button> : null}</div>
            <div className="space-y-2">
              {budget.extras.map((expense, index) => <div key={expense.id} className="grid grid-cols-[110px_1fr_110px_40px] gap-2 max-sm:grid-cols-[100px_1fr_40px]">
                <SelectField value={expense.category} onValueChange={value => { setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, category: value as TripExpenseCategory } : item) })); setDirty(true); }} options={categories} />
                <Input aria-label="비용 이름" value={expense.title} placeholder="비용 이름" onChange={event => setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, title: event.target.value } : item) }))} />
                <Input className="max-sm:col-span-2" aria-label="금액" type="number" min={0} value={expense.amount} onChange={event => setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, amount: Number(event.target.value) } : item) }))} />
                <Button type="button" className="h-10 w-10 p-0" variant="ghost" aria-label="비용 삭제" onClick={() => { setBudget(current => ({ ...current, extras: current.extras.filter((_, i) => i !== index) })); setDirty(true); }}><Trash2 className="h-4 w-4" /></Button>
              </div>)}
              {!budget.extras.length ? <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">아직 추가 비용이 없어요.</p> : null}
            </div>
          </section>

          <div className="rounded-2xl bg-foreground p-5 text-background">
            <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold opacity-70">현재 여행 총액</p><p className="mt-1 text-3xl font-black tabular-nums">{formatCurrency(totals.total)}</p></div><div className="text-right"><p className="text-xs font-bold opacity-70">1인당</p><p className="mt-1 text-xl font-black text-primary">{formatCurrency(totals.perPerson)}</p></div></div>
            <div className="mt-4 flex items-center gap-3 border-t border-background/20 pt-4"><Users className="h-4 w-4" /><label htmlFor="splitCount" className="text-sm font-bold">몇 명이 나눌까요?</label><Input id="splitCount" name="splitCount" type="number" min={1} max={100} value={splitCount} onChange={event => setSplitCount(Number(event.target.value))} className="ml-auto w-20 border-background/30 bg-background/10 text-background" /></div>
          </div>
          {canEdit && dirty ? <div className="sticky bottom-3 z-20 flex items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-card/95 p-3 shadow-2xl backdrop-blur" aria-live="polite"><div className="min-w-0"><p className="text-sm font-black">저장하지 않은 변경사항</p><p className="truncate text-xs text-muted-foreground">실제 금액과 정산 정보를 저장하세요.</p></div><SubmitButton className="shrink-0" pendingText="저장 중…">변경사항 저장</SubmitButton></div> : null}
        </form>
      </CardContent>
    </Card>
  );
}

function ChoiceSummary({ label, value, href }: { label: string; value: string; href: string }) {
  return <div className="flex min-w-0 items-center gap-3 rounded-xl border bg-muted/40 p-3"><div className="min-w-0 flex-1"><p className="text-xs font-bold text-muted-foreground">{label}</p><p className="mt-1 truncate text-sm font-black">{value}</p></div><Link href={href} aria-label={`${label} 변경`} className="inline-flex min-h-9 shrink-0 items-center gap-1 rounded-lg px-2 text-xs font-black text-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">변경 <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" /></Link></div>;
}
