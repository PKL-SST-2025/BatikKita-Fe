import { createResource, For, Show, createSignal, onMount } from "solid-js";
import { A } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const fetchProducts = async () => {
  const res = await fetch(import.meta.env.VITE_API_URL + "/produk");
  if (!res.ok) throw new Error("Gagal mengambil data produk");
  return res.json();
};

export default function Produk() {
  const [products] = createResource(fetchProducts);
  const [filteredProducts, setFilteredProducts] = createSignal<any[]>([]);
  const [selectedCategory, setSelectedCategory] = createSignal("all");
  const [sortBy, setSortBy] = createSignal("newest");
  const [searchQuery, setSearchQuery] = createSignal("");
  const [viewMode, setViewMode] = createSignal<"grid" | "list">("grid");
  const [animateHero, setAnimateHero] = createSignal(false);

  const categories = [
    { value: "all", label: "Semua Produk", icon: "🎨" },
    { value: "batik-tulis", label: "Batik Tulis", icon: "✍️" },
    { value: "batik-cap", label: "Batik Cap", icon: "🎯" },
    { value: "batik-print", label: "Batik Print", icon: "🖨️" },
    { value: "aksesoris", label: "Aksesoris", icon: "💍" }
  ];

  const sortOptions = [
    { value: "newest", label: "Terbaru" },
    { value: "price-low", label: "Harga Terendah" },
    { value: "price-high", label: "Harga Tertinggi" },
    { value: "popular", label: "Terpopuler" }
  ];

  onMount(() => {
    setTimeout(() => setAnimateHero(true), 100);
  });

  // Filter and sort products
  const filterAndSortProducts = () => {
    if (!products()) return;
    
    let filtered = [...products()];
    
    // Apply search filter
    if (searchQuery()) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchQuery().toLowerCase())
      );
    }
    
    // Apply category filter
    if (selectedCategory() !== "all") {
      filtered = filtered.filter(p => p.category === selectedCategory());
    }
    
    // Apply sorting
    switch (sortBy()) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "popular":
        filtered.sort((a, b) => (b.sold || 0) - (a.sold || 0));
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }
    
    setFilteredProducts(filtered);
  };

  // Update filtered products when dependencies change
  createResource(
    () => [products(), selectedCategory(), sortBy(), searchQuery()],
    filterAndSortProducts
  );

  return (
    <>
      <Navbar />

      {/* Enhanced Hero Section */}
      <section class="relative py-24 overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Animated Background Elements */}
        <div class="absolute inset-0 overflow-hidden">
          <div class="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-3xl animate-blob"></div>
          <div class="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-400 to-orange-400 rounded-full opacity-20 blur-3xl animate-blob animation-delay-2000"></div>
          <div class="absolute -bottom-40 left-1/2 w-80 h-80 bg-gradient-to-br from-green-400 to-blue-400 rounded-full opacity-20 blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div class="relative z-10 container mx-auto px-6 text-center">
          <h1 class={`text-5xl md:text-7xl font-black mb-6 transition-all duration-1000 ${
            animateHero() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Koleksi Batik Premium
            </span>
          </h1>
          
          <p class={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 transition-all duration-1000 delay-200 ${
            animateHero() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            Temukan karya seni batik autentik dari pengrajin terbaik Indonesia. 
            Setiap helai menyimpan cerita dan keindahan budaya nusantara.
          </p>

          {/* Search Bar */}
          <div class={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
            animateHero() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}>
            <div class="relative">
              <input
                type="text"
                placeholder="Cari batik impian Anda..."
                value={searchQuery()}
                onInput={(e) => setSearchQuery(e.currentTarget.value)}
                class="w-full px-6 py-4 pr-12 rounded-full shadow-lg text-gray-800 dark:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-4 focus:ring-purple-500/20 transition-all"
              />
              <button class="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:scale-110 transition-transform">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div class={`flex flex-wrap justify-center gap-8 mt-12 transition-all duration-1000 delay-400 ${
            animateHero() ? "opacity-100" : "opacity-0"
          }`}>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-800 dark:text-white">500+</div>
              <div class="text-gray-600 dark:text-gray-400">Produk Eksklusif</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-800 dark:text-white">100+</div>
              <div class="text-gray-600 dark:text-gray-400">Pengrajin Mitra</div>
            </div>
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-800 dark:text-white">4.9/5</div>
              <div class="text-gray-600 dark:text-gray-400">Rating Pelanggan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter & Controls Section */}
      <section class="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div class="container mx-auto px-6 py-4">
          <div class="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div class="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0">
              <For each={categories}>
                {(category) => (
                  <button
                    onClick={() => setSelectedCategory(category.value)}
                    class={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedCategory() === category.value
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span class="font-medium">{category.label}</span>
                  </button>
                )}
              </For>
            </div>

            {/* Sort & View Controls */}
            <div class="flex items-center gap-3">
              {/* Sort Dropdown */}
              <select
                value={sortBy()}
                onChange={(e) => setSortBy(e.currentTarget.value)}
                class="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <For each={sortOptions}>
                  {(option) => <option value={option.value}>{option.label}</option>}
                </For>
              </select>

              {/* View Mode Toggle */}
              <div class="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  class={`p-2 rounded transition-all ${
                    viewMode() === "grid"
                      ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  class={`p-2 rounded transition-all ${
                    viewMode() === "list"
                      ? "bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-sm"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid/List */}
      <div class="container mx-auto px-6 py-12 min-h-[60vh]">
        <Show when={products.loading}>
          <div class={viewMode() === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" 
            : "space-y-4"
          }>
            <For each={[1, 2, 3, 4, 5, 6, 7, 8]}>
              {() => (
                <div class={viewMode() === "grid" 
                  ? "bg-gray-100 dark:bg-gray-800 h-80 rounded-2xl animate-pulse" 
                  : "bg-gray-100 dark:bg-gray-800 h-32 rounded-2xl animate-pulse"
                }></div>
              )}
            </For>
          </div>
        </Show>

        <Show when={products.error}>
          <div class="text-center py-20">
            <div class="text-6xl mb-4">😕</div>
            <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Oops! Ada Masalah</h3>
            <p class="text-gray-600 dark:text-gray-400">Gagal memuat produk. Silakan coba lagi nanti.</p>
            <button class="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Coba Lagi
            </button>
          </div>
        </Show>

        <Show
          when={filteredProducts() && filteredProducts().length > 0}
          fallback={
            <div class="text-center py-20">
              <div class="text-6xl mb-4">🔍</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Tidak Ada Produk</h3>
              <p class="text-gray-600 dark:text-gray-400">Coba ubah filter atau kata kunci pencarian Anda.</p>
            </div>
          }
        >
          {/* Results Count */}
          <div class="mb-6 text-gray-600 dark:text-gray-400">
            Menampilkan <span class="font-semibold text-gray-800 dark:text-white">{filteredProducts().length}</span> produk
          </div>

          {/* Grid View */}
          <Show when={viewMode() === "grid"}>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <For each={filteredProducts()}>
                {(product: any) => (
                  <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
                    <div class="relative aspect-square overflow-hidden">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      {/* Overlay on Hover */}
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div class="absolute bottom-4 left-4 right-4">
                          <A
                            href={`/produk/${product.id}`}
                            class="block w-full text-center px-4 py-3 bg-white text-gray-800 rounded-lg font-semibold transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            Lihat Detail
                          </A>
                        </div>
                      </div>
                      {/* Badges */}
                      <div class="absolute top-3 left-3 flex gap-2">
                        <Show when={product.discount}>
                          <span class="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discount}%
                          </span>
                        </Show>
                        <Show when={product.isNew}>
                          <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            Baru
                          </span>
                        </Show>
                      </div>
                      {/* Wishlist Button */}
                      <button class="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white hover:scale-110">
                        <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                    <div class="p-5">
                      <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">
                        {product.name}
                      </h3>
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {product.description || "Batik berkualitas tinggi dengan motif tradisional"}
                      </p>
                      <div class="flex items-center justify-between">
                        <div>
                          <Show when={product.originalPrice}>
                            <p class="text-sm text-gray-500 line-through">
                              Rp {product.originalPrice.toLocaleString()}
                            </p>
                          </Show>
                          <p class="text-xl font-bold text-purple-600 dark:text-purple-400">
                            Rp {product.price.toLocaleString()}
                          </p>
                        </div>
                        <div class="flex items-center gap-1">
                          <span class="text-yellow-400">⭐</span>
                          <span class="text-sm text-gray-600 dark:text-gray-400">
                            {product.rating || "4.5"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>

          {/* List View */}
          <Show when={viewMode() === "list"}>
            <div class="space-y-4">
              <For each={filteredProducts()}>
                {(product: any) => (
                  <div class="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                    <div class="flex flex-col md:flex-row">
                      <div class="relative w-full md:w-48 h-48 md:h-auto overflow-hidden">
                        <img
                          src={product.image_url}
                          alt={product.name}
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          loading="lazy"
                        />
                        <Show when={product.discount}>
                          <span class="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            -{product.discount}%
                          </span>
                        </Show>
                      </div>
                      <div class="flex-1 p-6">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                          <div class="flex-1">
                            <h3 class="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                              {product.name}
                            </h3>
                            <p class="text-gray-600 dark:text-gray-400 mb-3">
                              {product.description || "Batik berkualitas tinggi dengan motif tradisional yang indah"}
                            </p>
                            <div class="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span class="flex items-center gap-1">
                                <span>🏷️</span> {product.category || "Batik Tulis"}
                              </span>
                              <span class="flex items-center gap-1">
                                <span>⭐</span> {product.rating || "4.5"} ({product.reviews || "120"} ulasan)
                              </span>
                              <span class="flex items-center gap-1">
                                <span>📦</span> Terjual {product.sold || "200"}+
                              </span>
                            </div>
                          </div>
                          <div class="flex flex-col items-end gap-3">
                            <div class="text-right">
                              <Show when={product.originalPrice}>
                                <p class="text-sm text-gray-500 line-through">
                                  Rp {product.originalPrice.toLocaleString()}
                                </p>
                              </Show>
                              <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                Rp {product.price.toLocaleString()}
                              </p>
                            </div>
                            <div class="flex gap-2">
                              <button class="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                              <A
                                href={`/produk/${product.id}`}
                                class="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                              >
                                Lihat Detail
                              </A>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </Show>
        </Show>
      </div>

      <Footer />

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}