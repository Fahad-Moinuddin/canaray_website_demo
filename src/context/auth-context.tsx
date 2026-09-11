"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEMO_USERS } from "@/lib/mock-data";
import { loadJSON, removeKey, saveJSON } from "@/lib/storage";
import type { DemoUser } from "@/lib/types";

interface AuthContextValue {
  user: DemoUser | null;
  ready: boolean;
  login: (userId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedId = loadJSON<string | null>("userId", null);
    const found = DEMO_USERS.find((u) => u.id === storedId) ?? null;
    setUser(found);
    setReady(true);
  }, []);

  const login = useCallback((userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (!found) return;
    setUser(found);
    saveJSON("userId", found.id);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    removeKey("userId");
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
