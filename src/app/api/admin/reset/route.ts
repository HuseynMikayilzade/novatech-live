import { z } from "zod";
import type { ResetResponse } from "@/lib/api-types.ts";
import { checkAdminKey } from "@/server/admin-auth.ts";
import { jsonError, readJsonBody } from "@/server/http.ts";
import { clientFingerprint, rateLimit } from "@/server/rate-limit.ts";
import { getStore } from "@/server/store/index.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ResetSchema = z.object({ key: z.string().max(256) });

export async function POST(request: Request): Promise<Response> {
  const store = getStore();
  try {
    // Throttle before checking the key to slow down guessing.
    const limit = await rateLimit(store, `admin:ip:${clientFingerprint(request)}`, 10, 60);
    if (!limit.allowed) {
      return jsonError(429, "rate_limited", "Çox cəhd edildi. Bir dəqiqə sonra yenidən yoxlayın.", { "Retry-After": String(limit.retryAfterSec) });
    }

    const body = await readJsonBody(request, 1024);
    if (!body.ok) return body.response;
    const parsed = ResetSchema.safeParse(body.data);
    if (!parsed.success) return jsonError(422, "validation_failed", "Açar göndərilməyib.");

    switch (checkAdminKey(parsed.data.key)) {
      case "not_configured":
        return jsonError(503, "not_configured", "ADMIN_KEY serverdə təyin olunmayıb (ən azı 12 simvol).");
      case "invalid":
        return jsonError(401, "unauthorized", "Açar yanlışdır.");
      case "ok":
        break;
    }

    await store.reset();
    const payload: ResetResponse = { ok: true, resetAt: new Date().toISOString() };
    return Response.json(payload);
  } catch (error) {
    console.error("[api/admin/reset] reset failed", error);
    return jsonError(503, "storage_unavailable", "Nəticələr sıfırlana bilmədi.");
  }
}
