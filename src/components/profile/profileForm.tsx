"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/clientApp";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import styles from "./profileForm.module.css"

interface ProfileData {
  id: string;
  title: string;
  desc: string;
}

export default function ProfileForm() {
  const [profiles, setProfiles] = useState<ProfileData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<ProfileData | null>(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [open, setOpen] = useState(false); // State untuk mengontrol dialog

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

  const handleOpen = (profile: ProfileData) => {
    setSelectedProfile(profile);
    setTitle(profile.title);
    setDesc(profile.desc);
    setOpen(true); // Buka dialog
  };

  const handleSave = async () => {
    if (!selectedProfile) return;

    try {
      const profileRef = doc(db, "profile", selectedProfile.id);
      await updateDoc(profileRef, {
        title: title,
        desc: desc,
      });

      setProfiles((prev) =>
        prev.map((p) => (p.id === selectedProfile.id ? { ...p, title, desc } : p))
      );

      setOpen(false); // Tutup dialog setelah update berhasil
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Informasi Desa {`>`} Profile List</h2>
      <ul className={styles.profileList}>
        {profiles.map((profile) => (
          <li key={profile.id} className={styles.profileItem}>
            <div className={styles.profileText}>
              <h3 className={styles.profileTitle}>{profile.title}</h3>
              <p>{profile.desc}</p>
            </div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className={styles.editButton} onClick={() => handleOpen(profile)}>
                  Edit Profil Desa
                </Button>
              </DialogTrigger>
              <DialogContent className={styles.dialogContent}>
                <DialogHeader>
                  <DialogTitle>Edit profil desa</DialogTitle>
                  <DialogDescription>
                    Ubah profil desa disini. Klik simpan jika sudah selesai.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="title" className={styles.label}>
                      Nama
                    </Label>
                    <Input
                      id="title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="desc" className={styles.label}>
                      Deskripsi
                    </Label>
                    <Input
                      id="desc"
                      value={desc}
                      onChange={(e) => setDesc(e.target.value)}
                      className={styles.input}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" onClick={handleSave}>
                    Simpan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </li>
        ))}
      </ul>
    </div>
  );
}
