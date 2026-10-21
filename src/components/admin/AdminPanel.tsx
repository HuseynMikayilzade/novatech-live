"use client";

import { useState, type FormEvent } from "react";
import { ApiError, resetResults } from "@/lib/client-api.ts";
import { formatTime } from "@/lib/format.ts";
import { useLiveResults } from "@/lib/use-live-results.ts";
import styles from "./admin.module.css";

type State =
  | { kind: "idle" }
  | { kind: "confirm" }
  | { kind: "working" }
  | { kind: "done"; at: string }
  | { kind: "error"; message: string };

export function AdminPanel() {
  const { data } = useLiveResults(5000);
  const [key, setKey] = useState("");
  const [state, setState] = useState<State>({ kind: "idle" });

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!key) return;
    // Two-step confirmation: resetting deletes every answer irreversibly.
    if (state.kind !== "confirm") {
      setState({ kind: "confirm" });
      return;
    }
    setState({ kind: "working" });
    try {
      const result = await resetResults(key);
      setState({ kind: "done", at: result.resetAt });
    } catch (error) {
      setState({ kind: "error", message: error instanceof ApiError ? error.message : "Sıfırlama alınmadı." });
    }
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.title}>İdarəetmə</h1>
      <p className={styles.text}>Təqdimatdan əvvəl sınaq cavablarını silmək üçündür. Açar Vercel-də ADMIN_KEY dəyişənində saxlanılır.</p>

      <dl className={styles.status}>
        <div>
          <dt>İştirakçılar</dt>
          <dd>{data?.kpis.participants ?? "-"}</dd>
        </div>
        <div>
          <dt>Cavablar</dt>
          <dd>{data?.kpis.totalAnswers ?? "-"}</dd>
        </div>
        <div>
          <dt>Yaddaş</dt>
          <dd>{data ? (data.persistent ? "Redis (davamlı)" : "Server yaddaşı (davamlı deyil)") : "-"}</dd>
        </div>
      </dl>

      <form className={styles.form} onSubmit={onSubmit}>
        <label htmlFor="admin-key">İdarəetmə açarı</label>
        <input
          id="admin-key"
          type="password"
          autoComplete="current-password"
          value={key}
          onChange={(e) => {
            setKey(e.target.value);
            if (state.kind === "confirm" || state.kind === "error") setState({ kind: "idle" });
          }}
        />
        {state.kind === "confirm" && <p className={styles.confirm}>Bütün cavablar birdəfəlik silinəcək. Təsdiq üçün yenidən basın.</p>}
        {state.kind === "error" && (
          <p className={styles.error} role="alert">
            {state.message}
          </p>
        )}
        {state.kind === "done" && (
          <p className={styles.ok} role="status">
            Nəticələr sıfırlandı ({formatTime(state.at)}).
          </p>
        )}
        <button type="submit" className={styles.danger} data-armed={state.kind === "confirm" || undefined} disabled={!key || state.kind === "working"}>
          {state.kind === "confirm" ? "Bəli, nəticələri sıfırla" : "Nəticələri sıfırla"}
        </button>
      </form>
      <p className={styles.links}>
        <a href="/neticeler">Nəticələr paneli</a>
        <a href="/">Auditoriya səhifəsi</a>
      </p>
    </main>
  );
}
