export function canEditOwnedTrip(sessionUserId: string | null | undefined, tripUserId: string | null | undefined) {
  return Boolean(sessionUserId && tripUserId && sessionUserId === tripUserId);
}
