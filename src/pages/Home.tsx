import { createSignal, onMount, For } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const produkUnggulan = [
  { id: "batik1", name: "Mega Mendung", image: "/images/batik-1.jpg" },
  { id: "batik2", name: "Parang", image: "/images/batik-2.jpg" },
  { id: "batik3", name: "Truntum", image: "/images/batik-3.jpg" },
];

export default function Home() {
  const [showOverlay, setShowOverlay] = createSignal(true);

  onMount(() => {
    setTimeout(() => setShowOverlay(false), 1000);
  });

  return (
    <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {showOverlay() && (
        <div class="fixed inset-0 bg-white z-50 animate-fade-out pointer-events-none" />
      )}

      <Navbar />

      <main class="flex-grow">
        {/* 🎥 Hero Section */}
        <section class="relative h-[600px] flex items-center justify-center text-center text-white overflow-hidden">
          <video
            autoplay
            loop
            muted
            playsinline
            class="absolute top-0 left-0 w-full h-full object-cover z-0"
          >
            <source src="/videos/batik-bg.mp4" type="video/mp4" />
          </video>
          <div class="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10" />
          <div class="relative z-20 p-8 max-w-2xl animate-fade-in-up">
            <h1 class="text-5xl font-extrabold mb-6">Selamat Datang di Batik Lokal</h1>
            <p class="text-lg mb-8">
              Temukan koleksi batik terbaik dari para pengrajin lokal Indonesia. Kami mendukung UMKM agar terus berkembang dengan menghadirkan produk batik berkualitas tinggi ke pasar nasional maupun internasional.
            </p>
            <a
              href="/produk"
              class="inline-block px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded shadow hover:bg-blue-700 transition duration-300"
            >
              Lihat Produk
            </a>
          </div>
        </section>

        {/* 🧵 Tentang UMKM Batik */}
        <section class="px-8 py-16 bg-white dark:bg-gray-900">
          <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center animate-fade-in">
            <div>
              <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Mengapa Mendukung UMKM Batik?
              </h2>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                UMKM batik adalah bagian penting dari budaya dan ekonomi lokal. Kami percaya setiap lembar batik membawa cerita dan makna mendalam dari daerah asalnya.
              </p>
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed">
                Dengan membeli batik lokal, Anda tidak hanya mendapatkan produk unik dan berkualitas, tetapi juga membantu keberlanjutan pengrajin tradisional dan pertumbuhan ekonomi di berbagai daerah Indonesia.
              </p>
            </div>
            <div>
              <img
                src="/images/umkm-batik.jpg"
                alt="Pengrajin Batik Lokal"
                class="mx-auto rounded-xl border-4 border-blue-100 shadow-2xl w-full max-w-md object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </section>

        {/* 🧵 Produk Unggulan */}
        <section class="bg-gray-50 dark:bg-gray-800 py-16 px-8">
          <div class="max-w-6xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-10">Produk Unggulan</h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 animate-fade-in-up">
              <For each={produkUnggulan}>
                {(item) => (
                  <div class="bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                    <img
                      src={item.image}
                      alt={item.name}
                      class="w-full h-52 object-cover"
                    />
                    <div class="p-4 text-left">
                      <h3 class="text-xl font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                      <p class="text-gray-600 dark:text-gray-300 mt-2 text-sm">
                        Motif klasik yang mencerminkan filosofi budaya Indonesia dengan sentuhan modern.
                      </p>
                      <a
                        href="/produk"
                        class="inline-block mt-4 text-blue-600 dark:text-blue-400 font-medium hover:underline"
                      >
                        Lihat Detail
                      </a>
                    </div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* 🙌 Testimoni */}
        <section class="bg-white dark:bg-gray-900 py-20 px-8">
          <div class="max-w-5xl mx-auto text-center">
            <h2 class="text-3xl font-bold text-gray-800 dark:text-white mb-10">Apa Kata Mereka?</h2>
            <div class="grid md:grid-cols-3 gap-8 animate-fade-in">
              {[
                { name: "Dewi", comment: "Kualitas batiknya luar biasa, dan pengirimannya cepat!" },
                { name: "Rizky", comment: "Saya bangga bisa pakai produk lokal seindah ini." },
                { name: "Lina", comment: "Batik Lokal benar-benar mendukung UMKM, saya salut!" },
              ].map((user) => (
                <div class="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
                  <p class="text-gray-700 dark:text-gray-300 mb-4">"{user.comment}"</p>
                  <h4 class="text-blue-700 dark:text-blue-400 font-semibold">— {user.name}</h4>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section
          class="relative bg-blue-700 text-white py-20 px-8 text-center overflow-hidden"
          style={{
            "background-image": "url('/images/batik-cover.jpg')",
            "background-size": "cover",
            "background-position": "center",
          }}
        >
          <div class="absolute inset-0 bg-black bg-opacity-50 z-0" />
          <div class="relative z-10 animate-fade-in-up">
            <h2 class="text-3xl font-bold mb-4">Dukung UMKM Hari Ini</h2>
            <p class="max-w-xl mx-auto text-lg mb-8">
              Bergabunglah bersama kami untuk menjadikan batik lokal sebagai bagian dari gaya hidup modern Anda.
            </p>
            <a
              href="/produk"
              class="inline-block px-8 py-4 bg-white text-blue-700 font-bold rounded shadow hover:bg-gray-100 transition"
            >
              Jelajahi Produk
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}