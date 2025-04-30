'use client';
import { useEffect, useState } from 'react';
import { db } from '@/firebase/clientApp';
import { collection, getDocs, updateDoc, query, where, getDocs as getDocByKk, doc } from 'firebase/firestore';
import input from "@/components/admin/input.module.css"
import tables from "@/components/admin/table.module.css"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function KKTableTest() {
  type Person = {
    id: string;
    nik: string;
    nama: string;
    noKk: string;
    hubungan: string;
    tanggalLahir: string;
    fotoKk?: string;
  };

  const [data, setData] = useState<Person[]>([]);
  const [selectedKK, setSelectedKK] = useState<string | null>(null);
  const [fotoKkFiles, setFotoKkFiles] = useState<{ [kk: string]: File | null }>({});
  const [fotoKkUrls, setFotoKkUrls] = useState<{ [kk: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'penduduk'));
      const results: Person[] = snapshot.docs.map((docItem) => ({
        ...(docItem.data() as Person),
        id: docItem.id,
      }));
      setData(results);

      // Simpan URL lokal untuk KK yang sudah ada
      const kkMap: { [kk: string]: string } = {};
      results.forEach((d) => {
        if (d.fotoKk) kkMap[d.noKk] = d.fotoKk;
      });
      setFotoKkUrls(kkMap);
    };

    fetchData();
  }, []);

  const uniqueKK = Array.from(new Set(data.map((item) => item.noKk)));

  const handleFotoKkFileChange = (e: React.ChangeEvent<HTMLInputElement>, noKk: string) => {
    setFotoKkFiles((prev) => ({ ...prev, [noKk]: e.target.files?.[0] || null }));
  };

  const handleUploadFotoKk = async (noKk: string) => {
    const file = fotoKkFiles[noKk];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/upload/kependudukan/kk', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      alert('Upload gagal');
      return;
    }

    const dataRes = await response.json();
    const fileName = dataRes.fileName;
    const fileUrl = `/kependudukan/kk/${fileName}`;

    // Update semua penduduk dengan noKk yang sama
    const q = query(collection(db, 'penduduk'), where('noKk', '==', noKk));
    const snapshot = await getDocByKk(q);
    snapshot.forEach(async (docItem) => {
      await updateDoc(doc(db, 'penduduk', docItem.id), { fotoKk: fileUrl });
    });

    setFotoKkUrls((prev) => ({ ...prev, [noKk]: fileUrl }));
    alert('Foto KK berhasil diupload!');
  };

  const handleDownloadFotoKk = (url: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = url.split('/').pop() || 'kk.jpg';
    a.click();
  };

  return (
    <main className={input.container}>
      <h1 className="text-2xl font-bold mb-4">Daftar Kartu Keluarga</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 text-left">No</th>
              <th className="p-2 text-left">Nomor KK</th>
              <th className="p-2 text-left">Jumlah Anggota</th>
              <th className='p-2 text-left'>Kepala Keluarga</th>
              <th className="p-2 text-left">Foto</th>
              <th className="p-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {uniqueKK.map((kk, index) => {
              const kkData = data.filter((item) => item.noKk === kk);
              const fotoKkUrl = fotoKkUrls[kk];

              return (
                <tr key={kk} className={tables.table}>
                  <td className="p-2">{index + 1}</td>
                  <td className="p-2">{kk}</td>
                  <td className="p-2">{kkData.length}</td>
                  <td className='p-2'>{kkData.find((item) => item.hubungan === 'Kepala Keluarga')?.nama || '-'}</td>
                  <td className="p-2">
                    {fotoKkUrl ? (
                      <button
                        onClick={() => handleDownloadFotoKk(fotoKkUrl)}
                        className="text-blue-600 underline"
                      >
                        Download KK
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFotoKkFileChange(e, kk)}
                        />
                        <button
                          onClick={() => handleUploadFotoKk(kk)}
                          className="bg-blue-600 text-white px-2 rounded"
                        >
                          Upload
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="p-2">
                    <AlertDialog>
                      <AlertDialogTrigger onClick={() => setSelectedKK(selectedKK === kk ? null : kk)}>Lihat Anggota</AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Anggota KK</AlertDialogTitle>
                            <div className="mt-6">
                              <h2 className="text-xl font-semibold mb-2">Anggota KK: {selectedKK}</h2>
                              <div className="overflow-x-auto">
                                <table className="w-full border border-gray-300">
                                  <thead className="bg-gray-100">
                                    <tr>
                                      <th className="p-2 text-left">NIK</th>
                                      <th className="p-2 text-left">Nama</th>
                                      <th className="p-2 text-left">Tanggal Lahir</th>
                                      <th className="p-2 text-left">Hubungan</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {data
                                      .filter((item) => item.noKk === selectedKK)
                                      .map((item) => (
                                        <tr key={item.nik} className="border-t">
                                          <td className="p-2">{item.nik}</td>
                                          <td className="p-2">{item.nama}</td>
                                          <td className="p-2">{item.tanggalLahir}</td>
                                          <td className="p-2">{item.hubungan}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </AlertDialogHeader>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </main>
  );
}
