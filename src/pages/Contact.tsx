import { createSignal, onMount, Show, For } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [message, setMessage] = createSignal("");
  const [isSubmitting, setIsSubmitting] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [animateIn, setAnimateIn] = createSignal(false);
  const [selectedReason, setSelectedReason] = createSignal("");

  const contactReasons = [
    { value: "general", label: "Pertanyaan Umum", icon: "💬" },
    { value: "order", label: "Pesanan & Produk", icon: "📦" },
    { value: "partnership", label: "Kerjasama Bisnis", icon: "🤝" },
    { value: "feedback", label: "Kritik & Saran", icon: "💡" }
  ];

  const contactInfo = [
    {
      icon: "📍",
      title: "Alamat",
      content: "Jl. Batik Nusantara No. 88, Purwokerto, Jawa Tengah",
      action: "Lihat di Maps",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: "📞",
      title: "Telepon",
      content: "+62 812-3456-7890",
      action: "Hubungi Sekarang",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: "✉️",
      title: "Email",
      content: "hello@batikkita.id",
      action: "Kirim Email",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: "⏰",
      title: "Jam Operasional",
      content: "Senin - Sabtu: 09:00 - 18:00",
      action: "Atur Jadwal Meeting",
      color: "from-orange-500 to-red-500"
    }
  ];

  const socialMedia = [
    { icon: "📷", name: "Instagram", handle: "@batikkita.id", color: "hover:text-pink-500" },
    { icon: "📘", name: "Facebook", handle: "BatikKitaIndonesia", color: "hover:text-blue-600" },
    { icon: "🐦", name: "Twitter", handle: "@batikkita", color: "hover:text-sky-500" },
    { icon: "💼", name: "LinkedIn", handle: "Batik Kita Indonesia", color: "hover:text-blue-700" }
  ];

  const faqs = [
    {
      question: "Berapa lama proses pengiriman?",
      answer: "Pengiriman normal membutuhkan 3-5 hari kerja untuk area Jawa dan 5-7 hari kerja untuk luar Jawa."
    },
    {
      question: "Apakah bisa custom design?",
      answer: "Ya! Kami menerima custom design dengan minimum order 50 pcs. Hubungi tim kami untuk konsultasi."
    },
    {
      question: "Bagaimana cara menjadi reseller?",
      answer: "Daftar melalui form khusus reseller di website kami atau hubungi WhatsApp business kami."
    }
  ];

  onMount(() => {
    setTimeout(() => setAnimateIn(true), 100);
  });

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("Contact form submitted:", {
      name: name(),
      email: email(),
      message: message(),
      reason: selectedReason()
    });
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setSelectedReason("");
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div class="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 blur-3xl rounded-full animate-pulse"></div>
        <div class="absolute bottom-20 -right-20 w-96 h-96 bg-gradient-to-tr from-pink-400 to-orange-400 opacity-10 blur-3xl rounded-full animate-pulse animation-delay-2000"></div>

        <div class="container mx-auto px-6 py-24">
          {/* Header */}
          <div class={`text-center mb-16 transition-all duration-700 ${
            animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}>
            <h1 class="text-5xl md:text-6xl font-black mb-4">
              <span class="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Hubungi Kami
              </span>
            </h1>
            <p class="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Kami siap membantu Anda. Pilih cara yang paling nyaman untuk terhubung dengan tim kami.
            </p>
          </div>

          <div class="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {/* Contact Form */}
            <div class={`lg:col-span-2 transition-all duration-700 delay-200 ${
              animateIn() ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-8"
            }`}>
              <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-10 relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-400 opacity-10 blur-2xl"></div>
                
                <h2 class="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
                  Kirim Pesan 📨
                </h2>

                <form onSubmit={handleSubmit} class="space-y-6 relative z-10">
                  {/* Reason Selection */}
                  <div>
                    <label class="block mb-3 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Pilih Topik
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <For each={contactReasons}>
                        {(reason) => (
                          <button
                            type="button"
                            onClick={() => setSelectedReason(reason.value)}
                            class={`p-3 rounded-xl border-2 transition-all duration-300 ${
                              selectedReason() === reason.value
                                ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300"
                                : "border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500"
                            }`}
                          >
                            <div class="flex items-center gap-2">
                              <span class="text-xl">{reason.icon}</span>
                              <span class="text-sm font-medium">{reason.label}</span>
                            </div>
                          </button>
                        )}
                      </For>
                    </div>
                  </div>

                  {/* Name & Email Grid */}
                  <div class="grid md:grid-cols-2 gap-4">
                    <div>
                      <label for="name" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Nama Lengkap
                      </label>
                      <div class="relative">
                        <input
                          id="name"
                          type="text"
                          value={name()}
                          onInput={(e) => setName(e.currentTarget.value)}
                          placeholder="John Doe"
                          required
                          class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <span class="absolute left-3 top-3.5 text-gray-400">👤</span>
                      </div>
                    </div>

                    <div>
                      <label for="email" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                        Email
                      </label>
                      <div class="relative">
                        <input
                          id="email"
                          type="email"
                          value={email()}
                          onInput={(e) => setEmail(e.currentTarget.value)}
                          placeholder="john@example.com"
                          required
                          class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                        <span class="absolute left-3 top-3.5 text-gray-400">✉️</span>
                      </div>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label for="message" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Pesan
                    </label>
                    <div class="relative">
                      <textarea
                        id="message"
                        value={message()}
                        onInput={(e) => setMessage(e.currentTarget.value)}
                        placeholder="Tulis pesan Anda di sini..."
                        rows={6}
                        required
                        class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                      ></textarea>
                      <span class="absolute left-3 top-3 text-gray-400">💬</span>
                    </div>
                    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                      Minimal 20 karakter ({message().length}/500)
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting()}
                    class={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 transform ${
                      isSubmitting()
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 hover:scale-[1.02] hover:shadow-xl"
                    }`}
                  >
                    <Show when={!isSubmitting()} fallback={
                      <span class="flex items-center justify-center gap-2">
                        <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Mengirim...
                      </span>
                    }>
                      Kirim Pesan 🚀
                    </Show>
                  </button>
                </form>

                {/* Success Message */}
                <Show when={showSuccess()}>
                  <div class="absolute inset-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm rounded-3xl flex items-center justify-center z-20">
                    <div class="text-center animate-bounce-in">
                      <div class="text-6xl mb-4">✅</div>
                      <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Terkirim!</h3>
                      <p class="text-gray-600 dark:text-gray-300">Kami akan segera merespons pesan Anda</p>
                    </div>
                  </div>
                </Show>
              </div>

              {/* FAQ Section */}
              <div class="mt-8 bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8">
                <h3 class="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
                  Pertanyaan Umum 🤔
                </h3>
                <div class="space-y-4">
                  <For each={faqs}>
                    {(faq) => (
                      <div class="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                        <h4 class="font-semibold text-gray-800 dark:text-white mb-2">{faq.question}</h4>
                        <p class="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>

            {/* Contact Info Sidebar */}
            <div class={`space-y-6 transition-all duration-700 delay-400 ${
              animateIn() ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}>
              {/* Contact Cards */}
              <For each={contactInfo}>
                {(info) => (
                  <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 group">
                    <div class="flex items-start gap-4">
                      <div class={`w-12 h-12 rounded-xl bg-gradient-to-r ${info.color} flex items-center justify-center text-2xl text-white shadow-lg group-hover:scale-110 transition-transform`}>
                        {info.icon}
                      </div>
                      <div class="flex-1">
                        <h3 class="font-semibold text-gray-800 dark:text-white mb-1">{info.title}</h3>
                        <p class="text-gray-600 dark:text-gray-400 text-sm mb-2">{info.content}</p>
                        <button class="text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                          {info.action} →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </For>

              {/* Social Media */}
              <div class="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
                <h3 class="text-xl font-bold mb-4">Ikuti Kami 🌟</h3>
                <div class="space-y-3">
                  <For each={socialMedia}>
                    {(social) => (
                      <a
                        href="#"
                        class="flex items-center gap-3 hover:opacity-90 transition-opacity"
                      >
                        <span class="text-2xl">{social.icon}</span>
                        <div>
                          <p class="font-medium">{social.name}</p>
                          <p class="text-sm opacity-80">{social.handle}</p>
                        </div>
                      </a>
                    )}
                  </For>
                </div>
              </div>

              {/* Map Preview */}
              <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden group cursor-pointer">
                <div class="h-48 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-700 dark:to-gray-600 relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-4xl mb-2">🗺️</div>
                      <p class="text-gray-700 dark:text-gray-300 font-medium">Lihat Lokasi Kami</p>
                    </div>
                  </div>
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
}