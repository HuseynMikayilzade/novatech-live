import { createHash } from "node:crypto";
import type { AnswerStore } from "./store/index.ts";

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly retryAfterSec: number;
}

/** Fixed-window limiter; good enough for a classroom-sized audience and cheap on Redis. */
export async function rateLimit(store: AnswerStore, key: string, limit: number, windowSec: number): Promise<RateLimitResult> {
  const nowSec = Math.floor(Date.now() / 1000);
  const window = Math.floor(nowSec / windowSec);
  const count = await store.hit(`${key}:${window}`, windowSec);
  return { allowed: count <= limit, retryAfterSec: windowSec - (nowSec % windowSec) };
}

/** IPs are only used as hashed rate-limit keys and never stored in clear text. */
export function clientFingerprint(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = forwarded || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 16);
}
