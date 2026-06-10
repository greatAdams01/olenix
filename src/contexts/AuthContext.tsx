import { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  userRole: 'super_admin' | 'admin' | null;
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'super_admin' | 'admin' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          let role = null;
          const userDoc = await getDoc(doc(db, 'admins', user.uid));
          
          if (userDoc.exists()) {
            role = userDoc.data().role;
          } else {
            // Fallback: Check if there's a document mapping by email
            const q = query(collection(db, 'admins'), where('email', '==', user.email));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
              role = snapshot.docs[0].data().role;
            }
          }

          // Hard fallback: admin@olenix.com is always super admin
          if (!role && user.email === 'admin@olenix.com') {
            role = 'super_admin';
          }

          setUserRole(role);
        } catch (error) {
          console.error("Error fetching user role:", error);
          setUserRole(user.email === 'admin@olenix.com' ? 'super_admin' : null);
        }
      } else {
        setUserRole(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
