import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { BookSpine } from "@/components/ui/BookSpine";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import styles from "./Home.module.scss";

const volumes = [
  { roman: "I", title: "Sobre Mim", to: "/sobre-mim", hue: 140 },
  { roman: "II", title: "Projetos", to: "/projetos", hue: 30 },
  { roman: "III", title: "Experiências", to: "/experiencias", hue: 160 },
  { roman: "IV", title: "Certificados", to: "/certificados", hue: 45 },
  { roman: "V", title: "Contato", to: "/contato", hue: 130 },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement | null>(null);
  const shelfRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(`.${styles.portrait}`, { y: 20, opacity: 0, duration: 0.9, ease: "power2.out" });
      gsap.from(`.${styles.name} > span`, { y: 24, opacity: 0, duration: 0.06, stagger: 0.04, ease: "power2.out", delay: 0.2 });
      gsap.from(`.${styles.role}`, { opacity: 0, duration: 0.8, delay: 0.9 });
      if (shelfRef.current) {
        gsap.from(shelfRef.current.querySelectorAll("[data-spine]"), {
          y: 40, opacity: 0, duration: 0.6, stagger: 0.1, ease: "power2.out", delay: 1,
        });
      }
    }, heroRef);
    return () => ctx.revert();
  }, []);

  const name = "MATHEUS ROTHJE";

  return (
    <div className={styles.wrap} ref={heroRef}>
      <div className={styles.portraitWrap}>
        <div className={styles.portrait}>
          <img src="https://github.com/Matheus-Soares-Rothje.png" alt="Matheus Rothje" />
        </div>
      </div>
      <h1 className={styles.name} aria-label={name}>
        {name.split("").map((c, i) => (
          <span key={i} aria-hidden="true">{c === " " ? "\u00A0" : c}</span>
        ))}
      </h1>
      <p className={styles.role}><em>Desenvolvedor Full Stack</em></p>

      <OrnamentalDivider label="A Estante" />

      <div className={styles.shelfWrap}>
        <div className={styles.shelf} ref={shelfRef}>
          {volumes.map((v) => (
            <div key={v.to} data-spine>
              <BookSpine roman={v.roman} title={v.title} to={v.to} hue={v.hue} />
            </div>
          ))}
        </div>
        <div className={styles.shelfBoard} />
      </div>

      <footer className={styles.foot}>
        <p><em>“Um bom livro é um amigo que nunca engana.”</em></p>
        <p className={styles.year}>— Anno MMXXV</p>
      </footer>
    </div>
  );
}
