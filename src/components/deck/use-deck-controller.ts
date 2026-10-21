"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SLIDES, SLIDE_COUNT } from "@/content/deck.ts";
import { ApiError, endLive, fetchPresenterSession, publishLive, startPresenterSession } from "@/lib/client-api.ts";

const CHANNEL = "novatech-deck";
const PUBLISH_DEBOUNCE_MS = 400;

interface DeckMessage {
  readonly from: string;
  readonly hello?: true;
  readonly index?: number;
  readonly overlay?: boolean;
  readonly black?: boolean;
  readonly sync?: boolean;
}

export type SyncStatus = "checking" | "off" | "on" | "error";

export interface DeckController {
  /** 0-based slide index. */
  readonly index: number;
  readonly overlay: boolean;
  readonly black: boolean;
  readonly sync: SyncStatus;
  readonly syncError: string | null;
  /** Digits typed so far for "number + Enter" jumps. */
  readonly jumpBuffer: string;
  readonly go: (index: number) => void;
  readonly next: () => void;
  readonly prev: () => void;
  readonly toggleOverlay: () => void;
  readonly toggleBlack: () => void;
  readonly login: (key: string) => Promise<boolean>;
  readonly setSyncEnabled: (on: boolean) => void;
}

const clamp = (i: number) => Math.min(Math.max(i, 0), SLIDE_COUNT - 1);

function readHash(): number {
  const n = Number(window.location.hash.replace("#", ""));
  return Number.isInteger(n) && n >= 1 ? clamp(n - 1) : 0;
}

/**
 * Slide state shared by the projector and presenter windows. The window where a
 * change happens broadcasts it to the other one and, while sync is on, publishes
 * the slide to phones; received changes are only applied, never re-published.
 */
export function useDeckController(): DeckController {
  const [index, setIndex] = useState(0);
  const [overlay, setOverlay] = useState(false);
  const [black, setBlack] = useState(false);
  const [sync, setSync] = useState<SyncStatus>("checking");
  const [syncError, setSyncError] = useState<string | null>(null);

  const id = useRef("");
  const channel = useRef<BroadcastChannel | null>(null);
  const state = useRef({ index: 0, overlay: false, black: false, sync: "checking" as SyncStatus });
  state.current = { index, overlay, black, sync };
  const publishTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const broadcast = useCallback((msg: Omit<DeckMessage, "from">) => {
    channel.current?.postMessage({ ...msg, from: id.current } satisfies DeckMessage);
  }, []);

  const publish = useCallback((i: number) => {
    clearTimeout(publishTimer.current);
    publishTimer.current = setTimeout(() => {
      const slide = SLIDES[i];
      if (!slide) return;
      publishLive({ slide: slide.number, questionIds: slide.questionIds }).catch((e: unknown) => {
        if (e instanceof ApiError && e.status === 401) {
          setSync("off");
          setSyncError("Təqdimatçı sessiyası bitib. Açarı yenidən daxil edin.");
        } else {
          setSyncError("Slayd telefonlara göndərilmədi. Növbəti keçiddə yenidən cəhd olunacaq.");
        }
      });
    }, PUBLISH_DEBOUNCE_MS);
  }, []);

  // Restore the slide from the URL and join the window channel.
  useEffect(() => {
    id.current = Math.random().toString(36).slice(2);
    setIndex(readHash());
    const onHash = () => setIndex(readHash());
    window.addEventListener("hashchange", onHash);

    if (typeof BroadcastChannel !== "undefined") {
      const ch = new BroadcastChannel(CHANNEL);
      channel.current = ch;
      ch.onmessage = (event: MessageEvent<DeckMessage>) => {
        const msg = event.data;
        if (msg.from === id.current) return;
        if (msg.hello) {
          const s = state.current;
          ch.postMessage({ from: id.current, index: s.index, overlay: s.overlay, black: s.black } satisfies DeckMessage);
          return;
        }
        if (msg.index !== undefined) setIndex(clamp(msg.index));
        if (msg.overlay !== undefined) setOverlay(msg.overlay);
        if (msg.black !== undefined) setBlack(msg.black);
        if (msg.sync !== undefined) setSync(msg.sync ? "on" : "off");
      };
      ch.postMessage({ from: id.current, hello: true } satisfies DeckMessage);
    }

    fetchPresenterSession()
      .then(({ active }) => setSync(active ? "on" : "off"))
      .catch(() => setSync("off"));

    return () => {
      window.removeEventListener("hashchange", onHash);
      channel.current?.close();
      channel.current = null;
      clearTimeout(publishTimer.current);
    };
  }, []);

  // Keep the URL in step so a reload returns to the same slide.
  useEffect(() => {
    const hash = `#${index + 1}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
  }, [index]);

  const go = useCallback(
    (target: number) => {
      const next = clamp(target);
      if (next === state.current.index) return;
      setIndex(next);
      setOverlay(false);
      broadcast({ index: next, overlay: false });
      if (state.current.sync === "on") publish(next);
    },
    [broadcast, publish],
  );

  const toggleOverlay = useCallback(() => {
    const on = !state.current.overlay;
    setOverlay(on);
    broadcast({ overlay: on });
  }, [broadcast]);

  const toggleBlack = useCallback(() => {
    const on = !state.current.black;
    setBlack(on);
    broadcast({ black: on });
  }, [broadcast]);

  const setSyncEnabled = useCallback(
    (on: boolean) => {
      setSyncError(null);
      setSync(on ? "on" : "off");
      broadcast({ sync: on });
      if (on) publish(state.current.index);
      else endLive().catch(() => setSyncError("Canlı rejim dayandırılmadı."));
    },
    [broadcast, publish],
  );

  const login = useCallback(
    async (key: string) => {
      try {
        await startPresenterSession(key);
        setSyncEnabled(true);
        return true;
      } catch (e) {
        setSyncError(e instanceof ApiError ? e.message : "Daxil olmaq alınmadı.");
        return false;
      }
    },
    [setSyncEnabled],
  );

  // Keyboard and presentation clickers (which send PageUp/PageDown, and "b" or "." to blank).
  const [jumpBuffer, setJumpBuffer] = useState("");
  const jumpRef = useRef("");
  useEffect(() => {
    const setJump = (v: string) => {
      jumpRef.current = v;
      setJumpBuffer(v);
    };
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (target?.closest("input, textarea, select, dialog, [contenteditable='true']")) return;
      const i = state.current.index;

      if (/^\d$/.test(e.key)) {
        setJump((jumpRef.current + e.key).slice(-2));
        return;
      }
      switch (e.key) {
        case "Enter":
          if (jumpRef.current) {
            go(Number(jumpRef.current) - 1);
            setJump("");
            e.preventDefault();
          }
          return;
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
        case " ":
          e.preventDefault();
          go(i + 1);
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          go(i - 1);
          break;
        case "Home":
          go(0);
          break;
        case "End":
          go(SLIDE_COUNT - 1);
          break;
        case "r":
        case "R":
          toggleOverlay();
          break;
        case "b":
        case "B":
        case ".":
          toggleBlack();
          break;
        case "Escape":
          if (state.current.overlay) toggleOverlay();
          break;
        default:
          return;
      }
      setJump("");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleOverlay, toggleBlack]);

  return {
    index,
    overlay,
    black,
    sync,
    syncError,
    jumpBuffer,
    go,
    next: () => go(state.current.index + 1),
    prev: () => go(state.current.index - 1),
    toggleOverlay,
    toggleBlack,
    login,
    setSyncEnabled,
  };
}
