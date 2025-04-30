"use client"

import { useState, useEffect } from "react"
import { db } from "@/firebase/clientApp"
import { collection, getDocs, query, orderBy } from "firebase/firestore"

type Officer = {
  id: string
  name: string
  image?: string // Menambahkan field image untuk URL gambar
  [key: string]: any
}

export default function ResidentForm() {
  const [searchTerm, setSearchTerm] = useState("")
  const [officers, setOfficers] = useState<Officer[]>([])
  const [filteredOfficers, setFilteredOfficers] = useState<Officer[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchOfficers = async () => {
      setLoading(true)
      try {
        const officerRef = collection(db, "officer")
        const q = query(officerRef, orderBy("name"))
        const querySnapshot = await getDocs(q)
        const docs = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Officer[]

        setOfficers(docs)
        setFilteredOfficers(docs) 
      } catch (error) {
        console.error("Error fetching officers:", error)
      }
      setLoading(false)
    }

    fetchOfficers()
  }, [])

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOfficers(officers)
    } else {
      const filtered = officers.filter((officer) =>
        officer.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredOfficers(filtered)
    }
  }, [searchTerm, officers])

  // Fungsi untuk mengunduh gambar
  const downloadImage = (url: string) => {
    const link = document.createElement("a")
    link.href = url
    link.download = url.split("/").pop() || "image"
    link.click()
  }

  return (
    <div className="space-y-4">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Cari nama resident..."
        className="border rounded px-4 py-2 w-full"
      />
      {loading && <p className="text-gray-500 text-sm">Loading data...</p>}

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b text-left">Nama</th>
              <th className="py-2 px-4 border-b text-left">Image</th> {/* Kolom untuk Gambar */}
            </tr>
          </thead>
          <tbody>
            {filteredOfficers.length > 0 ? (
              filteredOfficers.map((officer) => (
                <tr key={officer.id} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{officer.name}</td>
                    <td className="py-2 px-4 border-b">
                        {officer.image ? (
                            <button
                            onClick={() => downloadImage(officer.image!)}
                            className="text-blue-500 hover:text-blue-700"
                            >
                            Download
                            </button>
                        ) : (
                            "No Image"
                        )}
                    </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 text-center" colSpan={2}>
                  Tidak ada hasil ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
