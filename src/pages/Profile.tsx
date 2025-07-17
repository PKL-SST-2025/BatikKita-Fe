import { createSignal, onMount, Show, For } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Profile() {
  const { user, logout } = useAuth();
  const currentUser = user();
  const [profilePhoto, setProfilePhoto] = createSignal<string | null>(
    localStorage.getItem("profilePhoto") || null
  );
  const [animateIn, setAnimateIn] = createSignal(false);
  const [isUploading, setIsUploading] = createSignal(false);
  const [activeTab, setActiveTab] = createSignal<"overview" | "stats" | "settings">("overview");

  const handlePhotoUpload = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      setIsUploading(true);
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setProfilePhoto(base64);
        localStorage.setItem("profilePhoto", base64);
        setTimeout(() => setIsUploading(false), 500);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem("profilePhoto");
  };

  const stats = [
    { label: "UMKM Dibina", value: "7", trend: "+2", icon: "🏪" },
    { label: "Performa", value: "+14%", trend: "up", icon: "📈" },
    { label: "Proyek Aktif", value: "3", trend: "0", icon: "📋" },
    { label: "Rating", value: "4.8", trend: "+0.2", icon: "⭐" }
  ];

  const quickActions = [
    { label: "Kelola UMKM", href: "/umkm", icon: "🏢", color: "bg-gradient-to-br from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700" },
    { label: "Laporan", href: "/reports", icon: "📊", color: "bg-gradient-to-br from-emerald-700 to-emerald-800 hover:from-emerald-600 hover:to-emerald-700" },
    { label: "Pengaturan", href: "/settings", icon: "⚙️", color: "bg-gradient-to-br from-neutral-700 to-neutral-800 hover:from-neutral-600 hover:to-neutral-700" },
    { label: "Bantuan", href: "/help", icon: "❓", color: "bg-gradient-to-br from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700" }
  ];

  const achievements = [
    { title: "Early Adopter", desc: "Bergabung di tahun pertama", icon: "🏆" },
    { title: "Top Mentor", desc: "Membantu 5+ UMKM", icon: "🎖️" },
    { title: "Rising Star", desc: "Performa konsisten naik", icon: "🌟" }
  ];

  onMount(() => {
    setTimeout(() => setAnimateIn(true), 100);
  });

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div class="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-slate-900 dark:to-stone-900 flex items-center justify-center">
          <div class="text-center p-8 bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md mx-auto border border-slate-200 dark:border-slate-700">
            <div class="text-6xl mb-4">🔒</div>
            <h2 class="text-2xl font-bold mb-4 text-slate-800 dark:text-slate-100">Akses Terbatas</h2>
            <p class="text-slate-600 dark:text-slate-300 mb-6">
              Anda perlu login untuk melihat halaman profil
            </p>
            <a 
              href="/login" 
              class="inline-block px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Login Sekarang
            </a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-slate-50 via-stone-50 to-slate-100 dark:from-slate-900 dark:via-stone-900 dark:to-slate-800">
        {/* Hero Section */}
        <div class="relative overflow-hidden bg-gradient-to-r from-slate-800 via-stone-800 to-slate-900 pt-20">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <div class="absolute inset-0">
            <div class="absolute top-0 -left-4 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div class="absolute top-0 -right-4 w-72 h-72 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
            <div class="absolute -bottom-8 left-20 w-72 h-72 bg-neutral-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
          </div>
          
          <div class="relative container mx-auto px-4 py-12">
            <div class="flex flex-col md:flex-row items-center justify-between">
              <div class="flex items-center space-x-6 mb-6 md:mb-0">
                <div class="relative group">
                  <Show when={profilePhoto()} fallback={
                    <div class="w-32 h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-white text-4xl shadow-2xl ring-4 ring-white/20 border border-white/30">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                  }>
                    <img
                      src={profilePhoto()!}
                      alt="Profile"
                      class="w-32 h-32 rounded-full object-cover shadow-2xl ring-4 ring-white/20 group-hover:ring-white/40 transition-all duration-300 border border-white/30"
                    />
                  </Show>
                  <Show when={isUploading()}>
                    <div class="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                      <div class="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </Show>
                  <label class="absolute bottom-0 right-0 bg-white dark:bg-slate-800 p-2 rounded-full shadow-lg cursor-pointer hover:scale-110 transition-transform border border-slate-200 dark:border-slate-700">
                    <span class="text-xl">📷</span>
                    <input
                      type="file"
                      accept="image/*"
                      class="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                </div>
                
                <div class="text-white">
                  <h1 class="text-4xl font-bold mb-2">{currentUser.name}</h1>
                  <p class="text-slate-200 flex items-center gap-2">
                    <span>✉️</span> {currentUser.email}
                  </p>
                  <p class="text-slate-300 text-sm mt-1">Member sejak 10 Februari 2024</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                class="px-6 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg hover:bg-white/20 transition-all transform hover:scale-105 flex items-center gap-2 border border-white/20"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div class={`container mx-auto px-4 py-8 transform transition-all duration-700 ${
          animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          {/* Stats Cards */}
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 -mt-8 relative z-10">
            <For each={stats}>
              {(stat, index) => (
                <div class={`bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 animation-delay-${index() * 100} border border-slate-200 dark:border-slate-700`}>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-3xl">{stat.icon}</span>
                    <Show when={stat.trend !== "0"}>
                      <span class={`text-sm font-semibold ${stat.trend === "up" || stat.trend.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                        {stat.trend === "up" ? "↑" : stat.trend}
                      </span>
                    </Show>
                  </div>
                  <p class="text-2xl font-bold text-slate-800 dark:text-slate-100">{stat.value}</p>
                  <p class="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              )}
            </For>
          </div>

          {/* Tabs */}
          <div class="flex space-x-1 mb-8 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg max-w-md border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab("overview")}
              class={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab() === "overview" 
                  ? "bg-white dark:bg-slate-700 shadow-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              class={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab() === "stats" 
                  ? "bg-white dark:bg-slate-700 shadow-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Statistik
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              class={`flex-1 py-2 px-4 rounded-md transition-all ${
                activeTab() === "settings" 
                  ? "bg-white dark:bg-slate-700 shadow-md text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-600" 
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Pengaturan
            </button>
          </div>

          {/* Tab Content */}
          <Show when={activeTab() === "overview"}>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Quick Actions */}
              <div class="lg:col-span-2">
                <h2 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>⚡</span> Akses Cepat
                </h2>
                <div class="grid grid-cols-2 gap-4">
                  <For each={quickActions}>
                    {(action) => (
                      <a
                        href={action.href}
                        class={`${action.color} p-6 rounded-xl text-white hover:shadow-xl transition-all transform hover:scale-105 group border border-white/10`}
                      >
                        <div class="flex items-center justify-between mb-4">
                          <span class="text-4xl group-hover:scale-110 transition-transform">{action.icon}</span>
                          <svg class="w-6 h-6 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                          </svg>
                        </div>
                        <p class="font-semibold text-lg">{action.label}</p>
                      </a>
                    )}
                  </For>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h2 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
                  <span>🏅</span> Pencapaian
                </h2>
                <div class="space-y-4">
                  <For each={achievements}>
                    {(achievement) => (
                      <div class="bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-slate-800 dark:to-slate-700 p-4 rounded-lg border border-amber-200 dark:border-slate-600">
                        <div class="flex items-start gap-3">
                          <span class="text-2xl">{achievement.icon}</span>
                          <div>
                            <h3 class="font-semibold text-slate-800 dark:text-slate-100">{achievement.title}</h3>
                            <p class="text-sm text-slate-600 dark:text-slate-400">{achievement.desc}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>
            </div>
          </Show>

          <Show when={activeTab() === "stats"}>
            <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <h2 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Statistik Performa</h2>
              <div class="space-y-6">
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-slate-600 dark:text-slate-400">Tingkat Keterlibatan</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-100">85%</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-slate-600 to-slate-700 h-3 rounded-full" style="width: 85%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-slate-600 dark:text-slate-400">Target Bulanan</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-100">70%</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-emerald-600 to-emerald-700 h-3 rounded-full" style="width: 70%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="text-slate-600 dark:text-slate-400">Kepuasan Mitra</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-100">92%</span>
                  </div>
                  <div class="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                    <div class="bg-gradient-to-r from-stone-600 to-stone-700 h-3 rounded-full" style="width: 92%"></div>
                  </div>
                </div>
              </div>
            </div>
          </Show>

<Show when={activeTab() === "settings"}>
  <div class="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
    <h2 class="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-100">Pengaturan Akun</h2>
    <div class="space-y-4">
      {/* Tambahkan href ke setiap link pengaturan */}
      <a 
        href="/notifications"
        class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🔔</span>
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">Notifikasi</p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Kelola preferensi notifikasi</p>
          </div>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </a>

      <a 
        href="/security"
        class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🔐</span>
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">Keamanan</p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Password dan autentikasi</p>
          </div>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </a>

      <a 
        href="/appearance"
        class="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-600"
      >
        <div class="flex items-center gap-3">
          <span class="text-2xl">🎨</span>
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">Tampilan</p>
            <p class="text-sm text-slate-600 dark:text-slate-400">Tema dan preferensi visual</p>
          </div>
        </div>
        <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </a>

      {/* Tombol hapus foto profil tetap di bawah */}
      <Show when={profilePhoto()}>
        <button
          onClick={handleRemovePhoto}
          class="w-full mt-6 px-4 py-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center justify-center gap-2 border border-red-200 dark:border-red-800"
        >
          <span>🗑️</span> Hapus Foto Profil
        </button>
      </Show>
    </div>
  </div>
</Show>
        </div>
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
        .animation-delay-100 {
          animation-delay: 100ms;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </>
  );
}