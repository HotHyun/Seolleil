import { createFirebaseDocument, deleteFirebaseDocument, getFirebaseCollections, queryFirebaseDocuments, updateFirebaseDocument } from "@/lib/firebase";
import { hashToken, createToken } from "@/lib/tokens";

type TeamDocument = { name: string; tripId: string; ownerId: string };
type MembershipDocument = {
  teamId: string;
  tripId: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  confirm: boolean;
  roles: string[];
  joined: string | null;
  invitationTokenHash?: string | null;
  expiresAt?: string | null;
};

export type TripMembership = {
  $id: string;
  teamId: string;
  userId: string | null;
  userName: string;
  userEmail: string;
  confirm: boolean;
  roles: string[];
  joined: string | null;
};

export async function createTripTeam(name: string, tripId: string, ownerId: string) {
  const { tripTeams } = getFirebaseCollections();
  return createFirebaseDocument<TeamDocument>(tripTeams, { name, tripId, ownerId });
}

export async function inviteTripMember(input: { teamId: string; tripId: string; email: string; permission: "read" | "edit"; acceptUrl: string }) {
  const { tripMemberships } = getFirebaseCollections();
  const email = input.email.trim().toLowerCase();
  const existing = await queryFirebaseDocuments<MembershipDocument>(tripMemberships, "teamId", input.teamId, 200);
  if (existing.some(item => item.userEmail.toLowerCase() === email && (!item.expiresAt || new Date(item.expiresAt).getTime() > Date.now()))) {
    throw new Error("이미 이 이메일로 초대했거나 트립에 참여 중입니다.");
  }

  const token = createToken();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const membership = await createFirebaseDocument<MembershipDocument>(tripMemberships, {
    teamId: input.teamId,
    tripId: input.tripId,
    userId: null,
    userName: "",
    userEmail: email,
    confirm: false,
    roles: [input.permission === "edit" ? "editor" : "viewer"],
    joined: null,
    invitationTokenHash: await hashToken(token),
    expiresAt
  });
  const inviteUrl = `${input.acceptUrl}${input.acceptUrl.includes("?") ? "&" : "?"}token=${encodeURIComponent(token)}`;
  try {
    const emailSent = await sendInvitationEmail({ email, inviteUrl, permission: input.permission });
    return { membership, inviteUrl, emailSent };
  } catch (error) {
    await deleteFirebaseDocument(tripMemberships, membership.$id);
    throw error;
  }
}

async function sendInvitationEmail(input: { email: string; inviteUrl: string; permission: "read" | "edit" }) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return false;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!from) throw new Error("초대 메일을 보내지 못했습니다. 발신 주소를 설정해 주세요.");
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [input.email],
      subject: "Korean Ski 트립 초대",
      text: `Korean Ski 트립 초대가 도착했습니다. 권한: ${input.permission === "edit" ? "편집" : "보기"}.\n\n초대를 수락하려면 7일 안에 아래 링크를 열어 주세요.\n${input.inviteUrl}`
    }),
    cache: "no-store"
  });
  if (!response.ok) {
    await response.body?.cancel().catch(() => undefined);
    throw new Error("초대 메일을 보내지 못했습니다. 잠시 후 다시 시도해 주세요.");
  }
  return true;
}

export async function acceptTripInvitation(input: { invitationToken: string; userId: string; userEmail: string; userName?: string | null }) {
  const { tripMemberships } = getFirebaseCollections();
  const tokenHash = await hashToken(input.invitationToken);
  const [membership] = await queryFirebaseDocuments<MembershipDocument>(tripMemberships, "invitationTokenHash", tokenHash, 1);
  if (!membership || membership.confirm || !membership.expiresAt || new Date(membership.expiresAt).getTime() <= Date.now()) {
    throw new Error("Invitation is unavailable");
  }
  if (membership.userEmail.toLowerCase() !== input.userEmail.trim().toLowerCase()) {
    throw new Error("Invitation email does not match the signed-in account");
  }
  const updated = await updateFirebaseDocument<MembershipDocument>(tripMemberships, membership.$id, {
    userId: input.userId,
    userName: input.userName ?? "",
    confirm: true,
    joined: new Date().toISOString(),
    invitationTokenHash: null,
    expiresAt: null
  });
  return { id: updated.$id, tripId: membership.tripId, teamId: membership.teamId };
}

export async function listUserTeams(userId: string) {
  const { tripMemberships } = getFirebaseCollections();
  const memberships = await queryFirebaseDocuments<MembershipDocument>(tripMemberships, "userId", userId, 200);
  return { teams: [...new Set(memberships.filter(item => item.confirm).map(item => item.teamId))].map($id => ({ $id })) };
}

export async function getTripTeamPermission(teamId: string, userId: string) {
  const memberships = await listTripMemberships(teamId);
  const membership = memberships.find(item => item.userId === userId && item.confirm);
  if (!membership) return null;
  return membership.roles.includes("editor") || membership.roles.includes("owner") ? "edit" : "read";
}

export async function listTripMemberships(teamId: string) {
  const { tripMemberships } = getFirebaseCollections();
  const memberships = await queryFirebaseDocuments<MembershipDocument>(tripMemberships, "teamId", teamId, 200);
  return memberships.map(item => ({ ...item } satisfies TripMembership));
}

export async function updateTripMembership(teamId: string, membershipId: string, permission: "read" | "edit") {
  const { tripMemberships } = getFirebaseCollections();
  const existing = (await listTripMemberships(teamId)).find(item => item.$id === membershipId);
  if (!existing) throw new Error("Membership does not exist");
  return updateFirebaseDocument<MembershipDocument>(tripMemberships, membershipId, {
    roles: [permission === "edit" ? "editor" : "viewer"]
  });
}

export async function removeTripMembership(teamId: string, membershipId: string) {
  const exists = (await listTripMemberships(teamId)).some(item => item.$id === membershipId);
  if (!exists) throw new Error("Membership does not exist");
  const { tripMemberships } = getFirebaseCollections();
  return deleteFirebaseDocument(tripMemberships, membershipId);
}
