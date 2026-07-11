import type { Config } from "./client";
import { createDocument, ensureCollection, hasDocument, string } from "./client";
import { migration202607110001InitialSchema } from "./migrations/202607110001_initial_schema";

export type Migration = {
  id: string;
  description: string;
  up: (cfg: Config) => Promise<void>;
};

export const migrations: Migration[] = [
  migration202607110001InitialSchema
];

export async function ensureMigrationsCollection(cfg: Config) {
  await ensureCollection(cfg, {
    id: cfg.collections.migrations,
    name: "Schema Migrations",
    attributes: [
      string("description", true, 255),
      string("appliedAt", true, 64)
    ],
    indexes: []
  });
}

export async function runMigrations(cfg: Config) {
  await ensureMigrationsCollection(cfg);

  for (const migration of migrations) {
    const applied = await hasDocument(cfg, cfg.collections.migrations, migration.id);
    if (applied) {
      console.log(`Migration already applied: ${migration.id}`);
      continue;
    }

    console.log(`Applying migration: ${migration.id} ${migration.description}`);
    await migration.up(cfg);
    await createDocument(cfg, cfg.collections.migrations, migration.id, {
      description: migration.description,
      appliedAt: new Date().toISOString()
    });
    console.log(`Migration applied: ${migration.id}`);
  }
}
