import { UserCircle } from "lucide-react";
import { FirebaseSignOutButton } from "@/components/auth/firebase-sign-out-button";
import { ThemeMenuItem, ThemeToggle } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { AppSession } from "@/lib/session";

export function AuthNav({ session }: { session: AppSession | null }) {
  if (!session?.user) {
    return (
      <span className="inline-flex shrink-0 items-center gap-2">
        <a href="/login" className="whitespace-nowrap hover:text-foreground">
          로그인
        </a>
        <ThemeToggle />
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="프로필 메뉴 열기"
        >
          <UserCircle className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="font-black">{session.user.name ?? "내 스키 트립"}</div>
          {session.user.email ? <div className="mt-0.5 truncate text-xs font-normal text-muted-foreground">{session.user.email}</div> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/my-trips">
            <UserCircle className="h-4 w-4" /> 내 스키 트립
          </a>
        </DropdownMenuItem>
        <ThemeMenuItem />
        <DropdownMenuSeparator />
        <FirebaseSignOutButton />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
