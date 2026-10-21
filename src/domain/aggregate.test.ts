import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aggregate, type RawSnapshot } from "./aggregate.ts";
import { normalizeAnswer, sanitizeDuration } from "./answers.ts";
import { QUESTION_IDS, getQuestion, type QuestionId } from "./questions.ts";

function emptySnapshot(): { answers: Record<QuestionId, Record<string, string>>; durations: Record<QuestionId, Record<string, number>> } {
  const answers = {} as Record<QuestionId, Record<string, string>>;
  const durations = {} as Record<QuestionId, Record<string, number>>;
  for (const id of QUESTION_IDS) {
    answers[id] = {};
    durations[id] = {};
  }
  return { answers, durations };
}

describe("normalizeAnswer", () => {
  it("accepts a valid option and rejects an unknown one", () => {
    const q = getQuestion("priority");
    assert.deepEqual(normalizeAnswer(q, "P2"), { ok: true, value: "P2" });
    assert.equal(normalizeAnswer(q, "P9").ok, false);
    assert.equal(normalizeAnswer(q, 2).ok, false);
  });

  it("validates scale bounds and integers", () => {
    const q = getQuestion("satisfaction");
    assert.deepEqual(normalizeAnswer(q, 5), { ok: true, value: "5" });
    assert.equal(normalizeAnswer(q, 0).ok, false);
    assert.equal(normalizeAnswer(q, 4.5).ok, false);
    assert.equal(normalizeAnswer(q, "4").ok, false);
  });

  it("requires exactly one rating per matrix dimension", () => {
    const q = getQuestion("maturity");
    assert.deepEqual(normalizeAnswer(q, [1, 2, 3, 4, 5]), { ok: true, value: "1,2,3,4,5" });
    assert.equal(normalizeAnswer(q, [1, 2, 3]).ok, false);
    assert.equal(normalizeAnswer(q, [1, 2, 3, 4, 6]).ok, false);
  });
});

describe("sanitizeDuration", () => {
  it("drops implausible response times", () => {
    assert.equal(sanitizeDuration(50), null);
    assert.equal(sanitizeDuration(Number.NaN), null);
    assert.equal(sanitizeDuration(4200.4), 4200);
  });
});

describe("aggregate", () => {
  it("returns empty KPIs when nobody has answered", () => {
    const { answers, durations } = emptySnapshot();
    const result = aggregate({ sessions: [], answers, durations });
    assert.equal(result.kpis.participants, 0);
    assert.equal(result.kpis.completionRate, null);
    assert.equal(result.kpis.maturityIndex, null);
  });

  it("computes participation, completion, maturity and CSAT", () => {
    const { answers, durations } = emptySnapshot();
    // s1 answers everything, s2 only two questions.
    answers.maturity = { s1: "2,2,2,2,2", s2: "4,4,4,4,4" };
    answers.priority = { s1: "P2", s2: "P2" };
    answers.kpi = { s1: "resolution" };
    answers.risk = { s1: "resistance" };
    answers["first-step"] = { s1: "A" };
    answers.satisfaction = { s1: "5" };
    durations.priority = { s1: 2000, s2: 4000 };

    const snapshot: RawSnapshot = { sessions: ["s1", "s2"], answers, durations };
    const { kpis, questions } = aggregate(snapshot);

    assert.equal(kpis.participants, 2);
    assert.equal(kpis.completed, 1);
    assert.equal(kpis.completionRate, 0.5);
    assert.equal(kpis.totalAnswers, 8);
    assert.equal(kpis.maturityIndex, 3);
    assert.equal(kpis.csat, 1);
    assert.equal(kpis.avgResponseSec, 3);

    const priority = questions.find((q) => q.id === "priority");
    assert.ok(priority && priority.kind === "single");
    assert.equal(priority.leaderId, "P2");
    assert.equal(priority.options.find((o) => o.id === "P2")?.share, 1);
  });

  it("ignores stored values that no longer match the catalog", () => {
    const { answers, durations } = emptySnapshot();
    answers.priority = { s1: "P2", s2: "OLD_OPTION" };
    const { kpis } = aggregate({ sessions: ["s1"], answers, durations });
    assert.equal(kpis.totalAnswers, 1);
  });

  it("reports no leader on a tie", () => {
    const { answers, durations } = emptySnapshot();
    answers["first-step"] = { s1: "A", s2: "B" };
    const q = aggregate({ sessions: [], answers, durations }).questions.find((x) => x.id === "first-step");
    assert.ok(q && q.kind === "single");
    assert.equal(q.leaderId, null);
  });
});
