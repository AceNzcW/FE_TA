"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit2, Trash2, Mail, User, Stethoscope, Clock, X } from "lucide-react";

export default function DoctorsPage() {
  const router = useRouter();
  const [doctors, setDoctors] = useState([]);
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

  // ✅ Cek login saat halaman dibuka
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect ke login kalau belum login
    } else {
      fetchDoctors(token);
    }
  }, []);

  async function fetchDoctors(token) {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}`, {
        headers: {
          "Authorization": `Bearer ${token}`, // ✅ kirim token ke backend
        },
      });
      if (!res.ok) throw new Error("Gagal memuat data dokter");
      const data = await res.json();
      setDoctors(data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      let res, doctorData;
      if (editingId) {
        res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}/${editingId}`, {
          method: "PUT",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal update dokter");
        doctorData = await res.json();
        setDoctors((prev) =>
          prev.map((d) => (d.id === editingId ? doctorData : d))
        );
        setEditingId(null);
      } else {
        res = await fetch("/api/doctors/doctors", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error("Gagal menambahkan dokter");
        doctorData = await res.json();
        setDoctors((prev) => [...prev, doctorData]);
      }

      setForm({ name: "", specialization: "", schedule: "", email: "" });
      setShowForm(false);
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan!");
    }
  }

    function handleEdit(doctor) {
    setForm({
      name: doctor.name,
      specialization: doctor.specialization,
      schedule: doctor.schedule,
      email: doctor.email || "",
    });
    setEditingId(doctor.id);
    setShowForm(true);
  }

  function handleCancel() {
    setForm({ name: "", specialization: "", schedule: "", email: "" });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleDelete(id) {
    if (!confirm("Yakin ingin menghapus dokter ini?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_UR}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Gagal menghapus dokter");
      setDoctors((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus dokter!");
    }
  }

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

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Dokter</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data dokter klinik</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <Plus className="w-5 h-5" />
          Tambah Dokter
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">
              {editingId ? "Edit Dokter" : "Tambah Dokter Baru"}
            </h2>
            <button
              onClick={handleCancel}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Nama Dokter
                </label>
                <input
                  type="text"
                  placeholder="Dr. John Doe"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Mail className="w-4 h-4 inline mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  placeholder="dokter@email.com"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Stethoscope className="w-4 h-4 inline mr-1" />
                  Spesialisasi
                </label>
                <input
                  type="text"
                  placeholder="Dokter Umum"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.specialization}
                  onChange={(e) => setForm({ ...form, specialization: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Jadwal
                </label>
                <input
                  type="text"
                  placeholder="Senin - Jumat, 09:00 - 15:00"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.schedule}
                  onChange={(e) => setForm({ ...form, schedule: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                {editingId ? "Simpan Perubahan" : "Tambah Dokter"}
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Daftar Dokter</h2>
          <p className="text-sm text-slate-500 mt-1">Total: {doctors.length} dokter</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Spesialisasi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Jadwal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {doctors.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data dokter
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(d)}
                          className="p-2 text-blue-600 hover:bg-blue-700 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(d.id)}
                          className="p-2 text-red-600 hover:bg-red-700 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
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