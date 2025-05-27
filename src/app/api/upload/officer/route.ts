import type { NextApiRequest, NextApiResponse } from "next";
import formidable, { File } from "formidable";
import fs from "fs";
import path from "path";

// Nonaktifkan bodyParser bawaan Next.js
export const config = {
  api: {
    bodyParser: false,
  },
};

// Pastikan folder tujuan ada
const uploadDir = path.join(process.cwd(), "public/officer");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const form = new formidable.IncomingForm({
        uploadDir,
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
      });

      form.parse(req, (err, fields, files) => {
        if (err) {
          console.error("Form parse error:", err);
          return res.status(500).json({ error: "Gagal parsing form" });
        }

        const file = files.file as File;
        if (!file) {
          return res.status(400).json({ error: "File tidak ditemukan" });
        }

        return res.status(200).json({ fileName: path.basename(file.filepath) });
      });
    } catch (err) {
      console.error("Upload exception:", err);
      return res.status(500).json({ error: "Terjadi kesalahan server" });
    }

  } else if (req.method === "DELETE") {
    try {
      const { fileName } = JSON.parse(req.body || "{}");

      if (!fileName) return res.status(400).json({ error: "Nama file tidak ditemukan" });

      const filePath = path.join(uploadDir, fileName);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Gagal hapus:", err);
          return res.status(500).json({ error: "Gagal menghapus file" });
        }
        return res.status(200).json({ message: "File berhasil dihapus" });
      });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ error: "Terjadi kesalahan saat delete" });
    }

  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}