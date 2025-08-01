import { Router, Route } from "@solidjs/router";
import { createSignal, onMount } from "solid-js";

import Home from "./pages/Home";
import Produk from "./pages/Produk";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Profile from "./pages/Profile";
import Favorites from "./pages/Favorites";

import Notifications from "./pages/Notifications";
import Security from "./pages/Security";
import Appearance from "./pages/Appearance";
import AdminChat from "./pages/AdminChat";

import SplashLogo from "./components/SplashLogo";
import ProtectedRoute from "./components/ProtectedRoute"; 
import ChatWidget from "./components/ChatWidget";
import AdminChatWidget from "./components/AdminChatWidget";
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";
import { FavoriteProvider } from "./store/FavoriteContext";
import { NotificationProvider } from "./store/NotificationContext";
import { ChatProvider } from "./store/ChatContext";

import "./tailwind.css";

export default function App() {
  const [showSplash, setShowSplash] = createSignal(true);

  onMount(() => {
    setTimeout(() => setShowSplash(false), 1800);
  });

  return (
    <AuthProvider>
      <FavoriteProvider>
        <CartProvider>
          <NotificationProvider>
            <ChatProvider>
        {showSplash() ? (
          <SplashLogo />
        ) : (
          <>
            <Router>
              <Route path="/" component={Home} />
              <Route path="/produk" component={Produk} />
              <Route path="/produk/:id" component={ProductDetail} />
              <Route path="/cart" component={Cart} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/forgot-password" component={ForgotPassword} />
              <Route path="/about" component={About} />
              <Route path="/contact" component={Contact} />
              
              {/* Protected Favorites route */}
              <Route
                path="/favorites"
                component={() => (
                  <ProtectedRoute>
                    <Favorites />
                  </ProtectedRoute>
                )}
              />
              
              {/* Protected user routes */}
              <Route
                path="/profile"
                component={() => (
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                )}
              />

              {/* Protected profile settings routes */}
              <Route
                path="/notifications"
                component={() => (
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                )}
              />

              <Route
                path="/security"
                component={() => (
                  <ProtectedRoute>
                    <Security />
                  </ProtectedRoute>
                )}
              />

              <Route
                path="/appearance"
                component={() => (
                  <ProtectedRoute>
                    <Appearance />
                  </ProtectedRoute>
                )}
              />

              {/* Protected admin-only route */}
              <Route
                path="/dashboard"
                component={() => (
                  <ProtectedRoute requiredRole="admin">
                    <Dashboard />
                  </ProtectedRoute>
                )}
              />

              {/* Admin Chat Route */}
              <Route
                path="/admin/chat"
                component={() => (
                  <ProtectedRoute requiredRole="admin">
                    <AdminChat />
                  </ProtectedRoute>
                )}
              />

              <Route path="*" component={Home} />
            </Router>
            
            {/* Live Chat Widgets */}
            <ChatWidget />
            <AdminChatWidget />
          </>
        )}
            </ChatProvider>
          </NotificationProvider>
        </CartProvider>
      </FavoriteProvider>
    </AuthProvider>
  );
}