export type TripWorkspaceView = "overview" | "checklist" | "budget";

export function getTripWorkspaceView(value: string | string[] | undefined): TripWorkspaceView {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate === "checklist" || candidate === "budget" ? candidate : "overview";
}
