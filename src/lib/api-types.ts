import type { LiveResults } from "@/domain/aggregate.ts";
import type { QuestionId } from "@/domain/questions.ts";

export interface AnswerRequest {
  readonly questionId: QuestionId;
  readonly value: string | number | readonly number[];
  readonly durationMs?: number;
}

export interface ResultsResponse extends LiveResults {
  readonly generatedAt: string;
  /** False when the server runs without Redis and data is not durable. */
  readonly persistent: boolean;
}

export interface ResetResponse {
  readonly ok: true;
  readonly resetAt: string;
}

export type ApiErrorCode =
  | "invalid_json"
  | "payload_too_large"
  | "validation_failed"
  | "rate_limited"
  | "unauthorized"
  | "not_configured"
  | "storage_unavailable";

export interface ApiErrorBody {
  readonly error: { readonly code: ApiErrorCode; readonly message: string };
}
