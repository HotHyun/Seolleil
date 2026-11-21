import { cn } from "@/lib/utils";

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-medium",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "good" && "bg-primary/15 text-primary",
        tone === "warn" && "bg-amber-500/15 text-amber-800 dark:text-amber-200",
        tone === "dark" && "bg-foreground text-background"
      )}
    >
      {children}
    </span>
  );
}
