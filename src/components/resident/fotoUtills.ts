// utils/fotoKkUtils.ts
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

// Cek apakah nilai 'fotoKk' duplikat
export const isDuplicateFotoKk = async (fotoKk: string): Promise<boolean> => {
  const q = query(collection(db, "dataKk"), where("fotoKk", "==", fotoKk));
  const snapshot = await getDocs(q);
  return snapshot.size > 1;
};