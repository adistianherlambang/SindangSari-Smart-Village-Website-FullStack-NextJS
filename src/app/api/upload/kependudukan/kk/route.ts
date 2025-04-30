import { writeFile } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'File tidak ditemukan' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(process.cwd(), 'public/kependudukan/kk', fileName);

  await writeFile(filePath, buffer);
  return NextResponse.json({ fileName });
}
