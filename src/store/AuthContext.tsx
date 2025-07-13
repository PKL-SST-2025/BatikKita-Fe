import { createSignal, createContext, useContext } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user"; 
};

export interface AuthContextValue {
  user: () => User | null;
  login: (email: string, password: string, role?: "admin" | "user") => Promise<void>;
  register: (name: string, email: string, password: string, role?: "admin" | "user") => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);

  // Pulihkan user dari localStorage saat aplikasi dimulai
  const stored = localStorage.getItem("authUser");
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as User;
      setUser(parsed);
    } catch (err) {
      console.error("Gagal memuat user dari localStorage", err);
    }
  }

const login = async (email: string, password: string) => {
  try {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      alert("Email atau password salah");
      return;
    }
    const user = await res.json();
    setUser(user);
    localStorage.setItem("authUser", JSON.stringify(user));
  } catch (err) {
    alert("Gagal login ke server");
    console.error(err);
  }
};

  const register = async (name: string, email: string, password: string, role: "admin" | "user" = "user") => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      if (!res.ok) {
        alert("Registrasi gagal");
        return;
      }
      const user = await res.json();
      setUser(user);
      localStorage.setItem("authUser", JSON.stringify(user));
    } catch (err) {
      alert("Gagal register ke server");
      console.error(err);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authUser");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth harus digunakan dalam <AuthProvider>");
  return context;
}