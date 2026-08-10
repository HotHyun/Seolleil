export function canEditOwnedTrip(sessionUserId: string | null | undefined, tripUserId: string | null | undefined) {
  return Boolean(sessionUserId && tripUserId && sessionUserId === tripUserId);
}

export function canMutateWithSharePermission(permission: "read" | "edit" | null | undefined) {
  return permission === "edit";
}

export function canManageTripSharing(sessionUserId: string | null | undefined, tripUserId: string | null | undefined) {
  return canEditOwnedTrip(sessionUserId, tripUserId);
}

export function createdTripDestination({ tripId, editToken, userId }: { tripId: string; editToken: string; userId?: string | null }) {
  const path = userId ? `/my-trips/${tripId}` : `/trips/${editToken}`;
  const notice = userId ? "내 트립에 저장했어요." : "비공개 트립을 만들었어요.";
  return `${path}?notice=${encodeURIComponent(notice)}`;
}
