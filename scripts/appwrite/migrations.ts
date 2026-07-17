import type { Config } from "./client";
import { createDocument, ensureCollection, hasDocument, string } from "./client";
import { migration202607110001InitialSchema } from "./migrations/202607110001_initial_schema";
import { migration202607130001TripSharing } from "./migrations/202607130001_trip_sharing";
import { migration202607130002TripIdentity } from "./migrations/202607130002_trip_identity";
import { migration202607130003TripBudget } from "./migrations/202607130003_trip_budget";
import { migration202607140001ShareLinkTokens } from "./migrations/202607140001_share_link_tokens";
import { migration202607170001TripShuttleSelection } from "./migrations/202607170001_trip_shuttle_selection";

export type Migration = {
  id: string;
  description: string;
  up: (cfg: Config) => Promise<void>;
};

export const migrations: Migration[] = [
  migration202607110001InitialSchema,
  migration202607130001TripSharing,
  migration202607130002TripIdentity,
  migration202607130003TripBudget,
  migration202607140001ShareLinkTokens,
  migration202607170001TripShuttleSelection
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
