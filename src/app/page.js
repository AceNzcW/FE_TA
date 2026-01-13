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
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOCTOR_SERVICE_URL}`);
        const data = await res.json();
        setDoctors(data.rows || data);
      } catch (err) {
        console.error("Gagal fetch dokter:", err);
      }
    };
    fetchDoctors();
  }, []);

  const handleDoctorChange = (doctorId) => {
    setFormData({...formData, doctor: doctorId});
    const doctor = doctors.find(d => d.id === parseInt(doctorId));
    setSelectedDoctor(doctor || null);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.contact || !formData.doctor || !formData.date){
      alert("Mohon lengkapi semua data!");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL}`,{
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
      console.log("Booking berhasil:", data);

      alert("Booking berhasil dibuat! Tim kami akan menghubungi anda");
      setFormData({ name: "", contact: "", doctor: "", date: ""});
      setSelectedDoctor(null);
    }catch (err){
      console.error("Error submit booking:", err);
      alert("Mohon lengkapi data");
    }
  };

  return (
    <main className="bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 text-gray-800 overflow-hidden">
      {/* Hero Section */}
      <section className="relative max-w-6xl mx-auto px-6 py-20 min-h-screen">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
        
        <div className="max-w-4xl mx-auto z-10 animate-fade-in text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-white/70 backdrop-blur-sm rounded-full text-sm font-semibold text-teal-700 shadow-md">
            ✨ Platform Booking Promedico klinik
          </div>
          <h1 className="text-6xl font-extrabold mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Senyum Sehat Dimulai Dari Sini 🦷
          </h1>
          <p className="text-xl mb-8 text-gray-700 leading-relaxed">
            Reservasi dokter gigi profesional hanya dalam hitungan detik. Mudah, cepat, dan tanpa ribet!
          </p>
        </div>

        {/* Tabel Jadwal Dokter */}
        <div className="relative z-10 bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-teal-100">
          <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-8 py-6">
            <h2 className="text-3xl font-bold text-white text-center flex items-center justify-center gap-3">
              <span>👨‍⚕️</span>
              Jadwal Dokter Kami
              <span>📅</span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-teal-50">
                  <th className="px-6 py-5 text-center text-sm font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-200">
                    Nama Dokter
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-200">
                    Spesialisasi
                  </th>
                  <th className="px-6 py-5 text-center text-sm font-bold text-teal-700 uppercase tracking-wider border-b-2 border-teal-200">
                    Jadwal Praktek
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {doctors.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center gap-3">
                        <span className="text-4xl">⏳</span>
                        <p className="text-lg">Memuat data dokter...</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  doctors.map((doc) => (
                    <tr 
                      key={doc.id} 
                      className="hover:bg-teal-50 transition-colors duration-200"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                            {doc.name?.charAt(0) || 'D'}
                          </div>
                          <span className="text-sm font-semibold text-gray-800">
                            {doc.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-100 text-cyan-800">
                          {doc.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-700 text-center">
                        {doc.schedule || 'Senin - Jumat, 09:00 - 17:00'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex gap-4 justify-center mt-8">
          <a
            href="#booking"
            className="group px-8 py-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-2xl shadow-2xl hover:shadow-cyan-300/50 hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              Booking Sekarang
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </span>
          </a>
          <button className="px-8 py-4 border-2 border-teal-500 text-teal-600 font-bold rounded-2xl hover:bg-teal-50 transition-all duration-300 hover:scale-105">
            Pelajari Lebih
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { number: "5000+", label: "Pasien Puas" },
            { number: "50+", label: "Dokter Ahli" },
            { number: "4.9★", label: "Rating" },
            { number: "24/7", label: "Layanan" }
          ].map((stat, i) => (
            <div key={i} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-5xl font-bold text-center mb-16 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          Kenapa Pilih Kami?
        </h2>
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {[
            {
              icon: "⚡",
              title: "Super Cepat",
              desc: "Booking hanya butuh 30 detik. Tidak perlu antri atau telepon berkali-kali."
            },
            {
              icon: "🏆",
              title: "Dokter Profesional",
              desc: "Semua dokter kami bersertifikat dan berpengalaman lebih dari 5 tahun."
            }
          ].map((feature, i) => (
            <div key={i} className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-2 border-transparent hover:border-teal-300">
              <div className="text-6xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4 text-teal-700">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

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
            <div className="group">
              <label className="block text-gray-700 mb-2 font-semibold">👤 Nama Lengkap</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Masukkan nama lengkap Anda"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300 group-hover:border-teal-300"
              />
            </div>
            
            <div className="group">
              <label className="block text-gray-700 mb-2 font-semibold">📱 Kontak</label>
              <input
                type="text"
                value={formData.contact}
                onChange={(e) => setFormData({...formData, contact: e.target.value})}
                placeholder="No. HP / Email aktif"
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300 group-hover:border-teal-300"
              />
            </div>
            
            <div className="group">
              <label className="block text-gray-700 mb-2 font-semibold">👨‍⚕️ Pilih Dokter</label>
              <select 
                value={formData.doctor}
                onChange={(e) => handleDoctorChange(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300 group-hover:border-teal-300"
              >
                <option value="">Pilih Dokter Gigi</option>
                {doctors.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    {doc.name} - {doc.specialization}
                  </option>
                ))}
              </select>
              
              {/* Doctor Schedule Display */}
              {selectedDoctor && (
                <div className="mt-4 p-5 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🗓️</div>
                    <div>
                      <h4 className="font-bold text-teal-700 mb-1">Jadwal Praktek:</h4>
                      <p className="text-gray-700">
                        {selectedDoctor.schedule || 'Senin - Jumat, 09:00 - 17:00'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="group">
              <label className="block text-gray-700 mb-2 font-semibold">📅 Tanggal Kunjungan</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-400 focus:border-transparent outline-none transition-all duration-300 group-hover:border-teal-300"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full py-5 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-cyan-300/50 transition-all duration-300 hover:scale-105 mt-4"
            >
              🎉 Konfirmasi Booking
            </button>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="relative bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-3xl p-16 shadow-2xl text-white overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full opacity-10 -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full opacity-10 -ml-48 -mb-48"></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-bold mb-4">
              Mulai Perjalanan Senyum Sehat Anda! 😁
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Bergabunglah dengan ribuan pasien yang telah mempercayai kami
            </p>
            <a
              href="#booking"
              className="inline-block px-10 py-5 bg-white text-teal-600 font-bold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:scale-110 transition-all duration-300"
            >
              🚀 Booking Sekarang Juga!
            </a>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out;
        }
      `}</style>
    </main>
  );
}