"use client";

import { useEffect, useState } from "react";
import { PLANNED_TOTAL_SEC, SLIDES, SLIDE_COUNT } from "@/content/deck.ts";
import { useLiveResults } from "@/lib/use-live-results.ts";
import { DeckContext } from "./deck-context.ts";
import styles from "./presenter.module.css";
import { SlideCanvas } from "./SlideCanvas.tsx";
import { SLIDE_COMPONENTS } from "./slides/index.ts";
import { SyncControl } from "./SyncControl.tsx";
import { useDeckController } from "./use-deck-controller.ts";

const clock = (sec: number) => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
};

function openProjector(slide: number) {
  window.open(`/teqdimat#${slide}`, "novatech-stage");
}

/** Laptop-side view: current and next slide, speaker notes, timers and live counts. */
export function PresenterView() {
  const controller = useDeckController();
  const { index } = controller;
  const { data } = useLiveResults(3000);
  const [host, setHost] = useState("");
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [slideStartedAt, setSlideStartedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => setHost(window.location.host), []);
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => setSlideStartedAt(Date.now()), [index]);

  const meta = SLIDES[index]!;
  const nextMeta = SLIDES[index + 1];
  const Current = SLIDE_COMPONENTS[index]!;
  const Next = nextMeta ? SLIDE_COMPONENTS[index + 1]! : null;
  const elapsed = startedAt === null ? 0 : (now - startedAt) / 1000;
  const onSlide = (now - slideStartedAt) / 1000;
  const plannedSoFar = SLIDES.slice(0, index).reduce((sum, s) => sum + s.durationSec, 0);
  const preview = { results: data, host, goTo: () => {}, interactive: false };
  const live = meta.questionIds.map((id) => data?.questions.find((q) => q.id === id)).filter((q) => q !== undefined);

  return (
    <DeckContext.Provider value={preview}>
      <main className={styles.view}>
        <header className={styles.bar}>
          <p className={styles.position}>
            <strong>
              {index + 1} / {SLIDE_COUNT}
            </strong>
            {meta.label}
          </p>
          <div className={styles.timers}>
            <span title="Ümumi vaxt / plan">
              {clock(elapsed)} <small>/ {clock(PLANNED_TOTAL_SEC)}</small>
            </span>
            <span title="Bu slaydda / plan" data-over={onSlide > meta.durationSec || undefined}>
              {clock(onSlide)} <small>/ {clock(meta.durationSec)}</small>
            </span>
            {startedAt !== null && elapsed > plannedSoFar + meta.durationSec + 30 && <span className={styles.behind}>Plandan gecikirsiniz</span>}
            <button type="button" className={styles.button} onClick={() => setStartedAt(startedAt === null ? Date.now() : null)}>
              {startedAt === null ? "Taymeri başlat" : "Sıfırla"}
            </button>
          </div>
          <div className={styles.actions}>
            <button type="button" className={styles.button} onClick={() => openProjector(index + 1)}>
              Proyektor pəncərəsi
            </button>
            <button type="button" className={styles.button} onClick={controller.toggleOverlay} aria-pressed={controller.overlay}>
              Nəticələr (R)
            </button>
            <button type="button" className={styles.button} onClick={controller.toggleBlack} aria-pressed={controller.black}>
              Qara ekran (B)
            </button>
            <SyncControl controller={controller} />
          </div>
        </header>

        <section className={styles.current} aria-label="Cari slayd">
          <SlideCanvas className={styles.canvas}>
            <Current />
          </SlideCanvas>
        </section>

        <aside className={styles.side}>
          <div className={styles.nextBox}>
            <p className={styles.label}>Növbəti: {nextMeta ? nextMeta.label : "son slayd"}</p>
            <div className={styles.nextCanvas}>
              {Next ? (
                <SlideCanvas>
                  <Next />
                </SlideCanvas>
              ) : (
                <p className={styles.end}>Təqdimatın sonu</p>
              )}
            </div>
          </div>

          {live.length > 0 && (
            <div className={styles.liveBox}>
              <p className={styles.label}>Bu slaydın sualları</p>
              {live.map((q) => (
                <p key={q.id} className={styles.liveRow}>
                  <span>{q.shortTitle}</span>
                  <strong>{q.responses}</strong>
                </p>
              ))}
              <p className={styles.hint}>{controller.sync === "on" ? "Telefonlarda bu suallar açıqdır." : "Sinxron söndürülüb: telefonlar sərbəst rejimdədir."}</p>
            </div>
          )}

          <div className={styles.nav}>
            <button type="button" className={styles.navButton} onClick={controller.prev} disabled={index === 0}>
              ‹ Əvvəlki
            </button>
            <button type="button" className={styles.navButton} data-primary onClick={controller.next} disabled={index === SLIDE_COUNT - 1}>
              Növbəti ›
            </button>
          </div>

          <ol className={styles.list}>
            {SLIDES.map((s, i) => (
              <li key={s.number}>
                <button type="button" className={styles.listItem} aria-current={i === index || undefined} onClick={() => controller.go(i)}>
                  <span>{s.number}</span>
                  {s.label}
                  {s.questionIds.length > 0 && <em>sual</em>}
                </button>
              </li>
            ))}
          </ol>
        </aside>

        <section className={styles.notes} aria-label="Natiq qeydləri">
          <p className={styles.label}>Qeydlər</p>
          <div className={styles.notesText}>{meta.notes}</div>
        </section>
      </main>
    </DeckContext.Provider>
  );
}
