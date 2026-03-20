import type { ReactNode } from "react";

import styles from "./layout.module.css";
import Header from "./Header";

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <header className={styles.header} role="banner">
        <Header />
      </header>
      <main className={styles.main} role="main">
        {children}
      </main>
      <footer className={styles.footer} role="contentinfo">
        <p>© AutoGrab@2026</p>
      </footer>
    </div>
  );
};

export default Layout;
