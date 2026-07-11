type AppwriteConfig = {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  collections: {
    trips: string;
    tripTasks: string;
    analyticsEvents: string;
  };
};

export type AppwriteDocument<T> = T & {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
};

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required Appwrite environment variable: ${name}`);
  }
  return value;
}

export function getAppwriteConfig(): AppwriteConfig {
  const endpoint = (process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "").replace(/\/$/, "");
  if (!endpoint) {
    throw new Error("Missing required Appwrite environment variable: APPWRITE_ENDPOINT");
  }

  return {
    endpoint,
    projectId: requiredEnv("APPWRITE_PROJECT_ID"),
    apiKey: requiredEnv("APPWRITE_API_KEY"),
    databaseId: requiredEnv("APPWRITE_DATABASE_ID"),
    collections: {
      trips: process.env.APPWRITE_TRIPS_COLLECTION_ID ?? "trips",
      tripTasks: process.env.APPWRITE_TRIP_TASKS_COLLECTION_ID ?? "trip_tasks",
      analyticsEvents: process.env.APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID ?? "analytics_events"
    }
  };
}

export function appwriteHeaders(config = getAppwriteConfig()) {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": config.projectId,
    "X-Appwrite-Key": config.apiKey
  };
}

export async function appwriteFetch<T>(path: string, init: RequestInit = {}) {
  const config = getAppwriteConfig();
  const normalizedPath = config.endpoint.endsWith("/v1") && path.startsWith("/v1/")
    ? path.slice(3)
    : path;
  const response = await fetch(`${config.endpoint}${normalizedPath}`, {
    ...init,
    headers: {
      ...appwriteHeaders(config),
      ...(init.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Appwrite request failed (${response.status}) ${path}: ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function appwriteQuery(method: string, ...args: unknown[]) {
  if (method === "limit" || method === "offset" || method === "cursorAfter" || method === "cursorBefore") {
    return JSON.stringify({ method, values: args });
  }

  if (method === "orderAsc" || method === "orderDesc" || method === "orderRandom") {
    return JSON.stringify({ method, attribute: args[0] });
  }

  const [attribute, value] = args;
  return JSON.stringify({
    method,
    attribute,
    values: Array.isArray(value) ? value : [value]
  });
}

export function documentPath(collectionId: string, documentId?: string) {
  const { databaseId } = getAppwriteConfig();
  const base = `/v1/databases/${encodeURIComponent(databaseId)}/collections/${encodeURIComponent(collectionId)}/documents`;
  return documentId ? `${base}/${encodeURIComponent(documentId)}` : base;
}
