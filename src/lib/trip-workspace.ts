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
