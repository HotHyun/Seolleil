"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTripSubmit } from "@/components/trip/create-trip-submit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { departureLocations } from "@/data/resorts";
import { priorityLabels, timeSlotLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { currentPathWithSearch, readPendingTripDraft } from "@/lib/pending-trip-draft";
import type { SkiResort } from "@/lib/types";

const steps = [
  {
    icon: CalendarDays,
    title: "여행 정보",
    eyebrow: "Step 1",
    description: "날짜와 출발지만 정하면 시작할 수 있어요."
  },
  {
    icon: MapPin,
    title: "스키 준비",
    eyebrow: "Step 2",
    description: "잘 모르겠다면 기본 선택 그대로 추천을 받아도 괜찮아요."
  }
];

export function TripBuilderForm({
  action = "/recommendations",
  selectedResort,
  isAuthenticated = false
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  selectedResort?: SkiResort;
  isAuthenticated?: boolean;
}) {
  const [step, setStep] = React.useState(0);
  const [maxStepReached, setMaxStepReached] = React.useState(0);
  const [error, setError] = React.useState("");
  const [draftValues, setDraftValues] = React.useState<Record<string, string>>({});
  const [tripDuration, setTripDuration] = React.useState("same_day");
  const [visitDate, setVisitDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [draftRevision, setDraftRevision] = React.useState(0);
  const formRef = React.useRef<HTMLFormElement>(null);
  const progress = ((step + 1) / steps.length) * 100;
  const activeStep = steps[step];
  const ActiveIcon = activeStep.icon;

  React.useEffect(() => {
    if (!isAuthenticated || !selectedResort) return;
    const draft = readPendingTripDraft(currentPathWithSearch());
    if (!draft || draft.values.resortId !== selectedResort.id) return;
    setDraftValues(draft.values);
    setTripDuration(draft.values.tripDuration ?? "same_day");
    setVisitDate(draft.values.visitDate ?? "");
    setEndDate(draft.values.endDate ?? "");
    setStep(steps.length - 1);
    setMaxStepReached(steps.length - 1);
    setDraftRevision(1);
  }, [isAuthenticated, selectedResort]);

  const draftValue = (name: string, fallback?: string) => draftValues[name] ?? fallback;

  function goToNextStep() {
    const form = formRef.current;
    if (!form) return;

    if (step === 0) {
      const data = new FormData(form);
      const visitDate = String(data.get("visitDate") ?? "");
      if (!visitDate) {
        setError("방문 날짜를 먼저 선택해 주세요.");
        return;
      }
      const endDate = String(data.get("endDate") ?? "");
      if (tripDuration === "overnight" && (!endDate || endDate <= visitDate)) {
        setError("출발 날짜는 도착 날짜보다 뒤로 선택해 주세요.");
        return;
      }
    }

    setError("");
    setStep((current) => {
      const nextStep = Math.min(current + 1, steps.length - 1);
      setMaxStepReached((maxStep) => Math.max(maxStep, nextStep));
      return nextStep;
    });
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    if (step < steps.length - 1) {
      event.preventDefault();
      goToNextStep();
      return;
    }

    const visitDate = new FormData(event.currentTarget).get("visitDate");
    if (!visitDate) {
      event.preventDefault();
      setError("방문 날짜를 먼저 선택해 주세요.");
      setStep(0);
    }
  }

  return (
    <form ref={formRef} action={action} onSubmit={handleSubmit} className="grid gap-5 pb-24 sm:pb-0">
      {selectedResort ? <input type="hidden" name="resortId" value={selectedResort.id} /> : null}
      <React.Fragment key={draftRevision}>
      <Card className="overflow-hidden">
        <div className="h-1 bg-muted">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
        <CardHeader>
          {selectedResort ? (
            <div className="mb-4 rounded-lg border bg-primary/10 px-3 py-2">
              <div className="text-xs font-black uppercase tracking-[0.16em] text-primary">Selected resort</div>
              <div className="mt-1 font-black">{selectedResort.name}</div>
              <div className="mt-0.5 text-xs font-semibold text-muted-foreground">{selectedResort.region}</div>
            </div>
          ) : null}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">{activeStep.eyebrow}</p>
              <CardTitle className="mt-2 flex items-center gap-2 text-2xl font-black">
                <span className="text-primary [&_svg]:h-5 [&_svg]:w-5">
                  <ActiveIcon />
                </span>
                {activeStep.title}
              </CardTitle>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{activeStep.description}</p>
            </div>
            <div className="shrink-0 rounded-full bg-muted px-3 py-1 text-xs font-black text-muted-foreground">
              {step + 1}/{steps.length}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-5 grid grid-cols-2 gap-2">
            {steps.map((item, index) => {
              const Icon = item.icon;
              const state = index === step ? "active" : index < step ? "done" : "upcoming";
              const isDisabled = index > maxStepReached;
              return (
                <button
                  key={item.title}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => {
                    if (isDisabled) return;
                    setError("");
                    setStep(index);
                  }}
                  className={cn(
                    "rounded-lg border p-2 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    state === "active" && "border-primary bg-primary/12",
                    state === "done" && "bg-muted",
                    state === "upcoming" && "bg-card",
                    isDisabled && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("flex h-7 w-7 items-center justify-center rounded-md", state === "active" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                      {state === "done" ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                    </span>
                    <span className="hidden text-xs font-black sm:inline">{item.title}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {error ? <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm font-semibold text-destructive">{error}</div> : null}

          <div className="relative min-h-[460px]">
            <StepPanel active={step === 0}>
              <Field label="방문 날짜">
                <DatePicker name="visitDate" required value={visitDate || draftValue("visitDate", "")} onValueChange={value => { setVisitDate(value); if (endDate && endDate <= value) setEndDate(""); }} ariaLabel="여행 방문 날짜" />
              </Field>
              <Field label="출발지">
                <SelectField
                  name="departureLocation"
                  defaultValue={draftValue("departureLocation", "seoul-gangnam")}
                  options={departureLocations.map((location) => ({ value: location.id, label: location.label }))}
                />
              </Field>
              <Field label="인원">
                <Input name="peopleCount" type="number" min={1} max={20} defaultValue={draftValue("peopleCount", "2")} />
              </Field>
              <Field label="일정">
                <SelectField
                  name="tripDuration"
                  value={tripDuration}
                  onValueChange={setTripDuration}
                  options={[
                    { value: "same_day", label: "당일치기" },
                    { value: "overnight", label: "1박 이상" }
                  ]}
                />
              </Field>
              {tripDuration === "overnight" ? <Field label="출발 날짜">
                <div><DatePicker name="endDate" required min={visitDate || draftValue("visitDate", "")} value={endDate || draftValue("endDate", "")} onValueChange={setEndDate} ariaLabel="여행 출발 날짜" /><p className="mt-1 text-xs leading-5 text-muted-foreground">트립을 만든 뒤 실제 스키를 탈 날짜와 날짜별 이용 시간을 정할 수 있어요.</p></div>
              </Field> : <input type="hidden" name="endDate" value={visitDate || draftValue("visitDate", "")} />}
              <Field label="교통수단">
                <SelectField
                  name="transportType"
                  defaultValue={draftValue("transportType", "car")}
                  options={[
                    { value: "car", label: "자차" },
                    { value: "shuttle", label: "셔틀" },
                    { value: "bus", label: "버스" }
                  ]}
                />
              </Field>
            </StepPanel>

            <StepPanel active={step === 1}>
              <div className="rounded-xl border bg-muted/40 p-3 text-sm leading-6 text-muted-foreground md:col-span-2">
                처음 가는 경우에는 ‘처음’을, 몇 번 타 봤지만 쉬운 코스가 편하다면 ‘초보’를 선택하세요. 장비나 의류가 없으면 렌탈 비용도 함께 계산해요.
              </div>
              <Field label="실력">
                <SelectField
                  name="skillLevel"
                  defaultValue={draftValue("skillLevel", "beginner")}
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
                  defaultValue={draftValue("rideType", "ski")}
                  options={[
                    { value: "ski", label: "스키" },
                    { value: "snowboard", label: "보드" }
                  ]}
                />
              </Field>
              <Field label="장비 보유">
                <SelectField
                  name="ownsEquipment"
                  defaultValue={draftValue("ownsEquipment", "false")}
                  options={[
                    { value: "false", label: "렌탈 필요" },
                    { value: "true", label: "보유" }
                  ]}
                />
              </Field>
              <Field label="의류 보유">
                <SelectField
                  name="ownsClothing"
                  defaultValue={draftValue("ownsClothing", "false")}
                  options={[
                    { value: "false", label: "렌탈 필요" },
                    { value: "true", label: "보유" }
                  ]}
                />
              </Field>
              <details className="rounded-xl border bg-card p-4 md:col-span-2">
                <summary className="min-h-8 cursor-pointer font-bold outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  예산과 추천 우선순위 설정 <span className="ml-1 text-xs font-medium text-muted-foreground">선택 사항</span>
                </summary>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <Field label="예산 최소">
                    <Input name="budgetMin" type="number" min={0} step={10000} defaultValue={draftValue("budgetMin")} placeholder="예: 100000" />
                  </Field>
                  <Field label="예산 최대">
                    <Input name="budgetMax" type="number" min={0} step={10000} defaultValue={draftValue("budgetMax")} placeholder="예: 250000" />
                  </Field>
                  <Field label="1순위">
                    <SelectField name="priority1" defaultValue={draftValue("priority1", "beginner")} options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
                  </Field>
                  <Field label="2순위">
                    <SelectField name="priority2" defaultValue={draftValue("priority2", "close")} options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
                  </Field>
                  <Field label="3순위">
                    <SelectField name="priority3" defaultValue={draftValue("priority3", "rental")} options={Object.entries(priorityLabels).map(([value, label]) => ({ value, label }))} />
                  </Field>
                  <Field label="리프트 이용 시간">
                    <SelectField
                      name="liftTicketTimeSlot"
                      defaultValue={draftValue("liftTicketTimeSlot", "4h")}
                      options={Object.entries(timeSlotLabels)
                        .filter(([value]) => value !== "all")
                        .map(([value, label]) => ({ value, label }))}
                    />
                  </Field>
                  <Field label="숙박비 직접 입력">
                    <Input name="lodgingCostInput" type="number" min={0} step={10000} defaultValue={draftValue("lodgingCostInput")} placeholder="1박이면 선택 입력" />
                  </Field>
                </div>
              </details>
            </StepPanel>
          </div>
        </CardContent>
      </Card>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-card/95 pt-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] shadow-[0_-12px_32px_rgba(15,23,42,0.1)] backdrop-blur sm:sticky sm:inset-x-auto sm:bottom-4 sm:z-10 sm:rounded-xl sm:border sm:p-3 sm:shadow-2xl">
        <div className="page-shell mx-auto flex gap-2 sm:w-full">
          <Button
            type="button"
            variant="secondary"
            className={cn("w-12 px-0", step === 0 && "invisible")}
            onClick={() => {
              setError("");
              setStep((current) => Math.max(current - 1, 0));
            }}
            aria-label="이전 단계"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          {step < steps.length - 1 ? (
            <Button type="button" className="flex-1" onClick={goToNextStep}>
              다음 단계 <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            selectedResort ? (
              <CreateTripSubmit
                isAuthenticated={isAuthenticated}
                label={`${selectedResort.name} 트립 만들기`}
                className="w-full"
                wrapperClassName="flex-1"
              />
            ) : (
              <Button type="submit" className="flex-1">
                추천 결과 보기
              </Button>
            )
          )}
        </div>
      </div>
      </React.Fragment>
    </form>
  );
}

function StepPanel({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      data-step-active={active}
      className={cn(
        "grid gap-4 transition duration-300 md:grid-cols-2",
        active ? "animate-enter-up opacity-100" : "pointer-events-none absolute inset-0 hidden opacity-0"
      )}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}
