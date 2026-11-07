import { createFirebaseDocument, deleteFirebaseDocument, getFirebaseCollections, getFirebaseDocument, queryFirebaseDocuments, updateFirebaseDocument, type FirebaseDocument } from "@/lib/firebase";
import { decryptShareToken, encryptShareToken } from "@/lib/token-vault";
import type { RideType, SkillLevel, TransportType, TripDuration } from "@/lib/types";
import { EMPTY_TRIP_BUDGET, parseTripBudget, type TripBudgetState } from "@/lib/trip-budget";
import { parseTripSkiPlan, type TripSkiPlan } from "@/lib/trip-ski-plan";
import { normalizeTransportType } from "@/lib/transport";
import { rentalPriceRules } from "@/data/prices";

export type TripStatus = "planning" | "ready" | "completed" | "archived" | "deleted";
export type TripTaskStatus = "not_needed" | "needs_check" | "planned" | "reserved" | "paid" | "prepared";

export type TripTaskRecord = {
  id: string;
  tripId: string;
  category: string;
  title: string;
  status: TripTaskStatus;
  memo: string | null;
  isDefault: boolean;
  sortOrder: number;
  dueDate: Date | null;
  externalUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type TripRecord = {
  id: string;
  userId: string | null;
  editTokenHash: string;
  shareTokenHash: string;
  teamId: string | null;
  tripName: string | null;
  tripMemo: string | null;
  resortId: string;
  resortNameSnapshot: string;
  selectedRecommendation: unknown;
  season: string;
  visitDate: Date;
  endDate: Date;
  departureLocation: string;
  peopleCount: number;
  skillLevel: SkillLevel;
  rideType: RideType;
  transportType: TransportType;
  shuttleRouteId: string | null;
  shuttleStopId: string | null;
  tripDuration: TripDuration;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  needRental: boolean;
  needClothing: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  lodgingCostInput: number | null;
  lodgingName: string | null;
  lodgingUrl: string | null;
  splitCount: number;
  budgetData: TripBudgetState;
  liftTicketTimeSlot: string;
  selectedRentalShopId: string | null;
  selectedRentalOptionId: string | null;
  selectedLiftTicketOptionId: string | null;
  skiPlan: TripSkiPlan;
  status: TripStatus;
  archivedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: TripTaskRecord[];
};

export type TripCreateInput = Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks" | "shuttleRouteId" | "shuttleStopId"> & {
  shuttleRouteId?: string | null;
  shuttleStopId?: string | null;
  tasks: Array<Omit<TripTaskRecord, "id" | "tripId" | "createdAt" | "updatedAt">>;
};

type TripDocument = {
  userId?: string | null;
  editTokenHash: string;
  shareTokenHash: string;
  teamId?: string | null;
  tripName?: string | null;
  tripMemo?: string | null;
  resortId: string;
  resortNameSnapshot: string;
  selectedRecommendation?: string | null;
  season: string;
  visitDate: string;
  endDate?: string | null;
  departureLocation: string;
  peopleCount: number;
  skillLevel: SkillLevel;
  rideType: RideType;
  transportType: TransportType;
  shuttleRouteId?: string | null;
  shuttleStopId?: string | null;
  tripDuration: TripDuration;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  needRental: boolean;
  needClothing: boolean;
  budgetMin?: number | null;
  budgetMax?: number | null;
  lodgingCostInput?: number | null;
  lodgingName?: string | null;
  lodgingUrl?: string | null;
  splitCount?: number;
  budgetData?: string | null;
  liftTicketTimeSlot: string;
  selectedRentalShopId?: string | null;
  selectedRentalOptionId?: string | null;
  selectedLiftTicketOptionId?: string | null;
  skiPlanData?: string | null;
  status: TripStatus;
  archivedAt?: string | null;
  expiresAt?: string | null;
};

type TaskDocument = {
  tripId: string;
  category: string;
  title: string;
  status: TripTaskStatus;
  memo?: string | null;
  isDefault: boolean;
  sortOrder: number;
  dueDate?: string | null;
  externalUrl?: string | null;
};

