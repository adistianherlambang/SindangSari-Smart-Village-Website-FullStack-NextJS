"use client"

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, query, where, getDocs as getDocByKk, doc } from 'firebase/firestore';
import { db } from "@/firebase/clientApp";

export default function CountKTP() {

    const [ktp, setKtp] = useState<number>(0);
    const [kk, setKK] = useState<number>(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const snapshot = await getDocs(collection (db, 'penduduk'));
                const data = snapshot.docs.map(doc => doc.data());
                setKtp(data.length)

                const fetchKK = new Set(data.map(item => item.noKK));
                setKK(fetchKK.size)
            } catch {
                console.error('Error fetching penduduk', Error)
            }
        }
        fetchData()
    }, []);

    return{ktp, kk}
}