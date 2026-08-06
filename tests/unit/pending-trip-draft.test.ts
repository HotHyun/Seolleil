import { describe, expect, it } from "vitest";
import { createPendingTripDraft, parsePendingTripDraft, PENDING_TRIP_DRAFT_TTL_MS } from "@/lib/pending-trip-draft";

describe("pending trip draft", () => {
  it("serializes string form values and restores them on the matching route", () => {
    const formData = new FormData();
    formData.set("resortId", "konjiam");
    formData.set("peopleCount", "4");
    const draft = createPendingTripDraft(formData, "/plan?resortId=konjiam", 100);

    expect(parsePendingTripDraft(JSON.stringify(draft), "/plan?resortId=konjiam", 200)?.values).toEqual({ resortId: "konjiam", peopleCount: "4" });
  });

  it("rejects drafts from another route or after the expiry window", () => {
    const draft = createPendingTripDraft(new FormData(), "/plan?resortId=konjiam", 100);

    expect(parsePendingTripDraft(JSON.stringify(draft), "/plan?resortId=other", 200)).toBeNull();
    expect(parsePendingTripDraft(JSON.stringify(draft), draft.returnTo, 100 + PENDING_TRIP_DRAFT_TTL_MS + 1)).toBeNull();
  });
});
