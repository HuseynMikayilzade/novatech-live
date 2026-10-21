"use client";

import type { ResultsResponse } from "@/lib/api-types.ts";
import { DeckContext } from "./deck-context.ts";
import { STAGE_HEIGHT, STAGE_WIDTH } from "./SlideCanvas.tsx";
import { SLIDE_COMPONENTS } from "./slides/index.ts";
import styles from "./stage.module.css";

/** Every slide at native size, hidden on screen; "Save as PDF" prints one slide per page as a Wi-Fi-free backup. */
export function PrintDeck({ results, host }: { results: ResultsResponse | null; host: string }) {
  return (
    <DeckContext.Provider value={{ results, host, goTo: () => {}, interactive: false }}>
      <div className={styles.print} aria-hidden="true">
        {SLIDE_COMPONENTS.map((Slide, i) => (
          <div key={i} className={styles.printPage} style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT }}>
            <Slide />
          </div>
        ))}
      </div>
    </DeckContext.Provider>
  );
}
