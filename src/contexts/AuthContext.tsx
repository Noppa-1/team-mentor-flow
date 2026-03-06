import React, { createContext, useContext, useEffect, useState } from "react";
import { User, signInWithPopup, signOut, onAuthStateChanged } from "firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

export type UserRole = "admin" | "advisor" | "student" | "unknown";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>("unknown");
  const [loading, setLoading] = useState(true);

  const checkRole = async (email: string): Promise<UserRole> => {
    try {
      // Check admins/staff collection first
      const staffRef = collection(db, "staff");
      const staffQ = query(staffRef, where("email", "==", email));
      const staffSnap = await getDocs(staffQ);
      if (!staffSnap.empty) return "admin";

      // Check advisors collection
      const advisorsRef = collection(db, "advisors");
      const advQ = query(advisorsRef, where("email", "==", email));
      const advSnap = await getDocs(advQ);
      if (!advSnap.empty) return "advisor";

      return "student";
    } catch {
      return "unknown";
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser?.email) {
        const userRole = await checkRole(firebaseUser.email);
        setRole(userRole);
      } else {
        setRole("unknown");
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
    setRole("unknown");
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
