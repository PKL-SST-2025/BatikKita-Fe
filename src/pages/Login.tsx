import { createSignal, onMount } from "solid-js";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "@solidjs/router";

export default function Login() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [theme, setTheme] = createSignal("light");
  const [pageLeaving, setPageLeaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const newTheme = theme() === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  onMount(() => {
    if (theme() === "dark") {
      document.documentElement.classList.add("dark");
    }
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email(), password());
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassClick = (e: Event) => {
    e.preventDefault();
    setPageLeaving(true);
    setTimeout(() => {
      navigate("/forgot-password");
    }, 500);
  };

  const handleRegisterClick = (e: Event) => {
    e.preventDefault();
    setPageLeaving(true);
    setTimeout(() => {
      navigate("/register");
    }, 500);
  };

  return (
    <div
      class={`min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-900 to-blue-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 ${
        pageLeaving() ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <button
        class="absolute top-4 left-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition z-50"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <button
        class="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition z-50"
        onClick={toggleTheme}
      >
        {theme() === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <div
        class={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex max-w-4xl w-full overflow-hidden transition-all duration-500 ${
          pageLeaving() ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
      >
        <div class="w-1/2 p-8">
          <h2 class="text-3xl font-bold text-center mb-4 dark:text-white">Sign In</h2>
          <p class="text-center text-sm text-blue-600 dark:text-blue-300 mb-6">
            Access your Batik Kita account
          </p>

          {error() && (
            <div class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error()}
            </div>
          )}

          <form class="space-y-4" onSubmit={handleSubmit}>
            <div class="transition duration-300 hover:scale-105">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
                class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-300"
                onInput={(e) => setEmail(e.currentTarget.value)}
              />
            </div>

            <div class="transition duration-300 hover:scale-105">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
                class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-300"
                onInput={(e) => setPassword(e.currentTarget.value)}
              />
            </div>

            <div class="flex justify-between items-center">
              <label class="flex items-center text-sm text-gray-900 dark:text-gray-200">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500"
                />
                <span class="ml-2">Remember me</span>
              </label>
              <a
                onClick={handleForgotPassClick}
                href="/forgot-password"
                class="text-sm text-blue-600 dark:text-blue-300 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading() || isLoading()}
              class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading() || isLoading() ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <p class="text-center text-sm mt-4 dark:text-gray-300">
            Don’t have an account?{" "}
            <a
              href="/register"
              onClick={handleRegisterClick}
              class="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer"
            >
              Register here
            </a>
          </p>
        </div>

        {/* Sidebar Promo Section */}
        <div class="w-1/2 bg-gradient-to-br from-blue-700 to-indigo-700 dark:from-gray-800 dark:to-gray-700 text-white p-8 flex flex-col justify-center relative overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-40 h-40 bg-white/30 rounded-full blur-3xl animate-orbit"></div>
          </div>
          <h2 class="text-3xl font-bold mb-2 z-10">WELCOME TO</h2>
          <h3 class="text-3xl font-extrabold mb-6 z-10">BATIKITA</h3>

          <ul class="space-y-4 text-sm z-10">
            <li class="flex items-start gap-3">
              <span class="text-blue-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 11V5m4 6V3m4 18H5a2 2 0 01-2-2V5a2 2 0 012-2h3.6a1 1 0 01.7.3l2.7 2.7a1 1 0 00.7.3h7a2 2 0 012 2v11a2 2 0 01-2 2z" />
                </svg>
              </span>
              <div>
                <p class="font-bold">Statistik Penjualan</p>
                <p class="text-sm">Pantau transaksi batik secara real-time</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-300">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
d="M12 22c5.523 0 10-4.477 10-10V5l-10-3-10 3v7c0 5.523 4.477 10 10 10z"
/> </svg> </span> <div> <p class="font-bold">Keamanan Terjamin</p> <p class="text-sm">Transaksi aman dan terenkripsi</p> </div> </li>        <li class="flex items-start gap-3">
          <span class="text-blue-300">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 20h5v-2a4 4 0 00-5-3.874
                   M9 20H4v-2a4 4 0 015-3.874
                   M12 12a4 4 0 100-8 4 4 0 000 8z"
              />
            </svg>
          </span>
          <div>
            <p class="font-bold">Kolaborasi UMKM</p>
            <p class="text-sm">Jual & promosi produk batik bersama</p>
          </div>
        </li>
      </ul>

      <div class="mt-8 flex justify-around text-center z-10">
        <div>
          <p class="text-2xl font-extrabold">100+</p>
          <p class="text-sm">Product</p>
        </div>
        <div>
          <p class="text-2xl font-extrabold">20K+</p>
          <p class="text-sm">Visited</p>
        </div>
        <div>
          <p class="text-2xl font-extrabold">99.9%</p>
          <p class="text-sm">Uptime</p>
        </div>
      </div>
    </div>
  </div>
</div>
  );
}
