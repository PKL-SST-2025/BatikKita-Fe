import { createSignal, onMount } from "solid-js";
import { useAuth } from "../store/AuthContext";
import { useNavigate } from "@solidjs/router";

export default function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [theme, setTheme] = createSignal("light");
  const [pageLeaving, setPageLeaving] = createSignal(false);
  const { register } = useAuth();
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
    setPageLeaving(true);
    setTimeout(async () => {
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
      navigate("/dashboard");
    }, 500);
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
      class={`min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-700 to-blue-600 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 ${
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
        class="absolute top-4 right-4 p-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white hover:scale-105 transition"
        onClick={toggleTheme}
      >
        {theme() === "light" ? "🌙 Dark" : "☀️ Light"}
      </button>

      <div
        class={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex max-w-4xl w-full overflow-hidden transition-all duration-500 ${
          pageLeaving() ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
      >
        {/* LEFT: Form */}
        <div class="w-1/2 p-8">
          <h2 class="text-3xl font-bold text-center mb-4 dark:text-white">Create Account</h2>
          <p class="text-center text-sm text-blue-600 dark:text-blue-300 mb-6">
            Join BATIKITA and manage your assets
          </p>

          <form class="space-y-4" onSubmit={handleSubmit}>
            <div class="transition duration-300 hover:scale-105">
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                required
                class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-300"
                onInput={(e) => setName(e.currentTarget.value)}
              />
            </div>

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

            <button
              type="submit"
              class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 hover:scale-105"
            >
              Register →
            </button>
          </form>

          <p class="text-center text-sm mt-4 dark:text-gray-300">
            Already have an account?{" "}
            <a
              href="/login"
              onClick={handleLoginClick}
              class="text-blue-600 dark:text-blue-300 hover:underline cursor-pointer"
            >
              Sign In here
            </a>
          </p>
        </div>

        {/* RIGHT: Why Join Us */}
        <div class="w-1/2 bg-gradient-to-br from-blue-700 to-indigo-700 dark:from-gray-800 dark:to-gray-700 text-white p-8 flex flex-col justify-center relative overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-40 h-40 bg-white/30 rounded-full blur-3xl animate-orbit"></div>
          </div>

          <h2 class="text-3xl font-bold mb-2 z-10">Why Join Us?</h2>
          <ul class="space-y-4 text-sm z-10">
            <li class="flex items-start gap-3">
              <span class="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m0-6a9 9 0 110 18 9 9 0 010-18z" />
                </svg>
              </span>
              <div>
                <p class="font-bold">Otomatisasi Cerdas</p>
                <p class="text-sm">Hemat waktu untuk kunjungi website toko batik online terpercaya kapan saja, dimana saja</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405M19 13v6m-6 0a9 9 0 100-18 9 9 0 000 18z" />
                </svg>
              </span>
              <div>
                <p class="font-bold">Akses Mudah</p>
                <p class="text-sm">Akses Website dan Produk mudah</p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="text-blue-300">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-1.414 1.414A8 8 0 1112 4v4l4 4m0 0l4-4m-4 4V4" />
                </svg>
              </span>
              <div>
                <p class="font-bold">Dukungan 24/7</p>
                <p class="text-sm">Kami siap bantu kapan saja</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}