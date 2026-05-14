import { CalendarDays, MapPin, SlidersHorizontal } from "lucide-react";
import { AnalyticsTrack } from "@/components/analytics-track";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, Input, Select } from "@/components/ui/field";
import { departureLocations } from "@/data/resorts";
import { priorityLabels, timeSlotLabels } from "@/lib/constants";

export default function PlanPage() {
  return (
    <main className="page-shell py-8">
      <AnalyticsTrack eventName="trip_form_start" />
      <div className="mb-8 max-w-3xl">
        <p className="mb-2 text-sm font-semibold text-lime-700">Trip Builder</p>
        <h1 className="text-3xl font-black md:text-5xl">조건을 입력하면 추천 3곳을 비교합니다.</h1>
      </div>
      <form action="/recommendations" className="grid gap-4">
        <StepCard icon={<CalendarDays />} title="1. 일정/이동">
          <Field label="방문 날짜">
            <Input name="visitDate" type="date" required />
          </Field>
          <Field label="출발지">
            <Select name="departureLocation" defaultValue="seoul-gangnam">
              {departureLocations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="인원">
            <Input name="peopleCount" type="number" min={1} max={20} defaultValue={2} />
          </Field>
          <Field label="일정">
            <Select name="tripDuration" defaultValue="same_day">
              <option value="same_day">당일치기</option>
              <option value="overnight">1박 이상</option>
            </Select>
          </Field>
          <Field label="교통수단">
            <Select name="transportType" defaultValue="car">
              <option value="car">자차</option>
              <option value="shuttle">셔틀</option>
              <option value="bus">버스</option>
            </Select>
          </Field>
        </StepCard>

        <StepCard icon={<MapPin />} title="2. 사용자 상태">
          <Field label="실력">
            <Select name="skillLevel" defaultValue="beginner">
              <option value="first_time">처음</option>
              <option value="beginner">초보</option>
              <option value="intermediate">중급</option>
              <option value="advanced">상급</option>
            </Select>
          </Field>
          <Field label="종목">
            <Select name="rideType" defaultValue="ski">
              <option value="ski">스키</option>
              <option value="snowboard">보드</option>
            </Select>
          </Field>
          <Field label="장비 보유">
            <Select name="ownsEquipment" defaultValue="false">
              <option value="false">렌탈 필요</option>
              <option value="true">보유</option>
            </Select>
          </Field>
          <Field label="의류 보유">
            <Select name="ownsClothing" defaultValue="false">
              <option value="false">렌탈 필요</option>
              <option value="true">보유</option>
            </Select>
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
            <Select name="priority1" defaultValue="beginner">
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="2순위">
            <Select name="priority2" defaultValue="close">
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="3순위">
            <Select name="priority3" defaultValue="rental">
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="리프트권 시간권">
            <Select name="liftTicketTimeSlot" defaultValue="4h">
              {Object.entries(timeSlotLabels)
                .filter(([value]) => value !== "all")
                .map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
            </Select>
          </Field>
          <Field label="숙박비 직접 입력">
            <Input name="lodgingCostInput" type="number" min={0} step={10000} placeholder="1박이면 선택 입력" />
          </Field>
        </StepCard>

        <div className="sticky bottom-4 z-10 rounded-lg border bg-white p-3 shadow-lg">
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
          <span className="text-lime-700 [&_svg]:h-5 [&_svg]:w-5">{icon}</span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{children}</CardContent>
    </Card>
  );
}
