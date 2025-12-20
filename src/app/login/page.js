"use client";

import { useState } from "react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 🚨 Validasi sederhana
    if (!formData.username || !formData.password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login gagal");
        return;
      }

      // ✅ Cek role admin
      if (data.role !== "admin") {
        setError("❌ Hanya admin yang boleh login");
        return;
      }

      // Simpan token & role
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);

      alert("✅ Login Admin berhasil!");
      window.location.href = "/admin"; // redirect ke halaman admin
    } catch (err) {
      console.error("Login error:", err);
      setError("⚠️ Tidak dapat terhubung ke server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-md mx-auto px-6 py-20">
      <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-10 shadow-2xl border border-teal-100">
        <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
          🔐 Login Admin
        </h2>

        {error && (
          <p className="text-red-500 text-center mb-4 font-medium">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="grid gap-6">
          {/* Username */}
          <div className="group">
            <label className="block text-gray-700 mb-2 font-semibold">
              👤 Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Masukkan username"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-teal-400 focus:border-transparent 
                outline-none transition-all duration-300 
                group-hover:border-teal-300"
            />
          </div>

          {/* Password */}
          <div className="group">
            <label className="block text-gray-700 mb-2 font-semibold">
              🔑 Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Masukkan password"
              className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl 
                focus:ring-2 focus:ring-teal-400 focus:border-transparent 
                outline-none transition-all duration-300 
                group-hover:border-teal-300"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-5 text-white font-bold text-lg rounded-2xl shadow-xl mt-4 
              transition-all duration-300 hover:scale-105 
              ${loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:shadow-2xl hover:shadow-cyan-300/50"
              }`}
          >
            {loading ? "🔄 Sedang login..." : "🚀 Login Admin"}
          </button>
        </form>
      </div>
    </section>
  );
}
