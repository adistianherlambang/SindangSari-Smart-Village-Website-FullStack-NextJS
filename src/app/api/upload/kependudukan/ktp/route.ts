import { writeFile, unlink } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/firebase/clientApp';
import { doc, getDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';

// Handle Upload File KTP
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const nik = formData.get('nik') as string;

  if (!file || !nik) {
    return NextResponse.json({ error: 'File atau NIK tidak ditemukan' }, { status: 400 });
  }

  const originalName = (file as any).name || '';
  if (!originalName.includes('.')) {
    return NextResponse.json({ error: 'Nama file tidak valid' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = originalName.split('.').pop();
  const fileName = `${nik}.${ext}`;
  const filePath = path.join(process.cwd(), 'public/kependudukan/ktp', fileName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ fileName });
}

// Handle Delete File KTP / KK
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileName, type, pendudukId } = body;

    if (type === 'ktp') {
      if (!fileName) {
        return NextResponse.json({ error: 'Nama file tidak ditemukan' }, { status: 400 });
      }

      const filePath = path.join(process.cwd(), 'public/kependudukan/ktp', fileName);
      await unlink(filePath);

      return NextResponse.json({ message: 'File KTP berhasil dihapus' });
    }

    if (type === 'kk') {
      if (!pendudukId) {
        return NextResponse.json({ error: 'ID penduduk tidak diberikan' }, { status: 400 });
      }

      const pendudukRef = doc(db, 'penduduk', pendudukId);
      const pendudukSnap = await getDoc(pendudukRef);

      if (!pendudukSnap.exists()) {
        return NextResponse.json({ error: 'Penduduk tidak ditemukan' }, { status: 404 });
      }

      const { noKk, fotoKk } = pendudukSnap.data();

      // Hapus dokumen penduduk
      await deleteDoc(pendudukRef);

      // Cek apakah masih ada anggota keluarga
      const q = query(collection(db, 'p  enduduk'), where('noKk', '==', noKk));
      const snapshot = await getDocs(q);

      if (snapshot.empty && fotoKk) {
        const kkFilePath = path.join(process.cwd(), 'public', fotoKk);
        try {
          await unlink(kkFilePath);
          return NextResponse.json({
            message: 'Penduduk & file KK berhasil dihapus',
            kkFileDeleted: true,
            filePath: fotoKk,
          });
        } catch (err) {
          return NextResponse.json({
            message: 'Penduduk dihapus, tapi gagal hapus file KK',
            kkFileDeleted: false,
            error: String(err),
          });
        }
      }

      return NextResponse.json({
        message: 'Penduduk dihapus, file KK tetap disimpan karena masih digunakan',
        kkFileDeleted: false,
      });
    }

    return NextResponse.json({ error: 'Jenis penghapusan tidak valid' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal memproses penghapusan', details: String(error) }, { status: 500 });
  }
}
