"use server";

import { redirect } from "next/navigation";
import { acceptTripInvitation } from "@/lib/trip-collaboration";
import { getSession } from "@/lib/session";
import { reportAppError } from "@/lib/app-error";

export async function acceptTripInvitationAction(formData: FormData) {
  const invitationToken = String(formData.get("token") ?? "");
  const session = await getSession();
  if (!invitationToken || invitationToken.length > 100) {
    redirect(`/invite/accept?error=${encodeURIComponent("유효하지 않은 초대 링크입니다.")}`);
  }
  if (!session?.user?.id || !session.user.email) {
    redirect(`/login?callbackUrl=${encodeURIComponent(`/invite/accept?token=${encodeURIComponent(invitationToken)}`)}`);
  }
  let tripId: string;
  try {
    const invitation = await acceptTripInvitation({
      invitationToken,
      userId: session.user.id,
      userEmail: session.user.email,
      userName: session.user.name
    });
    tripId = invitation.tripId;
  } catch (error) {
    reportAppError(error, { action: "acceptTripInvitation" });
    redirect(`/invite/accept?token=${encodeURIComponent(invitationToken)}&error=${encodeURIComponent("초대 링크가 만료되었거나 다른 이메일 계정으로 로그인했습니다.")}`);
  }
  redirect(`/my-trips/${tripId}?notice=${encodeURIComponent("트립 초대를 수락했어요.")}`);
}
