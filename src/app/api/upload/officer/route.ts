import { writeFile, unlink } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
        return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(process.cwd(), "public/officer", fileName);

    await writeFile(filePath, buffer);
    return NextResponse.json({ fileName });
}

// export async function DELETE(req: NextRequest) {
//     const { fileName } = await req.json();
//     if (!fileName) {
//         return NextResponse.json({ error: "Nama file tidak ditemukan" }, { status: 400 });
//     }

//     const filePath = path.join(process.cwd(), "public/officer", fileName);
    
//     try {
//         await unlink(filePath);
//         return NextResponse.json({ message     : "File berhasil dihapus" });
//     } catch (error) {
//         return NextResponse.json({ error: "Gagal menghapus file", details: error }, { status: 500 });
//     }
// }

export async function DELETE(req: NextRequest) {
    const { fileName } = await req.json();
    if (!fileName) {
        return NextResponse.json({ error: "Nama file tidak ditemukan" }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), "public/officer", fileName);
    
    try {
        await unlink(filePath);
        return NextResponse.json({ message: "File berhasil dihapus" });
    } catch (error) {
        return NextResponse.json({ error: "Gagal menghapus file", details: error }, { status: 500 });
    }
}