"use client";

import { useMemo, useState } from "react";
import { Check } from "lucide-react";
import { RentalMapPicker, type RentalMapFilter, type RentalMapGroup } from "@/components/trip/rental-map-picker";
import { ShopPriceBreakdown } from "@/components/trip/rental-compare-parts";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { compareRentalShops } from "@/lib/rental-shop-comparison";
import type { SkiDayPlan } from "@/lib/trip-ski-plan";
import type { RideType } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";

type Access = { name: string; value: string };

// 첫 질문 "어디서 빌리고 리프트권을 살까요?"에 답하는 지도. 핀에는 예상 총액이, 카드에는 리프트권·장비·의류 가격과 공식 대비 절약액이 나온다.
export function RentalCompare({ resortId, groups, days, peopleCount, rideType, ownsEquipment, ownsClothing, savedShopId, canEdit, access, save }: {
  resortId: string;
  groups: RentalMapGroup[];
  days: SkiDayPlan[];
  peopleCount: number;
  rideType: RideType;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  savedShopId: string | null;
  canEdit: boolean;
  access: Access;
  save: (data: FormData) => Promise<boolean>;
}) {
  const needs = useMemo(() => ({ equipment: !ownsEquipment, clothing: !ownsClothing }), [ownsClothing, ownsEquipment]);
  const [filter, setFilter] = useState<RentalMapFilter>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showUnpriced, setShowUnpriced] = useState(false);

  const { baseline, results } = useMemo(() => compareRentalShops(groups, days, peopleCount, { rideType, needsEquipment: needs.equipment, needsClothing: needs.clothing }), [days, groups, needs, peopleCount, rideType]);
  const groupById = useMemo(() => new Map(groups.map(group => [group.shop.id, group])), [groups]);
  const resultById = useMemo(() => new Map(results.map(result => [result.shopId, result])), [results]);
  const visibleGroups = useMemo(() => results.flatMap(result => {
    const group = groupById.get(result.shopId);
    const shop = group?.shop;
    if (!group || !shop) return [];
    const matches = filter === "all" || (filter === "verified" && shop.dataStatus === "verified_25_26") || (filter === "pickup" && shop.pickupAvailable) || (filter === "clothing" && shop.clothingRentalAvailable) || (filter === "lift" && shop.liftTicketSalesAvailable);
    // 가격을 확인하지 못한 샵은 기본으로 숨겨 빈 가격이 지도에 늘어서지 않게 한다. 이미 고른 샵은 항상 보인다.
    const visibleByPrice = result.complete || showUnpriced || shop.id === savedShopId;
    return matches && visibleByPrice ? [group] : [];
  }), [filter, groupById, results, savedShopId, showUnpriced]);
  const unpricedCount = results.filter(result => !result.complete).length;
  const chosen = savedShopId ? resultById.get(savedShopId) : undefined;
  const chosenShop = savedShopId ? groupById.get(savedShopId)?.shop : undefined;
  const confirmShop = confirmId ? groupById.get(confirmId)?.shop : undefined;
  const confirmResult = confirmId ? resultById.get(confirmId) : undefined;

  async function confirm() {
    if (!confirmId || pending) return;
    setPending(true);
    const data = new FormData();
    data.set(access.name, access.value);
    data.set("decision", "rental_shop_plan");
    data.set("selectedRentalShopId", confirmId);
    try {
      if (await save(data)) { setConfirmId(null); setSelectedId(null); }
    } finally { setPending(false); }
  }

  if (!days.length) return <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">먼저 스키를 탈 날짜를 저장하면 샵별 가격을 비교해 드려요.</p>;

  return <div className="space-y-2.5" data-testid="rental-compare">
    {chosen?.complete && chosenShop ? <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-xl border border-emerald-500/40 bg-emerald-500/[0.06] px-3.5 py-2.5" role="status">
      <p className="flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200"><Check aria-hidden="true" className="h-4 w-4" />{chosenShop.name}으로 정했어요</p>
      <p className="text-sm font-semibold tabular-nums">{formatCurrency(chosen.total!)}{chosen.savings && chosen.savings.perPerson > 0 ? <span className="ml-2 text-emerald-800 dark:text-emerald-200">공식보다 {formatCurrency(chosen.savings.total)} 아낌</span> : null}</p>
    </div> : null}

    <RentalMapPicker resortId={resortId} groups={visibleGroups} results={resultById} people={peopleCount} needs={needs} savedShopId={savedShopId} selectedId={selectedId} onSelect={setSelectedId} filter={filter} onFilter={setFilter} canEdit={canEdit} onPick={setConfirmId} unpricedToggle={unpricedCount ? { count: unpricedCount, active: showUnpriced, onToggle: () => setShowUnpriced(value => !value) } : undefined} />

    <p className="text-xs leading-5 text-muted-foreground">
      {peopleCount}명 · {days.length}일 · 리프트권{needs.equipment ? " + 장비" : ""}{needs.clothing ? " + 의류" : ""} 렌탈 기준이에요.{" "}
      {baseline.perPerson !== null
        ? `공식 리조트 구성은 1인 ${formatCurrency(baseline.perPerson)}이에요.`
        : baseline.lift !== null ? `공식 렌탈 가격을 확인하지 못해 공식 리프트권(1인 ${formatCurrency(baseline.lift)})과 비교해요.` : "공식 가격을 확인하지 못해 샵끼리 총액만 비교해요."}
    </p>

    <Drawer open={Boolean(confirmShop && confirmResult)} onOpenChange={open => { if (!open && !pending) setConfirmId(null); }}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">{confirmShop?.name}으로 계속 진행할까요?</DrawerTitle>
        <DrawerDescription className="mb-4 mt-1 text-sm leading-6 text-muted-foreground">모든 스키 날짜에 가장 저렴한 기본 구성이 채워져요. 날짜별로 바꾸고 싶으면 아래 <strong className="font-semibold">날짜별 확정 현황</strong>에서 수정할 수 있어요.</DrawerDescription>
        {confirmResult ? <ShopPriceBreakdown result={confirmResult} people={peopleCount} needs={needs} /> : null}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button type="button" variant="secondary" className="h-11" onClick={() => setConfirmId(null)} disabled={pending}>다른 샵 더 보기</Button>
          <Button type="button" className="h-11" onClick={confirm} isLoading={pending} loadingText="적용 중…">이 샵으로 진행</Button>
        </div>
      </DrawerContent>
    </Drawer>
  </div>;
}
