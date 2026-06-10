import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import PublicPage from './pages/PublicPage';
import { AuthProvider } from './contexts/AuthContext';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import Login from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import MenuAdmin from './pages/admin/MenuAdmin';
import StaffAdmin from './pages/admin/StaffAdmin';
import Settings from './pages/admin/Settings';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<PublicPage />} />
          
          {/* Admin Login */}
          <Route path="/admin/login" element={<Login />} />

          {/* Protected Admin Dashboard */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="menu" element={<MenuAdmin />} />
            <Route path="staff" element={<StaffAdmin />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          
          {/* Catch all - redirect home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
