import { useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import AdminAccessDenied from './AdminAccessDenied';
import { LayoutDashboard, Utensils, Users, Settings, LogOut, Loader2, Menu, X } from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (!userRole) {
    return <AdminAccessDenied />;
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const navItems = [
    { name: 'Bookings', path: '/admin', icon: LayoutDashboard },
    { name: 'Menu', path: '/admin/menu', icon: Utensils },
    ...(userRole === 'super_admin' ? [{ name: 'Staff', path: '/admin/staff', icon: Users }] : []),
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex overflow-hidden print:overflow-visible print:block print:h-auto">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-stone-50/80 backdrop-blur-sm md:hidden" 
          onClick={closeMobileMenu} 
        />
      )}

      {/* Sidebar */}
      <aside className={`print:hidden fixed inset-y-0 left-0 z-50 w-64 bg-stone-50 border-r border-stone-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-stone-200 flex justify-between items-center">
          <div>
            <h1 className="font-serif text-2xl text-amber-600 uppercase tracking-widest">Admin</h1>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">{userRole?.replace('_', ' ')}</p>
          </div>
          <button onClick={closeMobileMenu} className="md:hidden text-stone-500 hover:text-stone-900">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                  isActive 
                    ? 'bg-amber-600/10 text-amber-600' 
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden w-full print:h-auto print:overflow-visible print:block">
        {/* Mobile Header */}
        <header className="print:hidden md:hidden flex items-center justify-between p-4 bg-stone-50 border-b border-stone-200 shrink-0">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-stone-900 hover:text-amber-600 transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="font-serif text-xl text-amber-600 uppercase tracking-widest">Admin</h1>
          </div>
          <button onClick={handleLogout} className="text-red-400 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-10 print:overflow-visible print:block print:h-auto print:p-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-200 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
