"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { BedDouble, BusFront, Car, Check, Clock3, ExternalLink, MapPin, Shirt, Sparkles } from "lucide-react";
import { updateTripDecisionSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { PlaceComparisonMap, type PlaceCandidate } from "@/components/place-comparison-map";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { SubmitButton } from "@/components/ui/submit-button";
import type { NearbyLodging } from "@/data/resort-map";
import type { RentalPriceRule, RentalShop } from "@/lib/types";
import { sortRentalComparisonGroups, type RentalComparisonSort } from "@/lib/rental-comparison";
import { formatCurrency } from "@/lib/utils";

type Trip = { id: string; resortId: string; selectedRentalOptionId: string | null; selectedRentalShopId: string | null; liftTicketTimeSlot: string; transportType: string; lodgingName: string | null; lodgingUrl: string | null; lodgingCostInput: number | null };
type RentalGroup = { shop: RentalShop; options: RentalPriceRule[] };
type RentalFilter = "all" | "verified" | "pickup" | "clothing" | "lift";

export function TripDecisionWorkspace({ trip, rentalGroups, lodgingOptions, liftUrl, shuttleUrl, lodgingSearchUrl, editToken, shareToken, canEdit = true }: { trip: Trip; rentalGroups: RentalGroup[]; lodgingOptions: NearbyLodging[]; liftUrl?: string; shuttleUrl?: string; lodgingSearchUrl?: string; editToken?: string; shareToken?: string; canEdit?: boolean }) {
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
    <section className="overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/15 via-card to-card p-5 sm:p-6"><div className="flex items-start gap-4"><span className="rounded-2xl bg-primary p-3 text-primary-foreground shadow-lg shadow-primary/20"><Sparkles className="h-5 w-5" /></span><div><p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Choose with confidence</p><h2 className="mt-1 text-2xl font-black">결정할수록 트립이 선명해져요</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">지도와 목록으로 후보를 비교해 저장하세요. 실제 예약·결제 여부는 체크리스트에서 관리합니다.</p></div></div></section>

    <DecisionSection id="rental" title="렌탈샵과 상품" description="위치, 제공 품목, 시즌 가격과 원문을 한 화면에서 비교하세요." icon={<Shirt />}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-2 overflow-x-auto pb-1" aria-label="렌탈샵 필터">{([['all','전체'],['verified','가격 확인'],['pickup','픽업'],['clothing','의류'],['lift','리프트권']] as const).map(([value,label]) => <Button key={value} type="button" variant={filter === value ? "primary" : "secondary"} className="h-9 shrink-0 px-3 text-xs" onClick={() => setFilter(value)}>{label}</Button>)}</div><div className="w-full sm:w-36"><SelectField name="rentalSort" ariaLabel="렌탈샵 정렬" value={sort} onValueChange={(value) => setSort(value as RentalComparisonSort)} options={[{value:"verified",label:"검증순"},{value:"distance",label:"거리순"},{value:"price",label:"가격순"}]} /></div></div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]">
        <PlaceComparisonMap candidates={filtered.map(({shop}) => toCandidate(shop.id, shop.name, "rental", shop.address, shop.latitude, shop.longitude, shop.mapLinks?.kakao ?? shop.mapLinks?.naver))} selectedId={rentalId} onSelect={selectRentalFromMap} />
        <div ref={rentalListRef} className="max-h-[520px] space-y-3 overflow-y-auto pr-1">{filtered.length ? filtered.map(({ shop, options }) => { const selected = rentalId === shop.id; const saved = trip.selectedRentalShopId === shop.id; return <Card key={shop.id} data-rental-shop-id={shop.id} tabIndex={-1} className={selected ? "border-primary ring-1 ring-primary/40" : ""}><CardHeader className="cursor-pointer pb-3" onClick={() => setRentalId(shop.id)}><div className="flex items-start justify-between gap-3"><div><CardTitle className="text-base">{shop.name}</CardTitle><p className="mt-1 text-xs text-muted-foreground">{shop.distanceMinutes !== undefined ? `리조트에서 약 ${shop.distanceMinutes}분` : "지도에서 위치 확인"}</p></div>{saved ? <span className="rounded-full bg-primary p-1.5 text-primary-foreground"><Check className="h-3.5 w-3.5" /></span> : null}</div></CardHeader>{selected ? <CardContent className="space-y-3"><div className="flex flex-wrap gap-1.5 text-[11px] font-bold">{shop.dataStatus === "verified_25_26" ? <Tag>25/26 가격 확인</Tag> : <Tag>가격 원문 확인</Tag>}{shop.pickupAvailable ? <Tag>픽업</Tag> : null}{shop.clothingRentalAvailable ? <Tag>의류</Tag> : null}{shop.liftTicketSalesAvailable ? <Tag>리프트권</Tag> : null}</div>{options.length ? <form action={save} className="grid gap-2"><AccessInput access={access} /><input type="hidden" name="decision" value="rental" /><SelectField name="selectedRentalOptionId" ariaLabel={`${shop.name} 렌탈 상품`} defaultValue={options.some(option => option.id === trip.selectedRentalOptionId) ? trip.selectedRentalOptionId! : options[0].id} options={options.map(option => ({ value: option.id, label: `${option.label} · ${option.representativePrice ? formatCurrency(option.representativePrice) : "원문 확인"}` }))} />{canEdit ? <SubmitButton variant="secondary" pendingText="저장 중…">이 상품 저장</SubmitButton> : null}</form> : <form action={save}><AccessInput access={access} /><input type="hidden" name="decision" value="rental_shop" /><input type="hidden" name="selectedRentalShopId" value={shop.id} /><p className="mb-3 rounded-lg bg-muted p-3 text-xs leading-5 text-muted-foreground">공개 가격이 없어 업체만 후보로 저장합니다. 예상 비용은 임의로 바꾸지 않습니다.</p>{canEdit ? <SubmitButton variant="secondary" pendingText="저장 중…">이 업체 저장</SubmitButton> : null}</form>}<SourceLinks mapUrl={shop.mapLinks?.kakao ?? shop.mapLinks?.naver} siteUrl={shop.url} /></CardContent> : null}</Card>; }) : <p className="rounded-xl border border-dashed p-5 text-center text-sm text-muted-foreground">조건에 맞는 업체가 없습니다.</p>}</div>
      </div>
    </DecisionSection>

    <div className="grid gap-5 xl:grid-cols-2">
      <DecisionSection id="lift" title="리프트권" description="이용 시간을 먼저 정하고 공식 판매 조건을 확인하세요." icon={<Clock3 />}><form action={save} className="space-y-3"><AccessInput access={access} /><input type="hidden" name="decision" value="lift" /><SelectField name="liftTicketTimeSlot" ariaLabel="리프트권 시간" defaultValue={trip.liftTicketTimeSlot} options={[{value:"2h",label:"2시간권"},{value:"3h",label:"3시간권"},{value:"4h",label:"4시간권"},{value:"6h",label:"6시간권"},{value:"night",label:"야간권"},{value:"full_day",label:"종일권"}]} /><div className="flex gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">저장하기</SubmitButton> : null}{liftUrl ? <ExternalButton href={liftUrl}>공식 판매처</ExternalButton> : null}</div></form></DecisionSection>
      <DecisionSection id="transport" title="교통" description="이동 방식을 저장하고 셔틀은 공식 노선을 확인하세요." icon={trip.transportType === "car" ? <Car /> : <BusFront />}><form action={save} className="space-y-3"><AccessInput access={access} /><input type="hidden" name="decision" value="transport" /><SelectField name="transportType" ariaLabel="교통수단" defaultValue={trip.transportType} options={[{value:"car",label:"자차"},{value:"shuttle",label:"스키장 셔틀"},{value:"bus",label:"고속·시외버스"}]} /><div className="flex gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">저장하기</SubmitButton> : null}{shuttleUrl ? <ExternalButton href={shuttleUrl}>셔틀 노선 확인</ExternalButton> : null}</div></form></DecisionSection>
    </div>

    <DecisionSection id="lodging" title="공식 숙소 비교" description="리조트 공식 숙소의 위치를 비교하고, 실제 확인한 숙박비를 직접 입력하세요." icon={<BedDouble />}>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(300px,.95fr)]"><PlaceComparisonMap candidates={lodgingOptions.map(item => toCandidate(item.id, item.name, undefined, item.latitude, item.longitude, item.mapLinks?.kakao ?? item.mapLinks?.naver))} selectedId={lodgingId} onSelect={setLodgingId} /><div className="space-y-3"><div className="grid max-h-56 gap-2 overflow-y-auto"><button type="button" onClick={() => setLodgingId(null)} className={`rounded-xl border p-3 text-left transition-colors ${lodgingId === null ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">다른 숙소 직접 입력</span><span className="mt-1 block text-xs text-muted-foreground">외부에서 찾은 숙소도 기록할 수 있어요.</span></button>{lodgingOptions.map(item => <button key={item.id} type="button" onClick={() => setLodgingId(item.id)} className={`rounded-xl border p-3 text-left transition-colors ${lodgingId === item.id ? "border-primary bg-primary/5" : "hover:bg-muted"}`}><span className="font-black">{item.name}</span><span className="mt-1 block text-xs text-muted-foreground">공식 숙박 · {item.category === "resort_hotel" ? "호텔" : "콘도"}</span></button>)}</div><form key={lodgingId ?? "custom"} action={save} className="grid gap-3 sm:grid-cols-2"><AccessInput access={access} /><input type="hidden" name="decision" value="lodging" /><Field label="숙소 이름"><Input name="lodgingName" required maxLength={120} defaultValue={selectedLodging?.name ?? trip.lodgingName ?? ""} readOnly={Boolean(selectedLodging)} placeholder="예약하거나 검토 중인 숙소" /></Field><Field label="예상 숙박비 (전체)"><Input name="lodgingCostInput" type="number" min="0" max="100000000" step="1000" defaultValue={trip.lodgingCostInput ?? ""} placeholder="직접 확인한 금액" /></Field><Field label="예약·숙소 링크"><Input name="lodgingUrl" type="url" defaultValue={selectedLodging?.url ?? trip.lodgingUrl ?? ""} readOnly={Boolean(selectedLodging)} placeholder="https://" /></Field><div className="flex flex-wrap items-end gap-2">{canEdit ? <SubmitButton pendingText="저장 중…">검토 중으로 저장</SubmitButton> : null}{selectedLodging?.url ? <ExternalButton href={selectedLodging.url}>공식 원문</ExternalButton> : lodgingSearchUrl ? <ExternalButton href={lodgingSearchUrl}>주변 숙소</ExternalButton> : null}</div><p className="text-xs leading-5 text-muted-foreground sm:col-span-2">저장하면 체크리스트가 ‘선택됨’으로 바뀝니다. 예약·결제 완료는 체크리스트에서 직접 표시하세요.</p></form></div></div>
    </DecisionSection>
  </div>;
}

