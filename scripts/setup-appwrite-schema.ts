import { ensureDatabase, getConfig } from "./appwrite/client";
import { loadDotenv } from "./appwrite/env";
import { runMigrations } from "./appwrite/migrations";

async function main() {
  loadDotenv();
  const cfg = getConfig();

  await ensureDatabase(cfg);
  await runMigrations(cfg);

  console.log("Appwrite schema setup complete.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
