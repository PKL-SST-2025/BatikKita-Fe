import { onMount, createSignal, For, Show } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const [visible, setVisible] = createSignal(false);
  const [activeValue, setActiveValue] = createSignal(0);
  const [statsVisible, setStatsVisible] = createSignal(false);

  const values = [
    {
      icon: "🎨",
      title: "Warisan Budaya",
      description: "Melestarikan seni batik tradisional Indonesia dengan sentuhan kontemporer"
    },
    {
      icon: "🤝",
      title: "Pemberdayaan Komunitas",
      description: "Mendukung pengrajin lokal dan mengembangkan ekonomi kreatif berkelanjutan"
    },
    {
      icon: "💎",
      title: "Kualitas Premium",
      description: "Setiap produk dibuat dengan standar tertinggi dan perhatian detail"
    },
    {
      icon: "🌍",
      title: "Jangkauan Global",
      description: "Memperkenalkan keindahan batik Indonesia ke pasar internasional"
    }
  ];

  const stats = [
    { number: "500+", label: "Pengrajin Mitra", icon: "👥" },
    { number: "10K+", label: "Produk Terjual", icon: "📦" },
    { number: "50+", label: "Motif Eksklusif", icon: "🎭" },
    { number: "4.9", label: "Rating Pelanggan", icon: "⭐" }
  ];

  const milestones = [
    { year: "2020", event: "Batik Kita didirikan dengan 5 pengrajin lokal", icon: "🚀" },
    { year: "2021", event: "Ekspansi ke 3 kota di Jawa Tengah", icon: "📍" },
    { year: "2022", event: "Peluncuran platform digital dan e-commerce", icon: "💻" },
    { year: "2023", event: "Kolaborasi internasional pertama", icon: "🌏" },
    { year: "2024", event: "Pembukaan gallery dan workshop center", icon: "🏛️" }
  ];

  const team = [
    { name: "Siti Nurhaliza", role: "Founder & CEO", image: "👩", quote: "Batik adalah jiwa Indonesia" },
    { name: "Budi Santoso", role: "Head of Production", image: "👨", quote: "Kualitas adalah prioritas kami" },
    { name: "Maya Putri", role: "Creative Director", image: "👩", quote: "Tradisi bertemu inovasi" },
    { name: "Rizky Ahmad", role: "Community Manager", image: "👨", quote: "Bersama kita berkembang" }
  ];

  onMount(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.1 }
    );

    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );

    const el = document.querySelector("#about-content");
    const statsEl = document.querySelector("#stats-section");
    
    if (el) observer.observe(el);
    if (statsEl) statsObserver.observe(statsEl);

    // Auto-rotate values
    const interval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % values.length);
    }, 3000);

    return () => {
      observer.disconnect();
      statsObserver.disconnect();
      clearInterval(interval);
    };
  });

  return (
    <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      <Navbar />

      {/* Animated Background Elements */}
      <div class="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400 to-purple-400 opacity-20 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-tr from-pink-400 to-orange-400 opacity-15 blur-3xl rounded-full animate-pulse pointer-events-none" />
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-indigo-300 to-purple-300 opacity-10 blur-3xl rounded-full animate-spin-slow pointer-events-none" />

      {/* Hero Section */}
      <section id="about-content" class="relative z-10 container mx-auto px-6 pt-28 pb-16">
        <div class="text-center max-w-4xl mx-auto">
          <h1
            class={`text-5xl md:text-7xl font-black mb-6 transition-all duration-1000 ease-out ${
              visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Tentang Batik Kita
            </span>
          </h1>
          
          <p
            class={`text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 transition-all duration-1000 delay-200 ease-out ${
              visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Melestarikan Warisan, Menginspirasi Masa Depan
          </p>

          {/* Logo with Animation */}
          <div
            class={`flex justify-center mb-16 transition-all duration-1000 delay-300 ease-out ${
              visible() ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            <div class="relative">
              <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-2xl opacity-30 animate-pulse"></div>
              <img
                src="/images/logo.png"
                alt="Batik Kita Logo"
                class="relative w-48 h-48 object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-300"
              />
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div
          class={`max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-1000 delay-400 ease-out ${
            visible() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 class="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Misi Kami
          </h2>
          <div class="grid md:grid-cols-2 gap-8 text-lg text-gray-700 dark:text-gray-300">
            <div class="space-y-4">
              <p class="leading-relaxed">
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">Batik Kita</span> lahir dari 
                kecintaan mendalam terhadap warisan budaya Indonesia. Kami percaya bahwa batik bukan sekadar kain, 
                melainkan <span class="font-semibold text-purple-600 dark:text-purple-400">kanvas yang menceritakan 
                kisah peradaban nusantara</span>.
              </p>
              <p class="leading-relaxed">
                Dengan menggabungkan teknik tradisional yang telah diwariskan turun-temurun dengan inovasi desain 
                kontemporer, kami menciptakan karya yang <span class="font-semibold text-pink-600 dark:text-pink-400">
                relevan untuk generasi modern</span> tanpa kehilangan esensi kulturalnya.
              </p>
            </div>
            <div class="space-y-4">
              <p class="leading-relaxed">
                Setiap helai batik yang kami produksi adalah hasil dari <span class="font-semibold text-orange-600 
                dark:text-orange-400">kolaborasi erat dengan pengrajin lokal</span>. Kami berkomitmen untuk memberikan 
                nilai ekonomi yang adil dan berkelanjutan bagi komunitas.
              </p>
              <p class="leading-relaxed">
                Visi kami sederhana namun ambisius: <span class="font-semibold text-green-600 dark:text-green-400">
                menjadikan batik Indonesia dikenal dan dicintai di seluruh dunia</span>, sambil memastikan bahwa 
                tradisi pembuatannya tetap hidup dan berkembang untuk generasi mendatang.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section class="relative z-10 py-20 bg-gradient-to-b from-transparent via-blue-50/50 to-transparent dark:via-gray-800/50">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Nilai-Nilai Kami
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <For each={values}>
              {(value, index) => (
                <div
                  class={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transform transition-all duration-500 hover:-translate-y-2 cursor-pointer ${
                    activeValue() === index() ? "ring-4 ring-blue-500 ring-opacity-50" : ""
                  }`}
                  onClick={() => setActiveValue(index())}
                >
                  <div class="text-5xl mb-4">{value.icon}</div>
                  <h3 class="text-xl font-bold mb-3 text-gray-800 dark:text-white">{value.title}</h3>
                  <p class="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats-section" class="relative z-10 py-20">
        <div class="container mx-auto px-6">
          <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <For each={stats}>
              {(stat, index) => (
                <div
                  class={`text-center transition-all duration-1000 ease-out ${
                    statsVisible() 
                      ? `opacity-100 translate-y-0 delay-${index() * 100}` 
                      : "opacity-0 translate-y-8"
                  }`}
                >
                  <div class="text-4xl mb-2">{stat.icon}</div>
                  <div class="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <p class="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section class="relative z-10 py-20 bg-gradient-to-b from-transparent to-purple-50/50 dark:to-gray-800/50">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Perjalanan Kami
          </h2>
          <div class="max-w-4xl mx-auto">
            <For each={milestones}>
              {(milestone, index) => (
                <div class="flex items-center mb-8 group">
                  <div class="flex-shrink-0 w-24 text-right pr-8">
                    <span class="text-2xl font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {milestone.year}
                    </span>
                  </div>
                  <div class="relative flex-shrink-0">
                    <div class="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-2xl shadow-lg transform group-hover:scale-125 transition-transform">
                      {milestone.icon}
                    </div>
                    <Show when={index() < milestones.length - 1}>
                      <div class="absolute top-12 left-1/2 w-0.5 h-16 bg-gray-300 dark:bg-gray-600 -translate-x-1/2"></div>
                    </Show>
                  </div>
                  <div class="flex-grow pl-8">
                    <p class="text-lg text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                      {milestone.event}
                    </p>
                  </div>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section class="relative z-10 py-20">
        <div class="container mx-auto px-6">
          <h2 class="text-4xl font-bold text-center mb-16 text-gray-800 dark:text-white">
            Tim Kami
          </h2>
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <For each={team}>
              {(member) => (
                <div class="text-center group">
                  <div class="relative inline-block mb-4">
                    <div class="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-6xl shadow-xl transform group-hover:scale-110 transition-all duration-300">
                      {member.image}
                    </div>
                    <div class="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      ✓
                    </div>
                  </div>
                  <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-1">{member.name}</h3>
                  <p class="text-gray-600 dark:text-gray-400 mb-3">{member.role}</p>
                  <p class="text-sm italic text-gray-500 dark:text-gray-500">"{member.quote}"</p>
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section class="relative z-10 py-20">
        <div class="container mx-auto px-6">
          <div class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 class="text-4xl font-bold mb-6">Bergabunglah Dengan Kami</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">
              Mari bersama-sama melestarikan warisan budaya Indonesia dan membawa batik ke panggung dunia
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/products"
                class="px-8 py-4 bg-white text-purple-600 rounded-full font-bold hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg"
              >
                Lihat Koleksi
              </a>
              <a
                href="/contact"
                class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all duration-300"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .delay-100 { animation-delay: 100ms; }
        .delay-200 { animation-delay: 200ms; }
        .delay-300 { animation-delay: 300ms; }
      `}</style>
    </div>
  );
}