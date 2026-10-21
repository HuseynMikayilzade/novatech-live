import { useDeck } from "../deck-context.ts";
import { Code, JoinCard, SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const SUMMARY = [
  "Cari vəziyyəti anla",
  "Real problemləri prioritetləşdir",
  "Sistemləri modernləşdir və inteqrasiya et",
  "Prosesləri sadələşdir və avtomatlaşdır",
  "Məlumat və SI-dən məsuliyyətlə istifadə et",
  "İnfrastrukturu qoru",
  "Nəticəni ölç və təkmilləşdir",
];

const DISCUSSION = [
  "Hansı təşəbbüs birinci tətbiq olunmalıdır və niyə?",
  "Transformasiyanın işlədiyini ən yaxşı hansı KPI göstərir?",
  "Tətbiq zamanı ən böyük risk nədir?",
];

// Each option links to the slide that discusses it, as in the original deck.
const OPTIONS = [
  { code: "A", label: "Sistem inteqrasiyası və API-lər", slide: 5 },
  { code: "B", label: "İş axınının avtomatlaşdırılması", slide: 6 },
  { code: "C", label: "KPI panelləri və analitika", slide: 7 },
];

export function Slide12Conclusion() {
  const { goTo, interactive, results } = useDeck();
  const firstStep = results?.questions.find((q) => q.id === "first-step");
  const count = (code: string) => (firstStep?.kind === "single" ? (firstStep.options.find((o) => o.id === code)?.count ?? 0) : 0);

  return (
    <SlideFrame number={12} eyebrow="Nəticə və müzakirə" title="Nəticə: anla, prioritetləşdir, mərhələli tətbiq et, ölç">
      <div className={s.s12}>
        <ol className={s.summary}>
          {SUMMARY.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>

        <div className={s.stack} style={{ gap: 24 }}>
          <blockquote className={s.quote} style={{ margin: 0 }}>
            «Rəqəmsal transformasiyanın əsas məqsədi daha çox texnologiya tətbiq etmək deyil, texnologiya vasitəsilə iş proseslərini daha səmərəli, təhlükəsiz və
            ölçülə bilən etməkdir.»
          </blockquote>
          <SectionLabel>Müzakirə sualları</SectionLabel>
          <ol className={s.stack} style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {DISCUSSION.map((q, i) => (
              <li key={q} className={s.numbered}>
                <span className={s.num}>{i + 1}</span>
                <span style={{ alignSelf: "center" }}>{q}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={s.poll}>
          <SectionLabel>Canlı sorğu: ilk addım hansı olmalıdır?</SectionLabel>
          {OPTIONS.map((o) => (
            <button
              key={o.code}
              type="button"
              className={s.pollOption}
              disabled={!interactive}
              tabIndex={interactive ? 0 : -1}
              onClick={() => goTo(o.slide)}
              title={`Slayd ${o.slide}-ə keç`}
            >
              <Code>{o.code}</Code>
              <span>{o.label}</span>
              <span className={s.muted}>
                {count(o.code)} səs
                <br />→ slayd {o.slide}
              </span>
            </button>
          ))}
          <div style={{ marginTop: 8 }}>
            <JoinCard title="Telefondan səs verin" size={140} />
          </div>
          <p className={`${s.xs} ${s.muted}`}>Və ya əl qaldırın. Telefonda məmnuniyyət sualı da açılır.</p>
        </div>
      </div>
    </SlideFrame>
  );
}
