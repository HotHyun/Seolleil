import { UserCircle } from "lucide-react";
import { signOutAction } from "@/app/auth-actions";
import type { Session } from "next-auth";

export function AuthNav({ session }: { session: Session | null }) {
  if (!session?.user) {
    return (
      <a href="/login" className="hover:text-foreground">
        로그인
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a href="/my-trips" className="inline-flex items-center gap-1.5 hover:text-foreground">
        <UserCircle className="h-4 w-4" /> 내 트립
      </a>
      <form action={signOutAction}>
        <button type="submit" className="hover:text-foreground">
          로그아웃
        </button>
      </form>
    </div>
  );
}
