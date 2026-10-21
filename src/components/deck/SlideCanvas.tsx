"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import styles from "./deck.module.css";

export const STAGE_WIDTH = 1920;
export const STAGE_HEIGHT = 1080;

/**
 * Fixed 1920×1080 stage scaled to fit its container with letterboxing, so a
 * slide looks identical on a projector, a laptop or a thumbnail.
 */
export function SlideCanvas({ children, className }: { children: ReactNode; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;
    const measure = () => {
      const { width, height } = frame.getBoundingClientRect();
      setScale(Math.min(width / STAGE_WIDTH, height / STAGE_HEIGHT));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={frameRef} className={`${styles.frame} ${className ?? ""}`}>
      <div
        className={styles.stage}
        style={{ width: STAGE_WIDTH, height: STAGE_HEIGHT, transform: `translate(-50%, -50%) scale(${scale})`, visibility: scale ? "visible" : "hidden" }}
      >
        {children}
      </div>
    </div>
  );
}
