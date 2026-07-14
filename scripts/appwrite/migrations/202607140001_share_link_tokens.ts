import { ensureAttribute, string, type Config } from "../client";
import type { Migration } from "../migrations";

export const migration202607140001ShareLinkTokens: Migration = {
  id: "202607140001_share_link_tokens",
  description: "Persist share token values for authorized link management",
  async up(cfg: Config) {
    await ensureAttribute(cfg, cfg.collections.tripShareLinks, string("tokenValue", false, 255));
  }
};
