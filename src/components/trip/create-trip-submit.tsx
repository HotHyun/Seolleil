"use client";

import * as React from "react";
import { CheckCircle2, Link2, LogIn, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { clearPendingTripDraft, currentPathWithSearch, readPendingTripDraft, savePendingTripDraft } from "@/lib/pending-trip-draft";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";

declare global {
  interface Window { umami?: { track: (eventName: string, eventData?: Record<string, unknown>) => void } }
}

export function CreateTripSubmit({
  isAuthenticated,
  label = "이 스키장으로 트립 만들기",
  className = "mt-4 w-full",
  wrapperClassName
}: {
  isAuthenticated: boolean;
  label?: string;
  className?: string;
  wrapperClassName?: string;
}) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const [loginHref, setLoginHref] = React.useState("/login");
  const [restored, setRestored] = React.useState(false);

  React.useEffect(() => {
    const returnTo = currentPathWithSearch();
    setLoginHref(`/login?callbackUrl=${encodeURIComponent(returnTo)}`);

    if (!isAuthenticated) return;
    const form = wrapperRef.current?.closest("form");
    const draft = readPendingTripDraft(returnTo);
    if (!form || !draft || draft.values.resortId !== new FormData(form).get("resortId")) return;

    for (const [name, value] of Object.entries(draft.values)) {
      const control = form.elements.namedItem(name);
      if (!(control instanceof HTMLInputElement || control instanceof HTMLSelectElement || control instanceof HTMLTextAreaElement)) continue;
      const prototype = control instanceof HTMLSelectElement ? HTMLSelectElement.prototype : control instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(prototype, "value")?.set?.call(control, value);
      control.dispatchEvent(new Event("input", { bubbles: true }));
      control.dispatchEvent(new Event("change", { bubbles: true }));
    }
    setRestored(true);
  }, [isAuthenticated]);

  if (isAuthenticated) {
    return (
      <div ref={wrapperRef} className={wrapperClassName}>
        {restored ? (
          <div className="mb-3 flex items-start gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2.5 text-sm" role="status">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <div><p className="font-black">입력한 설정을 그대로 불러왔어요.</p><p className="mt-0.5 text-xs text-muted-foreground">내용을 확인한 뒤 트립을 만들어 주세요.</p></div>
          </div>
        ) : null}
        <Button type="submit" className={className} onClick={() => { window.umami?.track("trip_create_submit", { authenticated: true }); clearPendingTripDraft(); }}>
          {label}
        </Button>
      </div>
    );
  }

  function submitAnonymousTrip() {
    window.umami?.track("trip_create_submit", { authenticated: false });
    wrapperRef.current?.closest("form")?.requestSubmit();
  }

  function continueWithLogin() {
    const form = wrapperRef.current?.closest("form");
    if (form) savePendingTripDraft(form);
    window.umami?.track("trip_create_login_continue");
  }

  return (
    <div ref={wrapperRef} className={wrapperClassName}>
      <Dialog>
        <DialogTrigger asChild>
          <Button type="button" className={className}>
            {label}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <DialogTitle>트립을 어떻게 저장할까요?</DialogTitle>
            <DialogDescription>
              로그인하면 내 트립 목록에서 언제든 다시 찾을 수 있어요. 지금까지 입력한 설정도 그대로 유지됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 text-sm">
            <div className="flex gap-2 rounded-lg border border-primary/25 bg-primary/10 p-3"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><span><strong className="text-foreground">로그인하고 안전하게 저장</strong><br /><span className="text-muted-foreground">현재 설정을 유지하고 내 트립에 저장합니다.</span></span></div>
            <div className="flex gap-2 rounded-lg border bg-muted/60 p-3"><Link2 className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><span><strong className="text-foreground">로그인 없이 링크로 만들기</strong><br /><span className="text-muted-foreground">편집 링크를 잃으면 트립을 다시 찾기 어렵습니다.</span></span></div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={submitAnonymousTrip}>
                로그인 없이 링크로 만들기
              </Button>
            </DialogClose>
            <a href={loginHref} onClick={continueWithLogin}>
              <Button type="button" className="w-full sm:w-auto">
                현재 설정 그대로 로그인 <LogIn className="h-4 w-4" />
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
