import { createSignal, createContext, useContext } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { AuthService } from "../services/authService";
import type { User } from "../services/authService";
import { setAuthToken, removeAuthToken, getAuthToken } from "../utils/api";
import { showNotification } from "../utils/notifications";

export interface AuthContextValue {
  user: () => User | null;
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => Promise<void>;
  logout: () => void;
  loading: () => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider(props: { children: JSX.Element }) {
  const [user, setUser] = createSignal<User | null>(null);
  const [loading, setLoading] = createSignal(false);

  // Initialize user from stored token
  const initializeAuth = async () => {
    const token = getAuthToken();
    if (token) {
      try {
        setLoading(true);
        const response = await AuthService.getProfile();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          console.warn("Failed to get user profile:", response.message);
          removeAuthToken();
        }
      } catch (error) {
        console.error("Failed to initialize auth:", error);
        // Clear invalid token
        removeAuthToken();
      } finally {
        setLoading(false);
      }
    }
  };

  // Initialize auth on app start
  initializeAuth();

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await AuthService.login({ email, password });
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        
        // Show success notification
        showNotification("🎉 Anda berhasil login! Selamat datang kembali", "success");
        
        // Redirect to products page after a short delay
        setTimeout(() => {
          window.location.href = "/produk";
        }, 1000);
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login error:", error);
      showNotification("❌ Login gagal: " + (error.message || "Email atau password salah"), "error");
      throw new Error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone?: string;
  }) => {
    try {
      setLoading(true);
      const response = await AuthService.register(userData);
      
      if (response.success && response.data) {
        setAuthToken(response.data.token);
        setUser(response.data.user);
        
        // Show success notification
        showNotification("🎊 Registrasi berhasil! Selamat datang di Batik Kita", "success");
        
        // Redirect to products page after a short delay
        setTimeout(() => {
          window.location.href = "/produk";
        }, 1000);
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      showNotification("❌ Registrasi gagal: " + (error.message || "Silakan coba lagi"), "error");
      throw new Error(error.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      
      // Show success notification
      showNotification("✅ Anda berhasil logout! Sampai jumpa lagi", "success");
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 1000);
    } catch (error) {
      console.error("Logout error:", error);
      showNotification("⚠️ Logout gagal, silakan coba lagi", "error");
    } finally {
      setUser(null);
      removeAuthToken();
    }
  };

  const isAuthenticated = () => !!user();

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      loading 
    }}>
      {props.children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}