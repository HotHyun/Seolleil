import { appwriteFetch, appwriteQuery, documentPath, getAppwriteConfig, type AppwriteDocument } from "@/lib/appwrite";
import type { RideType, SkillLevel, TransportType, TripDuration } from "@/lib/types";

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
  resortId: string;
  resortNameSnapshot: string;
  selectedRecommendation: unknown;
  season: string;
  visitDate: Date;
  departureLocation: string;
  peopleCount: number;
  skillLevel: SkillLevel;
  rideType: RideType;
  transportType: TransportType;
  tripDuration: TripDuration;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  needRental: boolean;
  needClothing: boolean;
  budgetMin: number | null;
  budgetMax: number | null;
  lodgingCostInput: number | null;
  liftTicketTimeSlot: string;
  selectedRentalShopId: string | null;
  selectedRentalOptionId: string | null;
  status: TripStatus;
  archivedAt: Date | null;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  tasks: TripTaskRecord[];
};

export type TripCreateInput = Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks"> & {
  tasks: Array<Omit<TripTaskRecord, "id" | "tripId" | "createdAt" | "updatedAt">>;
};

type TripDocument = {
  userId?: string | null;
  editTokenHash: string;
  shareTokenHash: string;
  teamId?: string | null;
  resortId: string;
  resortNameSnapshot: string;
  selectedRecommendation?: string | null;
  season: string;
  visitDate: string;
  departureLocation: string;
  peopleCount: number;
  skillLevel: SkillLevel;
  rideType: RideType;
  transportType: TransportType;
  tripDuration: TripDuration;
  ownsEquipment: boolean;
  ownsClothing: boolean;
  needRental: boolean;
  needClothing: boolean;
  budgetMin?: number | null;
  budgetMax?: number | null;
  lodgingCostInput?: number | null;
  liftTicketTimeSlot: string;
  selectedRentalShopId?: string | null;
  selectedRentalOptionId?: string | null;
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

type ShareLinkDocument = { tripId: string; tokenHash: string; permission: "read" | "edit"; createdBy?: string | null; revokedAt?: string | null };
export type TripShareLinkRecord = { id: string; tripId: string; permission: "read" | "edit"; createdAt: Date; revokedAt: Date | null };

type DocumentList<T> = {
  total: number;
  documents: Array<AppwriteDocument<T>>;
};

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

function mapTask(document: AppwriteDocument<TaskDocument>): TripTaskRecord {
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

function mapTrip(document: AppwriteDocument<TripDocument>, tasks: TripTaskRecord[] = []): TripRecord {
  return {
    id: document.$id,
    userId: document.userId ?? null,
    editTokenHash: document.editTokenHash,
    shareTokenHash: document.shareTokenHash,
    teamId: document.teamId ?? null,
    resortId: document.resortId,
    resortNameSnapshot: document.resortNameSnapshot,
    selectedRecommendation: decodeJson(document.selectedRecommendation),
    season: document.season,
    visitDate: new Date(document.visitDate),
    departureLocation: document.departureLocation,
    peopleCount: document.peopleCount,
    skillLevel: document.skillLevel,
    rideType: document.rideType,
    transportType: document.transportType,
    tripDuration: document.tripDuration,
    ownsEquipment: document.ownsEquipment,
    ownsClothing: document.ownsClothing,
    needRental: document.needRental,
    needClothing: document.needClothing,
    budgetMin: document.budgetMin ?? null,
    budgetMax: document.budgetMax ?? null,
    lodgingCostInput: document.lodgingCostInput ?? null,
    liftTicketTimeSlot: document.liftTicketTimeSlot,
    selectedRentalShopId: document.selectedRentalShopId ?? null,
    selectedRentalOptionId: document.selectedRentalOptionId ?? null,
    status: document.status,
    archivedAt: fromDate(document.archivedAt),
    expiresAt: fromDate(document.expiresAt),
    createdAt: new Date(document.$createdAt),
    updatedAt: new Date(document.$updatedAt),
    tasks
  };
}

async function listDocuments<T>(collectionId: string, queries: string[]) {
  const params = new URLSearchParams();
  for (const query of queries) params.append("queries[]", query);
  return appwriteFetch<DocumentList<T>>(`${documentPath(collectionId)}?${params.toString()}`);
}

async function getTripTasks(tripId: string) {
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<TaskDocument>(collections.tripTasks, [
    appwriteQuery("equal", "tripId", [tripId]),
    appwriteQuery("orderAsc", "category"),
    appwriteQuery("orderAsc", "sortOrder"),
    appwriteQuery("limit", 200)
  ]);
  return result.documents.map(mapTask);
}

export async function createTrip(input: TripCreateInput) {
  const { collections } = getAppwriteConfig();
  const trip = await appwriteFetch<AppwriteDocument<TripDocument>>(documentPath(collections.trips), {
    method: "POST",
    body: JSON.stringify({
      documentId: "unique()",
      data: serializeTrip(input)
    })
  });

  await Promise.all(
    input.tasks.map((task) =>
      appwriteFetch<AppwriteDocument<TaskDocument>>(documentPath(collections.tripTasks), {
        method: "POST",
        body: JSON.stringify({
          documentId: "unique()",
          data: serializeTask({ ...task, tripId: trip.$id })
        })
      })
    )
  );

  return mapTrip(trip, await getTripTasks(trip.$id));
}

function serializeTrip(input: Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks">): TripDocument {
  return {
    userId: input.userId,
    editTokenHash: input.editTokenHash,
    shareTokenHash: input.shareTokenHash,
    teamId: input.teamId,
    resortId: input.resortId,
    resortNameSnapshot: input.resortNameSnapshot,
    selectedRecommendation: encodeJson(input.selectedRecommendation),
    season: input.season,
    visitDate: input.visitDate.toISOString(),
    departureLocation: input.departureLocation,
    peopleCount: input.peopleCount,
    skillLevel: input.skillLevel,
    rideType: input.rideType,
    transportType: input.transportType,
    tripDuration: input.tripDuration,
    ownsEquipment: input.ownsEquipment,
    ownsClothing: input.ownsClothing,
    needRental: input.needRental,
    needClothing: input.needClothing,
    budgetMin: input.budgetMin,
    budgetMax: input.budgetMax,
    lodgingCostInput: input.lodgingCostInput,
    liftTicketTimeSlot: input.liftTicketTimeSlot,
    selectedRentalShopId: input.selectedRentalShopId,
    selectedRentalOptionId: input.selectedRentalOptionId,
    status: input.status,
    archivedAt: toIsoDate(input.archivedAt),
    expiresAt: toIsoDate(input.expiresAt)
  };
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
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<TripDocument>(collections.trips, [
    appwriteQuery("equal", "editTokenHash", [editTokenHash]),
    appwriteQuery("limit", 1)
  ]);
  const document = result.documents[0];
  return document ? mapTrip(document, await getTripTasks(document.$id)) : null;
}

export async function getTripByShareTokenHash(shareTokenHash: string) {
  const link = await getShareLinkByTokenHash(shareTokenHash);
  if (link) return getTripById(link.tripId);
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<TripDocument>(collections.trips, [
    appwriteQuery("equal", "shareTokenHash", [shareTokenHash]),
    appwriteQuery("limit", 1)
  ]);
  const document = result.documents[0];
  return document ? mapTrip(document, await getTripTasks(document.$id)) : null;
}

export async function getShareLinkByTokenHash(tokenHash: string) {
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<ShareLinkDocument>(collections.tripShareLinks, [appwriteQuery("equal", "tokenHash", [tokenHash]), appwriteQuery("limit", 1)]);
  const link = result.documents[0];
  if (!link || link.revokedAt) return null;
  return { id: link.$id, tripId: link.tripId, permission: link.permission, createdAt: new Date(link.$createdAt), revokedAt: fromDate(link.revokedAt) } satisfies TripShareLinkRecord;
}

export async function createTripShareLink(input: { tripId: string; tokenHash: string; permission: "read" | "edit"; createdBy?: string | null }) {
  const { collections } = getAppwriteConfig();
  return appwriteFetch<AppwriteDocument<ShareLinkDocument>>(documentPath(collections.tripShareLinks), { method: "POST", body: JSON.stringify({ documentId: "unique()", data: { ...input, revokedAt: null } }) });
}

export async function listTripShareLinks(tripId: string) {
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<ShareLinkDocument>(collections.tripShareLinks, [appwriteQuery("equal", "tripId", [tripId]), appwriteQuery("limit", 100)]);
  return result.documents
    .map(link => ({ id: link.$id, tripId: link.tripId, permission: link.permission, createdAt: new Date(link.$createdAt), revokedAt: fromDate(link.revokedAt) } satisfies TripShareLinkRecord))
    .sort((left, right) => right.createdAt.getTime() - left.createdAt.getTime());
}

export async function revokeTripShareLink(id: string, tripId: string) {
  const { collections } = getAppwriteConfig();
  const link = await appwriteFetch<AppwriteDocument<ShareLinkDocument>>(documentPath(collections.tripShareLinks, id));
  if (link.tripId !== tripId) throw new Error("Share link does not belong to trip");
  await appwriteFetch(documentPath(collections.tripShareLinks, id), { method: "PATCH", body: JSON.stringify({ data: { revokedAt: new Date().toISOString() } }) });
}

export async function revokeTripShareLinks(tripId: string) {
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<ShareLinkDocument>(collections.tripShareLinks, [appwriteQuery("equal", "tripId", [tripId]), appwriteQuery("limit", 100)]);
  await Promise.all(result.documents.filter(link => !link.revokedAt).map(link => appwriteFetch(documentPath(collections.tripShareLinks, link.$id), { method: "PATCH", body: JSON.stringify({ data: { revokedAt: new Date().toISOString() } }) })));
}

export async function getTripById(id: string) {
  const { collections } = getAppwriteConfig();
  try {
    const document = await appwriteFetch<AppwriteDocument<TripDocument>>(documentPath(collections.trips, id));
    return mapTrip(document, await getTripTasks(document.$id));
  } catch {
    return null;
  }
}

export async function getTripsByUserId(userId: string) {
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<TripDocument>(collections.trips, [
    appwriteQuery("equal", "userId", [userId]),
    appwriteQuery("notEqual", "status", ["deleted"]),
    appwriteQuery("orderAsc", "visitDate"),
    appwriteQuery("orderDesc", "$createdAt"),
    appwriteQuery("limit", 100)
  ]);
  const trips = await Promise.all(result.documents.map(async (document) => mapTrip(document, await getTripTasks(document.$id))));
  return trips;
}

export async function getTripsByTeamIds(teamIds: string[]) {
  if (!teamIds.length) return [];
  const { collections } = getAppwriteConfig();
  const result = await listDocuments<TripDocument>(collections.trips, [appwriteQuery("equal", "teamId", teamIds), appwriteQuery("notEqual", "status", ["deleted"]), appwriteQuery("limit", 100)]);
  return Promise.all(result.documents.map(async document => mapTrip(document, await getTripTasks(document.$id))));
}

export async function updateTrip(id: string, data: Partial<Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks">>) {
  const { collections } = getAppwriteConfig();
  const document = await appwriteFetch<AppwriteDocument<TripDocument>>(documentPath(collections.trips, id), {
    method: "PATCH",
    body: JSON.stringify({
      data: serializePartialTrip(data)
    })
  });
  return mapTrip(document, await getTripTasks(document.$id));
}

function serializePartialTrip(data: Partial<Omit<TripRecord, "id" | "createdAt" | "updatedAt" | "tasks">>) {
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Date) serialized[key] = value.toISOString();
    else if (key === "selectedRecommendation") serialized[key] = encodeJson(value);
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
  const { collections } = getAppwriteConfig();
  const serialized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    serialized[key] = value instanceof Date ? value.toISOString() : value;
  }
  return appwriteFetch<AppwriteDocument<TaskDocument>>(documentPath(collections.tripTasks, id), {
    method: "PATCH",
    body: JSON.stringify({ data: serialized })
  });
}

