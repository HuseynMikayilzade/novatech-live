"use client";

import { useRef, useState, type FormEvent } from "react";
import styles from "./stage.module.css";
import type { DeckController } from "./use-deck-controller.ts";

const LABEL: Record<DeckController["sync"], string> = {
  checking: "Sinxron yoxlanılır",
  on: "Telefonlar sinxron",
  off: "Sinxron söndürülüb",
  error: "Sinxron xətası",
};

/**
 * Badge + dialog for phone sync. The admin key is posted once to the session
 * endpoint and exchanged for an httpOnly cookie; it is never stored in the page.
 */
export function SyncControl({ controller }: { controller: DeckController }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const { sync, syncError } = controller;

  const open = () => {
    if (sync === "on") controller.setSyncEnabled(false);
    else dialogRef.current?.showModal();
  };

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("key") as HTMLInputElement;
    setBusy(true);
    const ok = await controller.login(input.value);
    setBusy(false);
    if (ok) {
      input.value = "";
      dialogRef.current?.close();
    }
  }

  return (
    <>
      <button
        type="button"
        className={styles.syncBadge}
        data-state={sync}
        onClick={open}
        title={sync === "on" ? "Sinxronu dayandır (telefonlar sərbəst rejimə qayıdır)" : "Telefonları slaydlarla sinxronlaşdır"}
      >
        <span className={styles.syncDot} aria-hidden="true" />
        {LABEL[sync]}
      </button>
      {syncError && (
        <span className={styles.syncError} role="alert">
          {syncError}
        </span>
      )}
      <dialog ref={dialogRef} className={styles.dialog} aria-labelledby="sync-title">
        <form onSubmit={submit} className={styles.dialogForm}>
          <h2 id="sync-title" className={styles.dialogTitle}>
            Telefonları sinxronlaşdır
          </h2>
          <p className={styles.dialogText}>
            ADMIN_KEY-i daxil edin. Açar yalnız bir dəfə serverə göndərilir və bu brauzerdə 8 saatlıq təqdimatçı sessiyası açılır. Sonra auditoriyanın telefonları
            sizin slaydınızı izləyəcək.
          </p>
          {/* Lets password managers file the key under a stable name. */}
          <input type="text" name="username" autoComplete="username" defaultValue="novatech-presenter" hidden readOnly />
          <input name="key" type="password" autoComplete="current-password" required minLength={12} className={styles.dialogInput} aria-label="ADMIN_KEY" />
          {syncError && <p className={styles.syncError}>{syncError}</p>}
          <div className={styles.dialogActions}>
            <button type="button" className={styles.ghost} onClick={() => dialogRef.current?.close()}>
              Ləğv et
            </button>
            <button type="submit" className={styles.primary} disabled={busy}>
              {busy ? "Yoxlanılır…" : "Daxil ol və sinxronlaşdır"}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
