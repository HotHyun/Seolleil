"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, BusFront, CalendarRange, ExternalLink, ListChecks } from "lucide-react";
import { updateTripDecisionSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { AffiliateNotice } from "@/components/affiliate-notice";
import { AnalyticsLink } from "@/components/analytics-link";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerDescription, DrawerTitle } from "@/components/ui/drawer";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { NearbyLodging } from "@/data/resort-map";
import { getSkiShuttleCoverage, getSkiShuttleRoutes } from "@/data/ski-shuttles";
import type { RentalPriceRule, RentalShop } from "@/lib/types";
import { liftTicketSavings } from "@/lib/pricing";
import type { TripDecisionView } from "@/lib/trip-workspace";
import { formatCurrency } from "@/lib/utils";
import { DailyRentalChoices } from "@/components/trip/daily-rental-choices";
import { NearbyPlaceHelp } from "@/components/nearby-place-help";
import { getResort } from "@/data/resorts";
import { DaySummaryPanel, formatSummaryDate } from "@/components/trip/day-summary-panel";
import { buildDaySummaries } from "@/lib/trip-day-summary";
import { TripSkiPlanEditor } from "@/components/trip/trip-ski-plan-editor";
import { LiftChoices } from "@/components/trip/day-lift-sheet";
import { RentalCompare } from "@/components/trip/rental-compare";
import { TripLodgingPlan } from "@/components/trip/trip-lodging-plan";
import { TripTransportPlan } from "@/components/trip/trip-transport-plan";
import type { TripSkiPlan } from "@/lib/trip-ski-plan";

type Trip = { id: string; resortId: string; ownsEquipment?: boolean; ownsClothing?: boolean; visitDate: Date; endDate: Date; peopleCount: number; rideType: "ski" | "snowboard" | "both"; skiPlan: TripSkiPlan; selectedRentalOptionId: string | null; selectedLiftTicketOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; shuttleRouteId: string | null; shuttleStopId: string | null; lodgingName: string | null; lodgingUrl: string | null; lodgingCostInput: number | null };
type RentalGroup = { shop: RentalShop; options: RentalPriceRule[] };

