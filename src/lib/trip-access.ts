export function canEditOwnedTrip(sessionUserId: string | null | undefined, tripUserId: string | null | undefined) {
  return Boolean(sessionUserId && tripUserId && sessionUserId === tripUserId);
}

export function canMutateWithSharePermission(permission: "read" | "edit" | null | undefined) {
  return permission === "edit";
}

export function canManageTripSharing(sessionUserId: string | null | undefined, tripUserId: string | null | undefined) {
  return canEditOwnedTrip(sessionUserId, tripUserId);
}
