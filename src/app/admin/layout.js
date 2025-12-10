"use client";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Stethoscope, 
  Calendar, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  User
} from "lucide-react";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage?.removeItem("token");
      window.localStorage?.removeItem("role");
    }
    router.push("/login");
  };

  const menuItems = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard", badge: null },
    { href: "/admin/dokter", icon: Stethoscope, label: "Dokter", badge: null },
    { href: "/admin/booking", icon: Calendar, label: "Booking", badge: null }
  ];

  const isActive = (href) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname?.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-col shadow-2xl">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MediCare</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
        </div>

        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Menu Utama
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group relative overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-slate-700/50'
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                  <span className={`font-medium ${active ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </div>
                
                {item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
                
                {active && (
                  <ChevronRight className="w-4 h-4 text-white absolute right-4" />
                )}
                
                {!active && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all duration-300" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Sidebar - Mobile */}
      <aside className={`
        lg:hidden fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-slate-900 to-slate-800 text-white
        transform transition-transform duration-300 ease-in-out shadow-2xl
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">MediCare</h1>
              <p className="text-xs text-slate-400">Admin Portal</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-slate-700/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold">Admin User</p>
              <p className="text-xs text-slate-400">Administrator</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-3 mb-3">
            Menu Utama
          </p>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center justify-between gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200 group relative overflow-hidden
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-slate-700/50'
                  }
                `}
              >
                <div className="flex items-center gap-3 relative z-10">
                  <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400 group-hover:text-white'} transition-colors`} />
                  <span className={`font-medium ${active ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                </div>
                
                {item.badge && (
                  <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                    {item.badge}
                  </span>
                )}
                
                {active && (
                  <ChevronRight className="w-4 h-4 text-white absolute right-4" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-700/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-30">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl font-bold text-slate-800">
                {pathname === "/admin" && "Dashboard"}
                {pathname?.startsWith("/admin/dokter") && "Manajemen Dokter"}
                {pathname?.startsWith("/admin/booking") && "Manajemen Booking"}
              </h2>
              <p className="text-sm text-slate-500">
                {new Date().toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>

            <div className="lg:hidden flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-slate-800">MediCare</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-800">Admin User</p>
                <p className="text-xs text-slate-500">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {children}
        </main>

        <footer className="bg-white border-t border-slate-200 p-4">
          <div className="text-center text-sm text-slate-500">
            © 2025 MediCare. All rights reserved.
          </div>
        </footer>
      </div>
    </div>
  );
}