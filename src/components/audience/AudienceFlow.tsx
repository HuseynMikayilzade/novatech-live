"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Question, QuestionId } from "@/domain/questions.ts";
import { ApiError, submitAnswer } from "@/lib/client-api.ts";
import { useLiveSession } from "@/lib/use-live-session.ts";
import styles from "./audience.module.css";
import { MatrixPicker, ScalePicker, SingleChoice, type DraftValue } from "./inputs.tsx";
import { ProgressRail } from "./ProgressRail.tsx";
import { SignalPacket } from "./SignalPacket.tsx";

const STORAGE_KEY = "novatech-live:progress:v1";
const PACKET_MS = 1100;

interface Progress {
  readonly step: number;
  readonly drafts: Partial<Record<QuestionId, DraftValue>>;
  readonly sent: readonly QuestionId[];
}

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "delivered" } | { kind: "error"; message: string };

const EMPTY: Progress = { step: 0, drafts: {}, sent: [] };

function loadProgress(total: number): Progress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY;
    const parsed = JSON.parse(raw) as Progress;
    const step = Number.isInteger(parsed.step) ? Math.min(Math.max(parsed.step, 0), total) : 0;
    return { step, drafts: parsed.drafts ?? {}, sent: Array.isArray(parsed.sent) ? parsed.sent : [] };
  } catch {
    return EMPTY; // Private mode or corrupted data: start fresh.
  }
}

function saveProgress(progress: Progress): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Storage unavailable: the flow still works, it just won't resume after reload.
  }
}

