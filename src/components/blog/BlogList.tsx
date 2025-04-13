"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase/clientApp";
import styles from "./BlogList.module.css";
import Link from "next/link";
import {Loading} from "@geist-ui/core"

interface Blog {
  id: string;
  title: string;
  article: string;
  image: string;
  timestamp: string | null;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [hover, setHover] = useState(false)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "blogs"));
        const blogData: Blog[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title || "No Title",
            article: data.article || "No Content",
            image: data.image || "",
            timestamp: data.timestamp
              ? new Date(data.timestamp.seconds * 1000).toLocaleString("id-ID", {
                  timeZone: "Asia/Jakarta",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null,
          };
        });
        setBlogs(blogData);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);


  if (loading) return <Loading>Loading</Loading>;
  if (blogs.length === 0) return <p className={styles.textCenter}>No blogs found.</p>;

  return (
    <div className={styles.container}>
      <div className={styles.compTitleContainer}>
          <p className={styles.compTitle}>Agenda & Berita</p>
          <Link className={styles.compButton} onMouseEnter={()  => setHover(true)} onMouseLeave={() => setHover(false)} href="/login">
              <p>Lihat Semua</p>
              <svg className={`${styles.compButtonIcon} ${hover ? styles.compButtonIconHover : ""}`} width="20" height="26" viewBox="0 0 31 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.08606 12.2761C1.03313 12.2761 0.179564 13.1297 0.179564 14.1826C0.179564 15.2355 1.03313 16.0891 2.08606 16.0891L2.08606 12.2761ZM30.3961 15.5307C31.1406 14.7862 31.1406 13.579 30.3961 12.8345L18.2632 0.701657C17.5187 -0.042876 16.3115 -0.0428758 15.567 0.701657C14.8225 1.44619 14.8225 2.65332 15.567 3.39785L26.3518 14.1826L15.567 24.9674C14.8225 25.7119 14.8225 26.919 15.567 27.6636C16.3116 28.4081 17.5187 28.4081 18.2632 27.6636L30.3961 15.5307ZM2.08606 16.0891L29.048 16.0891L29.048 12.2761L2.08606 12.2761L2.08606 16.0891Z" fill="#232323"/>
              </svg>
          </Link>
      </div>
      <div className={styles.grid}>
        {blogs.map((blog) => (
          <div
            key={blog.id}
            className={styles.card}
            onClick={(e) => {
              e.stopPropagation();
              console.log("Klik terdeteksi untuk:", blog.id);
              window.location.href = `/blog/${blog.id}`;
            }}
          >
            <div className={styles.imageWrapper}>
              <img
                src={blog.image}
                alt={blog.title}
                className={styles.image}
                onError={(e) => {
                  console.error("Image Load Error:", blog.image);
                  (e.target as HTMLImageElement).src = "/fallback-image.jpg";
                }}
              />
              <div className={styles.imageOverlay}></div>
            </div>
            <h2 className={styles.title}>{blog.title.length > 40 ? blog.title.substring(0, 40) + "..." : blog.title}</h2>
            <p className={styles.article}> {blog.article} </p>
            {/* <p className={styles.article}> {blog.article.split("\n").length > 3 ? `${blog.article.split("\n")[0]}...` : blog.article.split("\n")[0] } </p> */}
            <p className={styles.timestamp}>
              {blog.timestamp ? `Diterbitkan: ${blog.timestamp}` : "Tanggal tidak tersedia"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
