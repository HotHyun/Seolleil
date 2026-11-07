"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, CopyCheck, ExternalLink, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import { liftTicketSavings } from "@/lib/pricing";
import { optionAppliesToDay, rentalPriceAvailability, tripDayTypeLabel, type SkiDayPlan } from "@/lib/trip-ski-plan";
import type { RentalPriceRule, RentalShop, RideType } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

type Access = { name: string; value: string };

export function DailyRentalChoices({ shop, options, day, peopleCount, rideType, access, save, canEdit }: {
  shop: RentalShop;
  options: RentalPriceRule[];
  day: SkiDayPlan;
  peopleCount: number;
  rideType: RideType;
  access: Access;
  save: (data: FormData) => Promise<void>;
  canEdit: boolean;
}) {
  const available = useMemo(() => options.filter(option => optionAppliesToDay(option, day)), [day, options]);
  const grouped = useMemo(() => ({
    equipment: available.filter(option => option.itemType === "equipment" && (option.rideType === "all" || rideType === "both" || option.rideType === rideType)),
    clothing: available.filter(option => option.itemType === "clothing"),
    packages: available.filter(option => option.itemType === "equipment_clothing_package"),
    accessories: available.filter(option => ["helmet", "goggles", "protective_gear"].includes(option.itemType)),
    liftOptions: available.filter(option => option.itemType === "lift_ticket")
  }), [available, rideType]);
  const { equipment, clothing, packages, accessories, liftOptions } = grouped;
  const priceAvailability = rentalPriceAvailability(options, day);
  const savedAtShop = day.rentalShopId === shop.id;
  const [mode, setMode] = useState<"individual" | "package">(savedAtShop && packages.some(option => option.id === day.packageOptionId) ? "package" : "individual");
  const [equipmentId, setEquipmentId] = useState(savedAtShop ? day.equipmentOptionId ?? "none" : "none");
  const [clothingId, setClothingId] = useState(savedAtShop ? day.clothingOptionId ?? "none" : "none");
  const [packageId, setPackageId] = useState(savedAtShop ? day.packageOptionId ?? packages[0]?.id ?? "none" : packages[0]?.id ?? "none");
  const [accessoryIds, setAccessoryIds] = useState<string[]>(savedAtShop ? day.accessoryOptionIds : []);
  const [liftId, setLiftId] = useState(savedAtShop && liftOptions.some(option => option.id === day.liftTicketOptionId) ? day.liftTicketOptionId! : liftOptions[0]?.id);
  const selectedLift = liftOptions.find(option => option.id === liftId);
  const savings = selectedLift ? liftTicketSavings(selectedLift, day.date) : null;
  const individualPrice = priceOf(equipment.find(option => option.id === equipmentId)) + priceOf(clothing.find(option => option.id === clothingId));
  const packagePrice = priceOf(packages.find(option => option.id === packageId));
  const packageSaving = individualPrice > 0 && packagePrice > 0 && individualPrice > packagePrice ? individualPrice - packagePrice : 0;

  useEffect(() => {
    const saved = day.rentalShopId === shop.id;
    setMode(saved && packages.some(option => option.id === day.packageOptionId) ? "package" : "individual");
    setEquipmentId(saved ? day.equipmentOptionId ?? "none" : "none");
    setClothingId(saved ? day.clothingOptionId ?? "none" : "none");
    setPackageId(saved ? day.packageOptionId ?? packages[0]?.id ?? "none" : packages[0]?.id ?? "none");
    setAccessoryIds(saved ? day.accessoryOptionIds : []);
    setLiftId(saved && liftOptions.some(option => option.id === day.liftTicketOptionId) ? day.liftTicketOptionId! : liftOptions[0]?.id);
  }, [day, liftOptions, packages, shop.id]);

  async function saveRental(data: FormData) {
    data.set("accessoryOptionIds", JSON.stringify(accessoryIds));
    data.set("equipmentOptionId", mode === "individual" ? equipmentId : "none");
    data.set("clothingOptionId", mode === "individual" ? clothingId : "none");
    data.set("packageOptionId", mode === "package" ? packageId : "none");
    await save(data);
  }

  return <div className="space-y-4">
    <div className="flex flex-wrap gap-1.5 text-[11px] font-bold">
      <Tag>{tripDayTypeLabel(day.date)} 가격</Tag>
      {priceAvailability === "outside_validity" ? <Tag>새 시즌 가격 미공개</Tag> : shop.dataStatus === "verified_25_26" ? <Tag>25/26 가격 확인</Tag> : <Tag>가격 원문 확인</Tag>}
      {shop.pickupAvailable ? <Tag>픽업</Tag> : null}
      {shop.clothingRentalAvailable ? <Tag>의류</Tag> : null}
    </div>

    {priceAvailability === "available" ? <form action={saveRental} className="space-y-3 rounded-xl border p-3">
      <AccessInput access={access} />
      <input type="hidden" name="decision" value="rental_day" />
      <input type="hidden" name="skiDate" value={day.date} />
      <input type="hidden" name="selectedRentalShopId" value={shop.id} />
      <input type="hidden" name="accessoryOptionIds" value="[]" />
      <div>
        <p className="text-xs font-black uppercase tracking-wider text-muted-foreground">장비와 의류</p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">품목을 따로 고르거나 샵의 결합 패키지를 선택하세요.</p>
      </div>
      {packages.length ? <div className="grid grid-cols-2 gap-2 rounded-lg bg-muted p-1" role="group" aria-label="렌탈 선택 방식">
        <ModeButton active={mode === "individual"} onClick={() => setMode("individual")}>개별 선택</ModeButton>
        <ModeButton active={mode === "package"} onClick={() => setMode("package")}>결합 패키지</ModeButton>
      </div> : null}
      {mode === "individual" ? <div className="grid gap-3 sm:grid-cols-2">
        <ChoiceField label="장비" value={equipmentId} onValueChange={setEquipmentId} options={equipment} empty="장비를 선택하세요" unavailable="선택한 이용 시간의 장비 가격 미확인" />
        <ChoiceField label="의류" value={clothingId} onValueChange={setClothingId} options={clothing} empty="의류 선택 안 함" unavailable="선택한 이용 시간의 의류 가격 미확인" />
      </div> : <div className="space-y-2">
        <ChoiceField label="장비 + 의류 패키지" value={packageId} onValueChange={setPackageId} options={packages} empty="패키지를 선택하세요" unavailable="선택한 이용 시간의 패키지 가격 미확인" required />
        {packageSaving > 0 ? <div className="flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-xs font-bold text-emerald-800 dark:text-emerald-200"><PackageCheck className="h-4 w-4" /> 개별 선택보다 1인 {formatCurrency(packageSaving)} 절약</div> : null}
      </div>}
      {accessories.length ? <div>
        <p className="mb-2 text-xs font-black">보호·추가 장비</p>
        <div className="flex flex-wrap gap-2">{accessories.map(option => {
          const checked = accessoryIds.includes(option.id);
          return <button key={option.id} type="button" aria-pressed={checked} onClick={() => setAccessoryIds(current => checked ? current.filter(id => id !== option.id) : [...current, option.id])} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg border px-3 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", checked ? "border-primary bg-primary/10 text-primary" : "bg-card hover:bg-muted")}>
            {checked ? <Check className="h-3.5 w-3.5" /> : null}{option.label} · {priceLabel(option)}
          </button>;
        })}</div>
      </div> : null}
      <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg bg-muted/60 px-3 text-sm font-semibold">
        <input name="applyToAllDays" type="checkbox" value="true" className="h-4 w-4 accent-primary" />
        <span><span className="block">다른 스키 날짜에도 적용</span><span className="block text-xs font-normal text-muted-foreground">같은 샵·품목에서 각 날짜의 이용 시간에 맞는 상품을 적용합니다.</span></span>
      </label>
      {canEdit ? <SubmitButton variant="secondary" className="w-full" pendingText="렌탈 저장 중…"><CopyCheck className="h-4 w-4" /> {day.date} 렌탈 저장</SubmitButton> : null}
    </form> : <RentalPriceUnavailable shop={shop} options={options} day={day} access={access} save={save} canEdit={canEdit} reason={priceAvailability} />}

    <div className="rounded-xl border border-primary/25 bg-primary/5 p-3">
      <p className="mb-2 text-xs font-black uppercase tracking-wider text-primary">이 날짜의 할인 리프트권</p>
      {liftOptions.length ? <form action={save} className="grid gap-2">
        <AccessInput access={access} />
        <input type="hidden" name="decision" value="discounted_lift_day" />
        <input type="hidden" name="skiDate" value={day.date} />
        <SelectField name="selectedLiftTicketOptionId" ariaLabel={`${shop.name} ${day.date} 할인 리프트권`} value={liftId} onValueChange={setLiftId} options={liftOptions.map(option => ({ value: option.id, label: `${option.label} · ${priceLabel(option)}` }))} />
        {savings ? <div className="rounded-lg bg-background/80 p-3" aria-live="polite"><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-bold text-muted-foreground">공식 {formatCurrency(savings.officialPrice)}</p><p className="text-lg font-black text-primary">{formatCurrency(savings.shopPrice)}</p></div><span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">{savings.discountRate}% 절감</span></div><p className="mt-2 text-xs font-semibold">1인 {formatCurrency(savings.savedPerPerson)} · {peopleCount}명 총 {formatCurrency(savings.savedPerPerson * peopleCount)} 절감</p></div> : null}
        {canEdit ? <SubmitButton pendingText="할인권 저장 중…">이 날짜에 할인권 적용</SubmitButton> : null}
      </form> : <p className="text-xs leading-5 text-muted-foreground">선택한 날짜·시간에 공개된 할인권이 없습니다.</p>}
    </div>
  </div>;
}

