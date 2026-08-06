export const PENDING_TRIP_DRAFT_KEY = "korean-ski:pending-trip-draft";
export const PENDING_TRIP_DRAFT_VERSION = 1;
export const PENDING_TRIP_DRAFT_TTL_MS = 24 * 60 * 60 * 1000;

export type PendingTripDraft = {
  version: typeof PENDING_TRIP_DRAFT_VERSION;
  savedAt: number;
  returnTo: string;
  values: Record<string, string>;
};

export function createPendingTripDraft(formData: FormData, returnTo: string, savedAt = Date.now()): PendingTripDraft {
  const values: Record<string, string> = {};
  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") values[key] = value;
  }

  return { version: PENDING_TRIP_DRAFT_VERSION, savedAt, returnTo, values };
}

export function parsePendingTripDraft(raw: string | null, returnTo: string, now = Date.now()): PendingTripDraft | null {
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as Partial<PendingTripDraft>;
    if (
      draft.version !== PENDING_TRIP_DRAFT_VERSION ||
      typeof draft.savedAt !== "number" ||
      draft.returnTo !== returnTo ||
      !draft.values ||
      typeof draft.values !== "object" ||
      now - draft.savedAt > PENDING_TRIP_DRAFT_TTL_MS
    ) return null;

    return draft as PendingTripDraft;
  } catch {
    return null;
  }
}

export function currentPathWithSearch() {
  return `${window.location.pathname}${window.location.search}`;
}

export function readPendingTripDraft(returnTo = currentPathWithSearch()) {
  return parsePendingTripDraft(window.sessionStorage.getItem(PENDING_TRIP_DRAFT_KEY), returnTo);
}

export function savePendingTripDraft(form: HTMLFormElement, returnTo = currentPathWithSearch()) {
  const draft = createPendingTripDraft(new FormData(form), returnTo);
  window.sessionStorage.setItem(PENDING_TRIP_DRAFT_KEY, JSON.stringify(draft));
  return draft;
}

export function clearPendingTripDraft() {
  window.sessionStorage.removeItem(PENDING_TRIP_DRAFT_KEY);
}
