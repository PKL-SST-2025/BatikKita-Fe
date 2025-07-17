import { For, Show } from "solid-js";
import { useFavorites } from "../store/FavoriteContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavoriteButton from "../components/FavoriteButton";

export default function Favorites() {
  const { favorites, favoriteCount } = useFavorites();

  return (
    <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />

      <main class="flex-grow pt-20">
        {/* Header */}
        <section class="py-12 px-6 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20">
          <div class="max-w-6xl mx-auto">
            <div class="text-center">
              <h1 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                ❤️ Favorit Saya
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-300 mb-6">
                Kumpulan produk batik favorit Anda
              </p>
              
              <div class="flex items-center justify-center gap-4">
                <div class="bg-white dark:bg-gray-800 px-6 py-3 rounded-full shadow-lg">
                  <span class="text-lg font-semibold text-gray-800 dark:text-white">
                    Total: {favoriteCount()} produk
                  </span>
                </div>
                
              </div>
            </div>
          </div>
        </section>

        {/* Favorites Content */}
        <section class="py-12 px-6">
          <div class="max-w-6xl mx-auto">
            <Show
              when={favoriteCount() > 0}
              fallback={
                <div class="text-center py-20">
                  <div class="text-8xl mb-6">💔</div>
                  <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                    Belum Ada Favorit
                  </h2>
                  <p class="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Mulai eksplorasi dan tambahkan produk batik favorit Anda!
                  </p>
                  <a
                    href="/produk"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Jelajahi Produk
                  </a>
                </div>
              }
            >
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <For each={favorites()}>
                  {(product) => (
                    <div class="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                      <div class="relative h-64 overflow-hidden">
                        <img
                          src={product.product.images.find((img: any) => img.is_primary)?.image_url || product.product.images[0]?.image_url}
                          alt={product.product.name}
                          class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                        />
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        {/* Favorite Button */}
                        <div class="absolute top-4 right-4">
                          <FavoriteButton product={product} size="md" />
                        </div>

                        {/* Quick Actions */}
                        <div class="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <a
                            href={`/produk/${product.id}`}
                            class="flex-1 bg-white/90 text-gray-800 text-center py-2 px-4 rounded-lg font-semibold hover:bg-white transition-colors duration-300"
                          >
                            Lihat Detail
                          </a>
                          <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors duration-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H17M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div class="p-6">
                        <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                          {product.product.name}
                        </h3>
                        
                        <div class="flex items-center justify-between mb-4">
                          <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {product.product.discount_price || product.product.price}
                          </span>
                        </div>
                        
                        <div class="flex gap-2">
                          <a
                            href={`/produk/${product.product.id}`}
                            class="flex-1 text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                          >
                            Beli Sekarang
                          </a>
                          <button class="px-4 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 rounded-lg hover:bg-purple-600 hover:text-white dark:hover:bg-purple-400 dark:hover:text-gray-900 transition-all duration-300">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7H17M9 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </For>
              </div>

              {/* Recommendations */}
              <div class="mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
                <div class="text-center mb-8">
                  <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                    Mungkin Anda Juga Suka
                  </h2>
                  <p class="text-gray-600 dark:text-gray-300">
                    Rekomendasi produk berdasarkan favorit Anda
                  </p>
                </div>
                
                <div class="text-center">
                  <a
                    href="/produk"
                    class="inline-flex items-center gap-2 px-8 py-4 bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-full hover:border-purple-600 dark:hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400 font-semibold transition-all duration-300"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Lihat Produk Lainnya
                  </a>
                </div>
              </div>
            </Show>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
