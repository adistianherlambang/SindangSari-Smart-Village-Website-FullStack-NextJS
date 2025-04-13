"use client"

import { useState, useEffect } from "react"
import { db } from "@/firebase/clientApp";
import { collection, getDocs } from "firebase/firestore";

import styles from "./profile.module.css"

interface ProfileData {
  id: string;
  title: string;
  desc: string;
}

export default function Profile() {
    const  [profiles, setProfiles] = useState<ProfileData[]>([]);
    useEffect(() => {
        const fetchProfiles = async () => {
          try {
            const querySnapshot = await getDocs(collection(db, "profile"));
            const fetchedProfiles = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              title: doc.data().title || "",
              desc: doc.data().desc || "",
            }));
    
            setProfiles(fetchedProfiles);
          } catch (error) {
            console.error("Error fetching profiles:", error);
          }
        };
    
        fetchProfiles();
      }, []);

    return(
        <div>
            {profiles.map((profile) => (
                <div className={styles.container} key={profile.id}>
                    <p>Profil Desa Sindang Sari</p>
                    <p className={styles.title}>{profile.title}</p>
                    <p>{profile.desc}</p>
                </div>
            ))}
        </div>
    )
}