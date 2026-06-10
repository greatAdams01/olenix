import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Utensils, Users, Settings, LogOut, Loader2 } from 'lucide-react';

export default function AdminLayout() {
  const { currentUser, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = async () => {
    try {
      await signOut(auth);
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

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-white/10 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-serif text-2xl text-gold-500 uppercase tracking-widest">Admin</h1>
          <p className="text-[10px] text-white/50 uppercase tracking-widest mt-1">{userRole?.replace('_', ' ')}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-sm text-sm transition-colors ${
                  isActive 
                    ? 'bg-gold-500/10 text-gold-500' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
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
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-black border-b border-white/10">
          <h1 className="font-serif text-xl text-gold-500 uppercase tracking-widest">Admin</h1>
          <button onClick={handleLogout} className="text-red-400 p-2">
            <LogOut className="w-5 h-5" />
          </button>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
