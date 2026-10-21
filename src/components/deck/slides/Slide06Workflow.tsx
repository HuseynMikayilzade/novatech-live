import { ArrowDown } from "../icons.tsx";
import { SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const BEFORE = [
  "Sorğu e-poçtla gəlir",
  "İşçi onu əl ilə yönləndirir",
  "Status Excel cədvəlində izlənir",
  "Təsdiqləyicilərlə ayrıca əlaqə saxlanılır",
  "Hesabat üçün əlavə əmək tələb olunur",
];

const AFTER = [
  "Sorğu iş axını sistemində qeydə alınır",
  "Təsdiq əvvəlcədən müəyyən qaydalarla yönləndirilir",
  "Bildirişlər avtomatik göndərilir",
  "Status və audit tarixçəsi saxlanılır",
  "Səlahiyyətli istifadəçilər prosesi paneldə izləyir",
];

const EDMS = [
  { title: "Versiyalama", text: "Hər dəyişiklik ayrıca versiya kimi saxlanılır" },
  { title: "Giriş icazələri", text: "Rola və sənəd növünə görə müəyyən edilir" },
  { title: "Saxlama müddəti", text: "Sənəd növü üzrə saxlama qaydaları" },
  { title: "Ehtiyat nüsxə", text: "Müntəzəm backup və bərpa testi" },
  { title: "Audit izi", text: "Kim, nə vaxt, hansı əməliyyatı etdi" },
];

function Process({ title, steps, tone }: { title: string; steps: readonly string[]; tone: "before" | "after" }) {
  return (
    <div className={s.process} data-tone={tone}>
      <SectionLabel>{title}</SectionLabel>
      {steps.map((step, i) => (
        <div key={step} className={s.processStep}>
          <span>{i + 1}</span>
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}

export function Slide06Workflow() {
  return (
    <SlideFrame number={6} eyebrow="T3 + T4 · İş axını və elektron sənəd idarəetməsi" title="Nümunə: proqram lisenziyası sorğusunun təsdiqi">
      <div className={s.s6}>
        <div className={s.beforeAfter}>
          <Process title="Əvvəl - əl ilə proses" steps={BEFORE} tone="before" />
          <div className={s.principle}>
            <SectionLabel>Prinsip</SectionLabel>
            <strong>Sadələşdir</strong>
            <span className={s.arrow} aria-hidden="true">
              <ArrowDown />
            </span>
            <strong>Standartlaşdır</strong>
            <span className={s.arrow} aria-hidden="true">
              <ArrowDown />
            </span>
            <strong>Avtomatlaşdır</strong>
            <p className={`${s.xs} ${s.muted}`} style={{ marginTop: 12 }}>
              Pis prosesi avtomatlaşdırmaq onu sadəcə sürətləndirir
            </p>
          </div>
          <Process title="Sonra - təklif olunan proses" steps={AFTER} tone="after" />
        </div>

        <div className={s.edms}>
          <SectionLabel>Elektron sənəd idarəetməsi: əsas nəzarət mexanizmləri</SectionLabel>
          <div className={s.edmsGrid}>
            {EDMS.map((item) => (
              <div key={item.title} className={s.card}>
                <p className={s.cardTitle}>{item.title}</p>
                <p className={`${s.xs} ${s.muted}`} style={{ marginTop: 6 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