type EventDocument = {
  tripId?: string | null;
  eventName: string;
  properties?: string | null;
};

type ShareLinkDocument = { tripId: string; tokenHash: string; tokenCiphertext?: string | null; permission: "read" | "edit"; createdBy?: string | null; revokedAt?: string | null };
export type TripShareLinkRecord = { id: string; tripId: string; sharePath: string | null; permission: "read" | "edit"; createdAt: Date; revokedAt: Date | null };

function toIsoDate(value: Date | null | undefined) {
  return value ? value.toISOString() : null;
}

function fromDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function encodeJson(value: unknown) {
  return value === undefined ? null : JSON.stringify(value);
}

function decodeJson(value?: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}

function mapTask(document: FirebaseDocument<TaskDocument>): TripTaskRecord {
  return {
    id: document.$id,
    tripId: document.tripId,
    category: document.category,
    title: document.title,
    status: document.status,
    memo: document.memo ?? null,
    isDefault: document.isDefault,
    sortOrder: document.sortOrder,
    dueDate: fromDate(document.dueDate),
    externalUrl: document.externalUrl ?? null,
    createdAt: new Date(document.$createdAt),
    updatedAt: new Date(document.$updatedAt)
  };
}

function mapBudget(document: TripDocument) {
  const budget = parseTripBudget(decodeJson(document.budgetData) ?? EMPTY_TRIP_BUDGET);
  if (budget.overrides.lodging === undefined && document.lodgingCostInput != null) {
    return { ...budget, overrides: { ...budget.overrides, lodging: document.lodgingCostInput } };
  }
  return budget;
}

function mapTrip(document: FirebaseDocument<TripDocument>, tasks: TripTaskRecord[] = []): TripRecord {
  const visitDate = new Date(document.visitDate);
  const endDate = new Date(document.endDate ?? document.visitDate);
  return {
    id: document.$id,
    userId: document.userId ?? null,
    editTokenHash: document.editTokenHash,
    shareTokenHash: document.shareTokenHash,
    teamId: document.teamId ?? null,
    tripName: document.tripName ?? null,
    tripMemo: document.tripMemo ?? null,
    resortId: document.resortId,
    resortNameSnapshot: document.resortNameSnapshot,
    selectedRecommendation: decodeJson(document.selectedRecommendation),
    season: document.season,
    visitDate,
    endDate,
    departureLocation: document.departureLocation,
    peopleCount: document.peopleCount,
    skillLevel: document.skillLevel,
    rideType: document.rideType,
    transportType: normalizeTransportType(document.transportType),
    shuttleRouteId: document.shuttleRouteId ?? null,
    shuttleStopId: document.shuttleStopId ?? null,
    tripDuration: document.tripDuration,
    ownsEquipment: document.ownsEquipment,
    ownsClothing: document.ownsClothing,
    needRental: document.needRental,
    needClothing: document.needClothing,
    budgetMin: document.budgetMin ?? null,
    budgetMax: document.budgetMax ?? null,
    lodgingCostInput: document.lodgingCostInput ?? null,
    lodgingName: document.lodgingName ?? null,
    lodgingUrl: document.lodgingUrl ?? null,
    splitCount: document.splitCount ?? document.peopleCount,
    budgetData: mapBudget(document),
    liftTicketTimeSlot: document.liftTicketTimeSlot,
    selectedRentalShopId: document.selectedRentalShopId ?? null,
    selectedRentalOptionId: document.selectedRentalOptionId ?? null,
    selectedLiftTicketOptionId: document.selectedLiftTicketOptionId ?? null,
    skiPlan: parseTripSkiPlan(decodeJson(document.skiPlanData), {
      visitDate,
      endDate,
      liftTicketTimeSlot: document.liftTicketTimeSlot,
      selectedRentalShopId: document.selectedRentalShopId,
      selectedRentalOptionId: document.selectedRentalOptionId,
      selectedLiftTicketOptionId: document.selectedLiftTicketOptionId,
      rentalOptions: rentalPriceRules,
      transportType: normalizeTransportType(document.transportType),
      shuttleRouteId: document.shuttleRouteId,
      shuttleStopId: document.shuttleStopId,
      lodgingName: document.lodgingName,
      lodgingUrl: document.lodgingUrl,
      lodgingCostInput: document.lodgingCostInput
    }),
    status: document.status,
    archivedAt: fromDate(document.archivedAt),
    expiresAt: fromDate(document.expiresAt),
    createdAt: new Date(document.$createdAt),
    updatedAt: new Date(document.$updatedAt),
    tasks
  };
}

