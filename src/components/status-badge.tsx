import { cn } from "@/lib/utils";

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "good" && "bg-orange-500/15 text-orange-200",
        tone === "warn" && "bg-amber-500/15 text-amber-200",
        tone === "dark" && "bg-zinc-900 text-white"
      )}
    >
      {children}
    </span>
  );
}
