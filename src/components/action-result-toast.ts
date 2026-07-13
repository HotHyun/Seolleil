"use client";
import { toast } from "sonner";
import type { ActionResult } from "@/lib/app-error";

export function showActionResult<T>(result: ActionResult<T>) {
  if (result.ok) return toast.success(result.message);
  return toast.error(result.message, { description: result.retryable ? `다시 시도할 수 있습니다. 오류 ID: ${result.incidentId.slice(0, 8)}` : `오류 ID: ${result.incidentId.slice(0, 8)}` });
}
