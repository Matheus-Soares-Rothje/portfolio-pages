import type { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.scss";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: ReactNode;
}

export function Button({ variant = "primary", className, children, ...rest }: Props) {
  return (
    <button {...rest} className={`${styles.btn} ${styles[variant]} ${className ?? ""}`}>
      {children}
    </button>
  );
}
