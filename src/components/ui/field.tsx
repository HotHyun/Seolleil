import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("text-sm font-semibold text-foreground", className)} {...props} />;
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-lg border border-input bg-[#211f2e] px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-orange-400 focus:ring-2 focus:ring-ring",
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
        "h-11 w-full rounded-lg border border-input bg-[#211f2e] px-3 text-sm text-foreground outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-ring",
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
