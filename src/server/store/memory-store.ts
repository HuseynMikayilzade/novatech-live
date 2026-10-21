import type { RawSnapshot } from "@/domain/aggregate.ts";
import type { LiveState } from "@/domain/live.ts";
import { QUESTION_IDS, type QuestionId } from "@/domain/questions.ts";
import { LIVE_TTL_SEC, type AnswerStore, type SaveAnswerInput } from "./types.ts";

/**
 * Process-local store for local development and as a last-resort fallback.
 * On serverless platforms each instance has its own memory, so results can
 * split or disappear; the UI warns when this store is active.
 */
export class MemoryAnswerStore implements AnswerStore {
  readonly persistent = false;
  private sessions = new Set<string>();
  private answers = new Map<QuestionId, Map<string, string>>();
  private durations = new Map<QuestionId, Map<string, number>>();
  private counters = new Map<string, { count: number; expiresAt: number }>();
  private live: { state: LiveState; expiresAt: number } | null = null;

  async saveAnswer({ sessionId, questionId, value, durationMs }: SaveAnswerInput): Promise<void> {
    this.sessions.add(sessionId);
    this.bucket(this.answers, questionId).set(sessionId, value);
    const durations = this.bucket(this.durations, questionId);
    if (durationMs === null) durations.delete(sessionId);
    else durations.set(sessionId, durationMs);
  }

  async snapshot(): Promise<RawSnapshot> {
    const answers = {} as Record<QuestionId, Record<string, string>>;
    const durations = {} as Record<QuestionId, Record<string, number>>;
    for (const q of QUESTION_IDS) {
      answers[q] = Object.fromEntries(this.answers.get(q) ?? []);
      durations[q] = Object.fromEntries(this.durations.get(q) ?? []);
    }
    return { sessions: [...this.sessions], answers, durations };
  }

  async reset(): Promise<void> {
    this.sessions.clear();
    this.answers.clear();
    this.durations.clear();
  }

  async getLive(): Promise<LiveState | null> {
    if (this.live && this.live.expiresAt <= Date.now()) this.live = null;
    return this.live?.state ?? null;
  }

  async setLive(state: LiveState | null): Promise<void> {
    this.live = state ? { state, expiresAt: Date.now() + LIVE_TTL_SEC * 1000 } : null;
  }

  async hit(key: string, windowSec: number): Promise<number> {
    const now = Date.now();
    const current = this.counters.get(key);
    if (!current || current.expiresAt <= now) {
      this.counters.set(key, { count: 1, expiresAt: now + windowSec * 1000 });
      if (this.counters.size > 10_000) this.evictExpired(now);
      return 1;
    }
    current.count += 1;
    return current.count;
  }

  private bucket<V>(map: Map<QuestionId, Map<string, V>>, q: QuestionId): Map<string, V> {
    let inner = map.get(q);
    if (!inner) {
      inner = new Map();
      map.set(q, inner);
    }
    return inner;
  }

  private evictExpired(now: number): void {
    for (const [key, entry] of this.counters) if (entry.expiresAt <= now) this.counters.delete(key);
  }
}
