"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Mail, User, Stethoscope, Clock, X } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]); // Default array kosong
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    schedule: "",
    email: "",
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      fetchDoctors(token);
    }
  }, []);

  async function fetchDoctors(token) {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ PERBAIKAN: Gunakan "/" saja jika Env Var sudah bernilai "/api/doctors"
      // Ini mencegah URL menjadi "/api/doctors/doctors"
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`Gagal memuat data (Status: ${res.status})`);
      
      const data = await res.json();

      // ✅ PERBAIKAN: Pastikan data yang masuk adalah array sebelum disimpan
      if (Array.isArray(data)) {
        setDoctors(data);
      } else {
        console.error("Data bukan array:", data);
        setDoctors([]); // Fallback ke array kosong jika data salah format
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // ... (fungsi handleSubmit, handleEdit, handleCancel, handleDelete tetap sama)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat data dokter...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ... bagian header dan form ... */}

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Daftar Dokter</h2>
          {/* ✅ PERBAIKAN: Gunakan optional chaining untuk length */}
          <p className="text-sm text-slate-500 mt-1">Total: {doctors?.length || 0} dokter</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
               {/* ... bagian thead ... */}
            </thead>
            <tbody className="divide-y divide-slate-100">
              {/* ✅ PERBAIKAN: Tambahkan pengecekan Array.isArray sebelum .map */}
              {!Array.isArray(doctors) || doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    {error ? `Gagal memuat data: ${error}` : "Belum ada data dokter"}
                  </td>
                </tr>
              ) : (
                doctors.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-800">#{d.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{d.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{d.email || "-"}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{d.specialization}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{d.schedule}</td>
                    <td className="px-6 py-4">
                       {/* ... tombol edit/delete ... */}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}