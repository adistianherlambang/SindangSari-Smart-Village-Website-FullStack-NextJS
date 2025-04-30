'use client';
import { useState } from 'react';
import { db } from '@/firebase/clientApp';
import { collection, addDoc } from 'firebase/firestore';

export default function TestPage() {
  const [form, setForm] = useState({
    nik: '',
    nama: '',
    noKk: '',
    hubungan: '',
    tanggalLahir: '',
  });
  const [ktpFile, setKtpFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      ktpFileName, // hanya nama file, bukan URL
    });

    alert('Data berhasil disimpan!');
    setForm({ nik: '', nama: '', noKk: '', hubungan: '', tanggalLahir: '' });
    setKtpFile(null);
  };

  return (
    <main className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Form Data Penduduk</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {[{ name: 'nik', label: 'NIK' },
          { name: 'nama', label: 'Nama' },
          { name: 'noKk', label: 'No. KK' },
          { name: 'hubungan', label: 'Hubungan' },
          { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'date' }
        ].map(({ name, label, type }) => (
          <div key={name}>
            <label className="block mb-1 font-medium">{label}</label>
            <input
              type={type || 'text'}
              name={name}
              value={form[name as keyof typeof form]}
              onChange={handleChange}
              required
              className="w-full border px-3 py-2 rounded"
            />
          </div>
        ))}

        <div>
          <label className="block mb-1 font-medium">Upload Foto KTP</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setKtpFile(e.target.files?.[0] || null)}
            required
          />
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
          Simpan Data
        </button>
      </form>
    </main>
  );
}
