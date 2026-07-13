"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { Toaster as Sonner, toast } from "sonner";

export function Toaster() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setTheme(root.classList.contains("dark") ? "dark" : "light");
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  return <Sonner theme={theme} richColors closeButton position="bottom-center" toastOptions={{ className: "font-semibold" }} />;
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
