export type Config = {
  endpoint: string;
  projectId: string;
  apiKey: string;
  databaseId: string;
  collections: {
    migrations: string;
    trips: string;
    tripTasks: string;
    analyticsEvents: string;
  };
};

export type CollectionSpec = {
  id: string;
  name: string;
  attributes: AttributeSpec[];
  indexes: IndexSpec[];
};

export type AttributeSpec =
  | { type: "string"; key: string; required: boolean; size: number }
  | { type: "integer"; key: string; required: boolean }
  | { type: "boolean"; key: string; required: boolean }
  | { type: "datetime"; key: string; required: boolean };

export type IndexSpec = {
  key: string;
  type: "key" | "unique" | "fulltext";
  attributes: string[];
  orders?: Array<"ASC" | "DESC">;
};

type AppwriteError = {
  message?: string;
  code?: number;
  type?: string;
};

export function env(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export function getConfig(): Config {
  const endpoint = (process.env.APPWRITE_ENDPOINT ?? process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? "").replace(/\/$/, "");
  if (!endpoint) throw new Error("Missing required environment variable: APPWRITE_ENDPOINT");

  return {
    endpoint,
    projectId: env("APPWRITE_PROJECT_ID"),
    apiKey: env("APPWRITE_API_KEY"),
    databaseId: process.env.APPWRITE_DATABASE_ID ?? "korean_ski",
    collections: {
      migrations: process.env.APPWRITE_MIGRATIONS_COLLECTION_ID ?? "schema_migrations",
      trips: process.env.APPWRITE_TRIPS_COLLECTION_ID ?? "trips",
      tripTasks: process.env.APPWRITE_TRIP_TASKS_COLLECTION_ID ?? "trip_tasks",
      analyticsEvents: process.env.APPWRITE_ANALYTICS_EVENTS_COLLECTION_ID ?? "analytics_events"
    }
  };
}

function headers(cfg: Config) {
  return {
    "Content-Type": "application/json",
    "X-Appwrite-Project": cfg.projectId,
    "X-Appwrite-Key": cfg.apiKey
  };
}

export async function request<T>(cfg: Config, path: string, init: RequestInit = {}) {
  const response = await fetch(`${cfg.endpoint}${path}`, {
    ...init,
    headers: {
      ...headers(cfg),
      ...(init.headers ?? {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    let error: AppwriteError = {};
    try {
      error = JSON.parse(text) as AppwriteError;
    } catch {
      error.message = text;
    }
    throw Object.assign(new Error(error.message ?? `Appwrite request failed: ${response.status}`), {
      status: response.status,
      appwriteType: error.type
    });
  }

  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export function isConflict(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 409;
}

export function isNotFound(error: unknown) {
  return typeof error === "object" && error !== null && "status" in error && (error as { status: number }).status === 404;
}

export async function ensureDatabase(cfg: Config) {
  try {
    await request(cfg, `/databases/${cfg.databaseId}`);
    console.log(`Database exists: ${cfg.databaseId}`);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    await request(cfg, "/databases", {
      method: "POST",
      body: JSON.stringify({
        databaseId: cfg.databaseId,
        name: "Korean Ski"
      })
    });
    console.log(`Database created: ${cfg.databaseId}`);
  }
}

export async function ensureCollection(cfg: Config, spec: CollectionSpec) {
  try {
    await request(cfg, `/databases/${cfg.databaseId}/collections/${spec.id}`);
    console.log(`Collection exists: ${spec.id}`);
  } catch (error) {
    if (!isNotFound(error)) throw error;
    await request(cfg, `/databases/${cfg.databaseId}/collections`, {
      method: "POST",
      body: JSON.stringify({
        collectionId: spec.id,
        name: spec.name,
        permissions: [],
        documentSecurity: false,
        enabled: true
      })
    });
    console.log(`Collection created: ${spec.id}`);
  }

  for (const attribute of spec.attributes) {
    await ensureAttribute(cfg, spec.id, attribute);
  }

  if (spec.attributes.length) {
    console.log(`Waiting for attributes to become available: ${spec.id}`);
    await wait(3000);
  }

  for (const index of spec.indexes) {
    await ensureIndex(cfg, spec.id, index);
  }
}

export async function ensureAttribute(cfg: Config, collectionId: string, attribute: AttributeSpec) {
  const base = `/databases/${cfg.databaseId}/collections/${collectionId}/attributes`;
  const body: Record<string, unknown> = {
    key: attribute.key,
    required: attribute.required
  };

  let path = base;
  if (attribute.type === "string") {
    path += "/string";
    body.size = attribute.size;
  } else if (attribute.type === "integer") {
    path += "/integer";
  } else if (attribute.type === "boolean") {
    path += "/boolean";
  } else {
    path += "/datetime";
  }

  try {
    await request(cfg, path, {
      method: "POST",
      body: JSON.stringify(body)
    });
    console.log(`Attribute created: ${collectionId}.${attribute.key}`);
  } catch (error) {
    if (!isConflict(error)) throw error;
    console.log(`Attribute exists: ${collectionId}.${attribute.key}`);
  }
}

export async function ensureIndex(cfg: Config, collectionId: string, index: IndexSpec) {
  try {
    await request(cfg, `/databases/${cfg.databaseId}/collections/${collectionId}/indexes`, {
      method: "POST",
      body: JSON.stringify({
        key: index.key,
        type: index.type,
        attributes: index.attributes,
        orders: index.orders
      })
    });
    console.log(`Index created: ${collectionId}.${index.key}`);
  } catch (error) {
    if (!isConflict(error)) throw error;
    console.log(`Index exists: ${collectionId}.${index.key}`);
  }
}

export async function hasDocument(cfg: Config, collectionId: string, documentId: string) {
  try {
    await request(cfg, `/databases/${cfg.databaseId}/collections/${collectionId}/documents/${documentId}`);
    return true;
  } catch (error) {
    if (isNotFound(error)) return false;
    throw error;
  }
}

export async function createDocument(cfg: Config, collectionId: string, documentId: string, data: Record<string, unknown>) {
  return request(cfg, `/databases/${cfg.databaseId}/collections/${collectionId}/documents`, {
    method: "POST",
    body: JSON.stringify({ documentId, data })
  });
}

export function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function string(key: string, required: boolean, size: number): AttributeSpec {
  return { type: "string", key, required, size };
}

export function integer(key: string, required: boolean): AttributeSpec {
  return { type: "integer", key, required };
}

export function boolean(key: string, required: boolean): AttributeSpec {
  return { type: "boolean", key, required };
}

export function datetime(key: string, required: boolean): AttributeSpec {
  return { type: "datetime", key, required };
}

export function index(key: string, attributes: string[]): IndexSpec {
  return { key, type: "key", attributes };
}
