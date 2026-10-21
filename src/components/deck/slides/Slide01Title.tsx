import type { ReactNode } from "react";
import { useDeck } from "../deck-context.ts";
import deck from "../deck.module.css";
import { AnalyticsIcon, ApiIcon, AutomationIcon, CloudIcon, DocumentIcon, HubIcon, ShieldIcon } from "../icons.tsx";
import { JoinCard, SectionLabel, SlideFooter } from "../primitives.tsx";
import s from "./slides.module.css";

const HUB = { w: 760, h: 540, cx: 380, cy: 255, rx: 290, ry: 185 };

const NODES: readonly { label: string; icon: ReactNode; angle: number }[] = [
  { label: "API və inteqrasiya", icon: <ApiIcon size={38} />, angle: -90 },
  { label: "Bulud infrastrukturu", icon: <CloudIcon size={38} />, angle: -30 },
  { label: "Avtomatlaşdırma", icon: <AutomationIcon size={38} />, angle: 30 },
  { label: "Analitika və KPI", icon: <AnalyticsIcon size={38} />, angle: 90 },
  { label: "Sənəd idarəetməsi", icon: <DocumentIcon size={38} />, angle: 150 },
  { label: "Kibertəhlükəsizlik", icon: <ShieldIcon size={38} />, angle: 210 },
];

const position = (angle: number) => {
  const rad = (angle * Math.PI) / 180;
  return { x: HUB.cx + HUB.rx * Math.cos(rad), y: HUB.cy + HUB.ry * Math.sin(rad) };
};

function IntegrationHub() {
  return (
    <div className={s.hub} role="img" aria-label="Hədəf vəziyyət: mərkəzdə inteqrasiya platforması, ətrafında altı əlaqəli imkan">
      <svg className={s.hubLines} viewBox={`0 0 ${HUB.w} ${HUB.h}`} aria-hidden="true">
        {NODES.map((n) => {
          const p = position(n.angle);
          return <line key={n.label} x1={HUB.cx} y1={HUB.cy} x2={p.x} y2={p.y} />;
        })}
      </svg>
      <div className={s.hubCenter} style={{ left: HUB.cx, top: HUB.cy }}>
        <div className={s.hubCenterDisc}>
          <HubIcon size={44} />
          İnteqrasiya
          <br />
          platforması
        </div>
      </div>
      {NODES.map((n) => {
        const p = position(n.angle);
        // Disc sits on the spoke end; the label goes below it, or above for the top node so it doesn't cover the spoke.
        return (
          <div key={n.label} className={s.hubNode} data-top={n.angle === -90 || undefined} style={{ left: p.x, top: n.angle === -90 ? p.y - 22 : p.y + 22 }}>
            <div className={s.hubNodeDisc}>{n.icon}</div>
            <span className={s.hubNodeLabel}>{n.label}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Slide01Title() {
  const { host } = useDeck();
  return (
    <div className={deck.slide}>
      <div className={s.titleGrid}>
        <div className={s.titleLeft}>
          <p className={s.kicker}>NÜMUNƏ ARAŞDIRMASI · NOVATECH SOLUTIONS</p>
          <h1 className={s.heroTitle}>İş yerində rəqəmsal transformasiyanın tətbiqi</h1>
          <p className={s.heroSub}>IT xidmətləri və sistem inteqrasiyası şirkəti nümunəsində</p>
          <p className={s.heroText}>
            NovaTech Solutions IT konsaltinq, proqram təminatının tətbiqi və dəstəyi, sistem inteqrasiyası, API inkişafı və hesabat həlləri təqdim edir.
            Şirkət böyüdükcə daxili prosesləri və texnoloji mühiti yenilənməyə ehtiyac duyur.
          </p>
          <div className={s.keyQuestion}>
            <SectionLabel>Əsas sual</SectionLabel>
            <p>
              Bir IT xidmətləri şirkəti bir-birindən ayrı işləyən prosesləri inteqrasiya olunmuş, təhlükəsiz və məlumatlara əsaslanan rəqəmsal mühitə necə
              çevirə bilər?
            </p>
          </div>
        </div>
        <div className={s.titleRight}>
          <IntegrationHub />
          <JoinCard size={150} />
        </div>
      </div>
      <SlideFooter number={1} host={host} />
    </div>
  );
}
