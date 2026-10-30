"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, BusFront, Check, Clock3, ExternalLink, Shirt, Sparkles } from "lucide-react";
import { updateTripDecisionSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { PlaceComparisonMap, type PlaceCandidate } from "@/components/place-comparison-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { NearbyLodging } from "@/data/resort-map";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";
import type { RentalPriceRule, RentalShop } from "@/lib/types";
import { liftTicketSavings } from "@/lib/pricing";
import type { TripDecisionView } from "@/lib/trip-workspace";
import { sortRentalComparisonGroups, type RentalComparisonSort } from "@/lib/rental-comparison";
import { formatCurrency } from "@/lib/utils";
import { DailyRentalChoices } from "@/components/trip/daily-rental-choices";
import { TripSkiPlanEditor } from "@/components/trip/trip-ski-plan-editor";
import { TripLodgingPlan } from "@/components/trip/trip-lodging-plan";
import { TripTransportPlan } from "@/components/trip/trip-transport-plan";
import { timeSlotLabels } from "@/lib/constants";
import { tripDayTypeLabel, type TripSkiPlan } from "@/lib/trip-ski-plan";

type Trip = { id: string; resortId: string; visitDate: Date; endDate: Date; peopleCount: number; rideType: "ski" | "snowboard"; skiPlan: TripSkiPlan; selectedRentalOptionId: string | null; selectedLiftTicketOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; shuttleRouteId: string | null; shuttleStopId: string | null; lodgingName: string | null; lodgingUrl: string | null; lodgingCostInput: number | null };
type RentalGroup = { shop: RentalShop; options: RentalPriceRule[] };
type RentalFilter = "all" | "verified" | "pickup" | "clothing" | "lift";

export function TripDecisionWorkspace({ view, trip, rentalGroups, lodgingOptions, liftUrl, shuttleUrl, lodgingSearchUrl, editToken, shareToken, canEdit = true }: { view: TripDecisionView; trip: Trip; rentalGroups: RentalGroup[]; lodgingOptions: NearbyLodging[]; liftUrl?: string; shuttleUrl?: string; lodgingSearchUrl?: string; editToken?: string; shareToken?: string; canEdit?: boolean }) {
  const router = useRouter();
  const access = editToken ? { name: "editToken", value: editToken } : shareToken ? { name: "shareToken", value: shareToken } : { name: "tripId", value: trip.id };
  const [filter, setFilter] = useState<RentalFilter>("all");
  const [sort, setSort] = useState<RentalComparisonSort>("verified");
  const [rentalId, setRentalId] = useState<string | null>(trip.selectedRentalShopId ?? rentalGroups[0]?.shop.id ?? null);
  const [activeSkiDate, setActiveSkiDate] = useState(trip.skiPlan.days[0]?.date ?? trip.visitDate.toISOString().slice(0, 10));
  const activeSkiDay = trip.skiPlan.days.find(day => day.date === activeSkiDate) ?? trip.skiPlan.days[0];
  const rentalListRef = useRef<HTMLDivElement | null>(null);
  const filtered = useMemo(() => sortRentalComparisonGroups(rentalGroups
    .filter(({ shop }) => filter === "all" || (filter === "verified" && shop.dataStatus === "verified_25_26") || (filter === "pickup" && shop.pickupAvailable) || (filter === "clothing" && shop.clothingRentalAvailable) || (filter === "lift" && shop.liftTicketSalesAvailable)), sort, activeSkiDay?.rentalShopId), [activeSkiDay?.rentalShopId, filter, rentalGroups, sort]);
  const shuttleRoutes = useMemo(() => getSkiShuttleRoutes(trip.resortId), [trip.resortId]);
  const shuttleCoverage = useMemo(() => getSkiShuttleCoverage({ id: trip.resortId, shuttleUrl, lastCheckedAt: "2026-07-17" }, shuttleRoutes), [shuttleRoutes, shuttleUrl, trip.resortId]);
  const workspaceCopy = view === "rental_lift"
    ? { eyebrow: "Daily gear plan", title: "날짜마다 필요한 장비만 골라요", description: "스키를 탈 날짜와 시간을 먼저 정한 뒤, 장비·의류·리프트권을 날짜별로 비교하세요." }
    : view === "lodging"
      ? { eyebrow: "Stay", title: "머무를 곳에만 집중해요", description: "공식 리조트 숙소와 호텔을 나눠 비교하고, 객실 판매 현황과 실제 숙박 정보를 기록하세요." }
      : { eyebrow: "Getting there", title: "가는 방법을 구체적으로 정해요", description: "가는 길의 탑승지와 돌아오는 길의 귀가 하차지를 구간별로 확인하세요." };
  const selectRentalFromMap = useCallback((id: string) => {
    setRentalId(id);
    window.requestAnimationFrame(() => {
      const card = rentalListRef.current?.querySelector<HTMLElement>(`[data-rental-shop-id="${id}"]`);
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      card?.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "nearest" });
      card?.focus({ preventScroll: true });
    });
  }, []);
  async function save(data: FormData) { const result = await updateTripDecisionSafeAction(data); showActionResult(result); if (result.ok) router.refresh(); }
  const toCandidate = (id: string, name: string, typeOrAddress?: "rental" | "lodging" | string, addressOrLatitude?: string | number, latitudeOrLongitude?: number, longitudeOrUrl?: number | string, externalMapUrl?: string): PlaceCandidate => {
    const typed = typeOrAddress === "rental" || typeOrAddress === "lodging";
    const type = typed ? typeOrAddress : "lodging";
    const address = typed ? (addressOrLatitude as string | undefined) : typeOrAddress;
    const latitude = typed ? latitudeOrLongitude : (addressOrLatitude as number | undefined);
    const longitude = typed ? (longitudeOrUrl as number | undefined) : latitudeOrLongitude;
    const mapUrl = typed ? externalMapUrl : (longitudeOrUrl as string | undefined);
    return { id, name, type, address, latitude, longitude, searchQuery: `${name} ${address ?? ""}`.trim(), externalMapUrl: mapUrl };
  };

  return <div className="space-y-5" data-testid="trip-decision-workspace">
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-5 sm:p-6"><div className="flex items-start gap-4"><span className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{workspaceCopy.eyebrow}</p><h1 data-trip-workspace-title tabIndex={-1} className="mt-1 text-pretty text-2xl font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{workspaceCopy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{workspaceCopy.description}</p></div></div></section>

    {view === "rental_lift" ? <>
    <DecisionSection id="schedule" title="스키 일정" description="숙박 기간과 실제 스키를 탈 날짜는 다를 수 있어요. 날짜별 이용 시간을 먼저 정하세요." icon={<Clock3 />}>
      <TripSkiPlanEditor trip={trip} editToken={editToken} shareToken={shareToken} canEdit={canEdit} />
    </DecisionSection>
    <DecisionSection id="rental" title="렌탈샵과 상품" description="위치, 제공 품목, 시즌 가격과 원문을 한 화면에서 비교하세요." icon={<Shirt />}>
      <div className="mb-4">
        <p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">설정할 스키 날짜</p>
        <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="날짜별 렌탈 계획">
          {trip.skiPlan.days.map(day => <button key={day.date} type="button" role="tab" aria-selected={activeSkiDate === day.date} onClick={() => { setActiveSkiDate(day.date); setRentalId(day.rentalShopId ?? rentalGroups[0]?.shop.id ?? null); }} className={`min-h-11 shrink-0 cursor-pointer rounded-xl border px-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${activeSkiDate === day.date ? "border-primary bg-primary text-primary-foreground" : "bg-card hover:bg-muted"}`}><span className="block text-xs font-black">{new Intl.DateTimeFormat("ko-KR", { month: "numeric", day: "numeric", weekday: "short", timeZone: "UTC" }).format(new Date(`${day.date}T00:00:00Z`))}</span><span className={`mt-0.5 block text-[11px] ${activeSkiDate === day.date ? "text-primary-foreground/75" : "text-muted-foreground"}`}>{tripDayTypeLabel(day.date)} · {timeSlotLabels[day.timeSlot]}</span></button>)}
        </div>
      </div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 overflow-x-auto pb-1" aria-label="렌탈샵 필터">{([['all','전체'],['verified','가격 확인'],['pickup','픽업'],['clothing','의류'],['lift','리프트권']] as const).map(([value,label]) => <Button key={value} type="button" variant={filter === value ? "primary" : "secondary"} className="h-9 shrink-0 px-3 text-xs hover:translate-y-0" onClick={() => setFilter(value)}>{label}</Button>)}</div><div className="w-full sm:w-36"><SelectField name="rentalSort" ariaLabel="렌탈샵 정렬" value={sort} onValueChange={(value) => setSort(value as RentalComparisonSort)} options={[{value:"verified",label:"검증순"},{value:"distance",label:"거리순"},{value:"price",label:"가격순"}]} /></div></div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]">
        <PlaceComparisonMap candidates={filtered.map(({shop}) => toCandidate(shop.id, shop.name, "rental", shop.address, shop.latitude, shop.longitude, shop.mapLinks?.kakao ?? shop.mapLinks?.naver))} selectedId={rentalId} onSelect={selectRentalFromMap} />
        <div ref={rentalListRef} className="max-h-[720px] space-y-3 overflow-y-auto pr-1">{activeSkiDay && filtered.length ? filtered.map(({ shop, options }) => { const selected = rentalId === shop.id; const saved = activeSkiDay.rentalShopId === shop.id; return <div key={shop.id} data-rental-shop-id={shop.id} tabIndex={-1} className={`rounded-2xl border bg-transparent text-card-foreground ${selected ? "border-primary ring-1 ring-primary/40" : "border-border"}`}><CardHeader className="cursor-pointer pb-3" onClick={() => setRentalId(shop.id)}><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{shop.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{shop.distanceMinutes !== undefined ? `리조트에서 약 ${shop.distanceMinutes}분` : "지도에서 위치 확인"}</p></div>{saved ? <span className="rounded-full bg-primary p-1.5 text-primary-foreground"><Check className="h-3.5 w-3.5" /></span> : null}</div></CardHeader>{selected ? <CardContent><DailyRentalChoices shop={shop} options={options} day={activeSkiDay} peopleCount={trip.peopleCount} rideType={trip.rideType} access={access} save={save} canEdit={canEdit} /></CardContent> : null}</div>; }) : <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">{activeSkiDay ? "조건에 맞는 업체가 없습니다." : "먼저 스키를 탈 날짜를 저장해 주세요."}</p>}</div>
      </div>
    </DecisionSection>

    <DecisionSection id="lift" title="공식 리조트 리프트권" description="선택한 날짜에 렌탈샵 할인권 대신 공식 시간권을 적용하세요." icon={<Clock3 />}>{activeSkiDay ? <><div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">{activeSkiDay.date} · {tripDayTypeLabel(activeSkiDay.date)} 조건입니다. 공식권을 저장하면 이 날짜의 할인권만 해제됩니다.</div><form action={save} className="space-y-3"><AccessInput access={access} /><input type="hidden" name="decision" value="lift_day" /><input type="hidden" name="skiDate" value={activeSkiDay.date} /><SelectField name="liftTicketTimeSlot" ariaLabel={`${activeSkiDay.date} 공식 리프트권 시간`} defaultValue={activeSkiDay.timeSlot} options={Object.entries(timeSlotLabels).filter(([value]) => value !== "all").map(([value,label]) => ({value,label}))} /><div className="flex gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">이 날짜에 공식권 적용</SubmitButton> : null}{liftUrl ? <ExternalButton href={liftUrl}>공식 판매처</ExternalButton> : null}</div></form></> : <p className="text-sm text-muted-foreground">먼저 스키 날짜를 저장해 주세요.</p>}</DecisionSection>
    </> : null}

    {view === "lodging" ?
    <DecisionSection id="lodging" title="숙박 밤별 계획" description="체크인하는 밤마다 숙소와 실제 확인한 1박 비용을 기록하세요. 같은 숙소는 한 번에 적용할 수 있습니다." icon={<BedDouble />}>
      <TripLodgingPlan resortId={trip.resortId} plan={trip.skiPlan} lodgingOptions={lodgingOptions} lodgingSearchUrl={lodgingSearchUrl} access={access} save={save} canEdit={canEdit} />
    </DecisionSection>
    : null}

    {view === "transport" ? <DecisionSection id="transport" title="왕복 교통" description="가는 날과 돌아오는 날의 이동수단을 따로 정하세요. 같은 조건이면 한 번에 적용할 수 있습니다." icon={<BusFront />}><TripTransportPlan plan={trip.skiPlan} routes={shuttleRoutes} coverage={shuttleCoverage} access={access} save={save} canEdit={canEdit} /></DecisionSection> : null}
  </div>;
}

function RentalShopChoices({ shop, options, trip, access, save, canEdit }: { shop: RentalShop; options: RentalPriceRule[]; trip: Trip; access: { name: string; value: string }; save: (data: FormData) => Promise<void>; canEdit: boolean }) {
  const rentalOptions = options.filter(option => option.itemType !== "lift_ticket");
  const liftOptions = options.filter(option => option.itemType === "lift_ticket");
  const initialLiftId = liftOptions.some(option => option.id === trip.selectedLiftTicketOptionId) ? trip.selectedLiftTicketOptionId! : liftOptions[0]?.id;
  const [liftId, setLiftId] = useState(initialLiftId);
  const selectedLift = liftOptions.find(option => option.id === liftId);
  const savings = selectedLift ? liftTicketSavings(selectedLift, trip.visitDate.toISOString().slice(0, 10)) : null;
  return <div className="space-y-4"><div className="flex flex-wrap gap-1.5 text-[11px] font-bold">{shop.dataStatus === "verified_25_26" ? <Tag>25/26 가격 확인</Tag> : <Tag>가격 원문 확인</Tag>}{shop.pickupAvailable ? <Tag>픽업</Tag> : null}{shop.clothingRentalAvailable ? <Tag>의류</Tag> : null}{liftOptions.length ? <Tag>할인 리프트권</Tag> : null}</div>
    <div className="rounded-xl border p-3"><p className="mb-2 text-xs font-black uppercase tracking-wider text-muted-foreground">장비·의류 렌탈</p>{rentalOptions.length ? <form action={save} className="grid gap-2"><AccessInput access={access} /><input type="hidden" name="decision" value="rental" /><SelectField name="selectedRentalOptionId" ariaLabel={`${shop.name} 장비·의류 상품`} defaultValue={rentalOptions.some(option => option.id === trip.selectedRentalOptionId) ? trip.selectedRentalOptionId! : rentalOptions[0].id} options={rentalOptions.map(option => ({ value: option.id, label: `${option.label} · ${option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}` }))} />{canEdit ? <SubmitButton variant="secondary" pendingText="저장 중…">렌탈 상품 저장</SubmitButton> : null}</form> : <p className="text-xs leading-5 text-muted-foreground">공개된 장비·의류 가격이 없습니다.</p>}</div>
    <div className="rounded-xl border border-primary/25 bg-primary/5 p-3"><p className="mb-2 text-xs font-black uppercase tracking-wider text-primary">할인 리프트권</p>{liftOptions.length ? <form action={save} className="grid gap-2"><AccessInput access={access} /><input type="hidden" name="decision" value="discounted_lift" /><SelectField name="selectedLiftTicketOptionId" ariaLabel={`${shop.name} 할인 리프트권`} value={liftId} onValueChange={setLiftId} options={liftOptions.map(option => ({ value: option.id, label: `${option.label} · ${option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}` }))} />{savings ? <div className="rounded-lg bg-background/80 p-3" aria-live="polite"><div className="flex items-end justify-between gap-3"><div><p className="text-[11px] font-bold text-muted-foreground">공식 {formatCurrency(savings.officialPrice)}</p><p className="text-lg font-black text-primary">{formatCurrency(savings.shopPrice)}</p></div><span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-xs font-black text-emerald-700 dark:text-emerald-300">{savings.discountRate}% 절감</span></div><p className="mt-2 text-xs font-semibold">1인 {formatCurrency(savings.savedPerPerson)} · {trip.peopleCount}명 총 {formatCurrency(savings.savedPerPerson * trip.peopleCount)} 절감</p></div> : <p className="rounded-lg bg-background/80 p-3 text-xs leading-5 text-muted-foreground">같은 시간대 공식 가격이 확인된 경우에만 절감액을 표시합니다.</p>}{canEdit ? <SubmitButton pendingText="저장 중…">할인권 저장</SubmitButton> : null}</form> : <p className="text-xs leading-5 text-muted-foreground">공개된 할인 리프트권이 없습니다. 아래 공식권을 선택해 주세요.</p>}</div>
    <SourceLinks mapUrl={shop.mapLinks?.kakao ?? shop.mapLinks?.naver} siteUrl={shop.url} />
  </div>;
}

function AccessInput({ access }: { access: { name: string; value: string } }) { return <input type="hidden" name={access.name} value={access.value} />; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{children}</span>; }
function SourceLinks({ mapUrl, siteUrl }: { mapUrl?: string; siteUrl?: string }) { return <div className="flex gap-2">{mapUrl ? <ExternalButton href={mapUrl}>지도</ExternalButton> : null}{siteUrl ? <ExternalButton href={siteUrl}>가격·예약 원문</ExternalButton> : null}</div>; }
function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer"><Button type="button" variant="secondary" className="h-9 px-3 text-xs">{children} <ExternalLink className="h-3.5 w-3.5" /></Button></a>; }
function DecisionSection({ id, title, description, icon, children }: { id: string; title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) { return <section id={id} className="scroll-mt-28 rounded-2xl border bg-card p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start gap-3"><span className="rounded-xl bg-muted p-2.5 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><h2 data-trip-workspace-anchor-title tabIndex={-1} className="text-lg font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>{children}</section>; }
