"use client";

import styles from "./navLanding.module.css";
import Link from "next/link";
import { useState } from "react";

export default function NavLanding() {
    const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
        <nav className={`${styles.navbar} ${isOpen ? styles.navOpen : ""}`}>
            <a className={styles.logo} href="/">
                Pemerintah Desa<br />Sindang Sari
            </a>
            <div className={styles.menu}>
                <Link href="/">Home</Link>
                <Link href="/">Profil Desa</Link>
                <Link href="/">Agenda & Berita</Link>
                <Link href="/login" legacyBehavior>
                    <a className={styles.loginButton}>Login Admin</a>
                </Link>
            </div>
            <nav className={styles.menuMobile}>
                <button className={styles.burger} onClick={() => setIsOpen(!isOpen)}>
                    <div className={`${styles.line} ${isOpen ? styles.lineOne : ""}`}></div>
                    <div className={`${styles.line} ${isOpen ? styles.lineTwo : ""}`}></div>
                </button>
            </nav>
        </nav>
        <div className={`${styles.mobileMenu} ${isOpen ? styles.menuOpen : styles.menuDisable}`}>
            <Link href="/">Home</Link>
            <div className={styles.lineGap}></div>
            <Link href="/">Profil Desa</Link>
            <div className={styles.lineGap}></div>
            <Link href="/">Agenda & Berita</Link>
            <div className={styles.lineGap}></div>
            <Link href="/login" className={`${styles.loginButton} ${styles.logGap}`}>Login Admin</Link>
        </div>
    </div>
  );
}
