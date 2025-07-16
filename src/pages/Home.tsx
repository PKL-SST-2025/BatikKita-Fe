import { createSignal, onMount, For, Show, } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const produkUnggulan = [
  { 
    id: "batik1", 
    name: "Mega Mendung", 
    image: "/images/batik-1.jpg",
    price: "Rp 350.000",
    rating: 4.8,
    sold: 234,
    tag: "Best Seller"
  },
  { 
    id: "batik2", 
    name: "Parang Rusak", 
    image: "/images/batik-2.jpg",
    price: "Rp 425.000",
    rating: 4.9,
    sold: 189,
    tag: "Premium"
  },
  { 
    id: "batik3", 
    name: "Truntum Klasik", 
    image: "/images/batik-3.jpg",
    price: "Rp 295.000",
    rating: 4.7,
    sold: 156,
    tag: "Favorit"
  },
];

const testimonials = [
  { 
    name: "Dewi Sartika", 
    role: "Fashion Designer",
    comment: "Kualitas batiknya luar biasa! Motifnya autentik dan pewarnaan yang sempurna.",
    avatar: "👩",
    rating: 5
  },
  { 
    name: "Rizky Pratama", 
    role: "Entrepreneur",
    comment: "Saya bangga bisa mendukung UMKM lokal dengan produk sekualitas ini.",
    avatar: "👨",
    rating: 5
  },
  { 
    name: "Lina Marlina", 
    role: "Kolektor Batik",
    comment: "Koleksi terlengkap dengan harga yang fair. Pelayanan juga memuaskan!",
    avatar: "👩",
    rating: 5
  },
];

const features = [
  {
    icon: "🎨",
    title: "100% Asli",
    description: "Batik autentik langsung dari pengrajin terpilih"
  },
  {
    icon: "🚚",
    title: "Pengiriman Cepat",
    description: "Gratis ongkir ke seluruh Indonesia"
  },
  {
    icon: "💎",
    title: "Kualitas Premium",
    description: "Bahan berkualitas tinggi dan tahan lama"
  },
  {
    icon: "🤝",
    title: "Dukung UMKM",
    description: "Setiap pembelian mendukung pengrajin lokal"
  }
];

const stats = [
  { number: "500+", label: "Produk Batik" },
  { number: "100+", label: "Pengrajin Mitra" },
  { number: "10K+", label: "Pelanggan Puas" },
  { number: "4.9/5", label: "Rating Toko" }
];

