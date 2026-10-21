import { Fragment } from "react";
import { AudienceQuestion, Code, SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const ROWS = [
  { code: "T1", name: "Modernizasiya", metric: "Dəyişikliyin hazırlanma müddəti; texniki xidmət əməyi", direction: "↓ müddət, ↓ əmək", risk: "Miqrasiya defektləri" },
  { code: "T2", name: "İnteqrasiya", metric: "Məlumat uyğunluğu; inteqrasiya xətası dərəcəsi", direction: "↑ uyğunluq, ↓ xəta", risk: "İnteqrasiya nasazlıqları" },
  { code: "T3", name: "Avtomatlaşdırma", metric: "Əl ilə emal vaxtı; xəta dərəcəsi", direction: "↓ vaxt, ↓ xəta", risk: "İstifadəçi müqaviməti" },
  { code: "T4", name: "Sənəd idarəetməsi", metric: "Təsdiq müddəti; izlənə bilmə", direction: "↓ müddət, ↑ izlənmə", risk: "Səhv icazə konfiqurasiyası" },
  { code: "T5", name: "Analitika", metric: "Hesabat gecikməsi; məlumat keyfiyyəti", direction: "↓ gecikmə, ↑ keyfiyyət", risk: "Zəif məlumat keyfiyyəti" },
  { code: "T6", name: "Bulud", metric: "Əlçatanlıq; bərpaya hazırlıq; xərc şəffaflığı", direction: "↑ əlçatanlıq, ↑ şəffaflıq", risk: "Büdcə artımı, vendor asılılığı" },
  { code: "T7", name: "Süni intellekt", metric: "Tapşırıq keyfiyyəti; qənaət olunan vaxt; insan yoxlaması payı", direction: "↑ keyfiyyət, ↓ vaxt", risk: "Halüsinasiya, məxfilik" },
];

const MITIGATIONS = [
  { risk: "Miqrasiya defektləri", action: "reqressiya testləri, rollback planı" },
  { risk: "İnteqrasiya nasazlıqları", action: "kontrakt testləri, təkrar cəhd, monitorinq" },
  { risk: "Təhlükəsizlik insidentləri", action: "MFA, minimum hüquq, insident planı" },
  { risk: "Zəif məlumat keyfiyyəti", action: "məlumat sahibləri, validasiya qaydaları" },
  { risk: "İstifadəçi müqaviməti", action: "erkən cəlb etmə, təlim, pilot rəyi" },
  { risk: "Bacarıq çatışmazlığı", action: "təlim planı, mentorluq, ekspert dəstəyi" },
  { risk: "Büdcə artımı", action: "mərhələli büdcə, xərc monitorinqi" },
  { risk: "Vendor asılılığı", action: "açıq standartlar, çıxış strategiyası" },
];

export function Slide11Benefits() {
  return (
    <SlideFrame number={11} eyebrow="Gözlənilən faydalar, KPI hədəfləri və risklər" title="Hər təşəbbüs ölçülə bilən göstəriciyə və riskə bağlanır">
      <div className={s.s11}>
        <div className={s.kpiTable} role="table" aria-label="Təşəbbüslər, göstəricilər, istiqamət və risklər">
          <span data-head role="columnheader">
            Transformasiya təşəbbüsü
          </span>
          <span data-head role="columnheader">
            Ölçüləcək göstərici
          </span>
          <span data-head role="columnheader">
            Gözlənilən istiqamət
          </span>
          <span data-head role="columnheader">
            Əsas risk
          </span>
          {ROWS.map((r) => (
            <Fragment key={r.code}>
              <span role="rowheader" className={s.row} style={{ gap: 12 }}>
                <Code tone="t">{r.code}</Code>
                <strong style={{ fontWeight: 600 }}>{r.name}</strong>
              </span>
              <span role="cell">{r.metric}</span>
              <span role="cell" className={s.direction}>
                {r.direction}
              </span>
              <span role="cell" className={s.muted}>
                {r.risk}
              </span>
            </Fragment>
          ))}
        </div>

        <div className={s.mitigations}>
          <SectionLabel>Risk → azaltma tədbiri</SectionLabel>
          {MITIGATIONS.map((m) => (
            <div key={m.risk} className={s.mitigation}>
              <strong>{m.risk}</strong>
              <span>{m.action}</span>
            </div>
          ))}
        </div>

        <div className={s.s11Bottom}>
          <p className={s.statement}>
            Uğur texnologiyaların sayı ilə deyil, <strong>biznes nəticələri ilə ölçülür</strong>. Rəqəmsal hədəflər yalnız baza göstəricilər ölçüldükdən sonra
            qoyulur.
          </p>
          <AudienceQuestion questionId="risk" />
        </div>
      </div>
    </SlideFrame>
  );
}