async function getTripTasks(tripId: string) {
  const { tripTasks } = getFirebaseCollections();
  const tasks = await queryFirebaseDocuments<TaskDocument>(tripTasks, "tripId", tripId, 200);
  return tasks.map(mapTask).sort((left, right) => left.category.localeCompare(right.category) || left.sortOrder - right.sortOrder);
}

export async function createTrip(input: TripCreateInput) {
  const { trips: tripsCollection, tripTasks } = getFirebaseCollections();
  const trip = await createFirebaseDocument<TripDocument>(tripsCollection, serializeTrip(input));

  await Promise.all(
    input.tasks.map((task) =>
      createFirebaseDocument<TaskDocument>(tripTasks, serializeTask({ ...task, tripId: trip.$id }))
    )
  );

  return mapTrip(trip, await getTripTasks(trip.$id));
}

function serializeTrip(input: TripCreateInput): TripDocument {
  return {
    userId: input.userId,
    editTokenHash: input.editTokenHash,
    shareTokenHash: input.shareTokenHash,
    teamId: input.teamId,
    tripName: input.tripName,
    tripMemo: input.tripMemo,
    resortId: input.resortId,
    resortNameSnapshot: input.resortNameSnapshot,
    selectedRecommendation: encodeJson(input.selectedRecommendation),
    season: input.season,
    visitDate: input.visitDate.toISOString(),
    endDate: input.endDate.toISOString(),
    departureLocation: input.departureLocation,
    peopleCount: input.peopleCount,
    skillLevel: input.skillLevel,
    rideType: input.rideType,
    transportType: input.transportType,
    shuttleRouteId: input.shuttleRouteId ?? null,
    shuttleStopId: input.shuttleStopId ?? null,
    tripDuration: input.tripDuration,
    ownsEquipment: input.ownsEquipment,
    ownsClothing: input.ownsClothing,
    needRental: input.needRental,
    needClothing: input.needClothing,
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    lodgingCostInput: input.lodgingCostInput,
    lodgingName: input.lodgingName,
    lodgingUrl: input.lodgingUrl,
    splitCount: input.splitCount,
    budgetData: encodeJson(input.budgetData),
    liftTicketTimeSlot: input.liftTicketTimeSlot,
    selectedRentalShopId: input.selectedRentalShopId,
    selectedRentalOptionId: input.selectedRentalOptionId,
    selectedLiftTicketOptionId: input.selectedLiftTicketOptionId,
    skiPlanData: encodeJson(input.skiPlan),
    status: input.status,
    archivedAt: toIsoDate(input.archivedAt),
    expiresAt: toIsoDate(input.expiresAt)
  };
}

export function getTripDisplayName(trip: Pick<TripRecord, "tripName" | "resortNameSnapshot">) {
  return trip.tripName?.trim() || `${trip.resortNameSnapshot} 트립`;
}

function serializeTask(input: Omit<TripTaskRecord, "id" | "createdAt" | "updatedAt">): TaskDocument {
  return {
    tripId: input.tripId,
    category: input.category,
    title: input.title,
    status: input.status,
    memo: input.memo,
    isDefault: input.isDefault,
    sortOrder: input.sortOrder,
    dueDate: toIsoDate(input.dueDate),
    externalUrl: input.externalUrl
  };
}

export async function getTripByEditTokenHash(editTokenHash: string) {
  const { trips } = getFirebaseCollections();
  const [document] = await queryFirebaseDocuments<TripDocument>(trips, "editTokenHash", editTokenHash, 1);
  return document ? mapTrip(document, await getTripTasks(document.$id)) : null;
}

