"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LiveState } from "@/domain/live.ts";
import { fetchLive } from "./client-api.ts";

export interface LiveSessionState {
  /** Null while no presentation is running (or before the first poll). */
  readonly active: LiveState | null;
  /** True once the first poll has answered, so the UI doesn't flash the free flow. */
  readonly ready: boolean;
}

/**
 * Follows the presenter's current slide. Same polling rules as useLiveResults:
 * one request in flight, paused while the tab is hidden. A failed poll keeps the
 * last known state so a Wi-Fi hiccup doesn't kick phones out of the question.
 */
export function useLiveSession(intervalMs = 2000): LiveSessionState {
  const [state, setState] = useState<LiveSessionState>({ active: null, ready: false });
  const inFlight = useRef<AbortController | null>(null);

  const load = useCallback(async () => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    try {
      const { active } = await fetchLive(controller.signal);
      // Keep the same object while nothing changed, so consumers don't re-run effects every poll.
      setState((prev) => (prev.ready && (prev.active?.updatedAt ?? null) === (active?.updatedAt ?? null) ? prev : { active, ready: true }));
    } catch (e) {
      if (e instanceof DOMException && e.name === "AbortError") return;
      setState((prev) => (prev.ready ? prev : { active: null, ready: true }));
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

  return state;
}
