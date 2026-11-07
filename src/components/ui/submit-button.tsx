"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

type SubmitButtonProps = Omit<React.ComponentProps<typeof Button>, "isLoading" | "loadingText"> & { pendingText?: React.ReactNode };

export function SubmitButton({ children, pendingText, ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return <Button {...props} isLoading={pending} loadingText={pendingText}>{children}</Button>;
}
