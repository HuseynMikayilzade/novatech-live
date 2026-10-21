import { createHmac, timingSafeEqual } from "node:crypto";
import { MIN_ADMIN_KEY_LENGTH } from "./admin-auth.ts";

export const PRESENTER_COOKIE = "nt_presenter";
export const PRESENTER_TTL_SEC = 8 * 60 * 60;

function signature(secret: string, expiresAtSec: number): Buffer {
  return createHmac("sha256", secret).update(`presenter:${expiresAtSec}`).digest();
}

/**
 * Stateless presenter session: `<expiry>.<HMAC(ADMIN_KEY, expiry)>`. The admin key
 * itself never leaves the server, and rotating it invalidates every session.
 */
export function signPresenterToken(secret: string, nowMs: number = Date.now()): string {
  const expiresAtSec = Math.floor(nowMs / 1000) + PRESENTER_TTL_SEC;
  return `${expiresAtSec}.${signature(secret, expiresAtSec).toString("base64url")}`;
}

export function verifyPresenterToken(
  token: string | undefined,
  secret: string | undefined = process.env.ADMIN_KEY,
  nowMs: number = Date.now(),
): boolean {
  if (!token || !secret || secret.length < MIN_ADMIN_KEY_LENGTH) return false;
  const [expiryPart, sigPart, extra] = token.split(".");
  if (!expiryPart || !sigPart || extra !== undefined || !/^\d{1,12}$/.test(expiryPart)) return false;
  const expiresAtSec = Number(expiryPart);
  if (expiresAtSec * 1000 <= nowMs) return false;

  const expected = signature(secret, expiresAtSec);
  const given = Buffer.from(sigPart, "base64url");
  return given.length === expected.length && timingSafeEqual(given, expected);
}
