"use client";

import * as React from "react";
import { ArrowLeft, ArrowRight, CalendarDays, CheckCircle2, MapPin, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CreateTripSubmit } from "@/components/trip/create-trip-submit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePicker } from "@/components/ui/date-picker";
import { Field, Input } from "@/components/ui/field";
import { SelectField } from "@/components/ui/select-field";
import { departureLocations } from "@/data/resorts";
import { priorityLabels, timeSlotLabels } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { SkiResort } from "@/lib/types";

const steps = [
  {
    icon: CalendarDays,
    title: "일정/이동",
    eyebrow: "Step 1",
    description: "언제, 어디서, 몇 명이 출발하는지 정합니다."
  },
  {
    icon: MapPin,
    title: "사용자 상태",
    eyebrow: "Step 2",
    description: "실력과 장비 보유 여부를 골라 추천 조건을 좁힙니다."
  },
  {
    icon: SlidersHorizontal,
    title: "비용/선호",
    eyebrow: "Step 3",
    description: "예산과 우선순위를 정하면 추천 결과를 비교할 수 있습니다."
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
  const formRef = React.useRef<HTMLFormElement>(null);
  const progress = ((step + 1) / steps.length) * 100;
  const activeStep = steps[step];
  const ActiveIcon = activeStep.icon;

  function goToNextStep() {
    const form = formRef.current;
    if (!form) return;

    if (step === 0) {
      const visitDate = new FormData(form).get("visitDate");
      if (!visitDate) {
        setError("방문 날짜를 먼저 선택해 주세요.");
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
    <form ref={formRef} action={action} onSubmit={handleSubmit} className="grid gap-5">
      {selectedResort ? <input type="hidden" name="resortId" value={selectedResort.id} /> : null}
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
          <div className="mb-5 grid grid-cols-3 gap-2">
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
            </StepPanel>

            <StepPanel active={step === 1}>
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
            </StepPanel>

            <StepPanel active={step === 2}>
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
            </StepPanel>
          </div>
        </CardContent>
      </Card>

      <div className="sticky bottom-4 z-10 rounded-xl border bg-card/90 p-3 shadow-2xl backdrop-blur">
        <div className="flex gap-2">
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
