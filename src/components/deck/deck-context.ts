"use client";

import { createContext, useContext } from "react";
import type { ResultsResponse } from "@/lib/api-types.ts";

export interface DeckContextValue {
  /** Latest poll results, shared by every slide; null until the first poll answers. */
  readonly results: ResultsResponse | null;
  /** Host shown under QR codes, e.g. novatech-live.vercel.app. */
  readonly host: string;
  /** Jumps to a 1-based slide; a no-op in previews and print. */
  readonly goTo: (slide: number) => void;
  /** False for thumbnails and print, where links must not navigate or take focus. */
  readonly interactive: boolean;
}

export const DeckContext = createContext<DeckContextValue>({
  results: null,
  host: "",
  goTo: () => {},
  interactive: false,
});

export const useDeck = (): DeckContextValue => useContext(DeckContext);