/** Converts a draft into the wire value, or null while the answer is incomplete. */
function toSubmittable(question: Question, draft: DraftValue | undefined): string | number | number[] | null {
  if (draft === undefined) return null;
  switch (question.kind) {
    case "single":
      return typeof draft === "string" ? draft : null;
    case "scale":
      return typeof draft === "number" ? draft : null;
    case "matrix":
      return Array.isArray(draft) && draft.length === question.dimensions.length && draft.every((v) => typeof v === "number")
        ? (draft as number[])
        : null;
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function AudienceFlow({ questions }: { questions: readonly Question[] }) {
  const total = questions.length;
  const [progress, setProgress] = useState<Progress>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const shownAt = useRef<number>(0);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // While the presenter runs the deck, phones show only the questions of the current slide.
  const live = useLiveSession();
  const openIds = live.active?.questionIds ?? null;
  const [liveAnswered, setLiveAnswered] = useState(false);
  // Read by the slide-change effect without making every answer re-trigger it.
  const sentRef = useRef(progress.sent);
  useEffect(() => {
    sentRef.current = progress.sent;
  }, [progress.sent]);

  useEffect(() => {
    setProgress(loadProgress(total));
    setHydrated(true);
  }, [total]);

  useEffect(() => {
    if (hydrated) saveProgress(progress);
  }, [progress, hydrated]);

  // Response time is measured from the moment a question is on screen.
  useEffect(() => {
    shownAt.current = performance.now();
    setStatus({ kind: "idle" });
    if (hydrated) headingRef.current?.focus({ preventScroll: false });
  }, [progress.step, hydrated]);

  const goTo = useCallback((step: number) => {
    setProgress((p) => ({ ...p, step: Math.min(Math.max(step, 0), total) }));
  }, [total]);

  const setDraft = useCallback((id: QuestionId, value: DraftValue) => {
    setProgress((p) => ({ ...p, drafts: { ...p.drafts, [id]: value } }));
    setStatus((s) => (s.kind === "error" ? { kind: "idle" } : s));
  }, []);

  const indexOf = useCallback((id: QuestionId) => questions.findIndex((q) => q.id === id), [questions]);

  // Each slide change brings the phone to that slide's first unanswered question.
  useEffect(() => {
    const ids = live.active?.questionIds;
    if (!hydrated || !ids?.length) return;
    const target = ids.find((id) => !sentRef.current.includes(id));
    setLiveAnswered(target === undefined);
    goTo(indexOf(target ?? ids[0]!));
  }, [hydrated, live.active, goTo, indexOf]);

  const question = questions[progress.step];
  const isDone = progress.step >= total;

  async function handleSubmit() {
    if (!question || status.kind === "sending" || status.kind === "delivered") return;
    const value = toSubmittable(question, progress.drafts[question.id]);
    if (value === null) return;

    setStatus({ kind: "sending" });
    try {
      await submitAnswer({ questionId: question.id, value, durationMs: performance.now() - shownAt.current });
      setStatus({ kind: "delivered" });
      setProgress((p) => ({ ...p, sent: p.sent.includes(question.id) ? p.sent : [...p.sent, question.id] }));
      const nextLive = openIds?.find((id) => id !== question.id && !progress.sent.includes(id));
      window.setTimeout(() => {
        if (!openIds) goTo(progress.step + 1);
        else if (nextLive) goTo(indexOf(nextLive));
        else setLiveAnswered(true);
      }, prefersReducedMotion() ? 350 : PACKET_MS);
    } catch (error) {
      setStatus({ kind: "error", message: error instanceof ApiError ? error.message : "Cavab göndərilmədi. Yenidən cəhd edin." });
    }
  }

  if (!hydrated || !live.ready) {
    return <div className={styles.skeleton} aria-busy="true" />;
  }

  if (openIds && openIds.length === 0) {
    return (
      <section className={styles.done} aria-labelledby="wait-title">
        <SignalPacket state="waiting" />
        <h1 id="wait-title" className={styles.doneTitle}>
          Təqdimat davam edir
        </h1>
        <p className={styles.doneText}>Təqdimatçı növbəti suala keçəndə sual burada avtomatik açılacaq. Səhifəni açıq saxlayın.</p>
        <p className={styles.doneText}>
          Cavablandırılan suallar: {progress.sent.length} / {total}
        </p>
      </section>
    );
  }

  if (openIds && (liveAnswered || !question || !openIds.includes(question.id))) {
    return (
      <section className={styles.done} aria-labelledby="live-done-title">
        <SignalPacket state="delivered" />
        <h1 id="live-done-title" ref={headingRef} tabIndex={-1} className={styles.doneTitle}>
          Cavabınız ekrana çatdı
        </h1>
        <p className={styles.doneText}>Nəticəni təqdimat ekranında izləyin. Növbəti sual vaxtı gələndə burada açılacaq.</p>
        <div className={styles.doneActions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => {
              setLiveAnswered(false);
              goTo(indexOf(openIds[0]!));
            }}
          >
            Cavabı yenilə
          </button>
        </div>
      </section>
    );
  }

  if (isDone || !question) {
    const answered = progress.sent.length;
    return (
      <section className={styles.done} aria-labelledby="done-title">
        <SignalPacket state="delivered" />
        <h1 id="done-title" ref={headingRef} tabIndex={-1} className={styles.doneTitle}>
          Cavablarınız panelə çatdı
        </h1>
        <p className={styles.doneText}>
          Cavablandırılan suallar: {answered} / {total}. Nəticələr təqdimat zamanı ekranda canlı göstəriləcək.
        </p>
        <div className={styles.doneActions}>
          <button type="button" className={styles.secondary} onClick={() => goTo(0)}>
            Cavablarıma qayıt
          </button>
          <a className={styles.linkButton} href="/neticeler">
            Nəticələrə bax
          </a>
        </div>
      </section>
    );
  }

  const draft = progress.drafts[question.id];
  const ready = toSubmittable(question, draft) !== null;
  const alreadySent = progress.sent.includes(question.id);
  const busy = status.kind === "sending" || status.kind === "delivered";

  return (
    <section className={styles.flow} aria-labelledby={`q-${question.id}`}>
      {!openIds && <ProgressRail questions={questions} current={progress.step} sent={progress.sent} onSelect={goTo} />}

      <div className={styles.questionHead}>
        {openIds ? (
          <p className={styles.liveBadge}>
            Canlı sual
            {openIds.length > 1 && ` · ${openIds.indexOf(question.id) + 1} / ${openIds.length}`}
          </p>
        ) : (
          <p className={styles.slideRef}>Slayd {question.slide} ilə bağlı</p>
        )}
        <h1 id={`q-${question.id}`} ref={headingRef} tabIndex={-1} className={styles.questionTitle}>
          {question.title}
        </h1>
        {question.hint && <p className={styles.hint}>{question.hint}</p>}
      </div>

      <div className={styles.inputArea}>
        {question.kind === "single" && (
          <SingleChoice question={question} value={typeof draft === "string" ? draft : undefined} onChange={(v) => setDraft(question.id, v)} disabled={busy} />
        )}
        {question.kind === "scale" && (
          <ScalePicker question={question} value={typeof draft === "number" ? draft : undefined} onChange={(v) => setDraft(question.id, v)} disabled={busy} />
        )}
        {question.kind === "matrix" && (
          <MatrixPicker question={question} value={Array.isArray(draft) ? draft : undefined} onChange={(v) => setDraft(question.id, v)} disabled={busy} />
        )}
      </div>

      <div className={styles.actionBar}>
        {status.kind === "error" && (
          <p className={styles.error} role="alert">
            {status.message}
          </p>
        )}
        {busy ? (
          <SignalPacket state={status.kind === "delivered" ? "delivered" : "sending"} />
        ) : (
          <button type="button" className={styles.primary} disabled={!ready} onClick={handleSubmit}>
            {alreadySent ? "Cavabı yenilə" : "Cavabı göndər"}
          </button>
        )}
        {!openIds && (
          <div className={styles.secondaryRow}>
            <button type="button" className={styles.textButton} onClick={() => goTo(progress.step - 1)} disabled={progress.step === 0 || busy}>
              Əvvəlki sual
            </button>
            <button type="button" className={styles.textButton} onClick={() => goTo(progress.step + 1)} disabled={busy}>
              Bu sualı keç
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
