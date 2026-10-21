import type { QuestionId } from "@/domain/questions.ts";
import { SPEAKER_NOTES } from "./speaker-notes.ts";

/** Metadata for one slide; the layout itself lives in src/components/deck/slides. */
export interface SlideMeta {
  readonly number: number;
  /** Short name for the presenter's slide list. */
  readonly label: string;
  /** Planned speaking time, from the deck's speaker notes. */
  readonly durationSec: number;
  /** Poll questions that open on phones while this slide is shown. */
  readonly questionIds: readonly QuestionId[];
  readonly notes: string;
}

const PLAN: readonly Omit<SlideMeta, "number" | "notes">[] = [
  { label: "Giriş", durationSec: 60, questionIds: ["maturity"] },
  { label: "İlkin vəziyyət", durationSec: 90, questionIds: ["priority"] },
  { label: "Strategiya və hədəf vəziyyət", durationSec: 90, questionIds: [] },
  { label: "T1 Modernizasiya", durationSec: 90, questionIds: [] },
  { label: "T2 İnteqrasiya və API", durationSec: 90, questionIds: [] },
  { label: "T3 + T4 Avtomatlaşdırma və sənədlər", durationSec: 90, questionIds: [] },
  { label: "T5 KPI panelləri", durationSec: 90, questionIds: ["kpi"] },
  { label: "T7 Süni intellekt", durationSec: 90, questionIds: [] },
  { label: "T6 Bulud və təhlükəsizlik", durationSec: 90, questionIds: [] },
  { label: "Yol xəritəsi", durationSec: 120, questionIds: [] },
  { label: "Faydalar, KPI və risklər", durationSec: 90, questionIds: ["risk"] },
  { label: "Nəticə və müzakirə", durationSec: 90, questionIds: ["first-step", "satisfaction"] },
  { label: "Canlı nəticələr", durationSec: 120, questionIds: [] },
];

export const SLIDES: readonly SlideMeta[] = PLAN.map((slide, i) => ({
  ...slide,
  number: i + 1,
  notes: SPEAKER_NOTES[i] ?? "",
}));

export const SLIDE_COUNT = SLIDES.length;
export const PLANNED_TOTAL_SEC = SLIDES.reduce((sum, s) => sum + s.durationSec, 0);
