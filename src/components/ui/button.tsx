import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
};

export function Button({ className, variant = "primary", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground shadow-lg shadow-orange-950/25 hover:bg-orange-500",
        variant === "secondary" && "border border-border bg-white/7 text-foreground hover:bg-white/12",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" && "bg-destructive text-destructive-foreground hover:opacity-90",
        className
      )}
      {...props}
    />
  );
}
