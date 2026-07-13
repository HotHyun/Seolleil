"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export function SubmitButton({ children, pendingText = "처리 중…", ...props }: React.ComponentProps<typeof Button> & { pendingText?: string }) {
  const { pending } = useFormStatus();
  return <Button {...props} disabled={pending || props.disabled}>{pending ? <><LoaderCircle className="h-4 w-4 animate-spin" />{pendingText}</> : children}</Button>;
}