function ChoiceField({ label, value, onValueChange, options, empty, unavailable, required = false }: { label: string; value: string; onValueChange: (value: string) => void; options: RentalPriceRule[]; empty: string; unavailable: string; required?: boolean }) {
  if (!options.length) return <div><span className="mb-1.5 block text-xs font-black">{label}</span><div className="flex min-h-11 items-center rounded-xl border border-dashed bg-muted/30 px-3 text-sm font-semibold text-muted-foreground">{unavailable}</div></div>;
  return <label className="block"><span className="mb-1.5 block text-xs font-black">{label}</span><SelectField ariaLabel={label} value={value} onValueChange={onValueChange} options={[...(!required ? [{ value: "none", label: empty }] : []), ...options.map(option => ({ value: option.id, label: `${option.label} · ${priceLabel(option)}` }))]} /></label>;
}

function RentalPriceUnavailable({ shop, options, day, access, save, canEdit, reason }: { shop: RentalShop; options: RentalPriceRule[]; day: SkiDayPlan; access: Access; save: (data: FormData) => Promise<void>; canEdit: boolean; reason: "no_catalog" | "outside_validity" }) {
  const primary = options.filter(option => option.itemType === "equipment" || option.itemType === "clothing" || option.itemType === "equipment_clothing_package");
  const validFrom = primary.map(option => option.validFrom).sort()[0];
  const validTo = primary.map(option => option.validTo).sort().at(-1);
  const reference = (["equipment", "clothing", "equipment_clothing_package"] as const).flatMap(itemType => {
    const candidates = primary.filter(option => option.itemType === itemType && priceOf(option) > 0).sort((left, right) => priceOf(left) - priceOf(right));
    return candidates[0] ? [candidates[0]] : [];
  });
  const sourceUrl = shop.url ?? shop.sourceUrl;
  return <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-950 dark:text-amber-100">
    <div className="flex items-start gap-3"><CalendarClock aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0" /><div className="min-w-0"><p className="font-black">{reason === "outside_validity" ? `${formatDate(day.date)} 렌탈 가격 미공개` : "저장 가능한 렌탈 가격 미확인"}</p><p className="mt-1 text-xs font-medium leading-5 opacity-85">{reason === "outside_validity" ? `장비나 의류를 대여하지 않는다는 뜻이 아닙니다. 현재 가격 데이터는 ${validFrom}~${validTo} 기준이라 선택한 날짜의 비용과 상품으로 확정할 수 없어요.` : "장비나 의류를 제공하지 않는다는 뜻이 아닙니다. 공개된 시즌 가격표를 확인하지 못해 상품 선택 대신 원문 확인이 필요해요."}</p></div></div>
    {reference.length ? <div className="mt-3 rounded-lg bg-background/65 p-3"><p className="text-[11px] font-black uppercase tracking-wider opacity-70">지난 시즌 참고 가격</p><div className="mt-2 grid gap-1.5 text-xs sm:grid-cols-3">{reference.map(option => <div key={option.id}><span className="font-semibold">{referenceLabel(option.itemType)}</span> <span className="font-black">{priceLabel(option)}~</span></div>)}</div></div> : null}
    <div className="mt-3 flex flex-wrap gap-2">{sourceUrl ? <a href={sourceUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-amber-700/25 bg-background px-3 text-xs font-black text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">최신 가격 원문 <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" /></a> : null}{canEdit ? <form action={save}><AccessInput access={access} /><input type="hidden" name="decision" value="rental_day" /><input type="hidden" name="skiDate" value={day.date} /><input type="hidden" name="selectedRentalShopId" value={shop.id} /><input type="hidden" name="equipmentOptionId" value="none" /><input type="hidden" name="clothingOptionId" value="none" /><input type="hidden" name="packageOptionId" value="none" /><input type="hidden" name="accessoryOptionIds" value="[]" /><SubmitButton variant="secondary" pendingText="후보 저장 중…">이 날짜의 후보 샵으로 저장</SubmitButton></form> : null}</div>
  </div>;
}

function ModeButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return <Button type="button" variant={active ? "primary" : "ghost"} className="min-h-10 cursor-pointer hover:translate-y-0" aria-pressed={active} onClick={onClick}>{children}</Button>;
}

function priceOf(option?: RentalPriceRule) {
  return option?.representativePrice ?? option?.priceMin ?? 0;
}

function priceLabel(option: RentalPriceRule) {
  const price = priceOf(option);
  return price ? formatCurrency(price) : "원문 확인";
}

function referenceLabel(itemType: RentalPriceRule["itemType"]) {
  return itemType === "equipment" ? "장비" : itemType === "clothing" ? "의류" : "장비+의류";
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("ko-KR", { year: "numeric", month: "numeric", day: "numeric", timeZone: "UTC" }).format(new Date(`${date}T00:00:00Z`));
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{children}</span>;
}

function AccessInput({ access }: { access: Access }) {
  return <input type="hidden" name={access.name} value={access.value} />;
}
