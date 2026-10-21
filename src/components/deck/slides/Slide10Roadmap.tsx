import { Fragment } from "react";
import { SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const PHASES = ["Qiymətləndirmə və araşdırma", "Prioritet və arxitektura", "Pilot tətbiq", "Mərhələli genişləndirmə", "Ölçmə və təkmilləşdirmə"];

const ROWS: readonly { label: string; cells: readonly string[] }[] = [
  {
    label: "Fəaliyyətlər",
    cells: [
      "Proses və sistem inventarı, müsahibələr, baza göstəricilərinin ölçülməsi",
      "Təşəbbüslərin dəyər və riskə görə sıralanması, hədəf arxitektura",
      "Bir prosesdə pilot (məs. daxili sorğu axını), istifadəçi testi",
      "Digər proseslərə yayılma, sistem inteqrasiyası, təlim",
      "KPI monitorinqi, rəy toplanması, növbəti təkmilləşdirmələr",
    ],
  },
  {
    label: "Nəticələr",
    cells: [
      "Cari vəziyyət xəritəsi, problem reyestri, KPI bazası",
      "Yol xəritəsi, arxitektura sənədi, təhlükəsizlik tələbləri",
      "İşlək pilot, ölçülmüş nəticələr, öyrənilən dərslər",
      "İnteqrasiya olunmuş sistemlər, dəstək modeli",
      "Dövri KPI hesabatı, təkmilləşdirmə siyahısı",
    ],
  },
  {
    label: "Rollar",
    cells: [
      "Sponsor, layihə meneceri, biznes analitik",
      "Həll arxitektoru, təhlükəsizlik mütəxəssisi",
      "Developerlər, biznes analitik, son istifadəçilər",
      "Layihə meneceri, developerlər, infrastruktur",
      "Sponsor, proses sahibləri, layihə meneceri",
    ],
  },
  {
    label: "Risk / asılılıq",
    cells: [
      "Natamam məlumat, əməkdaşların vaxtı",
      "Çox geniş əhatə, büdcə qeyri-müəyyənliyi",
      "İstifadəçi müqaviməti, inteqrasiya xətaları",
      "Miqrasiya defektləri, köhnə sistem asılılığı",
      "Diqqətin azalması, formal KPI izlənməsi",
    ],
  },
  {
    label: "Keçid meyarı",
    cells: [
      "Prioritet problemlər və baza KPI təsdiqlənib",
      "Pilot əhatəsi və uğur meyarları razılaşdırılıb",
      "Pilot meyarları qarşılanıb",
      "Sabit iş, insidentlər qəbul edilən həddə",
      "Dövr: ölç → təhlil et → təkmilləşdir",
    ],
  },
];

export function Slide10Roadmap() {
  return (
    <SlideFrame number={10} eyebrow="Tətbiq yol xəritəsi" title="Mərhələli yol xəritəsi: araşdırmadan davamlı təkmilləşdirməyə">
      <div className={s.s10}>
        <div className={s.roadmap} role="table" aria-label="Beş mərhələli yol xəritəsi">
          <span aria-hidden="true" />
          {PHASES.map((phase, i) => (
            <div key={phase} className={s.phase} role="columnheader">
              <span>{i + 1}</span>
              <strong>{phase}</strong>
            </div>
          ))}
          {ROWS.map((row) => (
            <Fragment key={row.label}>
              <span className={s.rowLabel} role="rowheader">
                {row.label}
              </span>
              {row.cells.map((cell, i) => (
                <span key={i} className={s.cell} role="cell" data-loop={(row.label === "Keçid meyarı" && i === 4) || undefined}>
                  {cell}
                </span>
              ))}
            </Fragment>
          ))}
        </div>
        <p className={s.statement}>
          <strong>Niyə pilot?</strong> Geniş tətbiqdən əvvəl dörd şey yoxlanılır: biznes dəyəri · texniki icra imkanı · təhlükəsizlik · istifadəçi qəbulu. Tarix
          və büdcə baza qiymətləndirməsindən sonra müəyyən edilir.
        </p>
      </div>
    </SlideFrame>
  );
}
