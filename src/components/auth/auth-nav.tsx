import Image from "next/image";
import { LogOut, UserCircle } from "lucide-react";
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

export function AuthNav({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <a href="/login" className="hover:text-foreground">
        로그인
      </a>
    );
  }

  const image = session.user.image;
  const name = session.user.name ?? "내 프로필";
  const email = session.user.email;

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
            <UserCircle className="h-4 w-4" /> 내 프로필
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <ThemeMenuItem />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full">
              <LogOut className="h-4 w-4" /> 로그아웃
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
