"use client"
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import { isDuplicateFotoKk } from "./fotoUtills";

interface DataKk {
  id: string;
  fotoKk: string;
}

export default function Home() {
  const [dataList, setDataList] = useState<DataKk[]>([]);

  // Ambil data Firestore saat komponen dimount
  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, "penduduk"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        fotoKk: doc.data().fotoKk,
      }));
      setDataList(data);
    };

    fetchData();
  }, []);

  // Fungsi dinamis berdasarkan fotoKk
  const handleDelete = async (fotoKk: string) => {
    const isDuplicate = await isDuplicateFotoKk(fotoKk);
    console.log(`fotoKk: ${fotoKk} => ${isDuplicate ? "true" : "false"}`);
  };

  return (
    <div>
      <h1>Data KK</h1>
      {dataList.map(item => (
        <div key={item.id} style={{ marginBottom: "1rem" }}>
          <p>ID: {item.id}</p>
          <p>fotoKk: {item.fotoKk}</p>
          <button onClick={() => handleDelete(item.fotoKk)}>Cek Duplikat</button>
        </div>
      ))}
    </div>
  );
}