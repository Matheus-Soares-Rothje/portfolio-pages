import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import styles from "./SectionTitle.module.scss";

interface Props {
  volume?: string;
  title: string;
  subtitle?: string;
}

export function SectionTitle({ volume, title, subtitle }: Props) {
  const titleRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const chars = el.querySelectorAll<HTMLSpanElement>("[data-char]");
    gsap.fromTo(
      chars,
      { opacity: 0, y: 8 },
      { opacity: 1, y: 0, duration: 0.05, stagger: 0.04, ease: "power2.out" }
    );
  }, [title]);

  return (
    <header className={styles.header}>
      {volume && <div className={styles.volume}>{volume}</div>}
      <h1 ref={titleRef} className={styles.title} aria-label={title}>
        {title.split("").map((c, i) => (
          <span key={i} data-char aria-hidden="true">{c === " " ? "\u00A0" : c}</span>
        ))}
      </h1>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </header>
  );
}
