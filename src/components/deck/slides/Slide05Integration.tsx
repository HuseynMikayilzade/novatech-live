import { ArrowRight } from "../icons.tsx";
import { SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const CONTROLS = [
  { title: "Autentifikasiya", text: "OAuth 2.0 / OpenID Connect, JWT" },
  { title: "Giriş icazələri", text: "Rol əsaslı (RBAC), minimum hüquq" },
  { title: "Validasiya", text: "Sxem və biznes qaydalarının yoxlanışı" },
  { title: "Xəta idarəetməsi", text: "Standart xəta cavabı, təkrar cəhd" },
  { title: "Loglama", text: "Hər sorğu korrelyasiya ID ilə izlənir" },
  { title: "Monitorinq", text: "Gecikmə, xəta dərəcəsi, əlçatanlıq" },
];

const JOURNEY = [
  { title: "1 · Sorğu yaradılır", text: "İşçi portalda yeni noutbuk sorğusu daxil edir" },
  { title: "2 · Yoxlanılır", text: "Gateway tokeni, sorğu xidməti məlumatları validasiya edir" },
  { title: "3 · Saxlanılır", text: "Sorğu bazaya yazılır, hadisə audit loguna düşür" },
  { title: "4 · Hesabatda görünür", text: "Səlahiyyətli BI sistemi yalnız icazəli sahələri oxuyur" },
];

const Arrow = () => (
  <span className={s.arrow} aria-hidden="true">
    <ArrowRight size={26} />
  </span>
);

export function Slide05Integration() {
  return (
    <SlideFrame number={5} eyebrow="T2 · Sistem inteqrasiyası və API arxitekturası" title="İnteqrasiya: vahid giriş nöqtəsi, idarə olunan məlumat axını">
      <div className={s.s5}>
        <div className={s.flowDiagram} role="img" aria-label="Sorğular web portal, daxili tətbiqlər və xarici xidmətlərdən API Gateway vasitəsilə biznes xidmətlərinə və məlumat anbarlarına keçir">
          <div className={s.flowCols}>
            <div className={s.flowCol}>
              <span className={s.node}>Web portal</span>
              <span className={s.node}>Daxili biznes tətbiqləri</span>
              <span className={s.node}>Xarici xidmətlər, tərəfdaşlar</span>
            </div>
            <Arrow />
            <div className={s.gateway}>
              <strong>API Gateway</strong>
              <span>Autentifikasiya</span>
              <span>Marşrutlaşdırma</span>
              <span>Sorğu limiti</span>
              <span>Loglama</span>
            </div>
            <Arrow />
            <div className={s.flowCol}>
              <span className={s.node}>Sorğu xidməti</span>
              <span className={s.node}>İnteqrasiya xidməti</span>
              <span className={s.node}>Sənəd xidməti</span>
            </div>
            <Arrow />
            <div className={s.flowCol}>
              <span className={s.node}>
                Əməliyyat bazası<small>(PostgreSQL)</small>
              </span>
              <span className={s.node}>
                Hesabat / BI<small>(replika və ya ETL)</small>
              </span>
              <span className={s.node}>Sənəd anbarı (EDMS)</span>
            </div>
          </div>
          <p className={s.band}>Monitorinq və mərkəzləşdirilmiş loglama - bütün qatlarda (korrelyasiya ID ilə)</p>
        </div>

        <div className={s.controls}>
          <SectionLabel>Etibarlılıq və təhlükəsizlik</SectionLabel>
          {CONTROLS.map((c) => (
            <div key={c.title} className={s.control}>
              <strong>{c.title}</strong>
              <span className={s.muted}>{c.text}</span>
            </div>
          ))}
        </div>

        <div className={s.journey}>
          <div className={s.stack} style={{ justifyContent: "center" }}>
            <SectionLabel>Praktik nümunə</SectionLabel>
            <p className={s.cardTitle}>Avadanlıq sorğusunun yolu</p>
          </div>
          {JOURNEY.map((step) => (
            <div key={step.title} className={s.journeyStep}>
              <strong>{step.title}</strong>
              <span className={`${s.xs} ${s.muted}`}>{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    </SlideFrame>
  );
}
