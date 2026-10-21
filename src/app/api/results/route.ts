import { aggregate } from "@/domain/aggregate.ts";
import type { ResultsResponse } from "@/lib/api-types.ts";
import { jsonError } from "@/server/http.ts";
import { clientFingerprint, rateLimit } from "@/server/rate-limit.ts";
import { getStore } from "@/server/store/index.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request): Promise<Response> {
  const store = getStore();
  try {
    const limit = await rateLimit(store, `results:ip:${clientFingerprint(request)}`, 600, 60);
    if (!limit.allowed) {
      return jsonError(429, "rate_limited", "Nəticələr çox tez-tez sorğulanır.", { "Retry-After": String(limit.retryAfterSec) });
    }
    const results = aggregate(await store.snapshot());
    const payload: ResultsResponse = { ...results, generatedAt: new Date().toISOString(), persistent: store.persistent };
    return Response.json(payload);
  } catch (error) {
    console.error("[api/results] failed to build results", error);
    return jsonError(503, "storage_unavailable", "Nəticələr hazırda yüklənə bilmədi.");
  }
}
