import type { LegacyTransportType, TransportType } from "@/lib/types";

export type { LegacyTransportType } from "@/lib/types";

export function isLegacyTransportType(value: unknown): value is LegacyTransportType {
  return value === "car"
    || value === "public_transit"
    || value === "shuttle"
    || value === "bus";
}

export function normalizeTransportType(value: unknown, fallback: TransportType = "car"): TransportType {
  if (value === "car") return "car";
  if (value === "public_transit" || value === "shuttle" || value === "bus") return "public_transit";
  return fallback;
}

export function transportTypeLabel(value: unknown) {
  return normalizeTransportType(value) === "car" ? "자차" : "대중교통";
}