export function TripDecisionWorkspace({ view, trip, rentalGroups, lodgingOptions, liftUrl, shuttleUrl, lodgingSearchUrl, editToken, shareToken, canEdit = true }: { view: TripDecisionView; trip: Trip; rentalGroups: RentalGroup[]; lodgingOptions: NearbyLodging[]; liftUrl?: string; shuttleUrl?: string; lodgingSearchUrl?: string; editToken?: string; shareToken?: string; canEdit?: boolean }) {
  const router = useRouter();
  const access = editToken ? { name: "editToken", value: editToken } : shareToken ? { name: "shareToken", value: shareToken } : { name: "tripId", value: trip.id };
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editDate, setEditDate] = useState<string | null>(null);
  const [editTab, setEditTab] = useState<"rental" | "lift">("rental");
  const [editShopId, setEditShopId] = useState<string | null>(null);
  const editDay = trip.skiPlan.days.find(day => day.date === editDate);
  const editGroup = rentalGroups.find(group => group.shop.id === editShopId);
  const summaries = useMemo(() => buildDaySummaries(trip.resortId, trip.skiPlan, rentalGroups, trip.peopleCount), [rentalGroups, trip.peopleCount, trip.resortId, trip.skiPlan]);
  // 확정 현황에서 날짜를 고르면 그 날짜의 렌탈샵·상품·리프트권을 고치는 시트를 연다.
  const openEdit = useCallback((date: string) => {
    const day = trip.skiPlan.days.find(item => item.date === date);
    setEditDate(date);
    setEditTab("rental");
    setEditShopId(day?.rentalShopId ?? rentalGroups[0]?.shop.id ?? null);
  }, [rentalGroups, trip.skiPlan.days]);
  const resortName = getResort(trip.resortId)?.name ?? "스키장";
  const shuttleRoutes = useMemo(() => getSkiShuttleRoutes(trip.resortId), [trip.resortId]);
  const shuttleCoverage = useMemo(() => getSkiShuttleCoverage({ id: trip.resortId, shuttleUrl, lastCheckedAt: "2026-07-17" }, shuttleRoutes), [shuttleRoutes, shuttleUrl, trip.resortId]);
  const workspaceCopy = view === "rental_lift"
    ? { title: "어디서 빌리고 리프트권을 살까요?", description: "샵마다 리프트권과 장비·의류를 합친 예상 총액을 공식 리조트와 비교했어요. 핀을 눌러 정하세요." }
    : view === "lodging"
      ? { title: "머무를 곳에만 집중해요", description: "공식 리조트 숙소와 호텔을 나눠 비교하고, 객실 판매 현황과 실제 숙박 정보를 기록하세요." }
      : { title: "가는 방법을 구체적으로 정해요", description: "가는 길의 탑승지와 돌아오는 길의 귀가 하차지를 구간별로 확인하세요." };
  async function saveDecision(data: FormData) { const result = await updateTripDecisionSafeAction(data); showActionResult(result); if (result.ok) router.refresh(); return result.ok; }
  async function save(data: FormData) { await saveDecision(data); }

  return <div className="space-y-5" data-testid="trip-decision-workspace">
    <header className="border-b pb-5"><h1 data-trip-workspace-title tabIndex={-1} className="mt-1 text-pretty text-2xl font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{workspaceCopy.title}</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{workspaceCopy.description}</p></header>

    {view === "rental_lift" ? <>
    <section id="compare" className="scroll-mt-28">
      {trip.skiPlan.days.length ? <RentalCompare resortId={trip.resortId} groups={rentalGroups} days={trip.skiPlan.days} peopleCount={trip.peopleCount} rideType={trip.rideType} ownsEquipment={Boolean(trip.ownsEquipment)} ownsClothing={Boolean(trip.ownsClothing)} savedShopId={trip.skiPlan.days[0]?.rentalShopId ?? null} canEdit={canEdit} access={access} save={saveDecision} /> : <div className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">먼저 스키를 탈 날짜를 저장해 주세요.{canEdit ? <Button type="button" variant="secondary" className="ml-2 h-9" onClick={() => setScheduleOpen(true)}>일정 정하기</Button> : null}</div>}
      <NearbyPlaceHelp resortName={resortName} kind="rental" className="mt-3" />
    </section>

    <DecisionSection id="summary" title="날짜별 확정 현황" description="렌탈샵, 장비·의류, 리프트권이 날짜마다 어떻게 정해졌고 얼마인지 확인하고, 달라지는 날은 여기서 수정하세요." icon={<ListChecks />}>
      {canEdit ? <div className="mb-3 flex justify-end"><Button type="button" variant="secondary" className="h-10 gap-1.5 px-3 text-xs" onClick={() => setScheduleOpen(true)}><CalendarRange aria-hidden="true" className="h-4 w-4" />스키 일정 수정</Button></div> : null}
      <DaySummaryPanel summaries={summaries} peopleCount={trip.peopleCount} onSelectDay={openEdit} canEdit={canEdit} />
    </DecisionSection>
    <AffiliateNotice />

    <Drawer open={scheduleOpen} onOpenChange={setScheduleOpen}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">스키 일정 수정</DrawerTitle>
        <DrawerDescription className="mb-4 mt-1 text-sm text-muted-foreground">숙박 기간과 실제 스키를 탈 날짜는 다를 수 있어요. 날짜별 이용 시간을 정하세요.</DrawerDescription>
        <TripSkiPlanEditor trip={trip} editToken={editToken} shareToken={shareToken} canEdit={canEdit} />
      </DrawerContent>
    </Drawer>

    <Drawer open={Boolean(editDay)} onOpenChange={open => { if (!open) setEditDate(null); }}>
      <DrawerContent className="lg:mx-auto lg:max-w-xl">
        <DrawerTitle className="text-lg font-semibold">{editDay ? formatSummaryDate(editDay.date) : ""} 수정</DrawerTitle>
        <DrawerDescription className="mb-3 mt-1 text-sm text-muted-foreground">이 날짜만 렌탈샵·상품이나 리프트권을 바꿔요. 다른 날짜에도 같이 적용하려면 저장할 때 옵션을 켜세요.</DrawerDescription>
        {editDay ? <>
          <div className="mb-4 grid grid-cols-2 gap-1 rounded-lg bg-muted p-1" role="tablist" aria-label="수정할 항목">
            {([["rental", "렌탈샵·상품"], ["lift", "리프트권"]] as const).map(([value, label]) => <button key={value} type="button" role="tab" aria-selected={editTab === value} onClick={() => setEditTab(value)} className={`min-h-10 cursor-pointer rounded-md text-sm font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${editTab === value ? "bg-background shadow-sm" : "text-muted-foreground"}`}>{label}</button>)}
          </div>
          {editTab === "rental" ? <div className="space-y-3">
            <SelectField ariaLabel="렌탈샵" value={editShopId ?? undefined} onValueChange={setEditShopId} options={rentalGroups.map(group => ({ value: group.shop.id, label: group.shop.name }))} />
            {editGroup ? <DailyRentalChoices key={`${editDay.date}-${editGroup.shop.id}`} shop={editGroup.shop} options={editGroup.options} day={editDay} peopleCount={trip.peopleCount} rideType={trip.rideType} access={access} save={async data => { if (await saveDecision(data)) setEditDate(null); }} canEdit={canEdit} /> : null}
          </div> : <div id="lift" className="space-y-4">
            <LiftChoices key={`${editDay.date}-${editDay.timeSlot}-${editDay.liftTicketOptionId ?? "official"}`} resortId={trip.resortId} day={editDay} groups={rentalGroups} peopleCount={trip.peopleCount} access={access} save={saveDecision} canEdit={canEdit} liftUrl={liftUrl} onDone={() => setEditDate(null)} />
          </div>}
        </> : null}
      </DrawerContent>
    </Drawer>

    </> : null}

    {view === "lodging" ?
    <DecisionSection id="lodging" title="숙박 밤별 계획" description="체크인하는 밤마다 숙소와 실제 확인한 1박 비용을 기록하세요. 같은 숙소는 한 번에 적용할 수 있습니다." icon={<BedDouble />}>
      <TripLodgingPlan resortId={trip.resortId} plan={trip.skiPlan} lodgingOptions={lodgingOptions} lodgingSearchUrl={lodgingSearchUrl} access={access} save={saveDecision} canEdit={canEdit} />
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
  return <div className="space-y-4"><div className="flex flex-wrap gap-2 text-xs font-medium">{shop.dataStatus === "verified_25_26" ? <Tag>25/26 가격 확인</Tag> : <Tag>가격 원문 확인</Tag>}{shop.pickupAvailable ? <Tag>픽업</Tag> : null}{shop.clothingRentalAvailable ? <Tag>의류</Tag> : null}{liftOptions.length ? <Tag>할인 리프트권</Tag> : null}</div>
    <div className="rounded-xl border p-3"><p className="mb-2 text-xs font-semibold text-muted-foreground">장비·의류 렌탈</p>{rentalOptions.length ? <form action={save} className="grid gap-2"><AccessInput access={access} /><input type="hidden" name="decision" value="rental" /><SelectField name="selectedRentalOptionId" ariaLabel={`${shop.name} 장비·의류 상품`} defaultValue={rentalOptions.some(option => option.id === trip.selectedRentalOptionId) ? trip.selectedRentalOptionId! : rentalOptions[0].id} options={rentalOptions.map(option => ({ value: option.id, label: `${option.label} · ${option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}` }))} />{canEdit ? <SubmitButton variant="secondary" pendingText="저장 중…">렌탈 상품 저장</SubmitButton> : null}</form> : <p className="text-xs leading-5 text-muted-foreground">공개된 장비·의류 가격이 없습니다.</p>}</div>
    <div className="rounded-xl border border-foreground/20 bg-muted/60 p-3"><p className="mb-2 text-xs font-semibold text-muted-foreground">할인 리프트권</p>{liftOptions.length ? <form action={save} className="grid gap-2"><AccessInput access={access} /><input type="hidden" name="decision" value="discounted_lift" /><SelectField name="selectedLiftTicketOptionId" ariaLabel={`${shop.name} 할인 리프트권`} value={liftId} onValueChange={setLiftId} options={liftOptions.map(option => ({ value: option.id, label: `${option.label} · ${option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}` }))} />{savings ? <div className="rounded-lg bg-background/80 p-3" aria-live="polite"><div className="flex items-end justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">공식 {formatCurrency(savings.officialPrice)}</p><p className="text-lg font-semibold text-muted-foreground">{formatCurrency(savings.shopPrice)}</p></div><span className="rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">{savings.discountRate}% 절감</span></div><p className="mt-2 text-xs font-semibold">1인 {formatCurrency(savings.savedPerPerson)} · {trip.peopleCount}명 총 {formatCurrency(savings.savedPerPerson * trip.peopleCount)} 절감</p></div> : <p className="rounded-lg bg-background/80 p-3 text-xs leading-5 text-muted-foreground">같은 시간대 공식 가격이 확인된 경우에만 절감액을 표시합니다.</p>}{canEdit ? <SubmitButton pendingText="저장 중…">할인권 저장</SubmitButton> : null}</form> : <p className="text-xs leading-5 text-muted-foreground">공개된 할인 리프트권이 없습니다. 아래 공식권을 선택해 주세요.</p>}</div>
    <SourceLinks mapUrl={shop.mapLinks?.kakao ?? shop.mapLinks?.naver} siteUrl={shop.url} />
  </div>;
}

function AccessInput({ access }: { access: { name: string; value: string } }) { return <input type="hidden" name={access.name} value={access.value} />; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">{children}</span>; }
function SourceLinks({ mapUrl, siteUrl }: { mapUrl?: string; siteUrl?: string }) { return <div className="flex gap-2">{mapUrl ? <ExternalButton href={mapUrl}>지도</ExternalButton> : null}{siteUrl ? <ExternalButton href={siteUrl}>가격·예약 원문</ExternalButton> : null}</div>; }
function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) { return <AnalyticsLink href={href} target="_blank" rel="noreferrer" eventName="external_link_click" eventData={{ type: "decision_source" }}><Button type="button" variant="secondary" className="h-11 px-4">{children} <ExternalLink className="h-4 w-4" /></Button></AnalyticsLink>; }
function DecisionSection({ id, title, description, children }: { id: string; title: string; description: string; icon?: React.ReactNode; children: React.ReactNode }) { return <section id={id} className="scroll-mt-28 rounded-xl border bg-card p-4 sm:p-5"><div className="mb-4"><div><h2 data-trip-workspace-anchor-title tabIndex={-1} className="text-lg font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{title}</h2><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>{children}</section>; }
