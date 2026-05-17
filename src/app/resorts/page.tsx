import { AnalyticsTrack } from "@/components/analytics-track";
import { ResortMapExplorer } from "@/components/resort-map-explorer";
import { rentalShops, resorts } from "@/data/resorts";

export default function ResortsPage() {
  const sorted = [...resorts].sort((a, b) => {
    if (a.operationStatus === b.operationStatus) return a.name.localeCompare(b.name, "ko");
    if (a.operationStatus === "operating") return -1;
    return 1;
  });

  return (
    <main>
      <AnalyticsTrack eventName="resort_detail_view" eventData={{ page: "directory" }} />
      <ResortMapExplorer resorts={sorted} rentalShops={rentalShops} />
    </main>
  );
}