export default function Home() {
  const [showOverlay, setShowOverlay] = createSignal(true);
  const [heroLoaded, setHeroLoaded] = createSignal(false);
  const [activeTestimonial, setActiveTestimonial] = createSignal(0);
  const [scrollY, setScrollY] = createSignal(0);
  const [statsVisible, setStatsVisible] = createSignal(false);
  const [counters, setCounters] = createSignal<{[key: string]: number}>({});

  onMount(() => {
    // Remove overlay
    setTimeout(() => setShowOverlay(false), 800);
    setTimeout(() => setHeroLoaded(true), 100);

    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    // Parallax scroll effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);

    // Stats counter animation
    const statsObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !statsVisible()) {
          setStatsVisible(true);
          animateCounters();
        }
      },
      { threshold: 0.5 }
    );

    const statsSection = document.querySelector("#stats-section");
    if (statsSection) statsObserver.observe(statsSection);

    return () => {
      clearInterval(interval);
      window.removeEventListener("scroll", handleScroll);
      statsObserver.disconnect();
    };
  });

  const animateCounters = () => {
    stats.forEach((stat, index) => {
      const target = parseInt(stat.number.replace(/\D/g, ""));
      const duration = 2000;
      const increment = target / (duration / 16);
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        setCounters(prev => ({ ...prev, [index]: Math.floor(current) }));
      }, 16);
    });
  };

  return (
    <div class="flex flex-col min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 overflow-x-hidden">
      {/* Loading Overlay */}
      <Show when={showOverlay()}>
        <div class="fixed inset-0 bg-white dark:bg-gray-900 z-50 flex items-center justify-center">
          <div class="relative">
            <div class="w-20 h-20 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl">🎨</span>
            </div>
          </div>
        </div>
      </Show>

      <Navbar />

      <main class="flex-grow">
        {/* Enhanced Hero Section */}
        <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Animated Background */}
          <div class="absolute inset-0 z-0">
            <video
              autoplay
              loop
              muted
              playsinline
              class="absolute top-0 left-0 w-full h-full object-cover"
              style={{ transform: `translateY(${scrollY() * 0.5}px)` }}
            >
              <source src="/videos/batik-bg.mp4" type="video/mp4" />
            </video>
            <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
          </div>

          {/* Floating Elements */}
          <div class="absolute inset-0 overflow-hidden pointer-events-none">
            <div class="absolute top-20 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-float"></div>
            <div class="absolute bottom-20 right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl animate-float-delayed"></div>
            <div class="absolute top-1/2 left-1/3 w-24 h-24 bg-pink-500/20 rounded-full blur-3xl animate-float"></div>
          </div>

          {/* Hero Content */}
          <div class={`relative z-20 text-center px-6 max-w-5xl mx-auto transition-all duration-1000 ${
            heroLoaded() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}>
            <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
              Discover the Beauty of
              <span class="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
                Indonesian Batik
              </span>
            </h1>
            <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed">
              Koleksi eksklusif batik premium dari pengrajin terbaik Nusantara. 
              Setiap helai menyimpan cerita, setiap motif memiliki makna.
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="/produk"
                class="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-semibold rounded-full shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <span class="relative z-10">Jelajahi Koleksi</span>
                <div class="absolute inset-0 bg-gradient-to-r from-pink-600 to-orange-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="/about"
                class="px-8 py-4 bg-white/10 backdrop-blur-md text-white text-lg font-semibold rounded-full border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
              >
                Tentang Kami
              </a>
            </div>

            {/* Mouse Scroll Indicator */}
            <div class="absolute mt-60 left-1/2 -translate-x-1/2">
              <div class="w-8 h-11 rounded-full border-2 border-white/50 p-1 relative">
                <div 
                  class="w-1.5 h-2.5 bg-white rounded-full mx-auto animate-scroll-wheel"
                  style={{ transform: `translateY(${Math.min(scrollY() * 0.02, 10)}px)` }}
                ></div>
              </div>
              <p class="text-white/70 text-sm mt-2 text-center animate-pulse">Scroll</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section class="py-20 px-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Mengapa Memilih Kami?
              </h2>
              <p class="text-xl text-gray-600 dark:text-gray-300">
                Komitmen kami untuk kualitas dan kepuasan pelanggan
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <For each={features}>
                {(feature, index) => (
                  <div 
                    class="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                    style={{ "animation-delay": `${index() * 100}ms` }}
                  >
                    <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 dark:text-white mb-2">
                      {feature.title}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats-section" class="py-20 px-6 bg-gradient-to-r from-slate-700 to-slate-900 text-white">
          <div class="max-w-6xl mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <For each={stats}>
                {(stat, index) => (
                  <div class="transform hover:scale-105 transition-transform duration-300">
                    <div class="text-4xl md:text-5xl font-bold mb-2">
                      <Show when={statsVisible()} fallback={<span>0</span>}>
                        <span>
                          {stat.number.includes("+") ? `${counters()[index()]}+` : 
                           stat.number.includes("/") ? `${counters()[index()]}/5` :
                           counters()[index()]}
                        </span>
                      </Show>
                    </div>
                    <div class="text-lg opacity-90">{stat.label}</div>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        {/* About Section with Parallax */}
        <section class="py-20 px-6 relative overflow-hidden">
          <div class="absolute inset-0 z-0 opacity-10">
            <img 
              src="/images/batik-pattern.png" 
              alt="" 
              class="w-full h-full object-cover"
              style={{ transform: `translateY(${scrollY() * 0.2}px)` }}
            />
          </div>
          
          <div class="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
            <div class="order-2 md:order-1">
              <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-6">
                Melestarikan Warisan,
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                  {" "}Membangun Masa Depan
                </span>
              </h2>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
                UMKM batik adalah jantung dari industri kreatif Indonesia. Setiap pembelian Anda 
                tidak hanya mendapatkan produk berkualitas, tetapi juga mendukung kehidupan 
                ratusan keluarga pengrajin.
              </p>
              <p class="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Kami berkomitmen untuk menjembatani tradisi dengan modernitas, menghadirkan 
                batik yang tidak hanya indah, tetapi juga relevan dengan gaya hidup kontemporer.
              </p>
              
              <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  </div>
                  <span class="text-gray-700 dark:text-gray-300">Fair Trade Certified</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span class="text-purple-600 dark:text-purple-400 font-bold">✓</span>
                  </div>
                  <span class="text-gray-700 dark:text-gray-300">Eco-Friendly Process</span>
                </div>
              </div>
            </div>
            
            <div class="order-1 md:order-2 relative">
              <div class="absolute -inset-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-2xl opacity-20"></div>
              <img
                src="/images/umkm-batik.jpg"
                alt="Pengrajin Batik"
                class="relative rounded-2xl shadow-2xl w-full object-cover transform hover:scale-105 transition-transform duration-500"
              />
              <div class="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-xl shadow-xl">
                <div class="flex items-center gap-3">
                  <div class="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                    10+
                  </div>
                  <div>
                    <p class="font-semibold text-gray-800 dark:text-white">Tahun</p>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Pengalaman</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section class="py-20 px-6 bg-gray-50 dark:bg-gray-800">
          <div class="max-w-6xl mx-auto">
            <div class="text-center mb-16">
              <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                Produk Unggulan
              </h2>
              <p class="text-xl text-gray-600 dark:text-gray-300">
                Koleksi terpilih dengan kualitas terbaik
              </p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <For each={produkUnggulan}>
                {(product) => (
                  <div class="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div class="relative h-80 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      />
                      <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <span class="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                        {product.tag}
                      </span>
                    </div>
                    
                    <div class="p-6">
                      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {product.name}
                      </h3>
                      <div class="flex items-center justify-between mb-4">
                        <span class="text-2xl font-bold text-purple-600 dark:text-purple-400">
                          {product.price}
                        </span>
                        <div class="flex items-center gap-1">
                          <span class="text-yellow-500">⭐</span>
                          <span class="text-gray-600 dark:text-gray-400">{product.rating}</span>
                          <span class="text-gray-500 dark:text-gray-500 text-sm">({product.sold} terjual)</span>
                        </div>
                      </div>
                      
                      <a
                        href="/produk"
                        class="block w-full text-center py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                      >
                        Lihat Detail
                      </a>
                    </div>
                  </div>
                )}
              </For>
            </div>
            
            <div class="text-center mt-12">
              <a
                href="/produk"
                class="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold hover:gap-4 transition-all duration-300"
              >
                Lihat Semua Produk
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials with Carousel */}
        <section class="py-20 px-6 bg-white dark:bg-gray-900">
          <div class="max-w-4xl mx-auto text-center">
            <h2 class="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-16">
              Apa Kata Mereka?
            </h2>
            
            <div class="relative">
              <div class="overflow-hidden">
                <div 
                  class="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${activeTestimonial() * 100}%)` }}
                >
                  <For each={testimonials}>
                    {(testimonial) => (
                      <div class="w-full flex-shrink-0 px-4">
                        <div class="bg-gray-50 dark:bg-gray-800 p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
                          <div class="flex justify-center mb-4">
                            <For each={[...Array(testimonial.rating)]}>
                              {() => <span class="text-yellow-400 text-2xl">⭐</span>}
                            </For>
                          </div>
                          <p class="text-xl text-gray-700 dark:text-gray-300 mb-6 italic">
                            "{testimonial.comment}"
                          </p>
                          <div class="flex items-center justify-center gap-4">
                            <div class="text-5xl">{testimonial.avatar}</div>
                            <div class="text-left">
                              <h4 class="font-bold text-gray-800 dark:text-white">{testimonial.name}</h4>
                              <p class="text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
              
              {/* Carousel Indicators */}
              <div class="flex justify-center gap-2 mt-8">
                <For each={testimonials}>
                  {(_, index) => (
                    <button
                      onClick={() => setActiveTestimonial(index())}
                      class={`w-2 h-2 rounded-full transition-all duration-300 ${
                        activeTestimonial() === index() 
                          ? "w-8 bg-purple-600" 
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section class="relative py-24 overflow-hidden">
          <div class="absolute inset-0 z-0">
            <img
              src="/images/batik-cover.jpg"
              alt=""
              class="w-full h-full object-cover"
            />
            <div class="absolute inset-0 bg-gradient-to-r from-purple-900/90 to-pink-900/90"></div>
          </div>
          
          <div class="relative z-10 max-w-4xl mx-auto text-center px-6">
            <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
              Mulai Perjalanan Batik Anda
            </h2>
            <p class="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Bergabunglah dengan ribuan pelanggan yang telah menemukan keindahan 
              batik Indonesia bersama kami
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/produk"
                class="px-8 py-4 bg-white text-purple-700 font-bold rounded-full shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105"
              >
                Belanja Sekarang
              </a>
              <a
                href="/contact"
                class="px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-purple-700 transition-all duration-300"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes scroll-wheel {
          0% { transform: translateY(0); opacity: 1; }
          30% { opacity: 1; }
          100% { transform: translateY(15px); opacity: 0; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        
        .animate-scroll-wheel {
          animation: scroll-wheel 1.5s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}