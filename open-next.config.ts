import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Serve prerendered pages from the static assets instead of re-rendering them
// on every request (the default dummy cache re-rendered each request and
// exceeded the Free plan's CPU limit). The app does not use ISR/revalidation.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache
});
