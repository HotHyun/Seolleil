import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-input bg-white px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-foreground focus:ring-2 focus:ring-ring",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-md border border-input bg-white px-3 text-sm outline-none transition focus:border-foreground focus:ring-2 focus:ring-ring",
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
