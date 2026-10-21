import { createHash, timingSafeEqual } from "node:crypto";

export const MIN_ADMIN_KEY_LENGTH = 12;

export type AdminKeyCheck = "ok" | "invalid" | "not_configured";

export function checkAdminKey(candidate: unknown, configured: string | undefined = process.env.ADMIN_KEY): AdminKeyCheck {
  if (!configured || configured.length < MIN_ADMIN_KEY_LENGTH) return "not_configured";
  if (typeof candidate !== "string" || candidate.length === 0) return "invalid";
  // Hash both sides so the comparison is constant-time regardless of length.
  const a = createHash("sha256").update(candidate).digest();
  const b = createHash("sha256").update(configured).digest();
  return timingSafeEqual(a, b) ? "ok" : "invalid";
}
