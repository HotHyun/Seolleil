import { appwriteSessionFetch } from "@/lib/session";

type Team = { $id: string };

export async function createTripTeam(sessionSecret: string, name: string) {
  return appwriteSessionFetch<Team>("/teams", sessionSecret, { method: "POST", body: JSON.stringify({ teamId: "unique()", name, roles: ["viewer", "editor"] }) });
}

export async function inviteTripMember(input: { sessionSecret: string; teamId: string; email: string; permission: "read" | "edit"; acceptUrl: string }) {
  return appwriteSessionFetch(`/teams/${encodeURIComponent(input.teamId)}/memberships`, input.sessionSecret, {
    method: "POST",
    body: JSON.stringify({ roles: [input.permission === "edit" ? "editor" : "viewer"], email: input.email, url: input.acceptUrl })
  });
}

export async function acceptTripInvitation(input: { sessionSecret: string; teamId: string; membershipId: string; userId: string; secret: string }) {
  return appwriteSessionFetch(`/teams/${encodeURIComponent(input.teamId)}/memberships/${encodeURIComponent(input.membershipId)}/status`, input.sessionSecret, { method: "PATCH", body: JSON.stringify({ userId: input.userId, secret: input.secret }) });
}

export async function listUserTeams(sessionSecret: string) {
  return appwriteSessionFetch<{ teams: Array<{ $id: string }> }>("/teams?queries[]=%7B%22method%22%3A%22limit%22%2C%22values%22%3A%5B100%5D%7D", sessionSecret);
}

export async function getTripTeamPermission(sessionSecret: string, teamId: string, userId: string) {
  const result = await appwriteSessionFetch<{ memberships: Array<{ userId: string; confirm: boolean; roles: string[] }> }>(`/teams/${encodeURIComponent(teamId)}/memberships`, sessionSecret);
  const membership = result.memberships.find(item => item.userId === userId && item.confirm);
  if (!membership) return null;
  return membership.roles.includes("editor") || membership.roles.includes("owner") ? "edit" : "read";
}
