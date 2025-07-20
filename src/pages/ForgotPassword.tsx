import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";
import { showNotification } from "../utils/notifications";

export default function ForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [theme, setTheme] = createSignal("light");
  const [pageLeaving, setPageLeaving] = createSignal(false);
  const [isLoading, setIsLoading] = createSignal(false);
  const [formAnimation, setFormAnimation] = createSignal("animate-slide-in-left");
  const [isEmailSent, setIsEmailSent] = createSignal(false);
  
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
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setIsEmailSent(true);
      setFormAnimation("animate-pulse");
      
      showNotification("📧 Link reset password telah dikirim ke email Anda!", "success");
      
      // Auto redirect after 5 seconds
      setTimeout(() => {
        navigate("/login");
      }, 5000);
      
    } catch (error) {
      showNotification("❌ Gagal mengirim email reset password", "error");
      setFormAnimation("animate-pulse");
      setTimeout(() => setFormAnimation(""), 600);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setPageLeaving(true);
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  return (
    <div
      class={`min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 animate-gradient bg-pattern ${
        pageLeaving() ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      {/* Floating Background Elements */}
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute top-10 left-10 w-20 h-20 bg-emerald-500/20 rounded-full animate-float"></div>
        <div class="absolute top-32 right-20 w-16 h-16 bg-teal-500/20 rounded-full animate-float" style="animation-delay: -1s;"></div>
        <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-cyan-500/20 rounded-full animate-float" style="animation-delay: -2s;"></div>
        <div class="absolute bottom-32 right-1/3 w-12 h-12 bg-blue-500/20 rounded-full animate-float" style="animation-delay: -3s;"></div>
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
        class={`glass-effect rounded-3xl shadow-2xl max-w-md w-full mx-4 overflow-hidden transition-all duration-700 card-hover-effect ${
          pageLeaving() ? "opacity-0 translate-y-10 scale-95" : "opacity-100 translate-y-0 scale-100"
        } ${formAnimation()}`}
      >
        <div class="p-12 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl">
          <div class="text-center mb-8">
            <div class="animate-bounce-in">
              {!isEmailSent() ? (
                <>
                  <div class="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 0h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600 mb-2">
                    Lupa Password?
                  </h1>
                  <p class="text-gray-600 dark:text-gray-300">
                    Jangan khawatir, kami akan mengirimkan link reset password ke email Anda
                  </p>
                </>
              ) : (
                <>
                  <div class="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                    <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600 mb-2">
                    Email Terkirim!
                  </h1>
                  <p class="text-gray-600 dark:text-gray-300">
                    Silakan cek email Anda dan ikuti instruksi untuk reset password
                  </p>
                </>
              )}
            </div>
          </div>

          {!isEmailSent() ? (
            <form class="space-y-6" onSubmit={handleSubmit}>
              <div class="input-focus-effect transition-all duration-300 hover:scale-[1.02]">
                <label class="block mb-2 text-sm font-semibold text-gray-700 dark:text-gray-200">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  placeholder="Masukkan email yang terdaftar"
                  required
                  class="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-4 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all duration-300 backdrop-blur-sm"
                  value={email()}
                  onInput={(e) => setEmail(e.currentTarget.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading()}
                class="w-full relative overflow-hidden bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed btn-hover-effect"
              >
                <div class="flex items-center justify-center">
                  {isLoading() ? (
                    <>
                      <div class="loading-spinner mr-3"></div>
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Link Reset
                      <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </div>
              </button>
            </form>
          ) : (
            <div class="space-y-6">
              <div class="p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500 rounded-xl">
                <div class="flex items-start space-x-3">
                  <svg class="w-6 h-6 text-green-600 dark:text-green-400 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h3 class="text-sm font-medium text-green-800 dark:text-green-200">
                      Link reset telah dikirim
                    </h3>
                    <p class="text-sm text-green-700 dark:text-green-300 mt-1">
                      Cek folder inbox atau spam pada email <strong>{email()}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div class="text-center text-sm text-gray-600 dark:text-gray-300">
                <p class="mb-2">Tidak menerima email?</p>
                <button 
                  onClick={() => setIsEmailSent(false)}
                  class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold transition-colors"
                >
                  Kirim ulang
                </button>
              </div>
            </div>
          )}

          <div class="mt-8 text-center">
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              Sudah ingat password Anda?
            </p>
            <button
              onClick={handleBackToLogin}
              class="text-emerald-600 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 font-semibold transition-all duration-300 hover:scale-105 cursor-pointer inline-flex items-center"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kembali ke Login
            </button>
          </div>

          {isEmailSent() && (
            <div class="mt-6 text-center">
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Anda akan diarahkan ke halaman login dalam 5 detik...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
