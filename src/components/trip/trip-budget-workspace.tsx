"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Plus, ReceiptText, Trash2, Users } from "lucide-react";
import { updateTripBudgetSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  lodgingUrl: string | null;
  splitCount: number;
  budgetData: TripBudgetState;
  selectedRecommendation: unknown;
  resortId: string;
  liftTicketTimeSlot: string;
  selectedRentalOptionId: string | null;
  transportType: string;
};

const categories: Array<{ value: TripExpenseCategory; label: string }> = [
  { value: "meal", label: "식비" }, { value: "fuel", label: "주유" }, { value: "toll", label: "통행료" },
  { value: "parking", label: "주차" }, { value: "transport", label: "추가 교통" }, { value: "other", label: "기타" }
];

function recommendationCost(value: unknown): CostEstimate | null {
  if (!value || typeof value !== "object" || !("cost" in value)) return null;
  return (value as { cost?: CostEstimate }).cost ?? null;
}

export function TripBudgetWorkspace({ trip, editToken, shareToken, canEdit = true, lodgingSearchUrl, rentalOptions }: {
  trip: BudgetTrip; editToken?: string; shareToken?: string; canEdit?: boolean; lodgingSearchUrl?: string;
  rentalOptions?: Array<{ value: string; label: string }>;
}) {
  const [budget, setBudget] = useState(trip.budgetData);
  const router = useRouter();
  const [splitCount, setSplitCount] = useState(trip.splitCount || trip.peopleCount);
  const totals = useMemo(() => calculateTripBudget(recommendationCost(trip.selectedRecommendation), budget, splitCount), [trip.selectedRecommendation, budget, splitCount]);
  const addExpense = () => setBudget(current => ({ ...current, extras: [...current.extras, { id: crypto.randomUUID(), category: "meal", title: "", amount: 0 }] }));

  return (
    <Card className="overflow-hidden border-primary/20" data-testid="trip-budget-workspace">
      <CardHeader className="bg-gradient-to-br from-primary/15 via-card to-card">
        <div className="flex items-start justify-between gap-3">
          <div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Trip budget</p><CardTitle className="mt-2">비용 확정과 1/N 정산</CardTitle><p className="mt-2 text-sm text-muted-foreground">추천 가격을 출발점으로 쓰고, 실제 결제 금액은 직접 덮어쓸 수 있어요.</p></div>
          <ReceiptText className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-4 sm:p-6">
        <form action={async formData => { formData.set("extras", JSON.stringify(budget.extras)); const result = await updateTripBudgetSafeAction(formData); showActionResult(result); if (result.ok) router.refresh(); }} className="space-y-6">
          <input type="hidden" name={editToken ? "editToken" : shareToken ? "shareToken" : "tripId"} value={editToken ?? shareToken ?? trip.id} />
          <input type="hidden" name="extras" value={JSON.stringify(budget.extras)} />

          <section>
            <h3 className="mb-3 font-black">이번 여행의 선택</h3>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-2"><label className="text-sm font-semibold">리프트권</label><SelectField name="liftTicketTimeSlot" ariaLabel="리프트권" defaultValue={trip.liftTicketTimeSlot} options={[{value:"2h",label:"2시간권"},{value:"3h",label:"3시간권"},{value:"4h",label:"4시간권"},{value:"6h",label:"6시간권"},{value:"night",label:"야간권"},{value:"full_day",label:"종일권"}]} /></div>
              <div className="space-y-2"><label className="text-sm font-semibold">교통</label><SelectField name="transportType" ariaLabel="교통" defaultValue={trip.transportType} options={[{value:"car",label:"자차"},{value:"shuttle",label:"셔틀"},{value:"bus",label:"버스"}]} /></div>
              <div className="space-y-2"><label className="text-sm font-semibold">렌탈샵·상품</label><SelectField name="selectedRentalOptionId" ariaLabel="렌탈샵·상품" defaultValue={trip.selectedRentalOptionId ?? "skip"} options={[{value:"skip",label:"렌탈하지 않음 / 나중에"}, ...(rentalOptions ?? [])]} /></div>
            </div>
          </section>

          <section>
            <h3 className="mb-3 font-black">예상 비용을 실제 금액으로 확정</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {totals.items.filter(item => ["lift_ticket", "rental", "transport"].includes(item.key)).map(item => (
                <Field key={item.key} label={`${item.label} · ${item.overridden ? "확정" : `예상 ${formatCurrency(item.amount)}`}`}>
                  <Input name={`${item.key}Override`} type="number" min={0} defaultValue={budget.overrides[item.key as keyof typeof budget.overrides]} placeholder={String(item.amount)} onChange={event => setBudget(current => ({ ...current, overrides: { ...current.overrides, [item.key]: event.target.value === "" ? undefined : Number(event.target.value) } }))} />
                </Field>
              ))}
            </div>
          </section>

          <section className="rounded-xl bg-muted/70 p-4">
            <div className="mb-3 flex items-center justify-between gap-3"><h3 className="font-black">숙소</h3>{lodgingSearchUrl ? <a className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline" href={lodgingSearchUrl} target="_blank" rel="noreferrer">숙소 확인 <ExternalLink className="h-3.5 w-3.5" /></a> : null}</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="숙소 이름"><Input name="lodgingName" defaultValue={trip.lodgingName ?? ""} placeholder="예: 예약한 펜션 이름" /></Field>
              <Field label="실제 숙박비"><Input name="lodgingOverride" type="number" min={0} defaultValue={budget.overrides.lodging} placeholder="예약 후 직접 입력" onChange={event => setBudget(current => ({ ...current, overrides: { ...current.overrides, lodging: event.target.value === "" ? undefined : Number(event.target.value) } }))} /></Field>
            </div>
            <Field label="예약/숙소 링크" className="mt-3"><Input name="lodgingUrl" type="url" defaultValue={trip.lodgingUrl ?? ""} placeholder="https://" /></Field>
          </section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3"><div><h3 className="font-black">추가 비용</h3><p className="text-xs text-muted-foreground">식비, 기름값, 주차비처럼 여행마다 달라지는 비용을 더하세요.</p></div>{canEdit ? <Button type="button" variant="secondary" className="h-9 px-3" onClick={addExpense}><Plus className="h-4 w-4" /> 추가</Button> : null}</div>
            <div className="space-y-2">
              {budget.extras.map((expense, index) => <div key={expense.id} className="grid grid-cols-[110px_1fr_110px_40px] gap-2 max-sm:grid-cols-[100px_1fr_40px]">
                <SelectField value={expense.category} onValueChange={value => setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, category: value as TripExpenseCategory } : item) }))} options={categories} />
                <Input aria-label="비용 이름" value={expense.title} placeholder="비용 이름" onChange={event => setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, title: event.target.value } : item) }))} />
                <Input className="max-sm:col-span-2" aria-label="금액" type="number" min={0} value={expense.amount} onChange={event => setBudget(current => ({ ...current, extras: current.extras.map((item, i) => i === index ? { ...item, amount: Number(event.target.value) } : item) }))} />
                <Button type="button" className="h-10 w-10 p-0" variant="ghost" aria-label="비용 삭제" onClick={() => setBudget(current => ({ ...current, extras: current.extras.filter((_, i) => i !== index) }))}><Trash2 className="h-4 w-4" /></Button>
              </div>)}
              {!budget.extras.length ? <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">아직 추가 비용이 없어요.</p> : null}
            </div>
          </section>

          <div className="rounded-2xl bg-foreground p-5 text-background">
            <div className="flex items-end justify-between gap-3"><div><p className="text-xs font-bold opacity-70">현재 여행 총액</p><p className="mt-1 text-3xl font-black tabular-nums">{formatCurrency(totals.total)}</p></div><div className="text-right"><p className="text-xs font-bold opacity-70">1인당</p><p className="mt-1 text-xl font-black text-primary">{formatCurrency(totals.perPerson)}</p></div></div>
            <div className="mt-4 flex items-center gap-3 border-t border-background/20 pt-4"><Users className="h-4 w-4" /><label htmlFor="splitCount" className="text-sm font-bold">몇 명이 나눌까요?</label><Input id="splitCount" name="splitCount" type="number" min={1} max={100} value={splitCount} onChange={event => setSplitCount(Number(event.target.value))} className="ml-auto w-20 border-background/30 bg-background/10 text-background" /></div>
          </div>
          {canEdit ? <SubmitButton className="w-full" pendingText="저장 중…">저장하기</SubmitButton> : null}
        </form>
      </CardContent>
    </Card>
  );
}
