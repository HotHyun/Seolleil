import type { CostEstimate } from "@/lib/types";

export type TripExpenseCategory = "meal" | "fuel" | "toll" | "parking" | "transport" | "lodging" | "other";

export type TripExtraExpense = {
  id: string;
  category: TripExpenseCategory;
  title: string;
  amount: number;
  memo?: string;
};

export type TripBudgetState = {
  overrides: Partial<Record<"lift_ticket" | "rental" | "transport" | "lodging", number>>;
  extras: TripExtraExpense[];
};

export const EMPTY_TRIP_BUDGET: TripBudgetState = { overrides: {}, extras: [] };

export function parseTripBudget(value: unknown): TripBudgetState {
  if (!value || typeof value !== "object") return EMPTY_TRIP_BUDGET;
  const candidate = value as Partial<TripBudgetState>;
  const overrides = Object.fromEntries(
    Object.entries(candidate.overrides ?? {}).filter(([, amount]) => Number.isFinite(amount) && Number(amount) >= 0)
  ) as TripBudgetState["overrides"];
  const extras = Array.isArray(candidate.extras)
    ? candidate.extras.filter((item): item is TripExtraExpense => Boolean(item?.id && item?.title && Number.isFinite(item.amount) && item.amount >= 0))
    : [];
  return { overrides, extras };
}

export function calculateTripBudget(cost: CostEstimate | null, budget: TripBudgetState, splitCount: number) {
  const baseItems = cost?.items ?? [];
  const items = baseItems.map((item) => ({
    key: item.key,
    label: item.label,
    amount: budget.overrides[item.key as keyof TripBudgetState["overrides"]] ?? item.representative ?? item.min ?? 0,
    overridden: budget.overrides[item.key as keyof TripBudgetState["overrides"]] !== undefined,
    confidence: item.confidence
  }));
  const baseKeys = new Set(baseItems.map(item => item.key));
  const overrideLabels = { lift_ticket: "리프트권", rental: "렌탈", transport: "교통비", lodging: "숙박비" } as const;
  for (const [key, amount] of Object.entries(budget.overrides)) {
    if (baseKeys.has(key) || amount === undefined) continue;
    items.push({ key, label: overrideLabels[key as keyof typeof overrideLabels], amount, overridden: true, confidence: "confirmed" });
  }
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const extrasTotal = budget.extras.reduce((sum, item) => sum + item.amount, 0);
  const total = subtotal + extrasTotal;
  const people = Math.max(1, Math.floor(splitCount || 1));
  return { items, subtotal, extrasTotal, total, splitCount: people, perPerson: Math.ceil(total / people) };
}
