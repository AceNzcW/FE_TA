"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50">
      {/* Navbar hanya muncul jika bukan di /admin */}
      {!isAdmin && (
        <header className="bg-white/80 backdrop-blur-lg border-b border-teal-100 text-gray-800 px-6 py-4 sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                🦷
              </div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ProMedico Klinik
              </h1>
            </div>
            <nav className="flex gap-8 font-semibold">
              <Link 
                href="/" 
                className={`relative hover:text-teal-600 transition-colors duration-300 ${
                  pathname === "/" ? "text-teal-600" : "text-gray-700"
                }`}
              >
                Home
                {pathname === "/" && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                )}
              </Link>
              <Link 
                href="/booking" 
                className={`relative hover:text-teal-600 transition-colors duration-300 ${
                  pathname === "/booking" ? "text-teal-600" : "text-gray-700"
                }`}
              >
                Booking
                {pathname === "/booking" && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                )}
              </Link>
              <Link 
                href="/doctors" 
                className={`relative hover:text-teal-600 transition-colors duration-300 ${
                  pathname === "/doctors" ? "text-teal-600" : "text-gray-700"
                }`}
              >
                Doctors
                {pathname === "/doctors" && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-teal-500 to-cyan-500"></span>
                )}
              </Link>
            </nav>
          </div>
        </header>
      )}

      <main className={`flex-grow ${!isAdmin && ""}`}>
        {children}
      </main>

      {!isAdmin && (
        <footer className="bg-white/80 backdrop-blur-lg border-t border-teal-100 text-gray-700 text-center py-6 mt-auto">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-lg font-bold">
                🦷
              </div>
              <span className="font-bold text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                ProMedico Klinik
              </span>
            </div>
            <p className="text-sm text-gray-600">
              © 2025 ProMedico Klinik | Semua hak cipta dilindungi
            </p>
          </div>
        </footer>
      )}
    </div>
  );
}