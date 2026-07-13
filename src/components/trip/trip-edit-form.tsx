"use client";

import { useRouter } from "next/navigation";
import { updateTripDetailsSafeAction, updateTripStatusSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { SubmitButton } from "@/components/ui/submit-button";
import { Field, Input, Textarea } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

type TripEditFormData = {
  id: string;
  tripName: string | null;
  tripMemo: string | null;
  resortId: string;
  resortNameSnapshot: string;
  visitDate: Date;
  peopleCount: number;
  transportType: string;
  lodgingCostInput: number | null;
  liftTicketTimeSlot: string;
  selectedRentalOptionId: string | null;
  status: string;
};

export function TripEditForm({
  trip,
  editToken
}: {
  trip: TripEditFormData;
  editToken?: string;
}) {
  const router = useRouter();
  const rentalOptions = getRentalOptionsForResort(trip.resortId);
  const accessField = editToken ? (
    <input type="hidden" name="editToken" value={editToken} />
  ) : (
    <input type="hidden" name="tripId" value={trip.id} />
  );

  return (
    <div className="grid gap-4">
      <form action={async data => { const result = await updateTripDetailsSafeAction(data); showActionResult(result); if (result.ok) router.refresh(); }} className="space-y-4">
        {accessField}
        <Field label="트립 이름">
          <Input name="tripName" maxLength={80} required defaultValue={trip.tripName?.trim() || `${trip.resortNameSnapshot} 트립`} placeholder="예: 대학 동기 새해 스키 여행" />
        </Field>
        <Field label="트립 메모">
          <Textarea name="tripMemo" maxLength={1000} defaultValue={trip.tripMemo ?? ""} placeholder="누구와 어떤 여행을 가는지, 모임에서 기억할 내용을 적어두세요." />
        </Field>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="방문 날짜">
            <Input name="visitDate" type="date" defaultValue={trip.visitDate.toISOString().slice(0, 10)} />
          </Field>
          <Field label="인원">
            <Input name="peopleCount" type="number" min={1} defaultValue={trip.peopleCount} />
          </Field>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-semibold">교통수단</div>
            <SelectField
              name="transportType"
              defaultValue={trip.transportType}
              options={[
                { value: "car", label: "자차" },
                { value: "shuttle", label: "셔틀" },
                { value: "bus", label: "버스" }
              ]}
            />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-semibold">리프트 시간권</div>
            <SelectField
              name="liftTicketTimeSlot"
              defaultValue={trip.liftTicketTimeSlot}
              options={[
                { value: "2h", label: "2시간권" },
                { value: "3h", label: "3시간권" },
                { value: "4h", label: "4시간권" },
                { value: "6h", label: "6시간권" },
                { value: "night", label: "야간권" },
                { value: "full_day", label: "종일권" }
              ]}
            />
          </div>
        </div>
        <Field label="숙박비">
          <Input name="lodgingCostInput" type="number" min={0} defaultValue={trip.lodgingCostInput ?? 0} />
        </Field>
        <div className="space-y-2">
          <div className="text-sm font-semibold">렌탈 옵션</div>
          <SelectField
            name="selectedRentalOptionId"
            defaultValue={trip.selectedRentalOptionId ?? "skip"}
            options={[
              { value: "skip", label: "나중에 선택" },
              ...rentalOptions.flatMap(({ shop, options }) =>
                options.map((option) => ({
                  value: option.id,
                  label: `${shop.id.endsWith("official-rental") ? "공식" : "외부"} · ${shop.name} · ${option.label} (${formatCurrency(option.representativePrice)})`
                }))
              )
            ]}
          />
        </div>
        <SubmitButton type="submit" className="w-full" pendingText="트립 저장 중…">
          트립 정보 저장하고 비용 재계산
        </SubmitButton>
      </form>

      <form action={async data => { const result = await updateTripStatusSafeAction(data); showActionResult(result); if (result.ok) router.refresh(); }} className="space-y-2">
        {accessField}
        <div className="text-sm font-semibold">트립 상태</div>
        <div className="flex gap-2">
          <div className="min-w-0 flex-1">
            <SelectField
              name="status"
              defaultValue={trip.status}
              options={[
                { value: "planning", label: "계획중" },
                { value: "ready", label: "준비 완료" },
                { value: "completed", label: "방문 완료" },
                { value: "archived", label: "보관" }
              ]}
            />
          </div>
          <SubmitButton type="submit" variant="secondary" className="shrink-0" pendingText="변경 중…">
            변경
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
