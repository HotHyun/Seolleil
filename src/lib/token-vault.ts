import "server-only";

let encryptionKey: Promise<CryptoKey> | undefined;

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

function fromBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - base64.length % 4) % 4);
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0));
}

function getEncryptionKey() {
  if (!encryptionKey) {
    encryptionKey = (async () => {
      const encoded = process.env.FIREBASE_SHARE_TOKEN_KEY;
      if (!encoded) throw new Error("Missing required Firebase share token encryption key.");
      const bytes = fromBase64Url(encoded);
      if (bytes.byteLength !== 32) throw new Error("Firebase share token encryption key must be 32 bytes.");
      return crypto.subtle.importKey("raw", bytes, "AES-GCM", false, ["encrypt", "decrypt"]);
    })();
  }
  return encryptionKey;
}

export async function encryptShareToken(token: string) {
  const key = await getEncryptionKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(token));
  return `${base64Url(iv)}.${base64Url(new Uint8Array(ciphertext))}`;
}

export async function decryptShareToken(ciphertext: string) {
  const [encodedIv, encodedValue] = ciphertext.split(".");
  if (!encodedIv || !encodedValue) throw new Error("Invalid encrypted share token.");
  const plaintext = await crypto.subtle.decrypt({ name: "AES-GCM", iv: fromBase64Url(encodedIv) }, await getEncryptionKey(), fromBase64Url(encodedValue));
  return new TextDecoder().decode(plaintext);
}
