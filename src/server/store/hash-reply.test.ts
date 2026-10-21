import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aggregate } from "../../domain/aggregate.ts";
import { QUESTION_IDS, type QuestionId } from "../../domain/questions.ts";
import { toRecord } from "./hash-reply.ts";

const A = "11111111-2222-4333-8444-555555555555";
const B = "66666666-7777-4888-9999-aaaaaaaaaaaa";

describe("toRecord", () => {
  it("turns a flat HGETALL array into field -> value pairs", () => {
    assert.deepEqual(toRecord([A, "P2", B, "P3"]), { [A]: "P2", [B]: "P3" });
  });

  it("passes objects through and treats empty replies as empty", () => {
    assert.deepEqual(toRecord({ [A]: "P2" }), { [A]: "P2" });
    assert.deepEqual(toRecord(null), {});
    assert.deepEqual(toRecord(undefined), {});
    assert.deepEqual(toRecord([]), {});
  });

  it("ignores a dangling field without a value", () => {
    assert.deepEqual(toRecord([A, "P2", B]), { [A]: "P2" });
  });

  it("keeps participants equal to real sessions (regression: counts were doubled)", () => {
    const answers = {} as Record<QuestionId, Record<string, string>>;
    const durations = {} as Record<QuestionId, Record<string, number>>;
    for (const id of QUESTION_IDS) {
      answers[id] = {};
      durations[id] = {};
    }
    answers.priority = toRecord([A, "P2", B, "P3"]);
    const results = aggregate({ sessions: [A, B], answers, durations });
    assert.equal(results.kpis.participants, 2);
    assert.equal(results.kpis.totalAnswers, 2);
  });
});
