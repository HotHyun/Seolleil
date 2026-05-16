import { validateStaticData } from "../src/lib/data-validation";

const issues = validateStaticData();

if (issues.length > 0) {
  console.error(`Static data validation failed with ${issues.length} issue(s).`);
  for (const issue of issues) {
    console.error(`- [${issue.scope}] ${issue.id}: ${issue.message}`);
  }
  process.exit(1);
}

console.log("Static data validation passed.");
