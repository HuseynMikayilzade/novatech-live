"use client";

import type { Question, QuestionId } from "@/domain/questions.ts";
import styles from "./audience.module.css";

interface ProgressRailProps {
  readonly questions: readonly Question[];
  readonly current: number;
  readonly sent: readonly QuestionId[];
  readonly onSelect: (step: number) => void;
}

/** The six questions as nodes on a data line; answered nodes turn amber. */
export function ProgressRail({ questions, current, sent, onSelect }: ProgressRailProps) {
  return (
    <nav className={styles.rail} aria-label="Sualların gedişatı">
      <ol className={styles.railList}>
        {questions.map((q, i) => {
          const state = i === current ? "current" : sent.includes(q.id) ? "sent" : "pending";
          return (
            <li key={q.id} className={styles.railItem}>
              <button
                type="button"
                className={styles.railNode}
                data-state={state}
                aria-current={i === current ? "step" : undefined}
                aria-label={`Sual ${i + 1}: ${q.shortTitle}${state === "sent" ? ", cavablandırılıb" : ""}`}
                onClick={() => onSelect(i)}
              />
            </li>
          );
        })}
      </ol>
      <p className={styles.railCount}>
        {Math.min(current + 1, questions.length)} / {questions.length}
      </p>
    </nav>
  );
}