export async function getTripByShareTokenHash(shareTokenHash: string, resolvedLink?: TripShareLinkRecord | null) {
  const link = resolvedLink === undefined ? await getShareLinkByTokenHash(shareTokenHash) : resolvedLink;
  if (link) return getTripById(link.tripId);
  const { trips } = getFirebaseCollections();
  const [document] = await queryFirebaseDocuments<TripDocument>(trips, "shareTokenHash", shareTokenHash, 1);
  return document ? mapTrip(document, await getTripTasks(document.$id)) : null;
}

export async function getShareLinkByTokenHash(tokenHash: string) {
  const { tripShareLinks } = getFirebaseCollections();
  const [link] = await queryFirebaseDocuments<ShareLinkDocument>(tripShareLinks, "tokenHash", tokenHash, 1);
  if (!link || link.revokedAt) return null;
  return { id: link.$id, tripId: link.tripId, sharePath: null, permission: link.permission, createdAt: new Date(link.$createdAt), revokedAt: fromDate(link.revokedAt) } satisfies TripShareLinkRecord;
}

export async function createTripShareLink(input: { tripId: string; tokenHash: string; tokenValue: string; permission: "read" | "edit"; createdBy?: string | null }) {
  const { tripShareLinks } = getFirebaseCollections();
  const { tokenValue, ...data } = input;
  return createFirebaseDocument<ShareLinkDocument>(tripShareLinks, { ...data, tokenCiphertext: await encryptShareToken(tokenValue), revokedAt: null });
}

export async function listTripShareLinks(tripId: string) {
  const { tripShareLinks } = getFirebaseCollections();
  const links = await queryFirebaseDocuments<ShareLinkDocument>(tripShareLinks, "tripId", tripId, 100);
  const mapped = await Promise.all(links.map(async link => ({ id: link.$id, tripId: link.tripId, sharePath: link.tokenCiphertext ? `/share/${await decryptShareToken(link.tokenCiphertext)}` : null, permission: link.permission, createdAt: new Date(link.$createdAt), revokedAt: fromDate(link.revokedAt) } satisfies TripShareLinkRecord)));
  return mapped.sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function revokeTripShareLink(id: string, tripId: string) {
  const { tripShareLinks } = getFirebaseCollections();
  const link = await getFirebaseDocument<ShareLinkDocument>(tripShareLinks, id);
  if (!link) throw new Error("Share link does not exist");
  assertShareLinkBelongsToTrip(link.tripId, tripId);
  await updateFirebaseDocument<ShareLinkDocument>(tripShareLinks, id, { revokedAt: new Date().toISOString() });
}

export function assertShareLinkBelongsToTrip(linkTripId: string, requestedTripId: string) {
  if (linkTripId !== requestedTripId) throw new Error("Share link does not belong to trip");
}

export async function revokeTripShareLinks(tripId: string) {
  const { tripShareLinks } = getFirebaseCollections();
  const links = await queryFirebaseDocuments<ShareLinkDocument>(tripShareLinks, "tripId", tripId, 100);
  await Promise.all(links.filter(link => !link.revokedAt).map(link => updateFirebaseDocument(tripShareLinks, link.$id, { revokedAt: new Date().toISOString() })));
}

export async function getTripById(id: string) {
  const { trips } = getFirebaseCollections();
  try {
    const document = await getFirebaseDocument<TripDocument>(trips, id);
    if (!document) return null;
    return mapTrip(document, await getTripTasks(document.$id));
  } catch {
    return null;
  }
}

export async function getTripsByUserId(userId: string) {
  const { trips: tripsCollection } = getFirebaseCollections();
  const documents = await queryFirebaseDocuments<TripDocument>(tripsCollection, "userId", userId, 100);
  const visible = documents.filter(document => document.status !== "deleted");
  const trips = await Promise.all(visible.map(async document => mapTrip(document, await getTripTasks(document.$id))));
  return trips.sort((left, right) => left.visitDate.getTime() - right.visitDate.getTime() || right.createdAt.getTime() - left.createdAt.getTime());
}

export async function getTripsByTeamIds(teamIds: string[]) {
  if (!teamIds.length) return [];
  const { trips: tripsCollection } = getFirebaseCollections();
  const result = await Promise.all(teamIds.map(teamId => queryFirebaseDocuments<TripDocument>(tripsCollection, "teamId", teamId, 100)));
  const documents = [...new Map(result.flat().filter(document => document.status !== "deleted").map(document => [document.$id, document])).values()];
  return Promise.all(documents.map(async document => mapTrip(document, await getTripTasks(document.$id))));
}

export async function updateTrip(id: string, data: Partial<Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks">>) {
  const { trips } = getFirebaseCollections();
  const document = await updateFirebaseDocument<TripDocument>(trips, id, serializePartialTrip(data));
  return mapTrip(document, await getTripTasks(document.$id));
}

function serializePartialTrip(data: Partial<Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks">>) {
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) serialized[key] = value.toISOString();
    else if (key === "selectedRecommendation" || key === "budgetData" || key === "skiPlan") {
      serialized[key === "skiPlan" ? "skiPlanData" : key] = encodeJson(value);
    }
    else serialized[key] = value;
  }
  return serialized;
}

