'use client';

import { useState, useEffect } from 'react';
import { db } from '@/firebase/clientApp';
import {
  collection,
  addDoc,
  onSnapshot,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

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

import styles from './ktpForm.module.css'; // Import the CSS Module
import tables from "@/components/admin/table.module.css"
import input from '@/components/admin/input.module.css'

export interface FormData {
  nik: string;
  nama: string;
  noKk: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  golDarah: string;
  alamat: string;
  rtRw: string;
  kelDesa: string;
  kecamatan: string;
  agama: string;
  statusPerkawinan: string;
  pekerjaan: string;
  kewarganegaraan: string;
  hubungan: string;
  ktpFileName?: string;
}

export interface FormDataWithId extends FormData {
  id: string;
}

export function KTPFormTest() {
  const [form, setForm] = useState<FormData>({
    nik: '',
    nama: '',
    noKk: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    golDarah: '',
    alamat: '',
    rtRw: '',
    kelDesa: '',
    kecamatan: '',
    agama: '',
    statusPerkawinan: '',
    pekerjaan: '',
    kewarganegaraan: '',
    hubungan: '',
  });

  const [ktpFile, setKtpFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let ktpFileName = '';
    if (ktpFile) {
      const formData = new FormData();
      formData.append('file', ktpFile);
      formData.append('nik', form.nik);

      const res = await fetch('/api/upload/kependudukan/ktp', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        alert('Gagal upload foto KTP');
        return;
      }

      ktpFileName = data.fileName;
    }

    await addDoc(collection(db, 'penduduk'), {
      ...form,
      ktpFileName,
    });

    alert('Data berhasil disimpan!');
    setForm({
      nik: '',
      nama: '',
      noKk: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      golDarah: '',
      alamat: '',
      rtRw: '',
      kelDesa: '',
      kecamatan: '',
      agama: '',
      statusPerkawinan: '',
      pekerjaan: '',
      kewarganegaraan: '',
      hubungan: '',
    });
    setKtpFile(null);
  };

  return (
    <main className={input.container}>
      <form onSubmit={handleSubmit} className={styles.form}>

        <div>
          <label className={styles.label}>NIK</label>
          <input type="text" name="nik" value={form.nik} onChange={handleChange} required className={styles.input} />
        </div>

        <div>
          <label className={styles.label}>Nama</label>
          <input type="text" name="nama" value={form.nama} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.flexGap2}>
          <div className={styles.flex1}>
            <label className={styles.label}>Tempat Lahir</label>
            <input type="text" name="tempatLahir" value={form.tempatLahir} onChange={handleChange} required className={styles.input} />
          </div>
          <div className={styles.flex1}>
            <label className={styles.label}>Tanggal Lahir</label>
            <input type="date" name="tanggalLahir" value={form.tanggalLahir} onChange={handleChange} required className={styles.input} />
          </div>
        </div>

        <div className={styles.flexGap2}>
          <div className={styles.flex1}>
            <label className={styles.label}>Jenis Kelamin</label>
            <select disabled value={form.jenisKelamin} onChange={handleChange} required className={styles.select}>
              <option value="" style={{color: "gray", fontSize: "14px"}}>Jenis Kelamin</option>
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>
          <div className={styles.flex1}>
            <label className={styles.label}>Golongan Darah</label>
            <select name="golDarah" value={form.golDarah} onChange={handleChange} required className={styles.select}>
              <option value="">Pilih</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
          </div>
        </div>

        <div>
            <label className={styles.label}>Alamat</label>
            <input placeholder="Alamat" type="text" name="alamat" value={form.alamat} onChange={handleChange} required className={styles.input} />
        </div>

        <div className={styles.flexGap2}>
          <input type="text" name="rtRw" value={form.rtRw} onChange={handleChange} required placeholder="RT/RW" className={`${styles.input} ${styles.w13}`} />
          <input type="text" name="kelDesa" value={form.kelDesa} onChange={handleChange} required placeholder="Kel/Desa" className={`${styles.input} ${styles.w13}`} />
          <input type="text" name="kecamatan" value={form.kecamatan} onChange={handleChange} required placeholder="Kecamatan" className={`${styles.input} ${styles.w13}`} />
        </div>

        {[
          { name: 'agama', label: 'Agama' },
          { name: 'statusPerkawinan', label: 'Status Perkawinan' },
          { name: 'pekerjaan', label: 'Pekerjaan' },
          { name: 'kewarganegaraan', label: 'Kewarganegaraan' },
          { name: 'noKk', label: 'Nomor KK' },
        ].map(({ name, label }) => (
          <div key={name}>
                <label className={styles.label}>{label}</label>
            <input type="text" placeholder={label} name={name} value={form[name as keyof FormData]} onChange={handleChange} required className={styles.input} />
          </div>
        ))}

        <div className={styles.flex1}>
          <label className={styles.label}>Hubungan</label>
          <select name='hubungan' value={form.hubungan} onChange={handleChange} required className={styles.input}>
            <option disabled>Pilih Hubungan</option>
            <option>Kepala Keluarga</option>
            <option>Suami</option>
            <option>Istri</option>
            <option>Anak</option>
            <option>Menantu</option>
            <option>Mertua</option>
            <option>Orang Tua</option>
            <option>Pembantu</option>
            <option>Famili lain</option>
          </select>
        </div>
        <div>
          <label className={input.inputWrapper}> {ktpFile ? ktpFile.name : "📁 Upload Foto KTP"}
          <input className={input.inputHidden} type="file" accept="image/*" onChange={(e) => setKtpFile(e.target.files?.[0] || null)} required />
          </label>
        </div>

        <button type="submit" className={input.button} style={{fontSize: "1rem"}}>
          Simpan Data
        </button>
      </form>
    </main>
  );
}

