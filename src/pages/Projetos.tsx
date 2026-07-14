import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import type { Project } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { Button } from "@/components/ui/Button";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import styles from "./Projetos.module.scss";

interface Props { projects: Project[] }

export default function Projetos({ projects }: Props) {
  const [filter, setFilter] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);

  const tags = useMemo(() => {
    const s = new Set<string>();
    projects.forEach((p) => p.tags.forEach((t) => s.add(t)));
    return Array.from(s);
  }, [projects]);

  const filtered = useMemo(
    () => projects.filter((p) => (filter ? p.tags.includes(filter) : true)),
    [projects, filter]
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-project]", { opacity: 0, y: 30, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, [filter]);

  return (
    <div className={styles.wrap} ref={ref}>
      <SectionTitle
        volume="Vol. II"
        title="Projetos"
        subtitle={`${projects.length} repositórios catalogados no acervo`}
      />

      <div className={styles.filters}>
        <button
          className={`${styles.chip} ${filter === null ? styles.chipActive : ""}`}
          onClick={() => setFilter(null)}
        >
          Todos
        </button>
        {tags.map((t) => (
          <button
            key={t}
            className={`${styles.chip} ${filter === t ? styles.chipActive : ""}`}
            onClick={() => setFilter(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <OrnamentalDivider />

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p><em>Obra não encontrada no catálogo.</em></p>
          <Button variant="outline" onClick={() => setFilter(null)}>Consultar novamente</Button>
        </div>
      ) : (
        <div className={styles.grid}>
          {filtered.sort((a, b) => a.order - b.order).map((p) => (
            <div key={p.id} data-project>
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
