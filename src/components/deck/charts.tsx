import styles from "./deck.module.css";

// Sample scenario data from slide 7 of the original deck - not real results.
const APPROVAL_DAYS = [
  { month: "Ay 1", value: 6.5 },
  { month: "Ay 2", value: 6.2 },
  { month: "Ay 3", value: 5.8 },
  { month: "Ay 4", value: 5.1 },
  { month: "Ay 5", value: 4.6 },
  { month: "Ay 6", value: 4.2 },
] as const;

const INCIDENTS = [
  { category: "Şəbəkə", total: 14, repeated: 5 },
  { category: "Tətbiq", total: 22, repeated: 9 },
  { category: "Giriş", total: 9, repeated: 2 },
  { category: "Məlumat", total: 6, repeated: 1 },
] as const;

const comma = (n: number) => String(n).replace(".", ",");

const W = 600;
const H = 380;
const M = { top: 20, right: 64, bottom: 40, left: 44 };
const plotW = W - M.left - M.right;
const plotH = H - M.top - M.bottom;

/** Single-series line: document approval time falling over six months. */
export function ApprovalTrend() {
  const max = 8;
  const x = (i: number) => M.left + (plotW * i) / (APPROVAL_DAYS.length - 1);
  const y = (v: number) => M.top + plotH - (plotH * v) / max;
  const path = APPROVAL_DAYS.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.value)}`).join(" ");
  const last = APPROVAL_DAYS[APPROVAL_DAYS.length - 1]!;

  return (
    <figure className={styles.chart}>
      <figcaption className={styles.chartTitle}>Sənəd təsdiq müddəti, gün</figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} role="img" aria-label="Sənəd təsdiq müddəti 6 ayda 6,5 gündən 4,2 günə enir">
        {[0, 2, 4, 6, 8].map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className={styles.chartGrid} />
            <text x={M.left - 12} y={y(t) + 6} textAnchor="end" className={styles.chartTick}>
              {t}
            </text>
          </g>
        ))}
        {APPROVAL_DAYS.map((d, i) => (
          <text key={d.month} x={x(i)} y={H - 10} textAnchor="middle" className={styles.chartTick}>
            {d.month}
          </text>
        ))}
        <path d={path} className={styles.chartLine} />
        {APPROVAL_DAYS.map((d, i) => (
          <g key={d.month}>
            <circle cx={x(i)} cy={y(d.value)} r={5} className={styles.chartDot} />
            {/* Larger invisible hit target carries the hover tooltip. */}
            <circle cx={x(i)} cy={y(d.value)} r={16} fill="transparent">
              <title>{`${d.month}: ${comma(d.value)} gün`}</title>
            </circle>
          </g>
        ))}
        <text x={x(APPROVAL_DAYS.length - 1) + 14} y={y(last.value) + 7} className={styles.chartValue}>
          {comma(last.value)}
        </text>
        <text x={x(0) + 14} y={y(APPROVAL_DAYS[0].value) - 12} className={styles.chartValue}>
          {comma(APPROVAL_DAYS[0].value)}
        </text>
      </svg>
      <table className="visually-hidden">
        <caption>Sənəd təsdiq müddəti, gün</caption>
        <tbody>
          {APPROVAL_DAYS.map((d) => (
            <tr key={d.month}>
              <th scope="row">{d.month}</th>
              <td>{comma(d.value)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

/** Two-series grouped columns: total vs repeated incidents per category. */
export function IncidentBars() {
  const max = 25;
  const bar = 24;
  const gap = 2;
  const band = plotW / INCIDENTS.length;
  const y = (v: number) => M.top + plotH - (plotH * v) / max;
  const baseline = y(0);
  // 4px rounded data end, square at the baseline.
  const column = (x0: number, v: number) => {
    const top = y(v);
    const r = Math.min(4, baseline - top);
    return `M${x0},${baseline} V${top + r} Q${x0},${top} ${x0 + r},${top} H${x0 + bar - r} Q${x0 + bar},${top} ${x0 + bar},${top + r} V${baseline} Z`;
  };

  return (
    <figure className={styles.chart}>
      <figcaption className={styles.chartTitle}>
        İnsidentlər: ümumi və təkrarlanan
        <span className={styles.legend}>
          <span className={styles.legendItem}>
            <span className={styles.swatch} data-series="1" aria-hidden="true" />
            Ümumi
          </span>
          <span className={styles.legendItem}>
            <span className={styles.swatch} data-series="2" aria-hidden="true" />
            Təkrarlanan
          </span>
        </span>
      </figcaption>
      <svg viewBox={`0 0 ${W} ${H}`} className={styles.chartSvg} role="img" aria-label="İnsidentlər kateqoriya üzrə: ən çox Tətbiq kateqoriyasında, 22 ümumi və 9 təkrarlanan">
        {[0, 5, 10, 15, 20, 25].map((t) => (
          <g key={t}>
            <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className={styles.chartGrid} />
            <text x={M.left - 12} y={y(t) + 6} textAnchor="end" className={styles.chartTick}>
              {t}
            </text>
          </g>
        ))}
        {INCIDENTS.map((d, i) => {
          const center = M.left + band * i + band / 2;
          const x1 = center - bar - gap / 2;
          const x2 = center + gap / 2;
          const highlight = d.category === "Tətbiq";
          return (
            <g key={d.category}>
              <path d={column(x1, d.total)} className={styles.chartBar} data-series="1">
                <title>{`${d.category}: ${d.total} ümumi`}</title>
              </path>
              <path d={column(x2, d.repeated)} className={styles.chartBar} data-series="2">
                <title>{`${d.category}: ${d.repeated} təkrarlanan`}</title>
              </path>
              {highlight && (
                <>
                  <text x={x1 + bar / 2} y={y(d.total) - 10} textAnchor="middle" className={styles.chartValue}>
                    {d.total}
                  </text>
                  <text x={x2 + bar / 2} y={y(d.repeated) - 10} textAnchor="middle" className={styles.chartValue}>
                    {d.repeated}
                  </text>
                </>
              )}
              <text x={center} y={H - 10} textAnchor="middle" className={styles.chartTick}>
                {d.category}
              </text>
            </g>
          );
        })}
      </svg>
      <table className="visually-hidden">
        <caption>İnsidentlər: ümumi və təkrarlanan</caption>
        <thead>
          <tr>
            <th scope="col">Kateqoriya</th>
            <th scope="col">Ümumi</th>
            <th scope="col">Təkrarlanan</th>
          </tr>
        </thead>
        <tbody>
          {INCIDENTS.map((d) => (
            <tr key={d.category}>
              <th scope="row">{d.category}</th>
              <td>{d.total}</td>
              <td>{d.repeated}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
