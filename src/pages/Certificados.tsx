import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import type { Certificate } from "@/types";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { CertCard } from "@/components/ui/CertCard";
import styles from "./Certificados.module.scss";

interface Props { certificates: Certificate[] }
export default function Certificados({ certificates }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from("[data-cert]", { opacity: 0, y: 20, duration: 0.6, stagger: 0.1, ease: "power2.out" });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.wrap} ref={ref}>
      <SectionTitle volume="Vol. IV" title="Certificados" subtitle={`${certificates.length} títulos concedidos`} />
      <div className={styles.grid}>
        {certificates.map((c) => (
          <div key={c.id} data-cert>
            <CertCard certificate={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
