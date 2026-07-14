import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.scss";

const items = [
  { to: "/", label: "Prólogo", roman: "" },
  { to: "/sobre-mim", label: "Sobre Mim", roman: "I" },
  { to: "/projetos", label: "Projetos", roman: "II" },
  { to: "/experiencias", label: "Experiências", roman: "III" },
  { to: "/certificados", label: "Certificados", roman: "IV" },
  { to: "/contato", label: "Contato", roman: "V" },
];

export function Navbar() {
  return (
    <aside className={styles.nav}>
      <div className={styles.logo}>
        <span className={styles.logoTop}>Bibliotheca</span>
        <span className={styles.logoBottom}>M. Rothje</span>
      </div>
      <div className={styles.divider}>◆ ——— ◆</div>
      <nav>
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `${styles.link} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.roman}>{item.roman}</span>
                <span className={styles.label}>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.footer}>
        <span>Anno</span>
        <span>MMXXV</span>
      </div>
    </aside>
  );
}
