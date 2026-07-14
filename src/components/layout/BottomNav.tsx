import { NavLink } from "react-router-dom";
import styles from "./BottomNav.module.scss";

const items = [
  { to: "/", label: "Início" },
  { to: "/sobre-mim", label: "Sobre" },
  { to: "/projetos", label: "Obras" },
  { to: "/experiencias", label: "Ofício" },
  { to: "/certificados", label: "Diplomas" },
  { to: "/contato", label: "Contato" },
];

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4 4h6a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4z" />
      <path d="M20 4h-6a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h7z" />
    </svg>
  );
}

export function BottomNav() {
  return (
    <nav className={styles.bottom}>
      {items.map((i) => (
        <NavLink
          key={i.to}
          to={i.to}
          end={i.to === "/"}
          className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
        >
          <BookIcon />
          <span>{i.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
