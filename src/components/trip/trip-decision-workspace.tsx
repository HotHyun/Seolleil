"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, BusFront, Car, Check, Clock3, ExternalLink, MapPin, Shirt, Sparkles } from "lucide-react";
import { updateTripDecisionSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { PlaceComparisonMap, type PlaceCandidate } from "@/components/place-comparison-map";
import { NoAffiliateShuttleNotice } from "@/components/shuttle-coverage";
import { ShuttleRouteExplorer } from "@/components/shuttle-route-explorer";
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

type Trip = { id: string; resortId: string; visitDate: Date; peopleCount: number; selectedRentalOptionId: string | null; selectedLiftTicketOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; shuttleRouteId: string | null; shuttleStopId: string | null; lodgingName: string | null; lodgingUrl: string | null; lodgingCostInput: number | null };
type RentalGroup = { shop: RentalShop; options: RentalPriceRule[] };
type RentalFilter = "all" | "verified" | "pickup" | "clothing" | "lift";

export function TripDecisionWorkspace({ view, trip, rentalGroups, lodgingOptions, liftUrl, shuttleUrl, lodgingSearchUrl, editToken, shareToken, canEdit = true }: { view: TripDecisionView; trip: Trip; rentalGroups: RentalGroup[]; lodgingOptions: NearbyLodging[]; liftUrl?: string; shuttleUrl?: string; lodgingSearchUrl?: string; editToken?: string; shareToken?: string; canEdit?: boolean }) {
  const router = useRouter();
  const access = editToken ? { name: "editToken", value: editToken } : shareToken ? { name: "shareToken", value: shareToken } : { name: "tripId", value: trip.id };
  const [filter, setFilter] = useState<RentalFilter>("all");
  const [sort, setSort] = useState<RentalComparisonSort>("verified");
  const [rentalId, setRentalId] = useState<string | null>(trip.selectedRentalShopId ?? rentalGroups[0]?.shop.id ?? null);
  const rentalListRef = useRef<HTMLDivElement | null>(null);
  const initialLodging = lodgingOptions.find(item => item.name === trip.lodgingName);
  const [lodgingId, setLodgingId] = useState<string | null>(initialLodging?.id ?? null);
  const filtered = useMemo(() => sortRentalComparisonGroups(rentalGroups
    .filter(({ shop }) => filter === "all" || (filter === "verified" && shop.dataStatus === "verified_25_26") || (filter === "pickup" && shop.pickupAvailable) || (filter === "clothing" && shop.clothingRentalAvailable) || (filter === "lift" && shop.liftTicketSalesAvailable)), sort, trip.selectedRentalShopId), [filter, rentalGroups, sort, trip.selectedRentalShopId]);
  const selectedLodging = lodgingOptions.find(item => item.id === lodgingId);
  const shuttleRoutes = useMemo(() => getSkiShuttleRoutes(trip.resortId), [trip.resortId]);
  const shuttleCoverage = useMemo(() => getSkiShuttleCoverage({ id: trip.resortId, shuttleUrl, lastCheckedAt: "2026-07-17" }, shuttleRoutes), [shuttleRoutes, shuttleUrl, trip.resortId]);
  const workspaceCopy = view === "rental_lift"
    ? { eyebrow: "Gear & lift", title: "장비와 리프트권을 함께 골라요", description: "렌탈샵의 상품과 리프트권 판매 여부를 한 흐름에서 비교하고, 내 이용 시간까지 정하세요." }
    : view === "lodging"
      ? { eyebrow: "Stay", title: "머무를 곳에만 집중해요", description: "공식 숙소의 위치를 비교하고 실제 확인한 숙박 정보와 비용을 기록하세요." }
      : { eyebrow: "Getting there", title: "가는 방법을 구체적으로 정해요", description: "이동수단을 고르고 이용 가능한 셔틀 노선과 탑승지를 차분히 확인하세요." };
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
    <DecisionSection id="rental" title="렌탈샵과 상품" description="위치, 제공 품목, 시즌 가격과 원문을 한 화면에서 비교하세요." icon={<Shirt />}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 overflow-x-auto pb-1" aria-label="렌탈샵 필터">{([['all','전체'],['verified','가격 확인'],['pickup','픽업'],['clothing','의류'],['lift','리프트권']] as const).map(([value,label]) => <Button key={value} type="button" variant={filter === value ? "primary" : "secondary"} className="h-9 shrink-0 px-3 text-xs hover:translate-y-0" onClick={() => setFilter(value)}>{label}</Button>)}</div><div className="w-full sm:w-36"><SelectField name="rentalSort" ariaLabel="렌탈샵 정렬" value={sort} onValueChange={(value) => setSort(value as RentalComparisonSort)} options={[{value:"verified",label:"검증순"},{value:"distance",label:"거리순"},{value:"price",label:"가격순"}]} /></div></div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]">
        <PlaceComparisonMap candidates={filtered.map(({shop}) => toCandidate(shop.id, shop.name, "rental", shop.address, shop.latitude, shop.longitude, shop.mapLinks?.kakao ?? shop.mapLinks?.naver))} selectedId={rentalId} onSelect={selectRentalFromMap} />
        <div ref={rentalListRef} className="max-h-[620px] space-y-3 overflow-y-auto pr-1">{filtered.length ? filtered.map(({ shop, options }) => { const selected = rentalId === shop.id; const saved = trip.selectedRentalShopId === shop.id; return <div key={shop.id} data-rental-shop-id={shop.id} tabIndex={-1} className={`rounded-2xl border bg-transparent text-card-foreground ${selected ? "border-primary ring-1 ring-primary/40" : "border-border"}`}><CardHeader className="cursor-pointer pb-3" onClick={() => setRentalId(shop.id)}><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{shop.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{shop.distanceMinutes !== undefined ? `리조트에서 약 ${shop.distanceMinutes}분` : "지도에서 위치 확인"}</p></div>{saved ? <span className="rounded-full bg-primary p-1.5 text-primary-foreground"><Check className="h-3.5 w-3.5" /></span> : null}</div></CardHeader>{selected ? <CardContent><RentalShopChoices shop={shop} options={options} trip={trip} access={access} save={save} canEdit={canEdit} /></CardContent> : null}</div>; }) : <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">조건에 맞는 업체가 없습니다.</p>}</div>
      </div>
    </DecisionSection>

    <DecisionSection id="lift" title="공식 리조트 리프트권" description="렌탈샵 할인권 대신 공식권을 선택할 때 이용 시간권을 정하세요." icon={<Clock3 />}><div className="mb-4 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-6 text-muted-foreground">공식권을 저장하면 위에서 선택한 렌탈샵 할인권은 해제됩니다. 렌탈 장비 선택은 그대로 유지돼요.</div><form action={save} className="space-y-3"><AccessInput access={access} /><input type="hidden" name="decision" value="lift" /><SelectField name="liftTicketTimeSlot" ariaLabel="공식 리프트권 시간" defaultValue={trip.liftTicketTimeSlot} options={[{value:"2h",label:"2시간권"},{value:"3h",label:"3시간권"},{value:"4h",label:"4시간권"},{value:"6h",label:"6시간권"},{value:"night",label:"야간권"},{value:"full_day",label:"종일권"}]} /><div className="flex gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">공식권으로 저장</SubmitButton> : null}{liftUrl ? <ExternalButton href={liftUrl}>공식 판매처</ExternalButton> : null}</div></form></DecisionSection>
    </> : null}

    {view === "lodging" ?
    <DecisionSection id="lodging" title="공식 숙소 비교" description="리조트 공식 숙소의 위치를 비교하고, 실제 확인한 숙박비를 직접 입력하세요." icon={<BedDouble />}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]"><PlaceComparisonMap candidates={lodgingOptions.map(item => toCandidate(item.id, item.name, undefined, item.latitude, item.longitude, item.mapLinks?.kakao ?? item.mapLinks?.naver))} selectedId={lodgingId} onSelect={setLodgingId} /><div className="space-y-3"><div className="grid max-h-56 gap-2 overflow-y-auto"><button type="button" onClick={() => setLodgingId(null)} className={`rounded-xl border p-3 text-left transition-colors ${lodgingId === null ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">다른 숙소 직접 입력</span><span className="mt-1 block text-xs text-muted-foreground">외부에서 찾은 숙소도 기록할 수 있어요.</span></button>{lodgingOptions.map(item => <button key={item.id} type="button" onClick={() => setLodgingId(item.id)} className={`rounded-xl border p-3 text-left transition-colors ${lodgingId === item.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">공식 숙박 · {item.category === "resort_hotel" ? "호텔" : "콘도"}</span></button>)}</div><form key={lodgingId ?? "custom"} action={save} className="grid gap-3 sm:grid-cols-2"><AccessInput access={access} /><input type="hidden" name="decision" value="lodging" /><Field label="숙소 이름"><Input name="lodgingName" required maxLength={120} defaultValue={selectedLodging?.name ?? trip.lodgingName ?? ""} readOnly={Boolean(selectedLodging)} placeholder="예약하거나 검토 중인 숙소" /></Field><Field label="예상 숙박비 (전체)"><Input name="lodgingCostInput" type="number" min="0" max="100000000" step="1000" defaultValue={trip.lodgingCostInput ?? ""} placeholder="직접 확인한 금액" /></Field><Field label="예약·숙소 링크"><Input name="lodgingUrl" type="url" defaultValue={selectedLodging?.url ?? trip.lodgingUrl ?? ""} readOnly={Boolean(selectedLodging)} placeholder="https://" /></Field><div className="flex flex-wrap items-end gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">검토 중으로 저장</SubmitButton> : null}{selectedLodging?.url ? <ExternalButton href={selectedLodging.url}>공식 원문</ExternalButton> : lodgingSearchUrl ? <ExternalButton href={lodgingSearchUrl}>주변 숙소</ExternalButton> : null}</div><p className="text-xs leading-5 text-muted-foreground sm:col-span-2">저장하면 체크리스트가 ‘선택됨’으로 바뀝니다. 예약·결제 완료는 체크리스트에서 직접 표시하세요.</p></form></div></div>
    </DecisionSection>
    : null}

    {view === "transport" ? <DecisionSection id="transport" title="교통" description="이동 방식을 저장하고 내 출발지와 가까운 제휴 셔틀을 찾아보세요." icon={trip.transportType === "car" ? <Car /> : <BusFront />}><form action={save} className="space-y-3"><AccessInput access={access} /><input type="hidden" name="decision" value="transport" /><SelectField name="transportType" ariaLabel="교통수단" defaultValue={trip.transportType} options={[{value:"car",label:"자차"},{value:"shuttle",label:"스키장 제휴 셔틀"},{value:"bus",label:"고속·시외버스"}]} /><div className="flex gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">저장하기</SubmitButton> : null}</div></form>{shuttleRoutes.length ? <div className="mt-4 border-t pt-4"><ShuttleRouteExplorer routes={shuttleRoutes} compact selectedRouteId={trip.shuttleRouteId} selectedStopId={trip.shuttleStopId} access={access} saveAction={save} canEdit={canEdit} /></div> : <div className="mt-4 border-t pt-4"><NoAffiliateShuttleNotice coverage={shuttleCoverage} compact /></div>}</DecisionSection> : null}
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
