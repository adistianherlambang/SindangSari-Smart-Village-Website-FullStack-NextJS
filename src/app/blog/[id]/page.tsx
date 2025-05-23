import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/clientApp";

export default async function BlogPage(props: any) {
  const { params } = props;
  const docRef = doc(db, "blogs", params.id);
  const docSnap = await getDoc(docRef);
  const blog = docSnap.exists() ? docSnap.data() : null;

  if (!blog) return <p>Blog tidak ditemukan</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <img src={blog.image} alt={blog.title} className="w-full h-60 object-cover" />
      <h1 className="text-2xl font-bold mt-4">{blog.title}</h1>
      <p className="mt-2">{blog.article}</p>
    </div>
  );
}