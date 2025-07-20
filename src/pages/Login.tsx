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
  const [showPassword, setShowPassword] = createSignal(false);
  const [formAnimation, setFormAnimation] = createSignal("animate-slide-in-left");
  
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
    
    // Trigger form animation
    setTimeout(() => {
      setFormAnimation("animate-bounce-in");
    }, 200);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      await login(email(), password());
      // Success notification will be handled by AuthContext
    } catch (err: any) {
      setError(err.message || "Login failed");
      // Shake animation on error
      setFormAnimation("animate-pulse");
      setTimeout(() => setFormAnimation(""), 600);
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
      class={`min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 animate-gradient bg-pattern ${
        pageLeaving() ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {/* Floating Background Elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float"></div>
        <div class="absolute top-32 right-20 w-16 h-16 bg-purple-500/20 rounded-full animate-float" style="animation-delay: -1s;"></div>
        <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500/20 rounded-full animate-float" style="animation-delay: -2s;"></div>
        <div class="absolute bottom-32 right-1/3 w-12 h-12 bg-pink-500/20 rounded-full animate-float" style="animation-delay: -3s;"></div>
      </div>

      <button
        class="absolute top-4 left-4 p-3 rounded-xl glass-effect text-white hover:scale-110 transition-all duration-300 z-50 btn-hover-effect"
        onClick={() => navigate(-1)}
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        class="absolute top-4 right-4 p-3 rounded-xl glass-effect text-white hover:scale-110 transition-all duration-300 z-50 btn-hover-effect"
        onClick={toggleTheme}
      >
        {theme() === "light" ? "🌙" : "☀️"}
      </button>

      <div
        class={`glass-effect rounded-3xl shadow-2xl flex max-w-6xl w-full mx-4 overflow-hidden transition-all duration-700 card-hover-effect ${
          pageLeaving() ? "opacity-0 translate-y-10 scale-95" : "opacity-100 translate-y-0 scale-100"
        } ${formAnimation()}`}
      >
        {/* LEFT: Form */}
        <div class="w-1/2 p-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <div class="text-center mb-8">
            <div class="animate-bounce-in">
              <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
                Selamat Datang
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                Masuk ke akun Batik Kita Anda
              </p>
            </div>
          </div>

          {error() && (
            <div class="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-500 text-red-700 dark:text-red-300 rounded-xl animate-bounce-in">
              <div class="flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
                {error()}
              </div>
            </div>
          )}

          <form class="space-y-6" onSubmit={handleSubmit}>
            <div class="space-y-6">
              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  required
                  class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                />
              </div>

              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  🔒 Password
                </label>
                <div class="relative">
                  <input
                    type={showPassword() ? "text" : "password"}
                    placeholder="Masukkan password Anda"
                    required
                    class="w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 backdrop-blur-sm"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword())}
                  >
                    {showPassword() ? (
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.757 6.757M9.878 9.878a3 3 0 000 4.243m4.242-4.243L17.121 17.121M14.121 14.121a3 3 0 01-4.243 0M6.757 6.757L3.636 3.636m0 0l1.414 1.414M5.05 5.05l14.95 14.95" />
                      </svg>
                    ) : (
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex justify-between items-center">
              <label class="flex items-center text-sm text-gray-600 dark:text-gray-300 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <input
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span class="ml-2">Ingat saya</span>
              </label>
              <a
                onClick={handleForgotPassClick}
                href="/forgot-password"
                class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
              >
                Lupa Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading() || isLoading()}
              class="w-full relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed btn-hover-effect"
            >
              <div class="flex items-center justify-center">
                {loading() || isLoading() ? (
                  <>
                    <div class="loading-spinner mr-3"></div>
                    Masuk...
                  </>
                ) : (
                  <>
                    Masuk
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </div>
            </button>
          </form>

          <div class="mt-8 text-center">
            <p class="text-gray-600 dark:text-gray-300">
              Belum punya akun?{" "}
              <a
                href="/register"
                onClick={handleRegisterClick}
                class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold transition-colors cursor-pointer"
              >
                Daftar di sini
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: Sidebar Promo */}
        <div class="w-1/2 bg-gradient-to-br from-blue-700 via-purple-700 to-indigo-700 dark:from-gray-800 dark:to-gray-700 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Animated Background */}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-40 h-40 bg-white/20 rounded-full blur-3xl animate-orbit"></div>
            <div class="w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-float absolute" style="animation-delay: -2s;"></div>
          </div>
          
          <div class="relative z-10 animate-slide-in-right">
            <h2 class="text-4xl font-bold mb-2">Selamat Datang</h2>
            <h3 class="text-3xl font-extrabold mb-8 text-yellow-300">BATIK KITA</h3>

            <ul class="space-y-6 text-sm">
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.2s;">
                <span class="text-blue-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Koleksi Batik Premium</p>
                  <p class="text-blue-100">Temukan batik autentik dengan kualitas terbaik</p>
                </div>
              </li>
              
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.4s;">
                <span class="text-purple-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Harga Terjangkau</p>
                  <p class="text-purple-100">Dapatkan batik berkualitas dengan harga bersahabat</p>
                </div>
              </li>
              
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.6s;">
                <span class="text-yellow-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Dukung UMKM Lokal</p>
                  <p class="text-yellow-100">Berbelanja sambil memberdayakan pengrajin batik</p>
                </div>
              </li>
            </ul>

            <div class="mt-12 flex justify-around text-center animate-fade-in" style="animation-delay: 0.8s;">
              <div class="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p class="text-3xl font-extrabold text-yellow-300">1000+</p>
                <p class="text-sm text-blue-100">Produk Batik</p>
              </div>
              <div class="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p class="text-3xl font-extrabold text-purple-300">50+</p>
                <p class="text-sm text-purple-100">Pengrajin</p>
              </div>
              <div class="p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                <p class="text-3xl font-extrabold text-blue-300">99.9%</p>
                <p class="text-sm text-blue-100">Kepuasan</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