export function KTPTableTest() {
    const [data, setData] = useState<FormDataWithId[]>([]);
    const [searchNik, setSearchNik] = useState('');
    const [searchKk, setSearchKk] = useState('');
    const [searchNama, setSearchNama] = useState('');
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'penduduk'), (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as FormDataWithId[];
        setData(docs);
      });
  
      return () => unsubscribe();
    }, []);
  
    const filteredData = data.filter(item => {
      const nikMatch = item.nik.toLowerCase().includes(searchNik.toLowerCase());
      const kkMatch = item.noKk.toLowerCase().includes(searchKk.toLowerCase());
      const namaMatch = item.nama.toLowerCase().includes(searchNama.toLowerCase());
  
      return nikMatch && kkMatch && namaMatch;
    });
  
    const handleDelete = async (id: string) => {
      await deleteDoc(doc(db, 'penduduk', id));
    };
  
    return (
      <div className={input.container}>
        <h2 className={input.formTitle}>Data Penduduk</h2>
        <div className={styles.topSection} style={{ display: 'flex', gap: '1rem', flexDirection: 'column', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              placeholder="Cari NIK"
              className={input.input}
              value={searchNik}
              onChange={(e) => setSearchNik(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cari No. KK"
              className={input.input}
              value={searchKk}
              onChange={(e) => setSearchKk(e.target.value)}
            />
            <input
              type="text"
              placeholder="Cari Nama"
              className={input.input}
              value={searchNama}
              onChange={(e) => setSearchNama(e.target.value)}
            />
          </div>
          <AlertDialog>
            <AlertDialogTrigger style={{ backgroundColor: "#CFF24D", color: "black" }} className={input.normalButton}>
              Tambah Penduduk
            </AlertDialogTrigger>
            <AlertDialogContent style={{ overflow: "auto", maxHeight: "70vh", width: "50rem", minWidth: "50rem", scrollbarWidth: "none", padding: "3rem" }}>
              <style>
                {`
                  ::-webkit-scrollbar {
                    display: none;
                  }
                  `}
              </style>
              <AlertDialogHeader>
                <AlertDialogTitle className={input.formTitle}>Form Data Penduduk</AlertDialogTitle>
                <KTPFormTest />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel style={{ width: "100%" }}>Batal</AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div>
          <h2>{filteredData.length}</h2>
        </div>
        <table className={tables.table}>
          <thead>
            <tr className={styles.tableHeadRow}>
              <th>No</th>
              <th>NIK</th>
              <th>No KK</th>
              <th>Nama</th>
              <th>Alamat</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((d, i) => (
                <tr key={d.id}>
                  <td>{i + 1}</td>
                  <td>{d.nik}</td>
                  <td>{d.noKk}</td>
                  <td>{d.nama}</td>
                  <td>{d.alamat}</td>
                  <td>
                    {d.ktpFileName ? (
                      <a
                        href={`/kependudukan/ktp/${d.ktpFileName}`}
                        target="_blank"
                        className={styles.downloadLink}
                        download
                      >
                        Download
                      </a>
                    ) : (
                      <span className={styles.belumUpload}>Belum Upload</span>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger className={tables.deleteButton}>Hapus</AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Data Penduduk?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Data penduduk yang dipilih akan dihapus secara permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction style={{ backgroundColor: "red" }} onClick={() => handleDelete(d.id)}>
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-4">
                  Tidak ada data yang cocok.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    );
  }