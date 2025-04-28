"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./tes.module.css"
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { Loading } from "@geist-ui/core"

interface Officer {
    id: string;
    name: string;
    position: string;
    image: string;
}

export default function TestPage() {
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
    if (officer.length === 0) return <p style={{textAlign: "center"}}>Perangkat Desa Tidak Ditemukan</p>;

    return (
        <div className={styles.carouselContainer}>
            <div className={styles.carousel}>
                {officer.map((item) => (
                    <div key={item.id} className={styles.carouselItem}>
                        <div className={styles.card}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: "100%", height: "60%", objectFit: "cover" }}
                            />
                            <div className={styles.cardContent}>
                                <h3 className={styles.name}>{item.name}</h3>
                                <p className={styles.position}>{item.position}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
