import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

// Helper untuk parsing form
const parseForm = async (req: NextApiRequest): Promise<{ fields: any; files: any }> =>
  new Promise((resolve, reject) => {
    const form = formidable({
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      uploadDir: './public/uploads',
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      resolve({ fields, files });
    });
  });

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { fields, files } = await parseForm(req);
    console.log('Fields:', fields);
    console.log('Files:', files);

    // Simpan info atau kirim ke database kalau perlu
    res.status(200).json({ message: 'Upload berhasil', data: { fields, files } });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ message: 'Upload gagal', error });
  }
}