"use client";

import { useState, useEffect } from "react";

export default function BookingPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("http://localhost:3002/bookings");
        const data = await res.json();
        setBookings(data.rows || data);
      } catch (err) {
        console.error("Gagal fetch bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 text-gray-800">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          
          <div className="relative bg-white/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-teal-100 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-extrabold mb-3 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Daftar Booking 📋
                </h1>
                <p className="text-xl text-gray-600">
                  Total: <span className="font-bold text-teal-600">{bookings.length} booking</span>
                </p>
              </div>
              <div className="text-6xl animate-bounce">
                🦷
              </div>
            </div>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
                <div className="inline-block w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 font-medium">Memuat data booking...</p>
              </div>
            ) : bookings.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 text-center shadow-lg">
                <div className="text-6xl mb-4">📭</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Belum Ada Booking</h3>
                <p className="text-gray-600">Belum ada jadwal booking yang tersedia saat ini.</p>
              </div>
            ) : (
              bookings.map((booking, index) => (
                <div
                  key={booking.id}
                  className="group bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-transparent hover:border-teal-300"
                >
                  <div className="flex items-center justify-between flex-wrap gap-6">
                    {/* Nama Pasien */}
                    <div className="flex items-center gap-4 min-w-[200px]">
                      <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                        {booking.patient_name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Nama Pasien</p>
                        <p className="text-xl font-bold text-gray-800">{booking.nama_pasien}</p>
                      </div>
                    </div>

                    {/* Dokter */}
                    <div className="min-w-[180px]">
                      <p className="text-sm text-gray-500 font-medium mb-1">👨‍⚕️ Dokter</p>
                      <p className="text-lg font-semibold text-teal-700">{booking.dokter || `Dr. ID ${booking.doctor_id}`}</p>
                    </div>

                    {/* Tanggal */}
                    <div className="min-w-[180px]">
                      <p className="text-sm text-gray-500 font-medium mb-1">📅 Tanggal Kunjungan</p>
                      <p className="text-lg font-semibold text-gray-800">
                        {new Date(booking.tanggal).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* No. Antrean */}
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-br from-blue-100 to-cyan-100 px-6 py-3 rounded-xl border-2 border-blue-200 shadow-md group-hover:shadow-lg transition-shadow">
                        <p className="text-xs text-gray-600 font-medium mb-1 text-center">NO. ANTREAN</p>
                        <p className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                          #{booking.queue_number}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </main>
  );
}