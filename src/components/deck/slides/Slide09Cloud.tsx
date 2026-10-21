import { ArrowDown, CheckIcon } from "../icons.tsx";
import { SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const MODELS = [
  { name: "IaaS", text: "Virtual server, şəbəkə, disk. OS və tətbiqi şirkət idarə edir.", example: "köhnə tətbiqin VM-ə köçürülməsi" },
  { name: "PaaS", text: "Platformanı provayder idarə edir; komanda koda fokuslanır.", example: "web tətbiq, idarə olunan DB" },
  { name: "SaaS", text: "Hazır proqram xidmət kimi istifadə olunur.", example: "e-poçt, ofis, helpdesk" },
];

const CONTROLS = [
  "Mərkəzləşdirilmiş IAM",
  "Çoxfaktorlu autentifikasiya (MFA)",
  "Minimum hüquq prinsipi",
  "Şifrələmə: ötürmə və saxlama",
  "Backup və bərpa testləri",
  "Monitorinq və insident cavabı",
  "Xərc idarəetməsi: büdcə, teqlər",
  "Vendor asılılığı, məlumatın yeri",
];

const Down = () => (
  <span className={s.arrow} aria-hidden="true">
    <ArrowDown size={24} />
  </span>
);

export function Slide09Cloud() {
  return (
    <SlideFrame number={9} eyebrow="T6 · Bulud infrastrukturu və kibertəhlükəsizlik" title="Bulud və təhlükəsizlik: idarə olunan, yoxlanıla bilən infrastruktur">
      <div className={s.s9}>
        <div className={s.cloudFlow} role="img" aria-label="İstifadəçilər IAM və MFA ilə yoxlanılır, sonra WAF vasitəsilə bulud mühitindəki tətbiq xidmətlərinə çatır">
          <span className={s.node}>İstifadəçilər</span>
          <Down />
          <span className={s.node} style={{ borderLeft: "4px solid var(--amber)" }}>
            IAM + MFA<small>kimlik yoxlanışı</small>
          </span>
          <Down />
          <div className={s.cloudBox}>
            <SectionLabel>Bulud mühiti (seçilmiş region)</SectionLabel>
            <span className={s.node}>WAF / yük balanslayıcı</span>
            <div className={s.paas}>
              Tətbiq xidmətləri (PaaS)
              <div className={s.envs}>
                <span>Dev</span>
                <span>Test</span>
                <span>Prod</span>
              </div>
            </div>
            <div className={s.pair}>
              <span className={s.node}>
                İdarə olunan DB<small>(şifrələnmiş)</small>
              </span>
              <span className={s.node}>
                Ehtiyat nüsxə<small>(ayrı zona)</small>
              </span>
            </div>
          </div>
          <p className={s.band}>Monitorinq, log toplama və insident xəbərdarlığı</p>
        </div>

        <div className={s.models}>
          <SectionLabel>Xidmət modelləri</SectionLabel>
          {MODELS.map((m) => (
            <div key={m.name} className={s.model}>
              <strong>{m.name}</strong>
              <span className={s.small}>{m.text}</span>
              <span className={`${s.xs} ${s.muted}`}>Nümunə: {m.example}</span>
            </div>
          ))}
        </div>

        <div className={s.stack} style={{ gap: 20 }}>
          <SectionLabel>Təhlükəsizlik və idarəetmə nəzarətləri</SectionLabel>
          <ul className={s.checks}>
            {CONTROLS.map((c) => (
              <li key={c}>
                <CheckIcon />
                {c}
              </li>
            ))}
          </ul>
          <div className={s.statement} style={{ marginTop: "auto" }}>
            <p className={s.cardTitle} style={{ marginBottom: 6, color: "var(--amber)" }}>
              Vacib
            </p>
            <p className={s.small}>
              Bulud özü-özlüyündə nə xərcləri azaldır, nə də təhlükəsizliyi təmin edir. Nəticə arxitekturadan, ortaq məsuliyyət modelindən və davamlı
              idarəetmədən asılıdır.
            </p>
          </div>
        </div>
      </div>
    </SlideFrame>
  );
}
