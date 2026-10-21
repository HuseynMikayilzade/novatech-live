import { QUESTION_IDS, isQuestionId, type QuestionId } from "./questions.ts";

/** What the presenter is showing right now; phones follow it while it exists. */
export interface LiveState {
  readonly slide: number;
  /** Questions open on this slide, in catalog order. Empty on content slides. */
  readonly questionIds: readonly QuestionId[];
  readonly updatedAt: string;
}

export const MAX_SLIDE = 99;

/** Validates stored or submitted state; anything malformed is treated as "no live session". */
export function parseLiveState(raw: unknown): LiveState | null {
  if (typeof raw !== "object" || raw === null) return null;
  const { slide, questionIds, updatedAt } = raw as Record<string, unknown>;
  if (typeof slide !== "number" || !Number.isInteger(slide) || slide < 1 || slide > MAX_SLIDE) return null;
  if (!Array.isArray(questionIds) || !questionIds.every(isQuestionId)) return null;
  if (typeof updatedAt !== "string" || Number.isNaN(Date.parse(updatedAt))) return null;
  const ordered = QUESTION_IDS.filter((id) => questionIds.includes(id));
  return { slide, questionIds: ordered, updatedAt };
}
