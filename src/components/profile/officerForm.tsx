import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import styles from "./officerForm.module.css";
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
} from "@/components/ui/alert-dialog";

type Officer = {
  id?: string;
  name: string;
  position: string;
  image: string;
};

export default function OfficerForm() {
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [officer, setOfficers] = useState<Officer[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    const querySnapshot = await getDocs(collection(db, "officer"));
    const officerData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Officer[];
    setOfficers(officerData);
    setCurrentPage(1);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/upload/officer", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Error mengunggah gambar");
      return null;
    }

    const data = await response.json();
    return `/officer/${data.fileName}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !position || !imageFile) {
      alert("Semua field harus diisi!");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    try {
      await addDoc(collection(db, "officer"), {
        name,
        position,
        image: imageUrl,
      });
      setName("");
      setPosition("");
      setImageFile(null);
      fetchOfficers();
    } catch (error) {
      console.error("Error menambahkan officer:", error);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      await deleteDoc(doc(db, "officer", id));
      await fetch("/api/upload/officer", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: imageUrl.split("/").pop() }),
      });
      fetchOfficers();
    } catch (error) {
      console.error("Gagal Menghapus Perangkat Desa:", error);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOfficers = officer.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(officer.length / itemsPerPage);

  const renderPagination = () => {
    const pagination = [];

    if (currentPage > 3) pagination.push('...');

    for (let i = Math.max(currentPage - 1, 1); i <= Math.min(currentPage + 1, totalPages); i++) {
      pagination.push(i);
    }

    if (currentPage < totalPages - 2) pagination.push('...');

    return pagination;
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.formTitle}>Tambah Perangkat Desa</p>
        <input
          type="text"
          placeholder="Nama Perangkat Desa"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.input}
        />
        <input
          type="text"
          placeholder="Jabatan"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className={styles.input}
        />
        <label className={styles.inputWrapper}>
          {imageFile ? imageFile.name : "📁 Pilih gambar..."}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className={styles.inputHidden}
          />
        </label>
        <button type="submit" className={styles.button}>
          Tambah Perangkat Desa
        </button>
      </form>

      <table className={tables.table}>
        <thead>
          <tr>
            <th>No.</th>
            <th>Nama</th>
            <th>Jabatan</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {currentOfficers.map((officer, index) => (
            <tr key={officer.id}>
              <td style={{maxWidth: "1rem", width: "0.5rem"}}>{index + 1 + (currentPage - 1) * itemsPerPage}.</td>
              <td>{officer.name}</td>
              <td>{officer.position}</td>
              <td>
                <AlertDialog>
                  <AlertDialogTrigger className={styles.deleteButton}>
                    Hapus
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Anda yakin ingin menghapus?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Data perangkat desa yang dipilih akan dihapus secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        style={{ backgroundColor: "red" }}
                        onClick={() => handleDelete(officer.id!, officer.image)}
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              color: "#000",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            &lt; Previous
          </button>
        )}

        {renderPagination().map((page, index) => (
          <button
            key={index}
            onClick={() => {
              if (page !== '...') setCurrentPage(page as number);
            }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: page === currentPage ? "#2563eb" : "#e5e7eb",
              color: page === currentPage ? "#fff" : "#000",
              border: "none",
              borderRadius: "0.25rem",
              cursor: page === '...' ? "not-allowed" : "pointer",
            }}
          >
            {page}
          </button>
        ))}

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#e5e7eb",
              color: "#000",
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
            }}
          >
            Next &gt;
          </button>
        )}
      </div>
    </div>
  );
}
