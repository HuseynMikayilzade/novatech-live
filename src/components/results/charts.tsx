import type { QuestionResult } from "@/domain/aggregate.ts";
import { formatDecimal, formatPercent } from "@/lib/format.ts";
import styles from "./results.module.css";

type SingleResult = Extract<QuestionResult, { kind: "single" }>;
type ScaleResult = Extract<QuestionResult, { kind: "scale" }>;
type MatrixResult = Extract<QuestionResult, { kind: "matrix" }>;

export function OptionBars({ result }: { result: SingleResult }) {
  // Sorted by votes so the room reads the ranking top-down; catalog order breaks ties.
  const rows = [...result.options].sort((a, b) => b.count - a.count);
  return (
    <ol className={styles.bars}>
      {rows.map((option) => {
        const leader = option.id === result.leaderId;
        return (
          <li key={option.id} className={styles.barRow} data-leader={leader || undefined}>
            <span className={styles.barLabel}>
              {option.code && <span className={styles.code}>{option.code}</span>}
              {option.label}
            </span>
            <span className={styles.barTrack} aria-hidden="true">
              <span className={styles.barFill} style={{ width: `${option.share * 100}%` }} />
            </span>
            <span className={styles.barValue}>
              <strong>{formatPercent(result.responses ? option.share : null)}</strong>
              <span>{option.count}</span>
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function ScaleColumns({ result }: { result: ScaleResult }) {
  const max = Math.max(1, ...result.distribution.map((d) => d.count));
  return (
    <div className={styles.scaleWrap}>
      <div className={styles.columns} role="list">
        {result.distribution.map((d) => (
          <div key={d.value} className={styles.column} role="listitem" aria-label={`${d.value} bal: ${d.count} cavab`}>
            <span className={styles.columnCount}>{d.count}</span>
            <span className={styles.columnTrack}>
              <span className={styles.columnFill} data-high={d.value >= 4 || undefined} style={{ height: `${(d.count / max) * 100}%` }} />
            </span>
            <span className={styles.columnValue}>{d.value}</span>
          </div>
        ))}
      </div>
      <div className={styles.scaleSummary}>
        <p className={styles.bigNumber}>{formatDecimal(result.average)}</p>
        <p className={styles.muted}>orta bal, 5 üzərindən</p>
        <p className={styles.legend}>
          1 = {result.minLabel}
          <br />5 = {result.maxLabel}
        </p>
      </div>
    </div>
  );
}

/** Splits a long axis label into two balanced lines for the SVG. */
function splitLabel(label: string): string[] {
  const words = label.split(" ");
  if (words.length < 2) return [label];
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const diff = Math.abs(words.slice(0, i).join(" ").length - words.slice(i).join(" ").length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

export function MaturityRadar({ result }: { result: MatrixResult }) {
  const size = 560;
  const c = size / 2;
  const radius = 150;
  const n = result.dimensions.length;
  const angle = (i: number) => (-90 + (360 / n) * i) * (Math.PI / 180);
  const point = (i: number, value: number) => {
    const r = (radius * value) / result.max;
    return [c + r * Math.cos(angle(i)), c + r * Math.sin(angle(i))] as const;
  };
  const ring = (value: number) => result.dimensions.map((_, i) => point(i, value).join(",")).join(" ");
  const shape = result.dimensions.map((d, i) => point(i, d.average ?? 0).join(",")).join(" ");
  const hasData = result.responses > 0;

  return (
    <div className={styles.radarWrap}>
      <svg viewBox={`0 0 ${size} ${size}`} className={styles.radar} role="img" aria-label="Rəqəmsal yetkinlik radar diaqramı">
        {[1, 2, 3, 4, 5].map((v) => (
          <polygon key={v} points={ring(v)} className={styles.radarRing} />
        ))}
        {result.dimensions.map((d, i) => {
          const [x, y] = point(i, result.max);
          return <line key={d.id} x1={c} y1={c} x2={x} y2={y} className={styles.radarAxis} />;
        })}
        {hasData && <polygon points={shape} className={styles.radarShape} />}
        {hasData &&
          result.dimensions.map((d, i) => {
            const [x, y] = point(i, d.average ?? 0);
            return <circle key={d.id} cx={x} cy={y} r={5} className={styles.radarPoint} />;
          })}
        {result.dimensions.map((d, i) => {
          const [x, y] = point(i, result.max + 0.75);
          const anchor = Math.abs(x - c) < 10 ? "middle" : x > c ? "start" : "end";
          const lines = splitLabel(d.label);
          return (
            <text key={d.id} x={x} y={y - (lines.length - 1) * 8} textAnchor={anchor} className={styles.radarLabel}>
              {lines.map((line, li) => (
                <tspan key={li} x={x} dy={li === 0 ? 0 : 17}>
                  {line}
                </tspan>
              ))}
            </text>
          );
        })}
      </svg>
      <dl className={styles.dimensionList}>
        {result.dimensions.map((d) => (
          <div key={d.id} className={styles.dimensionRow}>
            <dt>{d.label}</dt>
            <dd>{formatDecimal(d.average)}</dd>
          </div>
        ))}
        <div className={styles.dimensionTotal}>
          <dt>Yetkinlik indeksi</dt>
          <dd>{formatDecimal(result.average)}</dd>
        </div>
      </dl>
    </div>
  );
}
