"use client";

import { useEffect, useState } from "react";
import { auth } from "@/firebase/clientApp";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import styles from "./admin.module.css"
import { collection, getDocs, updateDoc, query, where, getDocs as getDocByKk, doc } from 'firebase/firestore';
import { db } from "@/firebase/clientApp";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import BlogList from "@/components/blog/BlogList";
import BlogForm from "@/components/blog/BlogForm";
import ProfileForm from "@/components/profile/profileForm";
import OfficerForm from "@/components/profile/officerForm";
import Footer from "@/components/footer/footer";
import ResidentForm from "@/components/resident/ktpForm";
import { KTPFormTest, KTPTableTest } from "@/components/resident/ktpFormTest";
import KKTableTest, {TotalKK  } from "@/components/resident/kk";
import CountKTP from "@/components/count/count";


export default function AdminPage() {

  const [isOpen, setIsOpen] = useState(false)
  const [activeComponent, setActiveComponent] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  const { kk, ktp } = CountKTP()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push("/login")
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  return (
    <div className={`${styles.container} ${isOpen ? styles.shifted : ""}`}>
      <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
        <p className={styles.sidebarLogo}>Pemerintah Desa<br/> Sindang Sari</p>
        <Accordion type="single" collapsible>
          <div style={{cursor: "pointer"}} onClick={() => setActiveComponent(null)} className={styles.sidebarMenu}>
            <svg className={styles.sidebarImg} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.33325 28V12L15.9999 4L26.6666 12V28H18.6666V18.6667H13.3333V28H5.33325Z" fill="#CFF24D"/>
            </svg> 
            Beranda
          </div>
          <AccordionItem  value="item-1">
            <AccordionTrigger style={{cursor: "pointer"}} className={styles.sidebarMenu}>
              <div>
                <svg className={styles.sidebarImg} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.3334 12H14.6667V9.33332H17.3334M17.3334 22.6667H14.6667V14.6667H17.3334M16.0001 2.66666C14.2491 2.66666 12.5153 3.01153 10.8976 3.6816C9.27996 4.35166 7.81011 5.33378 6.57199 6.5719C4.07151 9.07238 2.66675 12.4638 2.66675 16C2.66675 19.5362 4.07151 22.9276 6.57199 25.4281C7.81011 26.6662 9.27996 27.6483 10.8976 28.3184C12.5153 28.9884 14.2491 29.3333 16.0001 29.3333C19.5363 29.3333 22.9277 27.9286 25.4282 25.4281C27.9287 22.9276 29.3334 19.5362 29.3334 16C29.3334 14.249 28.9885 12.5152 28.3185 10.8975C27.6484 9.27987 26.6663 7.81001 25.4282 6.5719C24.1901 5.33378 22.7202 4.35166 21.1025 3.6816C19.4849 3.01153 17.751 2.66666 16.0001 2.66666Z" fill="#CFF24D"/>
                </svg> 
              </div>
              <p className="w-full">Informasi Desa</p>
            </AccordionTrigger>
            <AccordionContent style={{cursor: "pointer"}} onClick={() => setActiveComponent("Profil")} className={styles.sidebarMenuAccordion}>
              Profil Desa
            </AccordionContent>
            <div className="w-full h-[1px] bg-black-500"/>
            <AccordionContent style={{cursor: "pointer"}} onClick={() => setActiveComponent("Berita")} className={styles.sidebarMenuAccordion}>
              Berita & Kegiatan
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger style={{cursor: "pointer"}} className={styles.sidebarMenu}>
              <div>
                <svg className={styles.sidebarImg} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 28C14 28 12 28 12 26C12 24 14 18 22 18C30 18 32 24 32 26C32 28 30 28 30 28H14ZM22 16C23.5913 16 25.1174 15.3679 26.2426 14.2426C27.3679 13.1174 28 11.5913 28 10C28 8.4087 27.3679 6.88258 26.2426 5.75736C25.1174 4.63214 23.5913 4 22 4C20.4087 4 18.8826 4.63214 17.7574 5.75736C16.6321 6.88258 16 8.4087 16 10C16 11.5913 16.6321 13.1174 17.7574 14.2426C18.8826 15.3679 20.4087 16 22 16ZM10.432 28C10.1356 27.3756 9.98779 26.6911 10 26C10 23.29 11.36 20.5 13.872 18.56C12.6184 18.1729 11.312 17.9839 10 18C2 18 0 24 0 26C0 28 2 28 2 28H10.432ZM9 16C10.3261 16 11.5979 15.4732 12.5355 14.5355C13.4732 13.5979 14 12.3261 14 11C14 9.67392 13.4732 8.40215 12.5355 7.46447C11.5979 6.52678 10.3261 6 9 6C7.67392 6 6.40215 6.52678 5.46447 7.46447C4.52678 8.40215 4 9.67392 4 11C4 12.3261 4.52678 13.5979 5.46447 14.5355C6.40215 15.4732 7.67392 16 9 16Z" fill="#CFF24D"/>
                </svg>
              </div>
              <p className="w-full">Kependudukan</p>
            </AccordionTrigger>
            <AccordionContent style={{cursor: "pointer"}} onClick={() => setActiveComponent("ktp")} className={styles.sidebarMenuAccordion}>
              KTP
            </AccordionContent>
            <div className="w-full h-[1px] bg-black-500"/>
            <AccordionContent style={{cursor: "pointer"}} onClick={() => setActiveComponent("kk")} className={styles.sidebarMenuAccordion}>
              KK
            </AccordionContent>
          </AccordionItem>
          <div style={{cursor: "pointer"}} onClick={() => setActiveComponent("Surat")} className={styles.sidebarMenu}>
            <svg className={styles.sidebarImg} width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.49991 5H22.4999C23.5839 5 24.4572 5 25.1666 5.05733C25.8946 5.11733 26.5346 5.244 27.1266 5.54533C28.068 6.0245 28.8335 6.78952 29.3132 7.73067C29.6146 8.32267 29.7399 8.96267 29.7999 9.69067C29.8088 9.79733 29.8159 9.90711 29.8212 10.02C29.8613 10.166 29.8677 10.3192 29.8399 10.468C29.8572 11.0147 29.8572 11.64 29.8572 12.3573V19.6427C29.8572 20.7267 29.8572 21.6013 29.7999 22.3093C29.7399 23.0373 29.6132 23.6773 29.3119 24.2693C28.8327 25.2108 28.0677 25.9763 27.1266 26.456C26.5346 26.7573 25.8946 26.8827 25.1666 26.9427C24.4572 27 23.5839 27 22.4999 27H9.49991C8.41591 27 7.54258 27 6.83325 26.9427C6.10525 26.8827 5.46524 26.756 4.87324 26.4547C3.9323 25.9753 3.1673 25.2103 2.68791 24.2693C2.38658 23.6773 2.26124 23.0373 2.20124 22.3093C2.14258 21.6013 2.14258 20.7267 2.14258 19.6427V12.3573C2.14258 11.64 2.14258 11.0147 2.15991 10.468C2.13214 10.3192 2.13852 10.166 2.17858 10.02C2.1848 9.90622 2.19236 9.79689 2.20124 9.692C2.25991 8.96267 2.38658 8.32267 2.68791 7.73067C3.16707 6.78923 3.9321 6.02374 4.87324 5.544C5.46524 5.24267 6.10525 5.11733 6.83325 5.05733C7.54258 5 8.41591 5 9.49991 5ZM27.7999 9.788C27.7492 9.224 27.6599 8.892 27.5306 8.63867C27.2432 8.07388 26.7844 7.6146 26.2199 7.32667C25.9559 7.19333 25.6079 7.1 25.0026 7.05067C24.3866 7.00133 23.5932 7 22.4572 7H9.54258C8.40658 7 7.61458 7 6.99591 7.05067C6.39191 7.1 6.04391 7.19333 5.78124 7.32667C5.21626 7.61437 4.75695 8.07368 4.46924 8.63867C4.34124 8.892 4.25058 9.224 4.19991 9.788L13.0052 15.6587C14.3519 16.5573 14.8226 16.852 15.3012 16.9667C15.7605 17.0767 16.2393 17.0767 16.6986 16.9667C17.1786 16.852 17.6466 16.5573 18.9959 15.6587L27.7999 9.788Z" fill="#CFF24D"/>
            </svg>
            Surat Menyurat
          </div>
        </Accordion>

      </div>

      <div className={styles.nav}>
        <button onClick={() => {setIsOpen(!isOpen)}} className={styles.sidebarIcon}>
          <svg width="45" height="46" viewBox="0 0 45 46" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.875 7.0625V38.9375M5.625 18.125C5.625 13.925 5.625 11.825 6.4425 10.22C7.16154 8.80885 8.30885 7.66154 9.72 6.9425C11.325 6.125 13.425 6.125 17.625 6.125H27.375C31.575 6.125 33.675 6.125 35.28 6.9425C36.6912 7.66154 37.8385 8.80885 38.5575 10.22C39.375 11.825 39.375 13.925 39.375 18.125V27.875C39.375 32.075 39.375 34.175 38.5575 35.78C37.8385 37.1912 36.6912 38.3385 35.28 39.0575C33.675 39.875 31.575 39.875 27.375 39.875H17.625C13.425 39.875 11.325 39.875 9.72 39.0575C8.30885 38.3385 7.16154 37.1912 6.4425 35.78C5.625 34.175 5.625 32.075 5.625 27.875V18.125Z" stroke={isOpen ? "#CFF24D": "#FFFFFF"} strokeWidth={isOpen ? "5" : "3"} strokeLinecap="round" strokeLinejoin="round"/>
          </svg>

        </button>
        <div className={styles.userContainer}>
          {user && <p className={styles.user}>Halo, {user.email}</p>}
          <button onClick={handleLogout} className={styles.button}>
            Logout
          </button>
        </div>
      </div>
      {activeComponent ?
        <div className={styles.contentContainer}>
          {activeComponent === "Profil" && (
            <>
              <ProfileForm />
              <OfficerForm />
            </>
          )}
          {activeComponent === "Berita" && <BlogForm/>}
          {activeComponent === "ktp" && <><KTPTableTest/> </>}
          {activeComponent === "kk" && <KKTableTest/>}
          {/* {activeComponent === "Kependudukan" && <ResidentForm/>} */}
        </div>
        : <div>jumlah ktp : {ktp}, jumlah kk: {kk}</div>
      }
      <div style={{height: "10rem"}}></div>
      <Footer/>
    </div>
  );
}
