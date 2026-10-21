import type { Question } from "./questions.ts";

/**
 * Answers are stored as compact strings so every storage backend (Redis hash,
 * in-memory map) can hold them without schema knowledge:
 *   single → option id ("P2"), scale → "4", matrix → "3,2,4,1,3".
 * Encoding and decoding live together so the two can never drift apart.
 */

export type DecodedAnswer =
  | { readonly kind: "single"; readonly optionId: string }
  | { readonly kind: "scale"; readonly value: number }
  | { readonly kind: "matrix"; readonly values: readonly number[] };

export type NormalizeResult = { readonly ok: true; readonly value: string } | { readonly ok: false; readonly reason: string };

/** Response times outside this window are noise (double taps, a phone left open) and are ignored. */
export const MIN_DURATION_MS = 300;
export const MAX_DURATION_MS = 15 * 60 * 1000;

function isIntInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= min && value <= max;
}

export function normalizeAnswer(question: Question, input: unknown): NormalizeResult {
  switch (question.kind) {
    case "single": {
      if (typeof input !== "string" || !question.options.some((o) => o.id === input)) {
        return { ok: false, reason: "Seçilmiş variant bu suala aid deyil." };
      }
      return { ok: true, value: input };
    }
    case "scale": {
      if (!isIntInRange(input, question.min, question.max)) {
        return { ok: false, reason: `Bal ${question.min} ilə ${question.max} arasında olmalıdır.` };
      }
      return { ok: true, value: String(input) };
    }
    case "matrix": {
      const expected = question.dimensions.length;
      if (!Array.isArray(input) || input.length !== expected || !input.every((v) => isIntInRange(v, question.min, question.max))) {
        return { ok: false, reason: `Hər ${expected} sahəyə ${question.min}-${question.max} arası bal verilməlidir.` };
      }
      return { ok: true, value: input.join(",") };
    }
  }
}

/** Returns null for values that no longer match the catalog (e.g. data written by an older version). */
export function decodeAnswer(question: Question, stored: string): DecodedAnswer | null {
  switch (question.kind) {
    case "single":
      return question.options.some((o) => o.id === stored) ? { kind: "single", optionId: stored } : null;
    case "scale": {
      const value = Number(stored);
      return isIntInRange(value, question.min, question.max) ? { kind: "scale", value } : null;
    }
    case "matrix": {
      const values = stored.split(",").map(Number);
      const valid = values.length === question.dimensions.length && values.every((v) => isIntInRange(v, question.min, question.max));
      return valid ? { kind: "matrix", values } : null;
    }
  }
}

export function sanitizeDuration(ms: unknown): number | null {
  if (typeof ms !== "number" || !Number.isFinite(ms)) return null;
  const rounded = Math.round(ms);
  return rounded >= MIN_DURATION_MS && rounded <= MAX_DURATION_MS ? rounded : null;
}
