import { createSignal, onMount, Show } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Notifications() {
  const { user } = useAuth();
  const currentUser = user();
  const [animateIn, setAnimateIn] = createSignal(false);
  
  // Notification settings state
  const [emailNotifications, setEmailNotifications] = createSignal(true);
  const [pushNotifications, setPushNotifications] = createSignal(true);
  const [umkmUpdates, setUmkmUpdates] = createSignal(true);
  const [reportReminders, setReportReminders] = createSignal(true);
  const [marketingEmails, setMarketingEmails] = createSignal(false);
  const [weeklyDigest, setWeeklyDigest] = createSignal(true);
  const [performanceAlerts, setPerformanceAlerts] = createSignal(true);
  const [systemUpdates, setSystemUpdates] = createSignal(true);
  const [collaborationNotifs, setCollaborationNotifs] = createSignal(true);
  
  const [isSaving, setIsSaving] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const notificationCategories = [
    {
      title: "Email Notifications",
      subtitle: "Terima notifikasi melalui email",
      icon: "✉️",
      enabled: emailNotifications,
      setter: setEmailNotifications
    },
    {
      title: "Push Notifications",
      subtitle: "Notifikasi langsung di browser",
      icon: "🔔",
      enabled: pushNotifications,
      setter: setPushNotifications
    },
    {
      title: "Update UMKM",
      subtitle: "Pemberitahuan tentang UMKM yang dibina",
      icon: "🏪",
      enabled: umkmUpdates,
      setter: setUmkmUpdates
    },
    {
      title: "Pengingat Laporan",
      subtitle: "Reminder untuk submit laporan",
      icon: "📋",
      enabled: reportReminders,
      setter: setReportReminders
    },
    {
      title: "Email Marketing",
      subtitle: "Tips dan update terbaru",
      icon: "📧",
      enabled: marketingEmails,
      setter: setMarketingEmails
    },
    {
      title: "Rangkuman Mingguan",
      subtitle: "Ringkasan aktivitas seminggu",
      icon: "📊",
      enabled: weeklyDigest,
      setter: setWeeklyDigest
    },
    {
      title: "Alert Performa",
      subtitle: "Notifikasi perubahan performa",
      icon: "📈",
      enabled: performanceAlerts,
      setter: setPerformanceAlerts
    },
    {
      title: "Update Sistem",
      subtitle: "Informasi maintenance dan update",
      icon: "🔧",
      enabled: systemUpdates,
      setter: setSystemUpdates
    },
    {
      title: "Kolaborasi",
      subtitle: "Notifikasi dari rekan kerja",
      icon: "👥",
      enabled: collaborationNotifs,
      setter: setCollaborationNotifs
    }
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
              Anda perlu login untuk mengatur notifikasi
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
        {/* Header */}
        <div class="relative overflow-hidden bg-gradient-to-r from-slate-800 via-stone-800 to-slate-900 pt-20">
          <div class="absolute inset-0 bg-black opacity-20"></div>
          <div class="absolute inset-0">
            <div class="absolute top-0 -left-4 w-72 h-72 bg-slate-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
            <div class="absolute top-0 -right-4 w-72 h-72 bg-stone-300 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
          </div>
          
          <div class="relative container mx-auto px-4 py-12">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <a href="/profile" class="text-white hover:text-slate-300 transition-colors">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </a>
                <div class="text-white">
                  <h1 class="text-4xl font-bold mb-2 flex items-center gap-3">
                    <span class="text-5xl">🔔</span>
                    Notifikasi
                  </h1>
                  <p class="text-slate-200">Kelola preferensi notifikasi Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div class={`container mx-auto px-4 py-8 transform transition-all duration-700 ${
          animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}>
          <div class="max-w-4xl mx-auto">
            {/* Success Message */}
            <Show when={showSuccess()}>
              <div class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">✅</span>
                  <div>
                    <p class="font-semibold text-emerald-800 dark:text-emerald-200">Pengaturan Disimpan</p>
                    <p class="text-sm text-emerald-600 dark:text-emerald-400">Preferensi notifikasi telah diperbarui</p>
                  </div>
                </div>
              </div>
            </Show>

            {/* Notification Settings */}
            <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <span>⚙️</span>
                  Pengaturan Notifikasi
                </h2>
                <p class="text-slate-600 dark:text-slate-400 mt-2">
                  Pilih jenis notifikasi yang ingin Anda terima
                </p>
              </div>

              <div class="divide-y divide-slate-200 dark:divide-slate-700">
                {notificationCategories.map((category, index) => (
                  <div class="p-6 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <span class="text-3xl">{category.icon}</span>
                        <div>
                          <h3 class="font-semibold text-slate-800 dark:text-slate-100">
                            {category.title}
                          </h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            {category.subtitle}
                          </p>
                        </div>
                      </div>
                      
                      <label class="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          class="sr-only peer"
                          checked={category.enabled()}
                          onChange={(e) => category.setter(e.target.checked)}
                        />
                        <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              <div class="p-6 bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={handleSave}
                  disabled={isSaving()}
                  class="w-full px-6 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                >
                  <Show when={isSaving()} fallback={<span>💾</span>}>
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </Show>
                  {isSaving() ? "Menyimpan..." : "Simpan Pengaturan"}
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span>🔕</span>
                  Mode Senyap
                </h3>
                <p class="text-slate-600 dark:text-slate-400 mb-4">
                  Nonaktifkan sementara semua notifikasi
                </p>
                <button class="w-full px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg hover:bg-amber-200 dark:hover:bg-amber-900/30 transition-colors border border-amber-300 dark:border-amber-800">
                  Aktifkan Mode Senyap
                </button>
              </div>

              <div class="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h3 class="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <span>🧹</span>
                  Bersihkan Notifikasi
                </h3>
                <p class="text-slate-600 dark:text-slate-400 mb-4">
                  Hapus semua notifikasi yang sudah dibaca
                </p>
                <button class="w-full px-4 py-2 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors border border-red-300 dark:border-red-800">
                  Bersihkan Semua
                </button>
              </div>
            </div>
          </div>
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
      `}</style>
    </>
  );
}