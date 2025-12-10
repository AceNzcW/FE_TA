"use client";

import { getDoctors, getBookings } from "@/lib/api";
import { useEffect, useState } from "react";
import { Users, Calendar, Activity, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const [doctors, setDoctors] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = window.localStorage?.getItem("token");
    const role = window.localStorage?.getItem("role");

    if (!token || role !== "admin") {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const doctorData = await getDoctors();
        const bookingData = await getBookings();
        setDoctors(doctorData);
        setBookings(bookingData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const today = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.tanggal === today).length;

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - thisWeekStart.getDay());
  const weekBookings = bookings.filter(b => new Date(b.tanggal) >= thisWeekStart).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Total Dokter</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{doctors.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Total Booking</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{bookings.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Booking Hari Ini</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{todayBookings}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <p className="text-sm text-slate-600">Booking Minggu Ini</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{weekBookings}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-800">Daftar Booking Terbaru</h2>
          <p className="text-sm text-slate-500 mt-1">Total: {bookings.length} booking</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Nama Pasien</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Dokter</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-800">#{booking.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800">{booking.nama_pasien}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">{booking.dokter}</td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(booking.tanggal).toLocaleDateString('id-ID', { 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        booking.tanggal === today 
                          ? 'bg-green-100 text-green-700' 
                          : new Date(booking.tanggal) > new Date()
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {booking.tanggal === today ? 'Hari Ini' : new Date(booking.tanggal) > new Date() ? 'Terjadwal' : 'Selesai'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    Tidak ada data booking
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}