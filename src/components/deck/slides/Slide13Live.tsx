import { buildTiles } from "../../results/ResultsBoard.tsx";
import { OptionBars, ScaleColumns } from "../../results/charts.tsx";
import { useDeck } from "../deck-context.ts";
import deck from "../deck.module.css";
import { JoinCard, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

export function Slide13Live() {
  const { results } = useDeck();
  const firstStep = results?.questions.find((q) => q.id === "first-step");
  const satisfaction = results?.questions.find((q) => q.id === "satisfaction");

  return (
    <SlideFrame number={13} eyebrow="Canlı nəticələr" title="Auditoriyanın cavabları: ölçmə prosesi canlı">
      <div className={s.s13}>
        {results ? (
          <ul className={deck.kpiRow}>
            {buildTiles(results.kpis).map((tile) => (
              <li key={tile.label} className={deck.kpiTile}>
                <p className={deck.kpiLabel}>{tile.label}</p>
                <p className={deck.kpiValue}>
                  {tile.value}
                  {tile.unit && <span className={deck.kpiUnit}>{tile.unit}</span>}
                </p>
                <p className={deck.kpiNote}>{tile.note}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className={s.muted}>Nəticələr yüklənir…</p>
        )}

        <div className={s.s13Charts}>
          <section className={s.resultPanel} aria-label="İlk addım nəticəsi">
            <p className={s.cardTitle}>İlk addım hansı olmalıdır? · {firstStep?.responses ?? 0} cavab</p>
            {firstStep?.kind === "single" && firstStep.responses > 0 ? <OptionBars result={firstStep} /> : <p className={s.muted}>Hələ cavab yoxdur.</p>}
          </section>
          <section className={s.resultPanel} aria-label="Məmnuniyyət nəticəsi">
            <p className={s.cardTitle}>Təqdimat mövzunu nə dərəcədə aydınlaşdırdı? · {satisfaction?.responses ?? 0} cavab</p>
            {satisfaction?.kind === "scale" && satisfaction.responses > 0 ? (
              <ScaleColumns result={satisfaction} />
            ) : (
              <p className={s.muted}>Hələ cavab yoxdur.</p>
            )}
          </section>
        </div>

        <div className={s.thanks}>
          <h3>Təşəkkürlər! Suallarınız?</h3>
          <JoinCard title="Hələ cavab verə bilərsiniz" size={110} />
        </div>
      </div>
    </SlideFrame>
  );
}
