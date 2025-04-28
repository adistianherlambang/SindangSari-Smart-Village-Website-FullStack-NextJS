"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import styles from "./officer.module.css"
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { Loading } from "@geist-ui/core"

interface Officer {
    id: string;
    name: string;
    position: string;
    image: string;
}

export default function OfficerList() {
    const [officer, setOfficer] = useState<Officer[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchOfficer = async () => {
            try {
                const querySnapshots = await getDocs(collection(db, "officer"));
                const officerData: Officer[] = querySnapshots.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        name: data.name || "Tanpa Nama",
                        position: data.position || "Tanpa Posisi",
                        image: data.image || ""
                    }
                });
                setOfficer(officerData)
            } catch(error) {
                console.error("Error fetch officer :", error)
            } finally {
                setLoading(false)
            }
        };

        fetchOfficer();
    }, []);

    if (loading) return <Loading>Loading</Loading>;
    if (officer.length === 0) return <p className={styles.textCenter} style={{textAlign: "center"}}>Perangkat Desa Tidak Ditemukan</p>;

    return (
        <div>
            <div className={styles.compContainer}>
                <p>Struktur dan Tugas Perangkat Desa</p>
                <div className={styles.container}>
                    <p className={styles.title}>Perangkat Desa<br/>Sindangsari</p>
                    <p className={styles.desc}>
                        Perangkat Desa Sindangsari yang selalu siap melayani masyarakat dengan sepenuh hati serta berkomitmen dalam membangun desa secara berkelanjutan, dengan dedikasi tinggi, tanggung jawab penuh, dan semangat kebersamaan demi kesejahteraan seluruh warga.
                    </p>
                </div>
            </div>

            <div className={styles.carouselContainer}>
                <Carousel className={styles.carousel}  options={{draggable: false}}>
                    <CarouselContent className={styles.carouselContent}>
                        {officer.map((office, index) => (
                            <CarouselItem className={styles.carouselItem} key={index}>
                                <div key={index} className={styles.card} style={{
                                    backgroundImage: `url('${office.image}')`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}>
                                    <CardContent className={styles.cardContent}>
                                        <span className={styles.name}>{office.name}</span>
                                        <p className={styles.position}>{office.position}</p>
                                    </CardContent>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                    {/* <CarouselPrevious className={styles.arrow} />
                    <CarouselNext className={styles.arrow}/> */}
                </Carousel>
            </div>
        </div>
    )
}
