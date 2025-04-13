"use client";

import { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import styles from "./BlogForm.module.css";

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


type Blog = {
  id?: string;
  title: string;
  article: string;
  image: string;
};

export default function BlogForm() {
  const [title, setTitle] = useState("");
  const [article, setArticle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    const querySnapshot = await getDocs(collection(db, "blogs"));
    const blogData = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Blog[];
    setBlogs(blogData);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;
    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/upload/blogs", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Error mengunggah gambar");
      return null;
    }

    const data = await response.json();
    return `/blog-images/${data.fileName}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !article || !imageFile) {
      alert("Semua field harus diisi!");
      return;
    }

    const imageUrl = await uploadImage();
    if (!imageUrl) return;

    try {
      await addDoc(collection(db, "blogs"), {
        title,
        article,
        image: imageUrl,
        timestamp: new Date(),
      });
      setTitle("");
      setArticle("");
      setImageFile(null);
      fetchBlogs();
    } catch (error) {
      console.error("Error menambahkan blog:", error);
    }
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    try {
      await deleteDoc(doc(db, "blogs", id));
      await fetch("/api/upload/blogs", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileName: imageUrl.split("/").pop() }),
      });
      fetchBlogs();
    } catch (error) {
      console.error("Error menghapus blog:", error);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Informasi Desa {`>`} Berita & Kegiatan</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <p className={styles.formTitle}>Tambah Blog</p>
        <input
          type="text"
          placeholder="Judul Blog"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
        />
        <textarea
          placeholder="Isi Artikel"
          value={article}
          onChange={(e) => setArticle(e.target.value)}
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
          Tambah Blog
        </button>
      </form>

      <table className={styles.blogTable}>
        <thead>
          <tr>
            <th>Judul</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id}>
              <td>{blog.title}</td>
              <td>
                <AlertDialog>
                  <AlertDialogTrigger className={styles.deleteButton}>Hapus</AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Konten Blog?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Konten blog yang dipilih akan dihapus secara permanen.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction style={{backgroundColor: "red"}} onClick={() => handleDelete(blog.id!, blog.image)}>
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}