"use client";

import { useRouter } from "next/navigation";
import { updateTripDetailsSafeAction, updateTripStatusSafeAction } from "@/app/actions";
import { showActionResult } from "@/components/action-result-toast";
import { SubmitButton } from "@/components/ui/submit-button";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";

type TripEditFormData = {
  id: string;
  tripName: string | null;
  resortId: string;
  resortNameSnapshot: string;
  visitDate: Date;
  endDate: Date;
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
  const accessField = editToken ? (
    <input type="hidden" name="editToken" value={editToken} />
  ) : (
    <input type="hidden" name="tripId" value={trip.id} />
  );

  return (
    <div className="grid gap-4">
      <form action={async data => { const result = await updateTripDetailsSafeAction(data); showActionResult(result); if (result.ok) router.refresh(); }} className="space-y-4">
        {accessField}
        <input type="hidden" name="tripName" value={trip.tripName?.trim() || `${trip.resortNameSnapshot} 트립`} />
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="도착 날짜">
            <Input name="visitDate" type="date" defaultValue={trip.visitDate.toISOString().slice(0, 10)} />
          </Field>
          <Field label="출발 날짜">
            <Input name="endDate" type="date" min={trip.visitDate.toISOString().slice(0, 10)} defaultValue={trip.endDate.toISOString().slice(0, 10)} />
          </Field>
          <Field label="인원">
            <Input name="peopleCount" type="number" min={1} defaultValue={trip.peopleCount} />
          </Field>
        </div>
        <SubmitButton type="submit" className="w-full" pendingText="트립 저장 중…">
          저장하기
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
