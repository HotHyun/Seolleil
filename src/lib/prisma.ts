import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Pool } from "pg";
import { cache } from "react";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createNodePrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });
}

function getHyperdriveConnectionString() {
  try {
    return getCloudflareContext().env.HYPERDRIVE?.connectionString;
  } catch {
    return undefined;
  }
}

function createHyperdrivePrismaClient(connectionString: string) {
  const pool = new Pool({
    connectionString,
    maxUses: 1
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool),
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]
  });
}

const getRequestPrisma = cache(() => {
  const hyperdriveConnectionString = getHyperdriveConnectionString();

  if (hyperdriveConnectionString) {
    return createHyperdrivePrismaClient(hyperdriveConnectionString);
  }

  const prisma = globalForPrisma.prisma ?? createNodePrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
  }

  return prisma;
});

export function getPrisma() {
  return getRequestPrisma();
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getPrisma(), property, receiver);
  }
});