function AccessInput({ access }: { access: { name: string; value: string } }) { return <input type="hidden" name={access.name} value={access.value} />; }
function Tag({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">{children}</span>; }
function SourceLinks({ mapUrl, siteUrl }: { mapUrl?: string; siteUrl?: string }) { return <div className="flex gap-2">{mapUrl ? <ExternalButton href={mapUrl}>지도</ExternalButton> : null}{siteUrl ? <ExternalButton href={siteUrl}>가격·예약 원문</ExternalButton> : null}</div>; }
function ExternalButton({ href, children }: { href: string; children: React.ReactNode }) { return <a href={href} target="_blank" rel="noreferrer"><Button type="button" variant="secondary" className="h-9 px-3 text-xs">{children} <ExternalLink className="h-3.5 w-3.5" /></Button></a>; }
function DecisionSection({ id, title, description, icon, children }: { id: string; title: string; description: string; icon: React.ReactNode; children: React.ReactNode }) { return <section id={id} className="scroll-mt-28 rounded-2xl border bg-card p-4 shadow-sm sm:p-5"><div className="mb-4 flex items-start gap-3"><span className="rounded-xl bg-muted p-2.5 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span><div><h3 className="text-lg font-black">{title}</h3><p className="mt-1 text-sm text-muted-foreground">{description}</p></div></div>{children}</section>; }
