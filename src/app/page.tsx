import { AudienceFlow } from "@/components/audience/AudienceFlow.tsx";
import styles from "@/components/audience/audience.module.css";
import { BrandMark } from "@/components/shared/BrandMark.tsx";
import { QUESTIONS } from "@/domain/questions.ts";

export default function AudiencePage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <BrandMark size={36} />
        <div>
          <p className={styles.brandName}>NovaTech canlı sorğu</p>
          <p className={styles.brandSub}>İş yerində rəqəmsal transformasiyanın tətbiqi</p>
        </div>
      </header>
      <AudienceFlow questions={QUESTIONS} />
    </main>
  );
}
