
import { createSignal, onCleanup, onMount } from "solid-js";
import { useAuth } from "../store/AuthContext";


export default function Navbar() {
  const [showNavbar, setShowNavbar] = createSignal(true);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const { user } = useAuth();
  let lastScrollY = 0;

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      setShowNavbar(false);
    } else {
      setShowNavbar(true);
    }
    lastScrollY = currentScrollY;
  };

  const toggleMenu = () => setMenuOpen(!menuOpen());

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/produk" },
    { name: "Tentang", href: "/about" },
    { name: "Kontak", href: "/contact" },
    ...(user()?.role === "admin" ? [{ name: "Dashboard", href: "/dashboard" }] : [])
  ];

  return (
    <nav
      class={`bg-white/70 dark:bg-gray-800/60 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 shadow-lg fixed w-full z-50 transition-transform duration-500 ${
        showNavbar() ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div class="max-w-screen-xl flex items-center justify-between mx-auto py-1 px-4 md:py-[6px] md:px-6">
        {/* Logo */}
        <a href="/" class="flex items-center">
          <img
            src="/images/logo.webp"
            class="h-[35px] max-h-[35px] w-auto ml-4 md:ml-6"
            alt="Logo Batik"
          />
        </a>

        {/* Dropdown Menu */}
        <div
          id="mobile-menu"
          class={`flex-col space-y-4 mt-6 absolute right-6 top-full bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl w-56 md:w-60 p-6 z-50 transition-all duration-300 ${
            menuOpen() ? "flex" : "hidden"
          }`}
        >
          {menuItems.map((item) => (
            <a
              href={item.href}
              class="block px-3 py-2 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-300"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Icon + Toggle */}
        <div class="flex items-center space-x-3">
          <a
            href="/cart"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <svg
              class="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H17M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
          </a>
          <a
            href="/profile"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <svg
              class="w-5 h-5 md:w-6 md:h-6"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M5.121 17.804A8.962 8.962 0 0112 15a8.962 8.962 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </a>
          <button
            onClick={toggleMenu}
            type="button"
            class="inline-flex items-center p-1 text-sm text-gray-500 dark:text-gray-400 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={menuOpen()}
          >
            <span class="sr-only">Toggle menu</span>
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}