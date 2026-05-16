import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  children,
  className
}: {
  label: string;
  children: React.ReactElement<{ id?: string }>;
  className?: string;
}) {
  const generatedId = React.useId();
  const childId = children.props.id ?? generatedId;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={childId}>{label}</Label>
      {React.cloneElement(children, { id: childId })}
    </div>
  );
}
