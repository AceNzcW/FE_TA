"use client";

import { useState, useEffect } from "react";

export default function HomePage() {
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    doctor: "",
    date: ""
  });

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);

  // ✅ Perbaikan Fetch Doctors: Gunakan Variabel Lingkungan & Validasi Array
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);
        // Menggunakan variabel lingkungan yang mengarah ke /api/doctors
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}`); 
        
        if (!res.ok) throw new Error("Gagal mengambil data dokter");

        const data = await res.json();
        
        // Memastikan data adalah array (menangani format data.rows atau data langsung)
        const doctorList = data.rows || data;
        setDoctors(Array.isArray(doctorList) ? doctorList : []);
      } catch (err) {
        console.error("Gagal fetch dokter:", err);
        setDoctors([]); // Fallback ke array kosong agar .map() tidak error
      } finally {
        setLoadingDoctors(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact || !formData.doctor || !formData.date){
      alert("Mohon lengkapi semua data!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      // Jika butuh login untuk booking, arahkan jika token tidak ada
      if (!token) {
        alert("Silahkan login terlebih dahulu untuk melakukan booking");
        return;
      }

      // ✅ Perbaikan URL Booking: Gunakan variabel lingkungan
      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          patient_name: formData.name,        
          patient_contact: formData.contact,          
          doctor_id: formData.doctor,
          appointment_date: formData.date
        })
      });

      if (!res.ok){
        const errData = await res.json();
        throw new Error(errData.error || "Gagal menyimpan booking");
      }

      const data = await res.json();
      alert("Booking berhasil dibuat! Tim kami akan menghubungi anda");
      setFormData({ name: "", contact: "", doctor: "", date: ""});
    } catch (err) {
      console.error("Error submit booking:", err);
      alert(err.message || "Terjadi kesalahan saat menyimpan booking");
    }
  };

  return (
    <main className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 text-gray-800 overflow-hidden">
      {/* ... Hero, Stats, & Features Section Tetap Sama ... */}

      {/* Booking Form */}
      <section id="booking" className="max-w-4xl mx-auto px-6 py-20">
        <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-teal-100">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Reservasi Online
            </h2>
            <p className="text-gray-600">Isi formulir di bawah dan kami akan konfirmasi dalam 5 menit!</p>
          </div>
          
          <div className="grid gap-6">
            {/* ... Input Nama & Kontak Tetap Sama ... */}
            
            <div className="group">
              <label className="block text-gray-700 mb-2 font-semibold">👨‍⚕️ Pilih Dokter</label>
              <select 
                value={formData.doctor}
                onChange={(e) => setFormData({...formData, doctor: e.target.value})}
                disabled={loadingDoctors}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300 group-hover:border-teal-300 disabled:bg-gray-100"
              >
                <option value="">
                  {loadingDoctors ? "Memuat daftar dokter..." : "Pilih Dokter Gigi"}
                </option>
                {/* ✅ Safe Mapping: Menggunakan Array.isArray */}
                {Array.isArray(doctors) && doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} ({doc.specialization})
                  </option>
                ))}
              </select>
            </div>
            
            {/* ... Input Tanggal & Button Konfirmasi Tetap Sama ... */}
          </div>
        </div>
      </section>

      {/* ... Footer & Styles Tetap Sama ... */}
    </main>
  );
}