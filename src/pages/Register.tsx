import { createSignal, onMount } from "solid-js";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "@solidjs/router";

export default function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [theme, setTheme] = createSignal("light");
  const [pageLeaving, setPageLeaving] = createSignal(false);
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);
  const [showPassword, setShowPassword] = createSignal(false);
  const [showConfirmPassword, setShowConfirmPassword] = createSignal(false);
  const [formAnimation, setFormAnimation] = createSignal("animate-slide-in-left");
  
  const { register, loading } = useAuth();
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
    
    if (password() !== confirmPassword()) {
      setError("Password dan konfirmasi password tidak cocok");
      setFormAnimation("animate-pulse");
      setTimeout(() => setFormAnimation(""), 600);
      return;
    }
    
    if (password().length < 6) {
      setError("Password minimal 6 karakter");
      setFormAnimation("animate-pulse");
      setTimeout(() => setFormAnimation(""), 600);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Split name into first and last name
      const nameParts = name().trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';
      
      await register({
        username: email(), // Use email as username for simplicity
        email: email(),
        password: password(),
        first_name,
        last_name
      });
      // Success notification will be handled by AuthContext
    } catch (err: any) {
      setError(err.message || "Registration failed");
      setFormAnimation("animate-pulse");
      setTimeout(() => setFormAnimation(""), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginClick = (e: Event) => {
    e.preventDefault();
    setPageLeaving(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div
      class={`min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 animate-gradient bg-pattern ${
        pageLeaving() ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {/* Floating Background Elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 right-10 w-20 h-20 bg-purple-500/20 rounded-full animate-float"></div>
        <div class="absolute top-32 left-20 w-16 h-16 bg-pink-500/20 rounded-full animate-float" style="animation-delay: -1s;"></div>
        <div class="absolute bottom-20 right-1/4 w-24 h-24 bg-indigo-500/20 rounded-full animate-float" style="animation-delay: -2s;"></div>
        <div class="absolute bottom-32 left-1/3 w-12 h-12 bg-blue-500/20 rounded-full animate-float" style="animation-delay: -3s;"></div>
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
              <h1 class="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-2">
                Bergabung Dengan Kami
              </h1>
              <p class="text-gray-600 dark:text-gray-300">
                Buat akun Batik Kita Anda sekarang
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

          <form class="space-y-5" onSubmit={handleSubmit}>
            <div class="space-y-5">
              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  👤 Nama Lengkap
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                />
              </div>

              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email Anda"
                  required
                  class="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
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
                    placeholder="Masukkan password Anda (min. 6 karakter)"
                    required
                    class="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                    value={password()}
                    onInput={(e) => setPassword(e.currentTarget.value)}
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowPassword(!showPassword())}
                  >
                    {showPassword() ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  🔐 Konfirmasi Password
                </label>
                <div class="relative">
                  <input
                    type={showConfirmPassword() ? "text" : "password"}
                    placeholder="Konfirmasi password Anda"
                    required
                    class="w-full px-4 py-3 pr-12 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-purple-500/30 focus:border-purple-500 transition-all duration-300 backdrop-blur-sm"
                    value={confirmPassword()}
                    onInput={(e) => setConfirmPassword(e.currentTarget.value)}
                  />
                  <button
                    type="button"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                  >
                    {showConfirmPassword() ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <input
                type="checkbox"
                required
                class="w-4 h-4 text-purple-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-purple-500 focus:ring-2"
              />
              <label class="ml-2 text-sm text-gray-600 dark:text-gray-300">
                Saya setuju dengan <span class="text-purple-600 dark:text-purple-400 cursor-pointer hover:underline">syarat dan ketentuan</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading() || isLoading()}
              class="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed btn-hover-effect"
            >
              <div class="flex items-center justify-center">
                {loading() || isLoading() ? (
                  <>
                    <div class="loading-spinner mr-3"></div>
                    Mendaftar...
                  </>
                ) : (
                  <>
                    Daftar Sekarang
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
              Sudah punya akun?{" "}
              <a
                href="/login"
                onClick={handleLoginClick}
                class="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 font-semibold transition-colors cursor-pointer"
              >
                Masuk di sini
              </a>
            </p>
          </div>
        </div>

        {/* RIGHT: Benefits */}
        <div class="w-1/2 bg-gradient-to-br from-purple-700 via-pink-700 to-indigo-700 dark:from-gray-800 dark:to-gray-700 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Animated Background */}
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-40 h-40 bg-white/20 rounded-full blur-3xl animate-orbit"></div>
            <div class="w-32 h-32 bg-pink-300/20 rounded-full blur-2xl animate-float absolute" style="animation-delay: -2s;"></div>
          </div>
          
          <div class="relative z-10 animate-slide-in-right">
            <h2 class="text-4xl font-bold mb-2">Bergabunglah</h2>
            <h3 class="text-3xl font-extrabold mb-8 text-yellow-300">BATIK KITA</h3>

            <ul class="space-y-6 text-sm">
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.2s;">
                <span class="text-pink-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Akses Eksklusif</p>
                  <p class="text-pink-100">Dapatkan akses ke koleksi batik premium dan limited edition</p>
                </div>
              </li>
              
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.4s;">
                <span class="text-purple-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Diskon Spesial</p>
                  <p class="text-purple-100">Nikmati diskon khusus member dan penawaran menarik</p>
                </div>
              </li>
              
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.6s;">
                <span class="text-yellow-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Wishlist & Favorit</p>
                  <p class="text-yellow-100">Simpan batik favorit dan dapatkan notifikasi update</p>
                </div>
              </li>
              
              <li class="flex items-start gap-4 animate-slide-in-right" style="animation-delay: 0.8s;">
                <span class="text-indigo-300 p-2 bg-white/10 rounded-lg">
                  <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <div>
                  <p class="font-bold text-lg">Support Prioritas</p>
                  <p class="text-indigo-100">Dapatkan bantuan cepat dari tim customer service kami</p>
                </div>
              </li>
            </ul>

            <div class="mt-12 p-6 bg-white/10 rounded-xl backdrop-blur-sm animate-fade-in" style="animation-delay: 1s;">
              <p class="text-center text-lg font-semibold mb-2">🎉 Bonus Pendaftaran</p>
              <p class="text-center text-sm text-gray-200">Dapatkan voucher diskon 20% untuk pembelian pertama Anda!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
