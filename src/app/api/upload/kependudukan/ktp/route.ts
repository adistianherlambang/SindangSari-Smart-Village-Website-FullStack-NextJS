import { writeFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;
  const nik = formData.get('nik') as string;

  if (!file || !nik) {
    return NextResponse.json({ error: 'File atau NIK tidak ditemukan' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const ext = file.name.split('.').pop();
  const fileName = `${nik}.${ext}`;
  const filePath = path.join(process.cwd(), 'public/kependudukan/ktp', fileName);

  await writeFile(filePath, buffer);

  return NextResponse.json({ fileName });
}
