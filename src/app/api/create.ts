export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Masuk ke handler'); // <-- Debug 1

  if (req.method !== 'POST') {
    console.log('Method bukan POST'); // <-- Debug 2
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Body:', req.body); // <-- Debug 3

    // Simulasi penyimpanan data
    // Misalnya ke Firestore:
    // await firestore.collection('penduduk').add(req.body);

    return res.status(200).json({ message: 'Data berhasil dibuat' });
  } catch (error) {
    console.error('Terjadi error saat create:', error); // <-- Debug 4
    return res.status(500).json({ message: 'Gagal membuat data' });
  }
}