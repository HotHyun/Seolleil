"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/auth";

export async function signInWithGoogleAction(formData: FormData) {
  const callbackUrl = String(formData.get("callbackUrl") ?? "/my-trips");
  await signIn("google", { redirectTo: callbackUrl });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}

export async function requireAuthRedirect() {
  redirect("/login");
}
