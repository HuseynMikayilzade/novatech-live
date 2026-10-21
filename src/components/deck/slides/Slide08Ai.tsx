import { ArrowRight } from "../icons.tsx";
import { SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const LEVELS = [
  { title: "Ənənəvi hesabat", question: "Nə baş verdi?", text: "Keçən ayın insident sayı, təsdiq müddəti" },
  { title: "Məlumat analitikası", question: "Niyə baş verdi?", text: "Trendlər, səbəb təhlili, seqmentləşdirmə" },
  { title: "SI dəstəkli tapşırıqlar", question: "Nə təklif olunur?", text: "Təsnifat, axtarış, anomaliya siqnalı" },
];

const AREAS = ["Texniki sənəd axtarışı", "Tiket təsnifatı", "Kod yazmaya köməkçi", "Bilik bazası köməkçisi", "Anomaliya aşkarlanması", "Trend və proqnoz*"];

const RISKS = [
  { title: "Halüsinasiya", text: "mənbəyə istinad, yoxlama" },
  { title: "Məxfi məlumat", text: "təsdiqlənmiş mühit, məlumat təsnifatı" },
  { title: "Giriş nəzarəti", text: "axtarış istifadəçi hüquqlarına uyğun" },
  { title: "İnsan yoxlaması", text: "kritik qərarlarda məcburi" },
  { title: "Qiymətləndirmə", text: "test sualları dəsti, keyfiyyət metrikləri" },
];

const RAG = ["Sual", "Giriş hüququ yoxlanışı", "Sənəd axtarışı", "Mənbəli cavab", "İşçi yoxlayır"];

export function Slide08Ai() {
  return (
    <SlideFrame number={8} eyebrow="T7 · Süni intellekt və məlumat analitikası" title="Süni intellekt: məhdud, ölçülə bilən və nəzarət olunan tətbiq">
      <div className={s.s8}>
        <div className={s.levels}>
          {LEVELS.map((level, i) => (
            <div key={level.title} style={{ display: "contents" }}>
              {i > 0 && (
                <span className={s.arrow} aria-hidden="true">
                  <ArrowRight />
                </span>
              )}
              <div className={s.level} data-step={i + 1}>
                <p className={s.cardTitle}>{level.title}</p>
                <p className={s.levelQuestion}>{level.question}</p>
                <p className={`${s.xs} ${s.muted}`}>{level.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={s.s8Main}>
          <div className={s.stack}>
            <SectionLabel>Praktik tətbiq sahələri</SectionLabel>
            <div className={s.chips}>
              {AREAS.map((area) => (
                <span key={area} className={s.chip}>
                  {area}
                </span>
              ))}
            </div>
            <p className={`${s.xs} ${s.muted}`}>* yalnız məlumat keyfiyyəti imkan verdikdə</p>
          </div>

          <div className={s.chat} aria-label="Nümunə: daxili bilik köməkçisi">
            <SectionLabel>Nümunə: daxili bilik köməkçisi</SectionLabel>
            <p className={s.bubbleAsk}>Müştəri serverində VPN sertifikatını necə yeniləyək?</p>
            <div className={s.bubbleAnswer}>
              <p>Təlimata görə 3 addım lazımdır: köhnə sertifikatın ehtiyat nüsxəsi, yeni sertifikatın idxalı və xidmətin yenidən başladılması.</p>
              <p className={s.source} style={{ marginTop: 8 }}>
                Mənbə: «VPN əməliyyat təlimatı», bölmə 4 · Yalnız giriş hüququnuz olan sənədlər axtarıldı
              </p>
            </div>
            <p className={`${s.xs} ${s.muted}`} style={{ marginTop: "auto" }}>
              Axtarışla gücləndirilmiş generasiya (RAG):
            </p>
            <div className={s.rag} style={{ marginTop: 0 }}>
              {RAG.map((step, i) => (
                <span key={step} style={{ display: "contents" }}>
                  {i > 0 && <span className={s.ragArrow}>→</span>}
                  <span>{step}</span>
                </span>
              ))}
            </div>
          </div>

          <div className={s.stack}>
            <SectionLabel>Risklər və nəzarət</SectionLabel>
            <ul className={s.riskList}>
              {RISKS.map((r) => (
                <li key={r.title}>
                  <strong>{r.title}:</strong> {r.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={s.statement}>
          <strong>SI işçiləri əvəz etmir</strong> və dəqiq proqnoza zəmanət vermir.
        </p>
      </div>
    </SlideFrame>
  );
}
