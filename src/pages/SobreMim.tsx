import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Experience, HardSkill, Stat } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { SkillBar } from "@/components/ui/SkillBar";
import { StatCard } from "@/components/ui/StatCard";
import { TimelineEntry } from "@/components/ui/TimelineEntry";
import styles from "./SobreMim.module.scss";

interface Props {
  paragraphs: string[];
  hardSkills: HardSkill[];
  stats: Stat[];
  experiences: Experience[];
}

export default function SobreMim({ paragraphs, hardSkills, stats, experiences }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-fade]", { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <SectionTitle volume="Vol. I" title="Sobre Mim" subtitle="Notas biográficas & inventário do ofício" />

      <div className={styles.book}>
        <section className={styles.leftPage} data-fade>
          <figure className={styles.figure}>
            <div className={styles.frame}>
              <img src="https://github.com/Matheus-Soares-Rothje.png" alt="Matheus Rothje" />
            </div>
            <figcaption>Matheus Rothje</figcaption>
          </figure>
          <div className={styles.bio}>
            {paragraphs.map((p, i) => (
              <p key={i} className={i === 0 ? styles.firstPara : undefined}>{p}</p>
            ))}
          </div>
        </section>

        <section className={styles.rightPage} data-fade>
          <h2 className={styles.heading}>Arsenal Técnico</h2>
          <div className={styles.skills}>
            {hardSkills.map((s) => <SkillBar key={s.name} name={s.name} level={s.level} />)}
          </div>

          <OrnamentalDivider />

          <h2 className={styles.heading}>Estatísticas</h2>
          <div className={styles.stats}>
            {stats.map((s) => <StatCard key={s.label} label={s.label} value={s.value} />)}
          </div>
        </section>
      </div>

      <OrnamentalDivider label="Linha do Tempo" />

      <section className={styles.timeline} data-fade>
        {experiences.map((e) => <TimelineEntry key={e.id} experience={e} />)}
      </section>
    </div>
  );
}
