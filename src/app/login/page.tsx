"use client";

import LoginForm from "@/components/LoginForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase/clientApp"; // Gunakan auth dari clientApp.ts
import { onAuthStateChanged } from "firebase/auth";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/admin"); // Redirect ke admin jika sudah login
      }
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen">
      <LoginForm />
    </div>
  );
}
