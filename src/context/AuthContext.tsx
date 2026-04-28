import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Profile, Role } from "@/types";
import { mockProfiles } from "@/data/mockData";

interface AuthContextValue {
  profile: Profile | null;
  loading: boolean;
  login: (role: Role, fullName?: string) => Profile;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "pisa_demo_profile_id";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = localStorage.getItem(STORAGE_KEY);
    if (id) {
      const found = mockProfiles.find((p) => p.id === id) ?? null;
      setProfile(found);
    }
    setLoading(false);
  }, []);

  const login = (role: Role) => {
    // Pick the first matching demo profile
    const found =
      mockProfiles.find((p) => p.role === role) ?? mockProfiles[0];
    localStorage.setItem(STORAGE_KEY, found.id);
    setProfile(found);
    return found;
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};