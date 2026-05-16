import { CalendarDays, MapPin, SlidersHorizontal } from "lucide-react";
import { AnalyticsTrack } from "@/components/analytics-track";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { departureLocations } from "@/data/resorts";
import { priorityLabels, timeSlotLabels } from "@/lib/constants";

export default function PlanPage() {
  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" />
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-primary">Trip Builder</p>
        <h1 className="text-3xl font-black md:text-5xl">조건을 입력하면 추천 3곳을 비교합니다.</h1>
      </div>
      <form action="/recommendations" className="grid gap-4">
        <StepCard icon={<CalendarDays />} title="1. 일정/이동">
          <Field label="방문 날짜">
            <DatePicker name="visitDate" required />
          </Field>
          <Field label="출발지">
            <SelectField
              name="departureLocation"
              defaultValue="seoul-gangnam"
              options={departureLocations.map((location) => ({ value: location.id, label: location.label }))}
            />
          </Field>
          <Field label="인원">
            <Input name="peopleCount" type="number" min={1} max={20} defaultValue={2} />
          </Field>
          <Field label="일정">
            <SelectField
              name="tripDuration"
              defaultValue="same_day"
              options={[
                { value: "same_day", label: "당일치기" },
                { value: "overnight", label: "1박 이상" }
              ]}
            />
          </Field>
          <Field label="교통수단">
            <SelectField
              name="transportType"
              defaultValue="car"
              options={[
                { value: "car", label: "자차" },
                { value: "shuttle", label: "셔틀" },
                { value: "bus", label: "버스" }
              ]}
            />
          </Field>
        </StepCard>

        <StepCard icon={<MapPin />} title="2. 사용자 상태">
          <Field label="실력">
            <SelectField
              name="skillLevel"
              defaultValue="beginner"
              options={[
                { value: "first_time", label: "처음" },
                { value: "beginner", label: "초보" },
                { value: "intermediate", label: "중급" },
                { value: "advanced", label: "상급" }
              ]}
            />
          </Field>
          <Field label="종목">
            <SelectField
              name="rideType"
              defaultValue="ski"
              options={[
                { value: "ski", label: "스키" },
                { value: "snowboard", label: "보드" }
              ]}
            />
          </Field>
          <Field label="장비 보유">
            <SelectField
              name="ownsEquipment"
              defaultValue="false"
              options={[
                { value: "false", label: "렌탈 필요" },
                { value: "true", label: "보유" }
              ]}
            />
          </Field>
          <Field label="의류 보유">
            <SelectField
              name="ownsClothing"
              defaultValue="false"
              options={[
                { value: "false", label: "렌탈 필요" },
                { value: "true", label: "보유" }
              ]}
            />
          </Field>
        </StepCard>

        <StepCard icon={<SlidersHorizontal />} title="3. 비용/선호">
          <Field label="예산 최소">
            <Input name="budgetMin" type="number" min={0} step={10000} placeholder="예: 100000" />
          </Field>
          <Field label="예산 최대">
            <Input name="budgetMax" type="number" min={0} step={10000} placeholder="예: 250000" />
          </Field>
          <Field label="1순위">
            <SelectField name="priority1" defaultValue="beginner" options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
          </Field>
          <Field label="2순위">
            <SelectField name="priority2" defaultValue="close" options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
          </Field>
          <Field label="3순위">
            <SelectField name="priority3" defaultValue="rental" options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
          </Field>
          <Field label="리프트권 시간권">
            <SelectField
              name="liftTicketTimeSlot"
              defaultValue="4h"
              options={Object.entries(timeSlotLabels)
                .filter(([value]) => value !== "all")
                .map(([value, label]) => ({ value, label }))}
            />
          </Field>
          <Field label="숙박비 직접 입력">
            <Input name="lodgingCostInput" type="number" min={0} step={10000} placeholder="1박이면 선택 입력" />
          </Field>
        </StepCard>

        <div className="sticky bottom-4 z-10 rounded-lg border bg-white/7 p-3 shadow-lg">
          <Button type="submit" className="w-full">
            추천 결과 보기
          </Button>
        </div>
      </form>
    </main>
  );
}

function StepCard({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span className="text-primary [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</CardContent>
    </Card>
  );
}
