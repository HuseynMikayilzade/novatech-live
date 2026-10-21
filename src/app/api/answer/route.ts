import { z } from "zod";
import { normalizeAnswer, sanitizeDuration } from "@/domain/answers.ts";
import { QUESTION_IDS, getQuestion } from "@/domain/questions.ts";
import { jsonError, readJsonBody } from "@/server/http.ts";
import { clientFingerprint, rateLimit } from "@/server/rate-limit.ts";
import { getOrCreateSessionId } from "@/server/session.ts";
import { getStore } from "@/server/store/index.ts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Transport-level shape only; question-specific rules live in the domain layer.
const AnswerSchema = z.object({
  questionId: z.enum(QUESTION_IDS),
  value: z.union([z.string().max(64), z.number(), z.array(z.number()).max(10)]),
  durationMs: z.number().optional(),
});

export async function POST(request: Request): Promise<Response> {
  const body = await readJsonBody(request, 2048);
  if (!body.ok) return body.response;

  const parsed = AnswerSchema.safeParse(body.data);
  if (!parsed.success) {
    return jsonError(422, "validation_failed", "Cavabın formatı düzgün deyil.");
  }

  const question = getQuestion(parsed.data.questionId);
  const normalized = normalizeAnswer(question, parsed.data.value);
  if (!normalized.ok) return jsonError(422, "validation_failed", normalized.reason);

  const store = getStore();
  try {
    const sessionId = await getOrCreateSessionId();

    // A whole class often shares one university IP, so the per-IP limit is generous
    // and the tight limit is per participant.
    const [perSession, perIp] = await Promise.all([
      rateLimit(store, `answer:s:${sessionId}`, 30, 60),
      rateLimit(store, `answer:ip:${clientFingerprint(request)}`, 600, 60),
    ]);
    const blocked = !perSession.allowed ? perSession : !perIp.allowed ? perIp : null;
    if (blocked) {
      return jsonError(429, "rate_limited", "Çox sürətli cavab göndərilir. Bir neçə saniyə gözləyin.", {
        "Retry-After": String(blocked.retryAfterSec),
      });
    }

    await store.saveAnswer({
      sessionId,
      questionId: question.id,
      value: normalized.value,
      durationMs: sanitizeDuration(parsed.data.durationMs),
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[api/answer] failed to save answer", error);
    return jsonError(503, "storage_unavailable", "Cavab hazırda saxlanıla bilmədi. Bir az sonra yenidən cəhd edin.");
  }
}
