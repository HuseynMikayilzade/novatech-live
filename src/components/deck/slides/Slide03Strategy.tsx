import { ArrowRight } from "../icons.tsx";
import { Code, SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const DIRECTIONS = ["Texnologiya", "İş prosesləri", "Məlumat idarəetməsi", "İnsanlar və bacarıqlar"];

const ROWS = [
  { p: "P1", problem: "Köhnə tətbiqlər, texniki borc", t: "T1", initiative: "Tətbiqlərin modernizasiyası", target: "Modul, test olunan, dəstəklənən tətbiqlər" },
  { p: "P2", problem: "Əlaqəsiz biznes sistemləri", t: "T2", initiative: "İnteqrasiya və standart API-lər", target: "Avtomatik, nəzarət olunan məlumat mübadiləsi" },
  { p: "P3", problem: "Təkrarlanan əl əməliyyatları", t: "T3", initiative: "İş axınlarının avtomatlaşdırılması", target: "Qaydalara əsaslanan, izlənilən proseslər" },
  { p: "P4", problem: "Dağınıq sənəd idarəetməsi", t: "T4", initiative: "Elektron sənəd idarəetməsi", target: "Vahid sənəd mənbəyi, versiya və audit izi" },
  { p: "P5", problem: "Gecikən, uyğunsuz hesabatlar", t: "T5", initiative: "KPI panelləri və analitika", target: "Vahid məlumata əsaslanan vaxtında qərarlar" },
  { p: "P6", problem: "İnfrastruktur və təhlükəsizlik", t: "T6", initiative: "Təhlükəsiz bulud infrastrukturu", target: "Miqyaslana bilən, idarə olunan mühit" },
  { p: "P3+5", problem: "Bilik axtarışı, təhlil yükü", t: "T7", initiative: "Məsuliyyətli süni intellekt", target: "İnsan nəzarəti ilə dəstəklənən tapşırıqlar" },
];

export function Slide03Strategy() {
  return (
    <SlideFrame number={3} eyebrow="Strategiya və hədəf vəziyyət" title="Transformasiya yeni proqram almaq deyil, əlaqəli dəyişikliklər toplusudur">
      <div className={s.s3}>
        <div className={s.directions}>
          <SectionLabel>Dəyişiklik istiqamətləri</SectionLabel>
          <div className={s.chips}>
            {DIRECTIONS.map((d) => (
              <span key={d} className={s.chip}>
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className={s.mapTable} role="table" aria-label="Problem, təşəbbüs və hədəf vəziyyət xəritəsi">
          <div className={s.mapTableHead} role="row">
            <span role="columnheader">CARİ VƏZİYYƏT (PROBLEM)</span>
            <span aria-hidden="true" />
            <span role="columnheader">TRANSFORMASİYA TƏŞƏBBÜSÜ</span>
            <span aria-hidden="true" />
            <span role="columnheader">HƏDƏF VƏZİYYƏT</span>
          </div>
          {ROWS.map((r) => (
            <div key={r.t} className={s.mapRow} role="row">
              <span className={s.mapCell} role="cell">
                <Code>{r.p}</Code>
                {r.problem}
              </span>
              <span className={s.arrow} aria-hidden="true">
                <ArrowRight />
              </span>
              <span className={s.mapCell} data-kind="t" role="cell">
                <Code tone="t">{r.t}</Code>
                <strong>{r.initiative}</strong>
              </span>
              <span className={s.arrow} aria-hidden="true">
                <ArrowRight />
              </span>
              <span className={s.mapCell} data-kind="target" role="cell">
                {r.target}
              </span>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
