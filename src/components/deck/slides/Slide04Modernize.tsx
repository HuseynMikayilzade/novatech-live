import { ArrowDown } from "../icons.tsx";
import { SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const STEPS = [
  { title: "Qiymətləndirmə", text: "Tətbiqlərin, asılılıqların və inteqrasiya nöqtələrinin inventarı" },
  { title: "Texniki borc və kritik məntiq", text: "Riskli modulların və əsas biznes qaydalarının müəyyənləşdirilməsi" },
  { title: "Refaktorinq və ya mərhələli əvəzetmə", text: "Strangler Fig: funksiyalar hissə-hissə yeni modula köçürülür" },
  { title: "Baza və API uyğunluğu", text: "Keçid dövründə köhnə və yeni sistem paralel, uyğun işləyir" },
  { title: "Test, miqrasiya, geri qaytarma", text: "Avtomatlaşdırılmış testlər, sınaq miqrasiyası, rollback planı" },
  { title: "Biznes davamlılığı", text: "Mövcud biznes qaydaları və vacib funksionallıq qorunur" },
];

const LAYERS = ["Web UI (Angular / React)", "REST API qatı", "Tətbiq xidmətləri", "Domen: biznes qaydaları", "Məlumat girişi (EF Core / Dapper)", "Verilənlər bazası"];

export function Slide04Modernize() {
  return (
    <SlideFrame number={4} eyebrow="T1 · Köhnə sistemlərin modernizasiyası" title="Modernizasiya: riski azaldaraq mərhələli yenilənmə">
      <div className={s.s4}>
        <div className={s.arch}>
          <SectionLabel>Əvvəl: sıx bağlı monolit</SectionLabel>
          <div className={s.monolith}>
            {["Ekranlar (UI)", "Biznes qaydaları", "Birbaşa SQL sorğuları", "Hesabat kodu"].map((part) => (
              <span key={part} className={s.tangle}>
                {part}
              </span>
            ))}
          </div>
          <span className={s.arrow} aria-hidden="true">
            <ArrowDown />
          </span>
          <div className={s.sharedDb}>Paylaşılan baza</div>
          <p className={s.caption} data-tone="bad">
            Bir dəyişiklik bütün sistemə təsir edir və tam yenidən test tələb edir
          </p>
        </div>

        <div className={s.arch}>
          <SectionLabel>Sonra: modul, qatlı arxitektura</SectionLabel>
          <div className={s.layers}>
            {LAYERS.map((layer) => (
              <span key={layer} className={s.layer} data-core={layer.startsWith("Domen") || undefined}>
                {layer}
              </span>
            ))}
          </div>
          <p className={s.caption} data-tone="good">
            Aydın sərhədlər; ayrıca xidmət yalnız real ehtiyac olduqda
          </p>
        </div>

        <div className={s.stack} style={{ gap: 24 }}>
          <div className={s.statement}>
            <p className={s.cardTitle} style={{ marginBottom: 8, color: "var(--amber)" }}>
              Əsas prinsip
            </p>
            <p className={s.small}>
              Modernizasiya riski azaltmalı və sistemin dəstəklənməsini asanlaşdırmalı, biznes əməliyyatlarını isə lazımsız yerə pozmamalıdır.
              Mikroservislər hər zaman düzgün seçim deyil: çox vaxt yaxşı qurulmuş modul monolit kifayətdir.
            </p>
          </div>
          <SectionLabel>Yanaşma addımları</SectionLabel>
          <ol className={s.steps} style={{ margin: 0, padding: 0, listStyle: "none" }}>
            {STEPS.map((step, i) => (
              <li key={step.title} className={s.numbered}>
                <span className={s.num}>{i + 1}</span>
                <strong className={s.small} style={{ fontWeight: 600 }}>
                  {step.title}
                </strong>
                <span className={`${s.xs} ${s.muted}`} style={{ gridColumn: 2 }}>
                  {step.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </SlideFrame>
  );
}