export async function createTask(
  input: Omit<TripTaskRecord, "id" | "createdAt" | "updatedAt" | "memo" | "dueDate" | "externalUrl"> &
    Partial<Pick<TripTaskRecord, "memo" | "dueDate" | "externalUrl">>
) {
  const { collections } = getAppwriteConfig();
  return appwriteFetch<AppwriteDocument<TaskDocument>>(documentPath(collections.tripTasks), {
    method: "POST",
    body: JSON.stringify({
      documentId: "unique()",
      data: serializeTask({
        ...input,
        memo: input.memo ?? null,
        dueDate: input.dueDate ?? null,
        externalUrl: input.externalUrl ?? null
      })
    })
  });
}

export async function deleteTask(id: string) {
  const { collections } = getAppwriteConfig();
  await appwriteFetch<void>(documentPath(collections.tripTasks, id), { method: "DELETE" });
}

export async function deleteTrip(id: string) {
  const { collections } = getAppwriteConfig();
  const tasks = await getTripTasks(id);
  await Promise.all(tasks.map((task) => deleteTask(task.id)));
  await appwriteFetch<void>(documentPath(collections.trips, id), { method: "DELETE" });
}

export async function recordAnalyticsEvent(input: { tripId?: string | null; eventName: string; properties?: unknown }) {
  const { collections } = getAppwriteConfig();
  await appwriteFetch<AppwriteDocument<EventDocument>>(documentPath(collections.analyticsEvents), {
    method: "POST",
    body: JSON.stringify({
      documentId: "unique()",
      data: {
        tripId: input.tripId ?? null,
        eventName: input.eventName,
        properties: encodeJson(input.properties ?? {})
      }
    })
  });
}
