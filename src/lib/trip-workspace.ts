export type TripWorkspaceView = "overview" | "decisions" | "checklist" | "budget";

export function getTripWorkspaceView(value: string | string[] | undefined): TripWorkspaceView {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === "decisions" || candidate === "checklist" || candidate === "budget" ? candidate : "overview";
}
