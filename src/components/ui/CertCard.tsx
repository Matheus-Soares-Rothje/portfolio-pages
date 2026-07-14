import type { Certificate, CertificateIcon } from "@/types";
import styles from "./CertCard.module.scss";

const ICONS: Record<CertificateIcon, string> = {
  html5: "⌘", css3: "❦", js: "JS", react: "⚛", node: "◈", python: "π", atom: "⚛", default: "✦",
};

interface Props { certificate: Certificate }
export function CertCard({ certificate }: Props) {
  const inner = (
    <>
      <div className={styles.seal}>⚜</div>
      <div className={styles.icon}>{ICONS[certificate.icon]}</div>
      <h3 className={styles.name}>{certificate.name}</h3>
      <p className={styles.platform}>{certificate.platform}</p>
      <div className={styles.rule} />
      <p className={styles.year}>ANNO {certificate.year}</p>
    </>
  );
  if (certificate.url) {
    return <a className={styles.card} href={certificate.url} target="_blank" rel="noreferrer">{inner}</a>;
  }
  return <div className={styles.card}>{inner}</div>;
}
