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
console.log(`26/27 replacement targets: ${report.replacementTargetCount}`);
console.log("");

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
