import { ApprovalTrend, IncidentBars } from "../charts.tsx";
import { AudienceQuestion, SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

// Sample scenario values from the original deck.
const TILES = [
  { value: "18 saat", label: "Orta həll müddəti" },
  { value: "86%", label: "Vaxtında icra" },
  { value: "99,6%", label: "Sistem əlçatanlığı" },
  { value: "34%", label: "Avtomatlaşdırma əhatəsi" },
  { value: "4,1 / 5", label: "İstifadəçi məmnuniyyəti" },
];

const USES = [
  { title: "Darboğazları aşkarlamaq", text: "Təsdiq hansı mərhələdə gecikir?" },
  { title: "Prioritet müəyyənləşdirmək", text: "Təkrarlanan insidentlər hansı sistemdədir?" },
  { title: "İrəliləyişi izləmək", text: "Dəyişikliklər göstəriciləri yaxşılaşdırırmı?" },
];

export function Slide07Kpi() {
  return (
    <SlideFrame number={7} eyebrow="T5 · İdarəetmə panelləri, hesabatlar və KPI" title="KPI paneli: bir neçə sistemdən vahid idarəetmə görünüşü">
      <div className={s.s7}>
        <section className={s.dashboard} aria-label="Nümunəvi əməliyyat paneli">
          <div className={s.dashHead}>
            <p className={s.cardTitle}>NovaTech · Əməliyyat paneli (nümunə)</p>
            <span className={s.sampleBadge}>NÜMUNƏVİ SSENARİ MƏLUMATLARI - FAKTİKİ NƏTİCƏ DEYİL</span>
          </div>
          <div className={s.dashTiles}>
            {TILES.map((t) => (
              <div key={t.label} className={s.dashTile}>
                <strong>{t.value}</strong>
                <span className={`${s.xs} ${s.muted}`}>{t.label}</span>
              </div>
            ))}
          </div>
          <div className={s.dashCharts}>
            <ApprovalTrend />
            <IncidentBars />
          </div>
        </section>

        <div className={s.stack} style={{ gap: 22 }}>
          <SectionLabel>Panel necə istifadə olunur?</SectionLabel>
          <ol className={s.stack} style={{ margin: 0, padding: 0, listStyle: "none", gap: 18 }}>
            {USES.map((u, i) => (
              <li key={u.title} className={s.numbered}>
                <span className={s.num}>{i + 1}</span>
                <strong style={{ fontWeight: 600 }}>{u.title}</strong>
                <span className={`${s.small} ${s.muted}`} style={{ gridColumn: 2 }}>
                  {u.text}
                </span>
              </li>
            ))}
          </ol>
          <div style={{ marginTop: "auto" }}>
            <AudienceQuestion questionId="kpi" note="Rəhbər və texniki komandanın cavabı fərqli ola bilər.">
              Bu göstəricilərdən hansını ilk növbədə araşdırardınız və niyə?
            </AudienceQuestion>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
