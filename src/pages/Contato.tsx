import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import type { ContactItem } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { OrnamentalDivider } from "@/components/ui/OrnamentalDivider";
import { Button } from "@/components/ui/Button";
import styles from "./Contato.module.scss";

interface Props { contacts: ContactItem[] }

const ICON: Record<string, string> = { email: "✉", github: "❦", linkedin: "in" };

export default function Contato({ contacts }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-line]", { opacity: 0, x: -18, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  const share = async () => {
    const url = window.location.href;
    const shareData = { title: "Biblioteca Rothje", url };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* silenciar cancelamento */
    }
  };

  return (
    <div className={styles.wrap} ref={ref}>
      <SectionTitle volume="Vol. V" title="Contato" subtitle="Correspondência bem-vinda" />

      <p className={styles.intro} data-line>
        <em>
          Prezado(a) visitante, é com honra que ponho à disposição os endereços abaixo
          para toda sorte de missiva — sejam saudações, propostas ou correspondências literárias.
        </em>
      </p>

      <OrnamentalDivider />

      <ul className={styles.list}>
        {contacts.map((c) => (
          <li key={c.type} className={styles.item} data-line>
            <span className={styles.icon}>{ICON[c.type] ?? "✦"}</span>
            <div className={styles.body}>
              <span className={styles.label}>{c.label}</span>
              <a href={c.url} target="_blank" rel="noreferrer" className={styles.value}>{c.value}</a>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.actions} data-line>
        <Button variant="primary" onClick={share}>
          {copied ? "Endereço copiado ✓" : "Compartilhar este acervo"}
        </Button>
      </div>

      <p className={styles.foot} data-line><em>Resposta em até 48 horas.</em></p>
    </div>
  );
}
