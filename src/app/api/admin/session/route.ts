import { cookies } from "next/headers";
import { z } from "zod";
import type { PresenterSessionResponse } from "@/lib/api-types.ts";
import { checkAdminKey } from "@/server/admin-auth.ts";
import { jsonError, readJsonBody } from "@/server/http.ts";
import { PRESENTER_COOKIE, PRESENTER_TTL_SEC, signPresenterToken, verifyPresenterToken } from "@/server/presenter-auth.ts";
import { clientFingerprint, rateLimit } from "@/server/rate-limit.ts";
import { getStore } from "@/server/store/index.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SessionSchema = z.object({ key: z.string().max(256) });

/** Reports whether this browser already holds a presenter session. */
export async function GET(): Promise<Response> {
  const jar = await cookies();
  return Response.json({ active: verifyPresenterToken(jar.get(PRESENTER_COOKIE)?.value) });
}

/** Exchanges the admin key for a presenter cookie, so the key is typed once and never kept in the browser. */
export async function POST(request: Request): Promise<Response> {
  const store = getStore();
  try {
    // Same throttle as reset: slows down key guessing.
    const limit = await rateLimit(store, `admin:ip:${clientFingerprint(request)}`, 10, 60);
    if (!limit.allowed) {
      return jsonError(429, "rate_limited", "Çox cəhd edildi. Bir dəqiqə sonra yenidən yoxlayın.", { "Retry-After": String(limit.retryAfterSec) });
    }
  } catch (error) {
    console.error("[api/admin/session] rate limit failed", error);
    return jsonError(503, "storage_unavailable", "Server hazırda cavab vermir.");
  }

  const body = await readJsonBody(request, 1024);
  if (!body.ok) return body.response;
  const parsed = SessionSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(422, "validation_failed", "Açar göndərilməyib.");

  switch (checkAdminKey(parsed.data.key)) {
    case "not_configured":
      return jsonError(503, "not_configured", "ADMIN_KEY serverdə təyin olunmayıb (ən azı 12 simvol).");
    case "invalid":
      return jsonError(401, "unauthorized", "Açar yanlışdır.");
    case "ok":
      break;
  }

  const jar = await cookies();
  jar.set(PRESENTER_COOKIE, signPresenterToken(process.env.ADMIN_KEY as string), {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: PRESENTER_TTL_SEC,
  });
  const payload: PresenterSessionResponse = { ok: true, expiresAt: new Date(Date.now() + PRESENTER_TTL_SEC * 1000).toISOString() };
  return Response.json(payload);
}

export async function DELETE(): Promise<Response> {
  const jar = await cookies();
  jar.delete(PRESENTER_COOKIE);
  return Response.json({ ok: true });
}
