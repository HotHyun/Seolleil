export type TripWorkspaceView = "overview" | "rental_lift" | "lodging" | "transport" | "checklist" | "budget";

export type TripDecisionView = Extract<TripWorkspaceView, "rental_lift" | "lodging" | "transport">;

export function isTripDecisionView(view: TripWorkspaceView): view is TripDecisionView {
  return view === "rental_lift" || view === "lodging" || view === "transport";
}

export function getTripWorkspaceView(value: string | string[] | undefined): TripWorkspaceView {
  const candidate = Array.isArray(value) ? value[0] : value;
  if (candidate === "decisions") return "rental_lift";
  return candidate === "rental_lift" || candidate === "lodging" || candidate === "transport" || candidate === "checklist" || candidate === "budget" ? candidate : "overview";
}

export type TripDashboardNextActionState = {
  rentalReady: boolean;
  liftReady: boolean;
  lodgingReady: boolean;
  transportReady: boolean;
  checklistReady: boolean;
};

export function getTripDashboardNextAction(state: TripDashboardNextActionState) {
  if (!state.rentalReady) return { view: "rental_lift", label: "렌탈 선택 이어가기" } as const;
  if (!state.liftReady) return { view: "rental_lift#lift", label: "리프트권 확인하기" } as const;
  if (!state.lodgingReady) return { view: "lodging", label: "숙소 정하기" } as const;
  if (!state.transportReady) return { view: "transport", label: "교통 정하기" } as const;
  if (!state.checklistReady) return { view: "checklist", label: "체크리스트 마무리" } as const;
  return { view: "budget", label: "비용 정리하기" } as const;
}
