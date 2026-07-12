"use client";

import * as React from "react";
import { LogIn, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
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

  React.useEffect(() => {
    setLoginHref(`/login?callbackUrl=${encodeURIComponent(`${window.location.pathname}${window.location.search}`)}`);
  }, []);

  if (isAuthenticated) {
    return (
      <Button type="submit" className={className} onClick={() => window.umami?.track("trip_create_submit", { authenticated: true })}>
        {label}
      </Button>
    );
  }

  function submitAnonymousTrip() {
    window.umami?.track("trip_create_submit", { authenticated: false });
    wrapperRef.current?.closest("form")?.requestSubmit();
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
              <TriangleAlert className="h-5 w-5" />
            </div>
            <DialogTitle>로그인하면 트립을 다시 찾기 쉽습니다.</DialogTitle>
            <DialogDescription>
              비로그인으로 만들면 트립은 생성되지만, 편집 링크를 직접 저장해 두어야 다시 들어올 수 있습니다.
              링크를 잃어버리면 내 트립 목록에서 복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg border bg-muted p-3 text-sm font-semibold text-muted-foreground">
            Google로 로그인 후 만들면 이 트립이 내 트립에 저장되어 나중에 마이페이지에서 바로 확인할 수 있습니다.
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" onClick={submitAnonymousTrip}>
                링크 저장하고 비로그인으로 계속
              </Button>
            </DialogClose>
            <a href={loginHref}>
              <Button type="button" className="w-full sm:w-auto">
                로그인하고 만들기 <LogIn className="h-4 w-4" />
              </Button>
            </a>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
