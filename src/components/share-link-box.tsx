"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";
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
        onClick={async () => {
          if (!shareUrl) return;
          try {
            await navigator.clipboard.writeText(shareUrl);
            window.umami?.track("share_link_copy");
            toast.success("공유 링크를 복사했어요.");
          } catch {
            toast.error("링크를 복사하지 못했어요. 다시 시도해 주세요.");
          }
        }}
      >
        <Copy className="h-4 w-4" /> 읽기 링크 복사
      </Button>
    </div>
  );
}
