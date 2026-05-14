import { cn } from "@/lib/utils";

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "good" | "warn" | "dark" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        tone === "neutral" && "bg-muted text-muted-foreground",
        tone === "good" && "bg-lime-100 text-lime-900",
        tone === "warn" && "bg-amber-100 text-amber-900",
        tone === "dark" && "bg-zinc-900 text-white"
      )}
    >
      {children}
    </span>
  );
}

