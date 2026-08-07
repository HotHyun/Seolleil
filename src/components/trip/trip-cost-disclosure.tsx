import { ChevronDown, ReceiptText } from "lucide-react";
import { TripCostAndBooking } from "@/components/trip/trip-overview";

export function TripCostDisclosure({ trip }: { trip: React.ComponentProps<typeof TripCostAndBooking>["trip"] }) {
  return (
    <details className="group rounded-2xl border bg-card">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 font-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <h1 data-trip-workspace-title tabIndex={-1} className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"><ReceiptText className="h-4 w-4 text-primary" /> 비용과 예약 링크</h1>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="border-t p-3 [&>div]:border-0 [&>div]:shadow-none"> <TripCostAndBooking trip={trip} /> </div>
    </details>
  );
}
