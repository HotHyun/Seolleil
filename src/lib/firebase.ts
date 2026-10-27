import "server-only";

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

type FirestoreValue = Record<string, unknown>;
type FirestoreDocument = {
  name: string;
  fields?: Record<string, FirestoreValue>;
  createTime?: string;
  updateTime?: string;
};

export type FirebaseDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

type FirestoreListResponse = {
  documents?: FirestoreDocument[];
  nextPageToken?: string;
};

type GoogleTokenResponse = { access_token: string; expires_in: number };

class FirebaseHttpError extends Error {
  constructor(readonly status: number) {
    super(`Firebase database request failed (${status}).`);
  }
}

let accessToken: string | undefined;
let accessTokenExpiresAt = 0;
let accessTokenRequest: Promise<string> | undefined;

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required Firebase environment variable: ${name}`);
  return value;
}

export function getFirebaseProjectId() {
  return requiredEnv("FIREBASE_PROJECT_ID");
}

export function getFirebaseCollections() {
  return {
    trips: process.env.FIREBASE_TRIPS_COLLECTION ?? "trips",
    tripTasks: process.env.FIREBASE_TRIP_TASKS_COLLECTION ?? "trip_tasks",
    analyticsEvents: process.env.FIREBASE_ANALYTICS_EVENTS_COLLECTION ?? "analytics_events",
    tripShareLinks: process.env.FIREBASE_TRIP_SHARE_LINKS_COLLECTION ?? "trip_share_links",
    tripMemberships: process.env.FIREBASE_TRIP_MEMBERSHIPS_COLLECTION ?? "trip_memberships",
    tripTeams: process.env.FIREBASE_TRIP_TEAMS_COLLECTION ?? "trip_teams"
  };
}

function getServiceAccount(): ServiceAccount {
  const raw = requiredEnv("FIREBASE_SERVICE_ACCOUNT_JSON");
  let account: Partial<ServiceAccount>;
  try {
    account = JSON.parse(raw) as Partial<ServiceAccount>;
  } catch {
    throw new Error("FIREBASE_SERVICE_ACCOUNT_JSON must contain a service account JSON object.");
  }
  if (!account.project_id || !account.client_email || !account.private_key) {
    throw new Error("Firebase service account JSON is missing required fields.");
  }
  if (account.project_id !== getFirebaseProjectId()) {
    throw new Error("Firebase service account project does not match FIREBASE_PROJECT_ID.");
  }
  return account as ServiceAccount;
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function encodeBase64Url(value: string) {
  return base64Url(new TextEncoder().encode(value));
}

function pemToBytes(pem: string) {
  const base64 = pem.replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, "");
  const binary = atob(base64);
  return Uint8Array.from(binary, character => character.charCodeAt(0));
}

async function createGoogleAssertion(account: ServiceAccount) {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = encodeBase64Url(JSON.stringify({
    iss: account.client_email,
    scope: "https://www.googleapis.com/auth/datastore",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600
  }));
  const signingInput = `${header}.${payload}`;
  const privateKey = await crypto.subtle.importKey("pkcs8", pemToBytes(account.private_key), {
    name: "RSASSA-PKCS1-v1_5",
    hash: "SHA-256"
  }, false, ["sign"]);
  const signature = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, new TextEncoder().encode(signingInput));
  return `${signingInput}.${base64Url(new Uint8Array(signature))}`;
}

async function requestAccessToken() {
  const account = getServiceAccount();
  const assertion = await createGoogleAssertion(account);
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    }),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Firebase service authentication failed (${response.status}).`);
  const token = await response.json() as GoogleTokenResponse;
  accessToken = token.access_token;
  accessTokenExpiresAt = Date.now() + token.expires_in * 1000 - 60_000;
  return accessToken;
}

async function getAccessToken() {
  if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;
  if (!accessTokenRequest) {
    accessTokenRequest = requestAccessToken().finally(() => { accessTokenRequest = undefined; });
  }
  return accessTokenRequest;
}

