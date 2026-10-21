import { decodeAnswer } from "./answers.ts";
import { QUESTIONS, type QuestionId } from "./questions.ts";

/** Raw state as persisted: per question, sessionId → encoded answer / response time. */
export interface RawSnapshot {
  readonly sessions: readonly string[];
  readonly answers: Readonly<Record<QuestionId, Readonly<Record<string, string>>>>;
  readonly durations: Readonly<Record<QuestionId, Readonly<Record<string, number>>>>;
}

export interface OptionResult {
  readonly id: string;
  readonly code?: string;
  readonly label: string;
  readonly count: number;
  /** 0..1 share of this question's responses. */
  readonly share: number;
}

interface QuestionResultBase {
  readonly id: QuestionId;
  readonly slide: number;
  readonly shortTitle: string;
  readonly title: string;
  readonly responses: number;
  readonly avgResponseSec: number | null;
}

export type QuestionResult =
  | (QuestionResultBase & { readonly kind: "single"; readonly options: readonly OptionResult[]; readonly leaderId: string | null })
  | (QuestionResultBase & {
      readonly kind: "scale";
      readonly min: number;
      readonly max: number;
      readonly minLabel: string;
      readonly maxLabel: string;
      readonly distribution: readonly { readonly value: number; readonly count: number }[];
      readonly average: number | null;
    })
  | (QuestionResultBase & {
      readonly kind: "matrix";
      readonly min: number;
      readonly max: number;
      readonly dimensions: readonly { readonly id: string; readonly label: string; readonly average: number | null }[];
      readonly average: number | null;
    });

export interface LiveKpis {
  readonly participants: number;
  readonly completed: number;
  /** 0..1, null while nobody has joined. */
  readonly completionRate: number | null;
  readonly totalAnswers: number;
  readonly avgResponseSec: number | null;
  /** 1..5 mean of all maturity ratings. */
  readonly maturityIndex: number | null;
  /** Share (0..1) of satisfaction answers rated 4 or 5. */
  readonly csat: number | null;
  readonly avgSatisfaction: number | null;
}

export interface LiveResults {
  readonly kpis: LiveKpis;
  readonly questions: readonly QuestionResult[];
}

const mean = (values: readonly number[]): number | null =>
  values.length === 0 ? null : values.reduce((sum, v) => sum + v, 0) / values.length;

export function aggregate(snapshot: RawSnapshot): LiveResults {
  const participants = new Set(snapshot.sessions);
  const answeredBySession = new Map<string, number>();
  const allDurations: number[] = [];
  let totalAnswers = 0;
  let maturityIndex: number | null = null;
  let csat: number | null = null;
  let avgSatisfaction: number | null = null;

  const questions: QuestionResult[] = QUESTIONS.map((question) => {
    const raw = snapshot.answers[question.id] ?? {};
    const durationsRaw = snapshot.durations[question.id] ?? {};

    // Only answers that still decode against the catalog are counted.
    const decoded = Object.entries(raw).flatMap(([sessionId, stored]) => {
      const answer = decodeAnswer(question, stored);
      return answer ? [{ sessionId, answer }] : [];
    });

    const durations: number[] = [];
    for (const { sessionId } of decoded) {
      participants.add(sessionId);
      answeredBySession.set(sessionId, (answeredBySession.get(sessionId) ?? 0) + 1);
      const ms = durationsRaw[sessionId];
      if (typeof ms === "number") durations.push(ms);
    }
    allDurations.push(...durations);
    totalAnswers += decoded.length;

    const avgMs = mean(durations);
    const base = {
      id: question.id,
      slide: question.slide,
      shortTitle: question.shortTitle,
      title: question.title,
      responses: decoded.length,
      avgResponseSec: avgMs === null ? null : avgMs / 1000,
    };

    switch (question.kind) {
      case "single": {
        const counts = new Map<string, number>();
        for (const { answer } of decoded) {
          if (answer.kind === "single") counts.set(answer.optionId, (counts.get(answer.optionId) ?? 0) + 1);
        }
        const options = question.options.map((o) => {
          const count = counts.get(o.id) ?? 0;
          return { id: o.id, code: o.code, label: o.label, count, share: decoded.length ? count / decoded.length : 0 };
        });
        const top = Math.max(0, ...options.map((o) => o.count));
        const leaders = options.filter((o) => o.count === top && top > 0);
        return { ...base, kind: "single", options, leaderId: leaders.length === 1 ? leaders[0]!.id : null };
      }
      case "scale": {
        const values = decoded.flatMap(({ answer }) => (answer.kind === "scale" ? [answer.value] : []));
        const distribution = [];
        for (let v = question.min; v <= question.max; v++) {
          distribution.push({ value: v, count: values.filter((x) => x === v).length });
        }
        const average = mean(values);
        if (question.id === "satisfaction") {
          avgSatisfaction = average;
          csat = values.length ? values.filter((v) => v >= 4).length / values.length : null;
        }
        return {
          ...base,
          kind: "scale",
          min: question.min,
          max: question.max,
          minLabel: question.minLabel,
          maxLabel: question.maxLabel,
          distribution,
          average,
        };
      }
      case "matrix": {
        const rows = decoded.flatMap(({ answer }) => (answer.kind === "matrix" ? [answer.values] : []));
        const dimensions = question.dimensions.map((d, i) => ({
          id: d.id,
          label: d.label,
          average: mean(rows.map((r) => r[i]!)),
        }));
        const average = mean(rows.flat());
        if (question.id === "maturity") maturityIndex = average;
        return { ...base, kind: "matrix", min: question.min, max: question.max, dimensions, average };
      }
    }
  });

  const completed = [...answeredBySession.values()].filter((n) => n >= QUESTIONS.length).length;
  const avgAllMs = mean(allDurations);

  return {
    kpis: {
      participants: participants.size,
      completed,
      completionRate: participants.size ? completed / participants.size : null,
      totalAnswers,
      avgResponseSec: avgAllMs === null ? null : avgAllMs / 1000,
      maturityIndex,
      csat,
      avgSatisfaction,
    },
    questions,
  };
}
