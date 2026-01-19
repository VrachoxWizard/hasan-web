import "server-only";

import crypto from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "cms_session";

function base64UrlEncode(input: Buffer | string): string {
  const buffer = typeof input === "string" ? Buffer.from(input, "utf8") : input;
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function base64UrlDecodeToString(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "===".slice((base64.length + 3) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

function sign(payloadB64: string, secret: string): string {
  return base64UrlEncode(
    crypto.createHmac("sha256", secret).update(payloadB64).digest()
  );
}

export type CmsSession = {
  sub: "admin";
  iat: number;
  exp: number;
};

export function createCmsSessionToken(ttlSeconds = 60 * 60 * 12): string {
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret) throw new Error("CMS_SESSION_SECRET is not set");

  const now = Math.floor(Date.now() / 1000);
  const session: CmsSession = {
    sub: "admin",
    iat: now,
    exp: now + ttlSeconds,
  };

  const payloadB64 = base64UrlEncode(JSON.stringify(session));
  const signature = sign(payloadB64, secret);
  return `${payloadB64}.${signature}`;
}

export function verifyCmsSessionToken(
  token: string | undefined | null
): CmsSession | null {
  if (!token) return null;
  const secret = process.env.CMS_SESSION_SECRET;
  if (!secret) return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, signature] = parts;

  const expected = sign(payloadB64, secret);
  try {
    if (
      !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return null;
    }
  } catch {
    return null;
  }

  try {
    const payloadJson = base64UrlDecodeToString(payloadB64);
    const session = JSON.parse(payloadJson) as CmsSession;
    if (session.sub !== "admin") return null;
    if (typeof session.exp !== "number") return null;
    if (session.exp < Math.floor(Date.now() / 1000)) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getCmsSessionFromCookies(): Promise<CmsSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyCmsSessionToken(token);
}
