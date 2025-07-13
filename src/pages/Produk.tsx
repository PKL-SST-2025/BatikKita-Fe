import { createResource, For, Show } from "solid-js";
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

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section class="relative py-20 text-center overflow-hidden bg-white dark:bg-gray-900">
        {/* Animated Glow */}
        <div class="absolute inset-0 flex items-center justify-center z-0">
          <div class="w-72 h-72 bg-rose-400/30 rounded-full blur-3xl animate-orbit absolute top-10 left-10"></div>
          <div class="w-72 h-72 bg-emerald-400/30 rounded-full blur-3xl animate-orbit-reverse absolute bottom-10 right-10"></div>
        </div>

        <div class="relative z-10">
          <h1 class="text-5xl font-heading font-bold text-slate-900 dark:text-white drop-shadow-md mb-4 animate-fade-in-up">
            Koleksi Batik UMKM
          </h1>
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-fade-in-up delay-100">
            Temukan ragam motif batik pilihan hasil karya UMKM terbaik Indonesia. Dukungan Anda adalah semangat mereka.
          </p>
        </div>
      </section>

      {/* Produk Grid */}
      <div class="container mx-auto px-6 py-12 min-h-[60vh]">
        <Show when={products.loading}>
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map(() => (
              <div class="bg-gray-100 dark:bg-gray-800 h-64 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </Show>

        <Show when={products.error}>
          <div class="text-center py-20 text-red-600">Gagal memuat produk. Coba lagi nanti.</div>
        </Show>

        <Show
          when={products() && products().length > 0}
          fallback={<div class="text-center py-20 text-gray-500">Belum ada produk tersedia.</div>}
        >
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 animate-fade-in">
            <For each={products()}>
              {(product: any) => (
                <div class="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 group transform hover:-translate-y-1">
                  <div class="relative mb-4 overflow-hidden rounded-xl">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      class="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span class="absolute top-2 left-2 bg-rose-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      Promo
                    </span>
                  </div>
                  <h2 class="text-lg font-semibold text-slate-800 dark:text-white mb-1 truncate">
                    {product.name}
                  </h2>
                  <p class="text-emerald-600 font-bold mb-3">
                    Rp {product.price.toLocaleString()}
                  </p>
                  <A
                    href={`/produk/${product.id}`}
                    class="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition duration-300"
                  >
                    Lihat Detail
                  </A>
                </div>
              )}
            </For>
          </div>
        </Show>
      </div>
      <Footer />
    </>
  );
}