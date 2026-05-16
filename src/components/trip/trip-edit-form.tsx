import { updateTripDetailsAction, updateTripStatusAction } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { getRentalOptionsForResort } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

type TripEditFormData = {
  id: string;
  resortId: string;
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
  const rentalOptions = getRentalOptionsForResort(trip.resortId);
  const accessField = editToken ? (
    <input type="hidden" name="editToken" value={editToken} />
  ) : (
    <input type="hidden" name="tripId" value={trip.id} />
  );

  return (
    <div className="grid gap-4">
      <form action={updateTripDetailsAction} className="space-y-4">
        {accessField}
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
        <Button type="submit" className="w-full">
          트립 정보 저장하고 비용 재계산
        </Button>
      </form>

      <form action={updateTripStatusAction} className="space-y-2">
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
          <Button type="submit" variant="secondary" className="shrink-0">
            변경
          </Button>
        </div>
      </form>
    </div>
  );
}