function documentsBase() {
  return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(getFirebaseProjectId())}/databases/(default)/documents`;
}

function encodeValue(value: unknown): FirestoreValue {
  if (value === null || value === undefined) return { nullValue: null };
  if (typeof value === "string") return { stringValue: value };
  if (typeof value === "boolean") return { booleanValue: value };
  if (typeof value === "number") {
    return Number.isInteger(value) ? { integerValue: String(value) } : { doubleValue: value };
  }
  if (value instanceof Date) return { timestampValue: value.toISOString() };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(encodeValue) } };
  if (typeof value === "object") {
    const fields = Object.fromEntries(Object.entries(value as Record<string, unknown>)
      .filter(([, child]) => child !== undefined)
      .map(([key, child]) => [key, encodeValue(child)]));
    return { mapValue: { fields } };
  }
  return { stringValue: String(value) };
}

function decodeValue(value?: FirestoreValue): unknown {
  if (!value) return undefined;
  if ("nullValue" in value) return null;
  if ("stringValue" in value) return value.stringValue;
  if ("booleanValue" in value) return value.booleanValue;
  if ("integerValue" in value) return Number(value.integerValue);
  if ("doubleValue" in value) return value.doubleValue;
  if ("timestampValue" in value) return value.timestampValue;
  if ("arrayValue" in value) {
    const array = value.arrayValue as { values?: FirestoreValue[] };
    return (array.values ?? []).map(decodeValue);
  }
  if ("mapValue" in value) {
    const map = value.mapValue as { fields?: Record<string, FirestoreValue> };
    return Object.fromEntries(Object.entries(map.fields ?? {}).map(([key, child]) => [key, decodeValue(child)]));
  }
  return undefined;
}

function mapDocument<T>(document: FirestoreDocument): FirebaseDocument<T> {
  const id = document.name.split("/").at(-1) ?? "";
  const data = Object.fromEntries(Object.entries(document.fields ?? {}).map(([key, value]) => [key, decodeValue(value)]));
  const createdAt = document.createTime ?? document.updateTime ?? new Date().toISOString();
  const updatedAt = document.updateTime ?? createdAt;
  return { ...data, $id: id, $createdAt: createdAt, $updatedAt: updatedAt } as FirebaseDocument<T>;
}

function encodeFields(data: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(data)
    .filter(([, value]) => value !== undefined)
    .map(([key, value]) => [key, encodeValue(value)]));
}

async function firestoreRequest<T>(url: string, init: RequestInit = {}): Promise<T> {
  const token = await getAccessToken();
  const response = await fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    if (response.status !== 404) console.error("Firestore request failed", { status: response.status });
    throw new FirebaseHttpError(response.status);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function firebaseDocumentPath(collectionId: string, documentId?: string) {
  const collection = encodeURIComponent(collectionId);
  return documentId
    ? `${documentsBase()}/${collection}/${encodeURIComponent(documentId)}`
    : `${documentsBase()}/${collection}`;
}

export async function getFirebaseDocument<T>(collectionId: string, documentId: string) {
  try {
    const document = await firestoreRequest<FirestoreDocument>(firebaseDocumentPath(collectionId, documentId));
    return mapDocument<T>(document);
  } catch (error) {
    if (error instanceof FirebaseHttpError && error.status === 404) return null;
    throw error;
  }
}

export async function listFirebaseDocuments<T>(collectionId: string) {
  const all: FirebaseDocument<T>[] = [];
  let pageToken: string | undefined;
  do {
    const params = new URLSearchParams({ pageSize: "1000" });
    if (pageToken) params.set("pageToken", pageToken);
    const result = await firestoreRequest<FirestoreListResponse>(`${firebaseDocumentPath(collectionId)}?${params}`);
    all.push(...(result.documents ?? []).map(mapDocument<T>));
    pageToken = result.nextPageToken;
  } while (pageToken);
  return all;
}

export async function queryFirebaseDocuments<T>(collectionId: string, field: string, value: unknown, limit = 1000) {
  const result = await firestoreRequest<Array<{ document?: FirestoreDocument }>>(
    `${documentsBase()}:runQuery`,
    {
      method: "POST",
      body: JSON.stringify({
        structuredQuery: {
          from: [{ collectionId }],
          where: {
            fieldFilter: {
              field: { fieldPath: field },
              op: "EQUAL",
              value: encodeValue(value)
            }
          },
          limit
        }
      })
    }
  );
  return result.flatMap(item => item.document ? [mapDocument<T>(item.document)] : []);
}

export async function createFirebaseDocument<T>(collectionId: string, data: Record<string, unknown>, id = crypto.randomUUID().replace(/-/g, "")) {
  const params = new URLSearchParams({ documentId: id });
  const document = await firestoreRequest<FirestoreDocument>(`${firebaseDocumentPath(collectionId)}?${params}`, {
    method: "POST",
    body: JSON.stringify({ fields: encodeFields(data) })
  });
  return mapDocument<T>(document);
}

export async function updateFirebaseDocument<T>(collectionId: string, id: string, data: Record<string, unknown>) {
  const params = new URLSearchParams();
  for (const key of Object.keys(data)) params.append("updateMask.fieldPaths", key);
  const document = await firestoreRequest<FirestoreDocument>(`${firebaseDocumentPath(collectionId, id)}?${params}`, {
    method: "PATCH",
    body: JSON.stringify({ fields: encodeFields(data) })
  });
  return mapDocument<T>(document);
}

export async function deleteFirebaseDocument(collectionId: string, id: string) {
  await firestoreRequest<void>(firebaseDocumentPath(collectionId, id), { method: "DELETE" });
}
