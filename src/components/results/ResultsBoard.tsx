"use client";

import { useEffect, useState } from "react";
import type { LiveKpis, QuestionResult } from "@/domain/aggregate.ts";
import { formatDecimal, formatPercent, formatSeconds, formatTime } from "@/lib/format.ts";
import { useLiveResults } from "@/lib/use-live-results.ts";
import { BrandMark } from "../shared/BrandMark.tsx";
import { QrCode } from "../shared/QrCode.tsx";
import { MaturityRadar, OptionBars, ScaleColumns } from "./charts.tsx";
import styles from "./results.module.css";

interface KpiTile {
  readonly label: string;
  readonly value: string;
  readonly unit?: string;
  readonly note: string;
}

/** Each live KPI is paired with the deck metric it mirrors, so the demo connects back to slide 7. */
function buildTiles(k: LiveKpis): KpiTile[] {
  return [
    { label: "İştirakçılar", value: String(k.participants), note: `Cəmi ${k.totalAnswers} cavab` },
    {
      label: "Tamamlama dərəcəsi",
      value: formatPercent(k.completionRate),
      note: `${k.completed} nəfər bütün suallara cavab verib`,
    },
    { label: "Orta cavab müddəti", value: formatSeconds(k.avgResponseSec), note: "Slayd 7-dəki həll müddətinin analoqu" },
    { label: "Rəqəmsal yetkinlik", value: formatDecimal(k.maturityIndex), unit: "/ 5", note: "Auditoriyanın baza göstəricisi" },
    {
      label: "Məmnuniyyət (CSAT)",
      value: formatPercent(k.csat),
      note: k.avgSatisfaction === null ? "4 və 5 bal verənlərin payı" : `Orta bal ${formatDecimal(k.avgSatisfaction)} / 5`,
    },
  ];
}

function QuestionPanel({ result }: { result: QuestionResult }) {
  return (
    <section className={styles.panel} aria-labelledby={`panel-${result.id}`} role="tabpanel" id={`tabpanel-${result.id}`}>
      <header className={styles.panelHead}>
        <h2 id={`panel-${result.id}`} className={styles.panelTitle}>
          {result.title}
        </h2>
        <p className={styles.panelMeta}>
          <span>Slayd {result.slide}</span>
          <span>{result.responses} cavab</span>
          <span>Orta cavab müddəti: {formatSeconds(result.avgResponseSec)}</span>
        </p>
      </header>
      {result.responses === 0 ? (
        <p className={styles.empty}>Bu suala hələ cavab yoxdur. Auditoriya QR kodu skan edib cavab verdikcə nəticə burada görünəcək.</p>
      ) : result.kind === "single" ? (
        <OptionBars result={result} />
      ) : result.kind === "scale" ? (
        <ScaleColumns result={result} />
      ) : (
        <MaturityRadar result={result} />
      )}
    </section>
  );
}

export function ResultsBoard() {
  const { data, error, stale } = useLiveResults(3000);
  const [active, setActive] = useState(0);
  const [host, setHost] = useState("");
  const questionCount = data?.questions.length ?? 0;

  useEffect(() => setHost(window.location.host), []);

  // Presenter shortcuts: 1-6 jump to a question, arrows step through.
  useEffect(() => {
    if (!questionCount) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return;
      const digit = Number(e.key);
      if (Number.isInteger(digit) && digit >= 1 && digit <= questionCount) setActive(digit - 1);
      else if (e.key === "ArrowRight") setActive((i) => (i + 1) % questionCount);
      else if (e.key === "ArrowLeft") setActive((i) => (i - 1 + questionCount) % questionCount);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [questionCount]);

  const current = data?.questions[active];

  return (
    <div className={styles.board}>
      <main className={styles.main}>
        <header className={styles.top}>
          <div className={styles.brand}>
            <BrandMark size={40} />
            <div>
              <h1 className={styles.title}>Canlı nəticələr</h1>
              <p className={styles.subtitle}>Auditoriyanın cavabları ölçülür və real vaxtda göstərilir</p>
            </div>
          </div>
          <p className={styles.live} data-stale={stale || undefined} aria-live="polite">
            <span className={styles.liveDot} aria-hidden="true" />
            {data ? `Yeniləndi ${formatTime(data.generatedAt)}` : "Qoşulur"}
          </p>
        </header>

        {data && !data.persistent && (
          <p className={styles.warning} role="note">
            Məlumat bazası qoşulmayıb: nəticələr yalnız serverin yaddaşında saxlanılır və itə bilər. Vercel-də Upstash Redis inteqrasiyasını əlavə edin.
          </p>
        )}
        {error && (
          <p className={styles.warning} role="alert">
            {stale ? `Son yeniləmə alınmadı: ${error} Köhnə nəticələr göstərilir.` : error}
          </p>
        )}

        {data ? (
          <>
            <ul className={styles.kpis}>
              {buildTiles(data.kpis).map((tile) => (
                <li key={tile.label} className={styles.kpi}>
                  <p className={styles.kpiLabel}>{tile.label}</p>
                  <p className={styles.kpiValue}>
                    {tile.value}
                    {tile.unit && <span className={styles.kpiUnit}>{tile.unit}</span>}
                  </p>
                  <p className={styles.kpiNote}>{tile.note}</p>
                </li>
              ))}
            </ul>

            <div className={styles.tabs} role="tablist" aria-label="Suallar">
              {data.questions.map((q, i) => (
                <button
                  key={q.id}
                  type="button"
                  role="tab"
                  id={`tab-${q.id}`}
                  aria-selected={i === active}
                  aria-controls={`tabpanel-${q.id}`}
                  className={styles.tab}
                  onClick={() => setActive(i)}
                >
                  <span className={styles.tabKey}>{i + 1}</span>
                  {q.shortTitle}
                  <span className={styles.tabCount}>{q.responses}</span>
                </button>
              ))}
            </div>

            {current && <QuestionPanel result={current} />}
          </>
        ) : (
          !error && <div className={styles.loading} aria-busy="true" />
        )}
      </main>

      <aside className={styles.join} aria-label="Sorğuya qoşulun">
        <div className={styles.qrCard}>
          <QrCode size={232} />
        </div>
        <p className={styles.joinTitle}>Telefonunuzla skan edin</p>
        <p className={styles.joinHost}>{host}</p>
        <div className={styles.joinCount}>
          <span className={styles.joinNumber}>{data?.kpis.participants ?? 0}</span>
          <span className={styles.muted}>nəfər qoşulub</span>
        </div>
        <p className={styles.shortcuts}>Klaviatura: 1-6 sual seçir, oxlar növbəti suala keçir.</p>
      </aside>
    </div>
  );
}
