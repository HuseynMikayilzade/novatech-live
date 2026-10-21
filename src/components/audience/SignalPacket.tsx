import styles from "./audience.module.css";

/**
 * The submit confirmation: an amber data packet travels from the participant
 * along a dashed integration line into the purple hub - the deck's slide 1 motif.
 */
export function SignalPacket({ state }: { state: "sending" | "delivered" }) {
  return (
    <div className={styles.packet} data-state={state} role="status" aria-live="polite">
      <svg viewBox="0 0 320 48" className={styles.packetSvg} aria-hidden="true" focusable="false">
        <line x1="14" y1="24" x2="290" y2="24" className={styles.packetLine} />
        <circle cx="14" cy="24" r="6" className={styles.packetSource} />
        <circle cx="296" cy="24" r="16" className={styles.packetHub} />
        <circle cx="14" cy="24" r="5" className={styles.packetDot} />
      </svg>
      <span className={styles.packetText}>{state === "delivered" ? "Cavabınız panelə çatdı" : "Göndərilir"}</span>
    </div>
  );
}
