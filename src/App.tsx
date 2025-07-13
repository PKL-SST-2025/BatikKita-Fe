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

import SplashLogo from "./components/SplashLogo";
import ProtectedRoute from "./components/ProtectedRoute"; 
import { CartProvider } from "./store/CartContext";
import { AuthProvider } from "./store/AuthContext";

import "./tailwind.css";

export default function App() {
  const [showSplash, setShowSplash] = createSignal(true);

  onMount(() => {
    setTimeout(() => setShowSplash(false), 1800);
  });

  return (
    <AuthProvider>
      <CartProvider>
        {showSplash() ? (
          <SplashLogo />
        ) : (
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
            
            {/* Protected user route */}
            <Route
              path="/profile"
              component={() => (
                <ProtectedRoute>
                  <Profile />
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

            <Route path="*" component={Home} />
          </Router>
        )}
      </CartProvider>
    </AuthProvider>
  );
}