import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Experience } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { TimelineEntry } from "@/components/ui/TimelineEntry";
import styles from "./Experiencias.module.scss";

interface Props { experiences: Experience[] }
export default function Experiencias({ experiences }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-entry]", { opacity: 0, y: 30, duration: 0.7, stagger: 0.15, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <SectionTitle volume="Vol. III" title="Experiências" subtitle="Registro cronológico do ofício" />
      <div className={styles.list}>
        {experiences.map((e) => (
          <div key={e.id} data-entry>
            <TimelineEntry experience={e} />
          </div>
        ))}
      </div>
    </div>
  );
}
