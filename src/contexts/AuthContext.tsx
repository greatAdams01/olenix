import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { fetchAdminRole } from '../lib/adminAuth';
import type { AdminRole } from '../types/database';

interface AuthContextType {
  currentUser: User | null;
  userRole: AdminRole | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userRole: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const applySession = async (user: User | null) => {
      if (!active) return;
      setCurrentUser(user);

      if (user) {
        try {
          const role = await fetchAdminRole();
          if (active) setUserRole(role);
        } catch (error) {
          console.error('Error fetching user role:', error);
          if (active) setUserRole(null);
        }
      } else if (active) {
        setUserRole(null);
      }

      if (active) setLoading(false);
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      applySession(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      applySession(session?.user ?? null);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userRole, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
