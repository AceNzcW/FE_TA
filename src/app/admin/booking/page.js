"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, X, User, Phone, Calendar, Stethoscope, CheckCircle, Hash } from "lucide-react";

export default function BookingPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editBooking, setEditBooking] = useState(null);
  const [queue, setQueue] = useState(null);
  const [form, setForm] = useState({
    nama_pasien: "",
    contact_pasien: "",
    dokter: "",
    tanggal: "",
    status: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login"); // redirect kalau belum login
    } else {
      fetchBookings(token);
    }
  }, []);

  async function fetchBookings(token) {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Gagal memuat booking");
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error("Gagal fetch booking:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Yakin hapus booking ini?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error("Gagal hapus booking");
      setBookings((prev) => prev.filter((b) => b.id !== id));
    } catch (err) {
      console.error(err);
      alert("Gagal hapus booking!");
    }
  }

  function handleEdit(b) {
    setEditBooking(b.id);
    setForm({
      nama_pasien: b.nama_pasien,
      contact_pasien: b.contact,
      dokter: b.dokter,
      tanggal: b.tanggal,
      status: b.status,
    });
  }

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return router.push("/login");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/${editBooking}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Gagal update booking");
      const updated = await res.json();

      setBookings((prev) =>
        prev.map((b) => (b.id === editBooking ? updated : b))
      );
      setEditBooking(null);
      setForm({ nama_pasien: "", contact_pasien: "", dokter: "", tanggal: "", status: "" });
    } catch (err) {
      console.error(err);
      alert("Gagal update booking!");
    }
  }

  function handleCancel() {
    setEditBooking(null);
    setForm({ nama_pasien: "", contact_pasien: "", dokter: "", tanggal: "", status: "" });
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "selesai":
        return "bg-green-100 text-green-700 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "batal":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  async function fetchQueue() {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/queue`);
      const data = await res.json();
      setQueue(data.last_number);
    } catch (err) {
      console.error("Gagal fetch queue:", err);
    }
  };

  async function resetQueue() {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/queue/reset`, { method: "POST" });
      alert("Nomor antrean berhasil direset!");
      fetchQueue(); // refresh data
    } catch (err) {
      console.error("Gagal reset queue:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat data booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Booking</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola data booking pasien</p>
        </div>
      </div>

      <div>
        <button
        onClick={async () => {
          await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}/queue/reset`, { method: "POST" });
          alert("Nomor antrean berhasil direset!");
        }}
        className="bg-red-500 text-white px-4 py-2 rounded"
        >
        Reset Nomor Antrean
      </button>
      </div>

      {editBooking && (
        <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Edit Booking</h2>
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
                  Nama Pasien
                </label>
                <input
                  type="text"
                  placeholder="Nama Pasien"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.nama_pasien}
                  onChange={(e) => setForm({ ...form, nama_pasien: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Kontak Pasien
                </label>
                <input
                  type="text"
                  placeholder="08123456789"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.contact_pasien}
                  onChange={(e) => setForm({ ...form, contact_pasien: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Stethoscope className="w-4 h-4 inline mr-1" />
                  Dokter
                </label>
                <input
                  type="text"
                  placeholder="Nama Dokter"
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.dokter}
                  onChange={(e) => setForm({ ...form, dokter: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Tanggal
                </label>
                <input
                  type="date" 
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  <CheckCircle className="w-4 h-4 inline mr-1" />
                  Status
                </label>
                <select
                  className="w-full border border-slate-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  <option value="">Pilih Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Selesai">Selesai</option>
                  <option value="Batal">Batal</option>
                </select>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Simpan Perubahan
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
          <h2 className="text-lg font-bold text-slate-800">Daftar Booking</h2>
          <p className="text-sm text-slate-500 mt-1">Total: {bookings.length} booking</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Kontak</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Aksi</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">No. Antrean</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-slate-500">
                    Belum ada data booking
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-800">#{b.id}</td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-800">{b.nama_pasien}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.contact}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{b.dokter}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(b.tanggal).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(b)}
                          className="p-2 text-blue-600 hover:bg-blue-700 rounded-lg transition"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-2 text-red-600 hover:bg-red-700 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                        <Hash className="w-3 h-3" />
                        {b.queue_number || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
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