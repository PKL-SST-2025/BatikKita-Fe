import { onMount, createSignal } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const [visible, setVisible] = createSignal(false);

  onMount(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    const el = document.querySelector("#about-content");
    if (el) observer.observe(el);

    return () => observer.disconnect();
  });

  return (
    <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      <Navbar />

      {/* Glow Elements */}
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-purple-400 opacity-25 blur-3xl rounded-full animate-float pointer-events-none z-0" />
      <div class="absolute bottom-[-6rem] -right-40 w-96 h-96 bg-blue-500 opacity-20 rounded-full blur-3xl animate-float pointer-events-none z-0" />

      {/* About Content */}
      <main class="flex-grow">
        <div id="about-content" class="relative z-10 container mx-auto px-6 py-20">
          <h1
            class={`text-4xl md:text-5xl font-extrabold text-center mb-10 transition-all duration-700 ease-out ${
              visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            } text-gray-900 dark:text-white`}
          >
            Tentang <span class="text-blue-600 dark:text-blue-400">Batik Kita</span>
          </h1>
<div class="mt-10 flex justify-center transition-all duration-1000 delay-100 ease-out">
            <img
              src="/images/logo.png"
              alt="Tentang Kami"
              class={`w-40 drop-shadow-xl dark:opacity-90 transition-transform duration-700 ${
    visible() ? "scale-100 opacity-100" : "scale-95 opacity-0"
  }`}

            />
          </div>
          <div
            class={`max-w-3xl mx-auto text-lg leading-relaxed text-gray-700 dark:text-gray-300 space-y-6 transition-all duration-700 ease-out ${
              visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <p>
              <strong class="text-blue-700 dark:text-blue-300">Batik Kita</strong> adalah inisiatif UMKM yang berfokus pada pelestarian dan pengembangan karya batik tradisional Indonesia.
              Kami menggabungkan keindahan tradisi dengan sentuhan modern untuk menciptakan produk berkualitas tinggi.
            </p>
            <p>
              Visi kami adalah <strong>memberdayakan komunitas lokal</strong> dan melestarikan seni batik sebagai warisan budaya Indonesia.
              Setiap produk kami diciptakan dengan penuh dedikasi dan apresiasi terhadap kekayaan budaya bangsa.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}