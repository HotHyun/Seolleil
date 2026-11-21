import * as React from "react";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  isLoading?: boolean;
  loadingText?: React.ReactNode;
};

export function Button({ className, variant = "primary", isLoading = false, loadingText, disabled, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition-colors duration-150 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50",
        variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary/90",
        variant === "secondary" && "border border-border bg-card text-foreground hover:bg-muted",
        variant === "ghost" && "text-foreground hover:bg-muted",
        variant === "danger" && "bg-destructive text-destructive-foreground hover:opacity-90",
        className
      )}
      disabled={isLoading || disabled}
      aria-busy={isLoading || undefined}
      {...props}
    >
      {isLoading ? <><LoaderCircle aria-hidden="true" className="h-4 w-4 shrink-0 animate-spin motion-reduce:animate-none" />{loadingText ?? children}</> : children}
    </button>
  );
}
