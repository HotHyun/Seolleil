import { createHash } from "crypto";
import { nanoid } from "nanoid";

export function createToken() {
  return nanoid(21);
}

export function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

