"use client"

import React from "react";
import { useState } from "react";
import styles from "./header.module.css"
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer";

import NavLanding from "@/components/nav/navLanding";

export default function Header() {
  
    const {ref, inView} = useInView({triggerOnce: false})
    const [isHover, setIsHover] = useState(false);

    return(
      <motion.div
        style={{ backgroundImage: `url('/landingPage/header.png')`}}
        className={styles.headerContainer}
        ref={ref}
        initial={{ filter: "blur(50px)", opacity: 0}}
        animate={inView ? { filter: "blur(0px)", opacity: 1} : {}}
        transition={{ duration: 1.4, ease: "easeOut" }}
      >
        <NavLanding/>
        <div className={styles.header}>
          <p className={styles.headerTag}>Smart Village</p>  
          <div>
            <p className={styles.headerText}>Selamat Datang di Website Resmi Desa Sindangsari</p>
            <p className={styles.headerPar}>Sumber informasi terbaru tentang pemerintahan di Desa Sindangsari</p>
          </div>
          <Link href="#content" className={styles.headerBtn} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            <p className={styles.headerBtnText}>Jelajahi Sekarang</p>
            <Image className={`${styles.headerArrow} ${isHover ? styles.headerArrowHover : ""}`} src="/landingPage/arrow.png" alt="arrow" width={50} height={50} />
          </Link>
        </div>
      </motion.div>
    )
}