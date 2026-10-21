import { cookies } from "next/headers";
import { z } from "zod";
import { MAX_SLIDE } from "@/domain/live.ts";
import { QUESTION_IDS } from "@/domain/questions.ts";
import type { LiveResponse } from "@/lib/api-types.ts";
import { jsonError, readJsonBody } from "@/server/http.ts";
import { PRESENTER_COOKIE, verifyPresenterToken } from "@/server/presenter-auth.ts";
import { getStore } from "@/server/store/index.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const LiveUpdateSchema = z.object({
  slide: z.number().int().min(1).max(MAX_SLIDE),
  questionIds: z.array(z.enum(QUESTION_IDS)).max(QUESTION_IDS.length),
});

/**
 * Polled by every phone in the room. Vercel's CDN keeps the answer for a second
 * (browsers still get no-store), so Redis sees ~1 read/s however many phones poll.
 */
export async function GET(): Promise<Response> {
  try {
    const payload: LiveResponse = { active: await getStore().getLive() };
    return Response.json(payload, { headers: { "Vercel-CDN-Cache-Control": "max-age=1, stale-while-revalidate=2" } });
  } catch (error) {
    console.error("[api/live] failed to read live state", error);
    return jsonError(503, "storage_unavailable", "Canlı rejim hazırda əlçatan deyil.");
  }
}

/** Presenter-only: publishes the current slide so phones open its questions. */
export async function POST(request: Request): Promise<Response> {
  const jar = await cookies();
  if (!verifyPresenterToken(jar.get(PRESENTER_COOKIE)?.value)) {
    return jsonError(401, "unauthorized", "Təqdimatçı kimi daxil olun.");
  }

  const body = await readJsonBody(request, 1024);
  if (!body.ok) return body.response;
  const parsed = LiveUpdateSchema.safeParse(body.data);
  if (!parsed.success) return jsonError(422, "validation_failed", "Slayd məlumatı düzgün deyil.");

  const active = {
    slide: parsed.data.slide,
    questionIds: QUESTION_IDS.filter((id) => parsed.data.questionIds.includes(id)),
    updatedAt: new Date().toISOString(),
  };
  try {
    await getStore().setLive(active);
    const payload: LiveResponse = { active };
    return Response.json(payload);
  } catch (error) {
    console.error("[api/live] failed to store live state", error);
    return jsonError(503, "storage_unavailable", "Canlı rejim yadda saxlanılmadı.");
  }
}

/** Presenter-only: ends the live session; phones fall back to the free flow. */
export async function DELETE(): Promise<Response> {
  const jar = await cookies();
  if (!verifyPresenterToken(jar.get(PRESENTER_COOKIE)?.value)) {
    return jsonError(401, "unauthorized", "Təqdimatçı kimi daxil olun.");
  }
  try {
    await getStore().setLive(null);
    const payload: LiveResponse = { active: null };
    return Response.json(payload);
  } catch (error) {
    console.error("[api/live] failed to clear live state", error);
    return jsonError(503, "storage_unavailable", "Canlı rejim dayandırılmadı.");
  }
}
