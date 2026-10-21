import type { ComponentType } from "react";
import { Slide01Title } from "./Slide01Title.tsx";
import { Slide02Current } from "./Slide02Current.tsx";
import { Slide03Strategy } from "./Slide03Strategy.tsx";
import { Slide04Modernize } from "./Slide04Modernize.tsx";
import { Slide05Integration } from "./Slide05Integration.tsx";
import { Slide06Workflow } from "./Slide06Workflow.tsx";
import { Slide07Kpi } from "./Slide07Kpi.tsx";
import { Slide08Ai } from "./Slide08Ai.tsx";
import { Slide09Cloud } from "./Slide09Cloud.tsx";
import { Slide10Roadmap } from "./Slide10Roadmap.tsx";
import { Slide11Benefits } from "./Slide11Benefits.tsx";
import { Slide12Conclusion } from "./Slide12Conclusion.tsx";
import { Slide13Live } from "./Slide13Live.tsx";

/** Slide layouts in deck order; index i renders SLIDES[i] from src/content/deck.ts. */
export const SLIDE_COMPONENTS: readonly ComponentType[] = [
  Slide01Title,
  Slide02Current,
  Slide03Strategy,
  Slide04Modernize,
  Slide05Integration,
  Slide06Workflow,
  Slide07Kpi,
  Slide08Ai,
  Slide09Cloud,
  Slide10Roadmap,
  Slide11Benefits,
  Slide12Conclusion,
  Slide13Live,
];
