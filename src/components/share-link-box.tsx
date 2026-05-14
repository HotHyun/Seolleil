"use client";

import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ShareLinkBox({ sharePath }: { sharePath?: string }) {
  const shareUrl =
    typeof window !== "undefined" && sharePath
      ? `${window.location.origin}${sharePath}`
      : sharePath;

  return (
    <div className="space-y-3">
      {shareUrl ? (
        <div className="rounded-md bg-muted p-3 text-sm font-semibold break-all">{shareUrl}</div>
      ) : null}
      <Button
        variant="secondary"
        className="w-full"
        type="button"
        disabled={!shareUrl}
        onClick={() => {
          if (!shareUrl) return;
          navigator.clipboard?.writeText(shareUrl);
          window.umami?.track("share_link_copy");
        }}
      >
        <Copy className="h-4 w-4" /> 읽기 링크 복사
      </Button>
    </div>
  );
}
