"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { SLIDES, SLIDE_COUNT } from "@/content/deck.ts";
import { useLiveResults } from "@/lib/use-live-results.ts";
import { DeckContext } from "./deck-context.ts";
import deck from "./deck.module.css";
import { LiveOverlay } from "./LiveOverlay.tsx";
import { PrintDeck } from "./PrintDeck.tsx";
import { SlideCanvas } from "./SlideCanvas.tsx";
import { SLIDE_COMPONENTS } from "./slides/index.ts";
import styles from "./stage.module.css";
import { SyncControl } from "./SyncControl.tsx";
import { useDeckController } from "./use-deck-controller.ts";

const HUD_IDLE_MS = 2500;
const SWIPE_PX = 60;

function toggleFullscreen() {
  if (document.fullscreenElement) void document.exitFullscreen();
  else void document.documentElement.requestFullscreen?.();
}

export function openPresenterWindow(slide: number) {
  window.open(`/teqdimat/natiq#${slide}`, "novatech-presenter", "popup,width=1280,height=800");
}

/** The projector screen: one slide at a time, scaled to fill the display. */
export function DeckStage() {
  const controller = useDeckController();
  const { index, overlay, black } = controller;
  const { data } = useLiveResults(3000);
  const [host, setHost] = useState("");
  const [hudVisible, setHudVisible] = useState(true);
  const hudTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const swipeStart = useRef<number | null>(null);

  useEffect(() => setHost(window.location.host), []);

  // Stage-only shortcuts: F fullscreen, P presenter window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement | null)?.closest("input, dialog")) return;
      if (e.key === "f" || e.key === "F") toggleFullscreen();
      if (e.key === "p" || e.key === "P") openPresenterWindow(index + 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // Controls fade out while the presenter talks and come back on mouse movement.
  const wakeHud = () => {
    setHudVisible(true);
    clearTimeout(hudTimer.current);
    hudTimer.current = setTimeout(() => setHudVisible(false), HUD_IDLE_MS);
  };
  useEffect(() => {
    wakeHud();
    return () => clearTimeout(hudTimer.current);
  }, []);

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") swipeStart.current = e.clientX;
  };
  const onPointerUp = (e: PointerEvent) => {
    if (swipeStart.current === null) return;
    const dx = e.clientX - swipeStart.current;
    swipeStart.current = null;
    if (dx <= -SWIPE_PX) controller.next();
    else if (dx >= SWIPE_PX) controller.prev();
  };

  const meta = SLIDES[index]!;
  const Current = SLIDE_COMPONENTS[index]!;
  const context = { results: data, host, goTo: (slide: number) => controller.go(slide - 1), interactive: true };

  return (
    <DeckContext.Provider value={context}>
      <main className={styles.screen} onMouseMove={wakeHud} onPointerDown={onPointerDown} onPointerUp={onPointerUp} data-hud={hudVisible || undefined}>
        <SlideCanvas>
          <section key={index} className={deck.fade} aria-roledescription="slide" aria-label={`Slayd ${meta.number} / ${SLIDE_COUNT}: ${meta.label}`}>
            <Current />
          </section>
          {overlay && <LiveOverlay questionIds={meta.questionIds} />}
          {black && <div className={deck.blackout} aria-hidden="true" />}
        </SlideCanvas>

        <div className={styles.progress} aria-hidden="true">
          <span style={{ width: `${((index + 1) / SLIDE_COUNT) * 100}%` }} />
        </div>

        <nav className={styles.hud} aria-label="Təqdimat idarəetməsi">
          <button type="button" className={styles.hudButton} onClick={controller.prev} disabled={index === 0} aria-label="Əvvəlki slayd">
            ‹
          </button>
          <span className={styles.hudCount}>
            {controller.jumpBuffer ? `→ ${controller.jumpBuffer}` : `${index + 1} / ${SLIDE_COUNT}`}
          </span>
          <button type="button" className={styles.hudButton} onClick={controller.next} disabled={index === SLIDE_COUNT - 1} aria-label="Növbəti slayd">
            ›
          </button>
          <span className={styles.hudDivider} aria-hidden="true" />
          <button type="button" className={styles.hudText} onClick={controller.toggleOverlay} title="R">
            Nəticələr
          </button>
          <button type="button" className={styles.hudText} onClick={() => openPresenterWindow(index + 1)} title="P">
            Natiq görünüşü
          </button>
          <button type="button" className={styles.hudText} onClick={toggleFullscreen} title="F">
            Tam ekran
          </button>
          <button type="button" className={styles.hudText} onClick={() => window.print()} title="PDF kimi saxla">
            PDF
          </button>
          <span className={styles.hudDivider} aria-hidden="true" />
          <SyncControl controller={controller} />
        </nav>

        <p className="visually-hidden" aria-live="polite">
          Slayd {meta.number}: {meta.label}
        </p>
      </main>
      <PrintDeck results={data} host={host} />
    </DeckContext.Provider>
  );
}
