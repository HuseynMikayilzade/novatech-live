import { useId } from "react";
import { AudienceQuestion, Code, SectionLabel, SlideFrame } from "../primitives.tsx";
import s from "./slides.module.css";

const SYSTEMS = ["CRM (köhnə)", "Layihə uçotu", "Helpdesk", "Maliyyə sistemi"];
const MANUAL = ["Excel cədvəlləri", "E-poçt təsdiqləri", "Paylaşılan qovluqlar"];

const PROBLEMS = [
  { code: "P1", title: "Köhnə tətbiqlər və texniki borc", text: "Dəyişiklik etmək çətin və risklidir, sənədləşmə natamamdır" },
  { code: "P2", title: "Əlaqəsiz biznes sistemləri", text: "Məlumat sistemlər arasında avtomatik ötürülmür" },
  { code: "P3", title: "Təkrarlanan əl əməliyyatları", text: "Eyni məlumat bir neçə dəfə əl ilə daxil edilir" },
  { code: "P4", title: "Dağınıq sənəd idarəetməsi", text: "Təsdiqlər e-poçtla, versiyalar müxtəlif qovluqlarda saxlanılır" },
  { code: "P5", title: "Gecikən və uyğunsuz hesabatlar", text: "Rəhbərlik hesabatı üçün bir neçə mənbə əl ilə birləşdirilir" },
  { code: "P6", title: "İnfrastruktur və təhlükəsizlik idarəetməsi", text: "Giriş hüquqları, ehtiyat nüsxə və miqyaslanma sistemli deyil" },
];

const CONSEQUENCES = ["Əlavə əmək sərfi", "Təkrarlanan məlumat", "Məhdud şəffaflıq", "Çətin texniki dəstək", "Gecikən qərarlar"];

// Geometry of the "current state" systems map (SVG units = stage px).
const SYS_W = 196;
const SYS = SYSTEMS.map((label, i) => ({ label, x: 6 + i * 214, y: 10 }));
const MAN_W = 250;
const MAN = MANUAL.map((label, i) => ({ label, x: 20 + i * 290, y: 200 }));
const REPORT = { x: 150, y: 380, w: 260 };
const LEAD = { x: 540, y: 380, w: 220 };
const BOX_H = 64;

function SystemsMap() {
  // Unique per instance: the slide is rendered twice (screen + print backup).
  const markerId = useId();
  // Every system leaks into the manual tools: the dashed lines are the re-keying points.
  const links: [number, number][] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [2, 1],
    [2, 2],
    [3, 0],
    [3, 2],
  ];
  return (
    <svg className={s.mapSvg} viewBox="0 0 860 470" role="img" aria-label="Cari vəziyyət: sistemlər bir-biri ilə əlaqəli deyil, məlumat Excel, e-poçt və qovluqlar vasitəsilə əl ilə ötürülür">
      {links.map(([from, to]) => {
        const a = SYS[from]!;
        const b = MAN[to]!;
        return <path key={`${from}-${to}`} className={s.mapLink} d={`M${a.x + SYS_W / 2},${a.y + BOX_H} L${b.x + MAN_W / 2},${b.y}`} />;
      })}
      {MAN.map((m) => (
        <path key={m.label} className={s.mapLink} d={`M${m.x + MAN_W / 2},${m.y + BOX_H} L${REPORT.x + REPORT.w / 2},${REPORT.y}`} />
      ))}
      <path className={s.mapLinkSolid} d={`M${REPORT.x + REPORT.w},${REPORT.y + BOX_H / 2} L${LEAD.x - 8},${LEAD.y + BOX_H / 2}`} markerEnd={`url(#${markerId})`} />
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="#b6a5f2" />
        </marker>
      </defs>

      {SYS.map((b) => (
        <g key={b.label}>
          <rect className={s.mapBox} x={b.x} y={b.y} width={SYS_W} height={BOX_H} rx={8} />
          <text className={s.mapText} x={b.x + SYS_W / 2} y={b.y + 40} textAnchor="middle">
            {b.label}
          </text>
        </g>
      ))}
      {MAN.map((b) => (
        <g key={b.label}>
          <rect className={s.mapBoxManual} x={b.x} y={b.y} width={MAN_W} height={BOX_H} rx={8} />
          <text className={s.mapText} x={b.x + MAN_W / 2} y={b.y + 40} textAnchor="middle">
            {b.label}
          </text>
        </g>
      ))}
      <rect className={s.mapBoxManual} x={REPORT.x} y={REPORT.y} width={REPORT.w} height={BOX_H} rx={8} />
      <text className={s.mapText} x={REPORT.x + REPORT.w / 2} y={REPORT.y + 40} textAnchor="middle">
        Əl ilə hesabat
      </text>
      <rect className={s.mapBoxLead} x={LEAD.x} y={LEAD.y} width={LEAD.w} height={BOX_H} rx={8} />
      <text className={s.mapText} x={LEAD.x + LEAD.w / 2} y={LEAD.y + 40} textAnchor="middle">
        Rəhbərlik
      </text>
      <text className={s.mapNote} x={430} y={160} textAnchor="middle">
        əl ilə köçürmə və təkrar daxiletmə
      </text>
    </svg>
  );
}

export function Slide02Current() {
  return (
    <SlideFrame number={2} eyebrow="İlkin vəziyyət" tag="Ssenari fərziyyələri" title="İlkin vəziyyət: ayrı sistemlər, əl ilə işlər, gecikən qərarlar">
      <div className={s.s2}>
        <div className={s.map}>
          <SectionLabel>Cari vəziyyət: məlumat sistemlər arasında əl ilə ötürülür</SectionLabel>
          <SystemsMap />
        </div>
        <ol className={s.problems}>
          {PROBLEMS.map((p) => (
            <li key={p.code} className={s.problem}>
              <Code>{p.code}</Code>
              <strong>{p.title}</strong>
              <span>{p.text}</span>
            </li>
          ))}
        </ol>
        <div className={s.s2Bottom}>
          <div className={s.consequences}>
            <SectionLabel>Biznes nəticələri</SectionLabel>
            <div className={s.chips}>
              {CONSEQUENCES.map((c) => (
                <span key={c} className={s.chip}>
                  {c}
                </span>
              ))}
            </div>
          </div>
          <AudienceQuestion questionId="priority">Bu problemlərdən hansının həlli ilk növbədə prioritet olmalıdır?</AudienceQuestion>
        </div>
      </div>
    </SlideFrame>
  );
}
