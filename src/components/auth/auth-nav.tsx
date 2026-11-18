"use client";

import Link from "next/link";
import { UserCircle } from "lucide-react";
import { FirebaseSignOutButton } from "@/components/auth/firebase-sign-out-button";
import { useFirebaseSession } from "@/components/auth/firebase-session-sync";
import { ThemeMenuItem, ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

export function AuthNav() {
  const { user, ready, sessionReady, sessionError, isAuthenticated } = useFirebaseSession();

  if (!ready || (user && !sessionReady && !sessionError)) {
    return (
      <span className="inline-flex shrink-0 items-center gap-2" aria-label="계정 상태 확인 중">
        <span aria-hidden="true" className="h-9 w-12 animate-pulse rounded-md bg-muted" />
        <ThemeToggle />
      </span>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <span className="inline-flex shrink-0 items-center gap-2">
        <Link href="/login" className="inline-flex h-9 w-12 items-center justify-center whitespace-nowrap hover:text-foreground">
          로그인
        </Link>
        <ThemeToggle />
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="mx-1.5 flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="프로필 메뉴 열기"
        >
          <UserCircle className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="font-black">{user.displayName ?? "내 스키 트립"}</div>
          {user.email ? <div className="mt-0.5 truncate text-xs font-normal text-muted-foreground">{user.email}</div> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/my-trips">
            <UserCircle className="h-4 w-4" /> 내 스키 트립
          </Link>
        </DropdownMenuItem>
        <ThemeMenuItem />
        <DropdownMenuSeparator />
        <FirebaseSignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
