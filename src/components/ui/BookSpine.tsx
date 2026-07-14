import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { gsap } from "gsap";
import styles from "./BookSpine.module.scss";

interface Props {
  roman: string;
  title: string;
  to: string;
  hue: number;
}

export function BookSpine({ roman, title, to, hue }: Props) {
  const navigate = useNavigate();
  const ref = useRef<HTMLButtonElement | null>(null);

  const onEnter = () => {
    if (ref.current) gsap.to(ref.current, { y: -14, duration: 0.35, ease: "power2.out" });
  };
  const onLeave = () => {
    if (ref.current) gsap.to(ref.current, { y: 0, duration: 0.4, ease: "power2.inOut" });
  };
  const onClick = () => {
    if (!ref.current) { navigate(to); return; }
    gsap.to(ref.current, {
      y: -22, duration: 0.2, ease: "power2.out",
      onComplete: () => navigate(to),
    });
  };

  const style: React.CSSProperties = {
    background: `linear-gradient(90deg, hsl(${hue}, 25%, 8%), hsl(${hue}, 30%, 14%) 40%, hsl(${hue}, 22%, 10%))`,
  };

  return (
    <button
      ref={ref}
      className={styles.spine}
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onClick={onClick}
      aria-label={`${roman} — ${title}`}
    >
      <span className={styles.top} />
      <span className={styles.roman}>{roman}</span>
      <span className={styles.title}>{title}</span>
      <span className={styles.bottom} />
    </button>
  );
}
