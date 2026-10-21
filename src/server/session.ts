import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "nt_sid";
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Anonymous participant id issued by the server in an httpOnly cookie, so a
 * participant's repeated answer to a question replaces the earlier one
 * instead of counting twice. Nothing personal is collected.
 */
export async function getOrCreateSessionId(): Promise<string> {
  const jar = await cookies();
  const existing = jar.get(COOKIE_NAME)?.value;
  if (existing && UUID_PATTERN.test(existing)) return existing;

  const sessionId = randomUUID();
  jar.set(COOKIE_NAME, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return sessionId;
}
