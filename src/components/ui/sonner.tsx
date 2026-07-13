"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Toaster as Sonner, toast } from "sonner";

export function Toaster() {
  return <Sonner richColors closeButton position="bottom-center" toastOptions={{ className: "font-semibold" }} />;
}

export function ToastFromUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    const url = new URL(window.location.href);
    const notice = url.searchParams.get("notice");
    if (!notice) return;
    toast.success(notice);
    url.searchParams.delete("notice");
    window.history.replaceState({}, "", `${url.pathname}${url.search}${url.hash}`);
  }, [pathname, searchParams]);
  return null;
}