export async function updateDefaultTasksForTrip(
  tripId: string,
  tasks: Array<{ category: string; title: string; externalUrl?: string }>
) {
  const existing = await getTripTasks(tripId);
  await Promise.all(
    tasks.map((task) => {
      const match = existing.find((item) => item.isDefault && item.category === task.category && item.title === task.title);
      if (!match) return Promise.resolve();
      return updateTask(match.id, {
        externalUrl: task.externalUrl ?? null,
        dueDate: null
      });
    })
  );
}

export async function updateTask(id: string, data: Partial<Omit<TripTaskRecord, "id" | "tripId" | "createdAt" | "updatedAt">>) {
  const { tripTasks } = getFirebaseCollections();
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    serialized[key] = value instanceof Date ? value.toISOString() : value;
  }
  return updateFirebaseDocument<TaskDocument>(tripTasks, id, serialized);
}

export async function createTask(
  input: Omit<TripTaskRecord, "id" | "createdAt" | "updatedAt" | "memo" | "dueDate" | "externalUrl"> &
    Partial<Pick<TripTaskRecord, "memo" | "dueDate" | "externalUrl">>
) {
  const { tripTasks } = getFirebaseCollections();
  return createFirebaseDocument<TaskDocument>(tripTasks, serializeTask({
    ...input,
    memo: input.memo ?? null,
    dueDate: input.dueDate ?? null,
    externalUrl: input.externalUrl ?? null
  }));
}

export async function deleteTask(id: string) {
  const { tripTasks } = getFirebaseCollections();
  await deleteFirebaseDocument(tripTasks, id);
}

export async function deleteTrip(id: string) {
  const { trips, tripShareLinks, tripMemberships, tripTeams } = getFirebaseCollections();
  const tasks = await getTripTasks(id);
  const [shareLinks, memberships, teams] = await Promise.all([
    queryFirebaseDocuments<ShareLinkDocument>(tripShareLinks, "tripId", id, 200),
    queryFirebaseDocuments<{ tripId: string }>(tripMemberships, "tripId", id, 200),
    queryFirebaseDocuments<{ tripId: string }>(tripTeams, "tripId", id, 100)
  ]);
  await Promise.all([
    ...tasks.map(task => deleteTask(task.id)),
    ...shareLinks.map(link => deleteFirebaseDocument(tripShareLinks, link.$id)),
    ...memberships.map(membership => deleteFirebaseDocument(tripMemberships, membership.$id)),
    ...teams.map(team => deleteFirebaseDocument(tripTeams, team.$id))
  ]);
  await deleteFirebaseDocument(trips, id);
}

export async function recordAnalyticsEvent(input: { tripId?: string | null; eventName: string; properties?: unknown }) {
  const { analyticsEvents } = getFirebaseCollections();
  await createFirebaseDocument<EventDocument>(analyticsEvents, {
    tripId: input.tripId ?? null,
    eventName: input.eventName,
    properties: encodeJson(input.properties ?? {})
  });
}
