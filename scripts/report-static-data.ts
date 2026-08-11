import { getStaticDataReport } from "../src/lib/data-validation";

const report = getStaticDataReport();

console.log(`Korean Ski data report (${report.season})`);
console.log(`Generated: ${report.generatedAt}`);
console.log("");
console.log(`Resorts: ${report.resortCount}`);
console.log(`Lift price rules: ${report.priceRuleCount}`);
console.log(`Rental shops: ${report.rentalShopCount}`);
console.log(`Rental price rules: ${report.rentalPriceRuleCount}`);
console.log(`Errors: ${report.issueCount}`);
console.log(`Warnings: ${report.warningCount}`);
console.log(`Estimated price items: ${report.estimatedPriceCount}`);
console.log(`Stale items: ${report.staleItemCount}`);
console.log(`26/27 price/rental rules not yet registered: ${report.replacementTargetCount}`);
console.log(
  `26/27 transition: ${report.seasonTransition.completedTargetCount}/${report.seasonTransition.replacementTargetCount} (${report.seasonTransition.progressPercent}%)`
);
console.log(`P1 research records: ${report.seasonTransition.priorityOneResearchCount}/12`);
console.log(`P2 research records: ${report.seasonTransition.priorityTwoResearchCount}/15`);
console.log(`P3 research records: ${report.seasonTransition.priorityThreeResearchCount}/12`);
console.log(`Official preliminary notices: ${report.seasonTransition.preliminaryResearchCount}`);
console.log("");

console.table(
  report.seasonTransition.resorts.map((resort) => ({
    priority: `P${resort.priority}`,
    resort: resort.resortName,
    lift: `${resort.lift.status}${resort.lift.research ? `/${resort.lift.research.status}` : ""} ${resort.lift.completedTargetCount}/${resort.lift.sourceCount}`,
    rental: `${resort.rental.status}${resort.rental.research ? `/${resort.rental.research.status}` : ""} ${resort.rental.completedTargetCount}/${resort.rental.sourceCount}`,
    shuttle: `${resort.shuttle.status}${resort.shuttle.research ? `/${resort.shuttle.research.status}` : ""} ${resort.shuttle.completedTargetCount}/${resort.shuttle.sourceCount}`,
    progress: `${resort.progressPercent}%`,
    remaining: resort.replacementTargetCount - resort.completedTargetCount,
    nextAction: resort.nextAction
  }))
);

console.log("");

const preliminaryResearch = report.seasonTransition.resorts.flatMap(resort => [
  { resort: resort.resortName, category: "lift", research: resort.lift.research },
  { resort: resort.resortName, category: "rental", research: resort.rental.research },
  { resort: resort.resortName, category: "shuttle", research: resort.shuttle.research }
]).filter(item => item.research?.status === "preliminary");

if (preliminaryResearch.length) {
  console.log("Official preliminary notices (not counted as completed replacement data):");
  for (const item of preliminaryResearch) {
    console.log(`- ${item.resort} / ${item.category}: ${item.research?.announcedFacts?.map(fact => `${fact.label} ${fact.value}`).join(", ")}`);
  }
  console.log("");
}

console.table(
  report.resorts.map((resort) => ({
    resort: resort.resortName,
    lifts: resort.liftRuleCount,
    confirmedLift: resort.confirmedLiftRuleCount,
    estimatedLift: resort.estimatedLiftRuleCount,
    externalRentals: resort.externalRentalShopCount,
    rentals: resort.rentalRuleCount,
    confirmedRental: resort.confirmedRentalRuleCount,
    estimatedRental: resort.estimatedRentalRuleCount,
    latestCheckedAt: resort.latestCheckedAt,
    missingSlots: resort.missingTimeSlots.join(",")
  }))
);

if (report.estimatedItems.length > 0) {
  console.log("");
  console.log("Estimated items requiring confirmation:");
  for (const item of report.estimatedItems.slice(0, 80)) {
    console.log(`- [${item.scope}] ${item.id} (${item.sourceName ?? "source unknown"}, ${item.lastCheckedAt})`);
  }
  if (report.estimatedItems.length > 80) {
    console.log(`...and ${report.estimatedItems.length - 80} more`);
  }
}
