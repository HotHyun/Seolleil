import { validateStaticData } from "../src/lib/data-validation";

const issues = validateStaticData();
const errors = issues.filter((issue) => issue.severity === "error");
const warnings = issues.filter((issue) => issue.severity === "warning");

if (errors.length > 0) {
  console.error(`Static data validation failed with ${errors.length} error(s).`);
  for (const issue of errors) {
    console.error(`- [${issue.scope}] ${issue.id}: ${issue.message}`);
  }
  process.exit(1);
}

console.log("Static data validation passed.");
if (warnings.length > 0) {
  console.log(`Warnings: ${warnings.length}. Run pnpm data:report for details.`);
}
