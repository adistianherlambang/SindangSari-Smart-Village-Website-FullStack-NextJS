"use client";

import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";

import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/firebase/clientApp";

// Definisikan tipe data User
type User = {
  id: string;
  username: string;
  password: string;
  dem: string;
};

export default function Test() {
  const [users, setUsers] = useState<User[]>([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [dem, setDem] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 🔥 Ambil data dari Firestore
  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const userList: User[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<User, "id">),
      }));

      setUsers(userList);
    } catch (error) {
      console.error("❌ Gagal mengambil data:", error);
    }
  };

  // 🔥 Tambah data ke Firestore
  const handleAddUser = async () => {
    if (!username || !password) {
      alert("Harap isi semua field!");
      return;
    }

    try {
      await addDoc(collection(db, "users"), {
        username,
        password,
        dem,
      });

      alert("Data berhasil ditambahkan!");
      setUsername("");
      setPassword("");
      setDem("");
      fetchUsers();
    } catch (error) {
      console.error("❌ Gagal menambah data:", error);
    }
  };

  // 🔥 Edit data di Firestore (Buka Modal)
  const handleEditUser = (user: User) => {
    setUsername(user.username);
    setPassword(user.password);
    setDem(user.dem);
    setEditId(user.id);
    setIsEditOpen(true);
  };

  // 🔥 Simpan perubahan data
  const handleUpdateUser = async () => {
    if (!editId) return;

    try {
      const userRef = doc(db, "users", editId);
      await updateDoc(userRef, {
        username,
        password,
        dem,
      });

      alert("Data berhasil diperbarui!");
      setIsEditOpen(false);
      setUsername("");
      setPassword("");
      setDem("");
      setEditId(null);
      fetchUsers();
    } catch (error) {
      console.error("❌ Gagal memperbarui data:", error);
    }
  };

  // 🔥 Hapus data dari Firestore (Buka Modal)
  const handleDeleteUser = (id: string) => {
    setDeleteId(id);
    setIsDeleteOpen(true);
  };

  // 🔥 Konfirmasi Hapus Data
  const confirmDeleteUser = async () => {
    if (!deleteId) return;

    try {
      await deleteDoc(doc(db, "users", deleteId));
      alert("Data berhasil dihapus!");
      setIsDeleteOpen(false);
      fetchUsers();
    } catch (error) {
      console.error("❌ Gagal menghapus data:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Kelola Data Firestore</h1>

      {/* Form Input */}
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md mb-6">
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Dem"
          className="w-full p-3 border rounded-md mb-3 focus:ring-2 focus:ring-blue-400"
          value={dem}
          onChange={(e) => setDem(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          onClick={handleAddUser}
        >
          Tambah Data
        </button>
      </div>

      {/* Daftar Data */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Daftar User:</h2>
      <div className="w-full max-w-3xl space-y-4">
        {users.length > 0 ? (
          users.map((user) => (
            <div key={user.id} className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="text-gray-800 font-semibold">ID: {user.id}</p>
                <p className="text-gray-600">Username: {user.username}</p>
                <p className="text-gray-600">Password: {user.password}</p>
                <p className="text-gray-600">Dem: {user.dem}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">Tidak ada data.</p>
        )}
      </div>

      {/* Modal Edit */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-lg font-semibold">Edit Data</h2>
          <input type="text" className="border p-2 w-full my-2" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="text" className="border p-2 w-full my-2" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button className="bg-green-500 text-white p-2 rounded-md w-full" onClick={handleUpdateUser}>Simpan</button>
        </div>
      </Dialog>

      {/* Modal Hapus */}
      <Dialog open={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-md">
          <h2 className="text-lg font-semibold">Yakin ingin menghapus?</h2>
          <button className="bg-red-500 text-white p-2 rounded-md w-full mt-3" onClick={confirmDeleteUser}>Hapus</button>
        </div>
      </Dialog>
    </div>
  );
}
