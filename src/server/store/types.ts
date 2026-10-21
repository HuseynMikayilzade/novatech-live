import type { RawSnapshot } from "@/domain/aggregate.ts";
import type { QuestionId } from "@/domain/questions.ts";

export interface SaveAnswerInput {
  readonly sessionId: string;
  readonly questionId: QuestionId;
  /** Already normalized by the domain layer. */
  readonly value: string;
  readonly durationMs: number | null;
}

/**
 * Persistence port. The API layer depends only on this interface, so the
 * backend (Upstash Redis in production, memory locally) is swappable.
 */
export interface AnswerStore {
  /** False when data lives only in this process and can vanish between requests. */
  readonly persistent: boolean;
  saveAnswer(input: SaveAnswerInput): Promise<void>;
  snapshot(): Promise<RawSnapshot>;
  reset(): Promise<void>;
  /** Increments a counter that expires after `windowSec`; returns the new value. */
  hit(key: string, windowSec: number): Promise<number>;
}

export const KEY_PREFIX = "nt:v1";
export const keys = {
  sessions: `${KEY_PREFIX}:sessions`,
  answers: (q: QuestionId) => `${KEY_PREFIX}:ans:${q}`,
  durations: (q: QuestionId) => `${KEY_PREFIX}:dur:${q}`,
  counter: (key: string) => `${KEY_PREFIX}:rl:${key}`,
} as const;
