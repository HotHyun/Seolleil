import { UsersRound } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import type { TripMembership } from "@/lib/trip-collaboration";

export function membershipDisplayName(member: TripMembership) {
  return member.userName?.trim() || member.userEmail?.split("@")[0] || "동행자";
}

export function TripCompanions({ members, currentUserId }: { members: TripMembership[]; currentUserId?: string }) {
  const companions = members.filter(member => member.confirm && member.userId !== currentUserId);
  if (!companions.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm" aria-label="함께 가는 사람">
      <span className="inline-flex items-center gap-1.5 font-semibold text-muted-foreground">
        <UsersRound className="h-4 w-4" /> 함께
      </span>
      {companions.slice(0, 4).map(member => <StatusBadge key={member.$id}>{membershipDisplayName(member)}</StatusBadge>)}
      {companions.length > 4 ? <StatusBadge>+{companions.length - 4}명</StatusBadge> : null}
    </div>
  );
}
