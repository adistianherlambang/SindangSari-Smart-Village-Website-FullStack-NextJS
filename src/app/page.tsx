import React from "react";
import Image from "next/image";

import BlogList from "@/components/blog/BlogList";
import Header from "@/components/landingPage/header";
import styles from "@/app/landing.module.css"
import Profile from "@/components/profile/profile";
import Officer from "@/components/profile/officer";
import Footer from "@/components/footer/footer";
import TestPage from "@/components/tes";
import TestPages from "@/components/tes2";

export default function Page() {
  
  return (
    <div>
      <Header />
      <div className={styles.content} id="content">
        <Profile />
        <div className={styles.jelajahiDesa}>
          <div className={styles.left}>
            Jelajah Desa
          </div>
          <div className={styles.right}>
            Melalui website ini Anda dapat menjelajahi segala hal yang terkait dengan Desa. Aspek pemerintahan, penduduk, demografi, potensi Desa, dan juga berita tentang Desa.
          </div>
        </div>  
        <Officer/>
        <BlogList />
      </div>
      <Footer />
    </div>
  );
}