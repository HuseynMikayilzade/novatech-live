"use client";

import type { ReactNode } from "react";
import { SLIDE_COUNT } from "@/content/deck.ts";
import { getQuestion, type QuestionId } from "@/domain/questions.ts";
import { QrCode } from "../shared/QrCode.tsx";
import { useDeck } from "./deck-context.ts";
import styles from "./deck.module.css";

const pad = (n: number) => String(n).padStart(2, "0");

interface SlideFrameProps {
  readonly number: number;
  readonly eyebrow: string;
  /** Muted qualifier after the eyebrow, e.g. "SSENARİ FƏRZİYYƏLƏRİ". */
  readonly tag?: string;
  readonly title: string;
  readonly children: ReactNode;
}

/** Shared chrome: eyebrow, title, body and a footer with the slide number. */
export function SlideFrame({ number, eyebrow, tag, title, children }: SlideFrameProps) {
  const { host } = useDeck();
  return (
    <div className={styles.slide}>
      <header className={styles.slideHead}>
        <p className={styles.eyebrow}>
          <span className={styles.eyebrowNumber}>{pad(number)}</span>
          <span>{eyebrow}</span>
          {tag && <span className={styles.eyebrowTag}>{tag}</span>}
        </p>
        <h2 className={styles.slideTitle}>{title}</h2>
      </header>
      <div className={styles.slideBody}>{children}</div>
      <SlideFooter number={number} host={host} />
    </div>
  );
}

export function SlideFooter({ number, host }: { number: number; host: string }) {
  return (
    <footer className={styles.slideFoot}>
      <span>NovaTech Solutions · İş yerində rəqəmsal transformasiyanın tətbiqi</span>
      <span className={styles.footRight}>
        {host && <span className={styles.footHost}>{host}</span>}
        <span className={styles.footNumber}>
          {pad(number)} / {pad(SLIDE_COUNT)}
        </span>
      </span>
    </footer>
  );
}

/** Problem / initiative code chip: P = problem (amber), T = initiative (violet). */
export function Code({ children, tone = "p" }: { children: ReactNode; tone?: "p" | "t" | "neutral" }) {
  return (
    <span className={styles.code} data-tone={tone}>
      {children}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return <p className={styles.sectionLabel}>{children}</p>;
}

/** QR card with the live participant count, for slides where the audience joins or votes. */
export function JoinCard({ title = "Canlı sorğuya qoşulun", size = 200 }: { title?: string; size?: number }) {
  const { results, host } = useDeck();
  return (
    <div className={styles.join}>
      <div className={styles.joinQr} style={{ width: size + 24, height: size + 24 }}>
        <QrCode size={size} />
      </div>
      <div className={styles.joinText}>
        <p className={styles.joinTitle}>{title}</p>
        <p className={styles.joinHost}>{host}</p>
        <p className={styles.joinCount}>
          <strong>{results?.kpis.participants ?? 0}</strong> nəfər qoşulub
        </p>
      </div>
    </div>
  );
}

/** "Ask the audience" callout: the slide's question with its live response count. */
export function AudienceQuestion({ questionId, children, note }: { questionId: QuestionId; children?: ReactNode; note?: string }) {
  const { results } = useDeck();
  const responses = results?.questions.find((q) => q.id === questionId)?.responses ?? 0;
  return (
    <div className={styles.ask}>
      <div className={styles.askHead}>
        <span className={styles.askLabel}>Auditoriyaya sual</span>
        <span className={styles.askLive}>
          <span className={styles.liveDot} aria-hidden="true" />
          {responses} cavab
        </span>
      </div>
      <p className={styles.askText}>{children ?? getQuestion(questionId).title}</p>
      {note && <p className={styles.askNote}>{note}</p>}
    </div>
  );
}
