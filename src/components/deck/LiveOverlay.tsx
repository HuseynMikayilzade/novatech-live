"use client";

import type { QuestionResult } from "@/domain/aggregate.ts";
import type { QuestionId } from "@/domain/questions.ts";
import { formatSeconds } from "@/lib/format.ts";
import { buildTiles } from "../results/ResultsBoard.tsx";
import { MaturityRadar, OptionBars, ScaleColumns } from "../results/charts.tsx";
import { useDeck } from "./deck-context.ts";
import styles from "./deck.module.css";
import { JoinCard } from "./primitives.tsx";

function ResultChart({ result }: { result: QuestionResult }) {
  if (result.responses === 0) return <p className={styles.overlayEmpty}>Hələ cavab yoxdur. QR kodu skan edib cavab verin.</p>;
  return (
    <div className={styles.overlayChart}>
      {result.kind === "single" ? <OptionBars result={result} /> : result.kind === "scale" ? <ScaleColumns result={result} /> : <MaturityRadar result={result} />}
    </div>
  );
}

/** Full-stage live results for the current slide's questions (toggled with R). */
export function LiveOverlay({ questionIds }: { questionIds: readonly QuestionId[] }) {
  const { results } = useDeck();
  const items = questionIds.flatMap((id) => results?.questions.filter((q) => q.id === id) ?? []);

  return (
    <div className={styles.overlay} role="dialog" aria-label="Canlı nəticələr">
      <div className={styles.overlayHead}>
        <div>
          <h2 className={styles.overlayTitle}>{items.length === 1 ? items[0]!.title : "Canlı nəticələr"}</h2>
          {items.length === 1 && (
            <p className={styles.overlayMeta}>
              {items[0]!.responses} cavab · Orta cavab müddəti: {formatSeconds(items[0]!.avgResponseSec)}
            </p>
          )}
        </div>
        <JoinCard size={130} title="Cavab verin" />
      </div>

      {items.length > 0 ? (
        <div className={styles.overlayBody} data-count={items.length}>
          {items.map((result) => (
            <section key={result.id} className={styles.overlayPanel}>
              {items.length > 1 && (
                <h3 className={styles.overlayPanelTitle}>
                  {result.title} · {result.responses} cavab
                </h3>
              )}
              <ResultChart result={result} />
            </section>
          ))}
        </div>
      ) : results ? (
        <ul className={styles.kpiRow}>
          {buildTiles(results.kpis).map((tile) => (
            <li key={tile.label} className={styles.kpiTile}>
              <p className={styles.kpiLabel}>{tile.label}</p>
              <p className={styles.kpiValue}>
                {tile.value}
                {tile.unit && <span className={styles.kpiUnit}>{tile.unit}</span>}
              </p>
              <p className={styles.kpiNote}>{tile.note}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className={styles.overlayEmpty}>Nəticələr yüklənir…</p>
      )}

      <p className={styles.overlayHint}>R və ya Esc - bağla</p>
    </div>
  );
}
