import { createSignal, onMount } from "solid-js";
import { useNavigate } from "@solidjs/router";

export default function ForgotPassword() {
  const [email, setEmail] = createSignal("");
  const [theme, setTheme] = createSignal("light");
  const [pageLeaving] = createSignal(false);
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

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log("Reset password for:", email());

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
        class={`bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 w-full max-w-md transition-all duration-500 ${
          pageLeaving() ? "opacity-0 translate-y-10" : "opacity-100 translate-y-0"
        }`}
      >
        <h2 class="text-3xl font-bold text-center mb-4 dark:text-white">Reset Password</h2>
        <p class="text-center text-sm text-blue-600 dark:text-blue-300 mb-6">
          Masukkan email untuk mereset password
        </p>

        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="transition duration-300 hover:scale-105">
            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-200">Email</label>
            <input
              type="email"
              placeholder="Masukkan email anda"
              required
              class="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white text-sm rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition duration-300"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
          </div>

          <button
            type="submit"
            class="w-full text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 hover:scale-105"
          >
            Kirim Link Reset →
          </button>
        </form>
      </div>
    </div>
  );
}
