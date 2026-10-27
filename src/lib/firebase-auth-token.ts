import "server-only";

import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";

const firebaseSigningKeys = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));

export type FirebaseIdTokenClaims = JWTPayload & {
  sub: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
  auth_time: number;
};

function getProjectId() {
  const id = process.env.FIREBASE_PROJECT_ID ?? process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!id) throw new Error("Missing required Firebase project ID.");
  return id;
}

export async function verifyFirebaseIdToken(token: string) {
  const projectId = getProjectId();
  const { payload } = await jwtVerify(token, firebaseSigningKeys, {
    audience: projectId,
    issuer: `https://securetoken.google.com/${projectId}`
  });
  const now = Math.floor(Date.now() / 1000);
  if (
    typeof payload.sub !== "string" || payload.sub.length === 0 || payload.sub.length > 128 ||
    typeof payload.iat !== "number" || payload.iat > now ||
    typeof payload.auth_time !== "number" || payload.auth_time > now
  ) {
    throw new Error("Invalid Firebase user token.");
  }
  return payload as FirebaseIdTokenClaims;
}
