import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import styles from "./Layout.module.scss";

export function Layout() {
  return (
    <div className={styles.shell}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
