"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResultsResponse } from "./api-types.ts";
import { ApiError, fetchResults } from "./client-api.ts";

export interface LiveResultsState {
  readonly data: ResultsResponse | null;
  readonly error: string | null;
  /** True when the last refresh failed but older data is still shown. */
  readonly stale: boolean;
  readonly refresh: () => void;
}

/**
 * Polls the results endpoint. Polling (rather than websockets) fits serverless
 * hosting, survives flaky classroom Wi-Fi and pauses while the tab is hidden.
 */
export function useLiveResults(intervalMs = 3000): LiveResultsState {
  const [data, setData] = useState<ResultsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      setData(await fetchResults(controller.signal));
      setError(null);
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setError(e instanceof ApiError ? e.message : "Nəticələr yüklənmədi.");
    }
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      void load();
      timer = setInterval(() => void load(), intervalMs);
    };
    const stop = () => {
      clearInterval(timer);
      inFlight.current?.abort();
    };
    const onVisibility = () => (document.hidden ? stop() : start());

    start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [intervalMs, load]);

  return { data, error, stale: error !== null && data !== null, refresh: () => void load() };
}
