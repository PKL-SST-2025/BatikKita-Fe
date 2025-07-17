import { createSignal, onCleanup, onMount, Show } from "solid-js";
import { useAuth } from "../store/AuthContext";
import { useFavorites } from "../store/FavoriteContext";
import { useCart } from "../store/CartContext";

export default function Navbar() {
  const [showNavbar, setShowNavbar] = createSignal(true);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [showNotifications, setShowNotifications] = createSignal(false);
  const [notificationCount] = createSignal(3); // Removed unused setter
  const { user } = useAuth();
  const { favoriteCount } = useFavorites();
  const { getCartCount } = useCart();
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

  const toggleMenu = () => {
    setMenuOpen(!menuOpen());
    setShowNotifications(false);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications());
    setMenuOpen(false);
  };

  onMount(() => {
    window.addEventListener("scroll", handleScroll);
  });

  onCleanup(() => {
    window.removeEventListener("scroll", handleScroll);
  });

  const menuItems = [
    { name: "Beranda", href: "/" },
    { name: "Produk", href: "/produk" },
    ...(user() ? [{ name: "Favorit", href: "/favorites" }] : []),
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

        {/* Simple Notification Dropdown - Only show when user is logged in */}
        <Show when={showNotifications() && user()}>
          <div class="absolute right-6 top-full mt-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border border-white/30 dark:border-white/10 rounded-2xl shadow-2xl w-80 z-50">
            <div class="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
              <h3 class="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                🔔 Notifikasi
              </h3>
            </div>
            <div class="p-4">
              <div class="space-y-3">
                <div class="flex items-start gap-3 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg">
                  <span class="text-xl">🛒</span>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-white">Pesanan Baru</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Ada pesanan baru dari Dewi Sartika</p>
                    <span class="text-xs text-gray-500">2 menit lalu</span>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <span class="text-xl">⚠️</span>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-white">Stok Rendah</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Batik Truntum stok tersisa 3 buah</p>
                    <span class="text-xs text-gray-500">1 jam lalu</span>
                  </div>
                </div>
                <div class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg">
                  <span class="text-xl">✅</span>
                  <div>
                    <h4 class="font-medium text-gray-800 dark:text-white">Pembayaran Diterima</h4>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Pembayaran order #ORD001 berhasil</p>
                    <span class="text-xs text-gray-500">3 jam lalu</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
              <a
                href="/notifications"
                class="block w-full text-center text-blue-600 dark:text-blue-400 hover:text-blue-800 text-sm py-2"
              >
                Lihat semua notifikasi →
              </a>
            </div>
          </div>
        </Show>

        {/* Icon + Toggle */}
        <div class="flex items-center space-x-3">
          {/* Favorites - Only show when logged in */}
          <Show when={user()}>
            <a
              href="/favorites"
              class="relative text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition"
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
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              <Show when={favoriteCount() > 0}>
                <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {favoriteCount()}
                </span>
              </Show>
            </a>
          </Show>

          {/* Cart */}
          <a
            href="/cart"
            class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition relative"
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
            <Show when={getCartCount() > 0}>
              <span class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getCartCount()}
              </span>
            </Show>
          </a>

          {/* Notifications - Only show when logged in */}
          <Show when={user()}>
            <button
              onClick={toggleNotifications}
              class="relative text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
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
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              
              {/* Badge */}
              <Show when={notificationCount() > 0}>
                <span class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium animate-pulse">
                  {notificationCount()}
                </span>
              </Show>
            </button>
          </Show>

          {/* Profile */}
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

          {/* Menu */}
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