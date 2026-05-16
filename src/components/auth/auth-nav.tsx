import Image from "next/image";
import { BarChart3, LogOut, UserCircle } from "lucide-react";
import { signOutAction } from "@/app/auth-actions";
import { ThemeMenuItem } from "@/components/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Session } from "next-auth";
import { isAdminSession } from "@/lib/admin";

export function AuthNav({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <a href="/login" className="hover:text-foreground">
        로그인
      </a>
    );
  }

  const image = session.user.image;
  const name = session.user.name ?? "내 스키 트립";
  const email = session.user.email;
  const admin = isAdminSession(session);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-border bg-card text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="프로필 메뉴 열기"
        >
          {image ? (
            <Image src={image} alt={name} width={36} height={36} className="h-full w-full object-cover" />
          ) : (
            <UserCircle className="h-5 w-5" />
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="font-black">{name}</div>
          {email ? <div className="mt-0.5 truncate text-xs font-normal text-muted-foreground">{email}</div> : null}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/my-trips">
            <UserCircle className="h-4 w-4" /> 내 스키 트립
          </a>
        </DropdownMenuItem>
        <ThemeMenuItem />
        {admin ? (
          <DropdownMenuItem asChild>
            <a href="/admin">
              <BarChart3 className="h-4 w-4" /> 운영 대시보드
            </a>
          </DropdownMenuItem>
        ) : null}
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <button
            type="submit"
            className="relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none transition hover:bg-muted focus:bg-muted"
          >
            <LogOut className="h-4 w-4" /> 로그아웃
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
