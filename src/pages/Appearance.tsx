import { createSignal, onMount, Show } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Appearance() {
  const { user } = useAuth();
  const currentUser = user();
  const [animateIn, setAnimateIn] = createSignal(false);
  
  // Appearance settings state
  const [theme, setTheme] = createSignal("system"); // light, dark, system
  const [primaryColor, setPrimaryColor] = createSignal("slate");
  const [fontSize, setFontSize] = createSignal("medium");
  const [compactMode, setCompactMode] = createSignal(false);
  const [animations, setAnimations] = createSignal(true);
  const [showAvatars, setShowAvatars] = createSignal(true);
  const [sidebar, setSidebar] = createSignal("expanded"); // expanded, collapsed, auto
  
  const [isSaving, setIsSaving] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);

  const themes = [
    { id: "light", name: "Terang", icon: "☀️", preview: "bg-white border-slate-200" },
    { id: "dark", name: "Gelap", icon: "🌙", preview: "bg-slate-900 border-slate-700" },
    { id: "system", name: "Sistem", icon: "🖥️", preview: "bg-gradient-to-br from-white to-slate-100 border-slate-300" }
  ];

  const colorOptions = [
    { id: "slate", name: "Slate", color: "bg-slate-600", accent: "bg-slate-100" },
    { id: "blue", name: "Biru", color: "bg-blue-600", accent: "bg-blue-100" },
    { id: "emerald", name: "Hijau", color: "bg-emerald-600", accent: "bg-emerald-100" },
    { id: "amber", name: "Kuning", color: "bg-amber-600", accent: "bg-amber-100" },
    { id: "red", name: "Merah", color: "bg-red-600", accent: "bg-red-100" },
    { id: "purple", name: "Ungu", color: "bg-purple-600", accent: "bg-purple-100" }
  ];

  const fontSizes = [
    { id: "small", name: "Kecil", sample: "text-sm" },
    { id: "medium", name: "Sedang", sample: "text-base" },
    { id: "large", name: "Besar", sample: "text-lg" }
  ];

  const handleSave = async () => {
    setIsSaving(true);
    
    // Apply theme immediately
    if (theme() === "dark") {
      document.documentElement.classList.add("dark");
    } else if (theme() === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // System theme
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      document.documentElement.classList.toggle("dark", isDark);
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const previewClasses = () => {
    const colorMap = {
      slate: "from-slate-700 to-slate-800",
      blue: "from-blue-700 to-blue-800",
      emerald: "from-emerald-700 to-emerald-800",
      amber: "from-amber-700 to-amber-800",
      red: "from-red-700 to-red-800",
      purple: "from-purple-700 to-purple-800"
    };
    return `bg-gradient-to-r ${colorMap[primaryColor() as keyof typeof colorMap]}`;
  };

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
              Anda perlu login untuk mengatur tampilan
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
                    <span class="text-5xl">🎨</span>
                    Tampilan
                  </h1>
                  <p class="text-slate-200">Personalisasi tampilan aplikasi</p>
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
                    <p class="text-sm text-emerald-600 dark:text-emerald-400">Tampilan telah diperbarui</p>
                  </div>
                </div>
              </div>
            </Show>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Settings Panel */}
              <div class="lg:col-span-2 space-y-6">
                {/* Theme Selection */}
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      <span>🌓</span>
                      Tema
                    </h2>
                  </div>
                  
                  <div class="p-6">
                    <div class="grid grid-cols-3 gap-4">
                      {themes.map((themeOption) => (
                        <label class="cursor-pointer">
                          <input
                            type="radio"
                            name="theme"
                            value={themeOption.id}
                            checked={theme() === themeOption.id}
                            onChange={() => setTheme(themeOption.id)}
                            class="sr-only"
                          />
                          <div class={`p-4 rounded-lg border-2 transition-all ${
                            theme() === themeOption.id 
                              ? "border-slate-500 bg-slate-50 dark:bg-slate-700" 
                              : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
                          }`}>
                            <div class={`w-full h-20 rounded-lg mb-3 ${themeOption.preview} border`}></div>
                            <div class="text-center">
                              <span class="text-2xl block mb-1">{themeOption.icon}</span>
                              <span class="text-sm font-medium text-slate-700 dark:text-slate-300">
                                {themeOption.name}
                              </span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Color Scheme */}
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      <span>🎨</span>
                      Warna Utama
                    </h2>
                  </div>
                  
                  <div class="p-6">
                    <div class="grid grid-cols-6 gap-3">
                      {colorOptions.map((color) => (
                        <label class="cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={color.id}
                            checked={primaryColor() === color.id}
                            onChange={() => setPrimaryColor(color.id)}
                            class="sr-only"
                          />
                          <div class={`relative group ${
                            primaryColor() === color.id ? "ring-2 ring-offset-2 ring-slate-400" : ""
                          } rounded-lg`}>
                            <div class={`w-12 h-12 rounded-lg ${color.color} group-hover:scale-110 transition-transform`}></div>
                            <Show when={primaryColor() === color.id}>
                              <div class="absolute inset-0 flex items-center justify-center">
                                <span class="text-white text-lg">✓</span>
                              </div>
                            </Show>
                          </div>
                          <p class="text-xs text-center mt-1 text-slate-600 dark:text-slate-400">
                            {color.name}
                          </p>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Typography */}
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      <span>📝</span>
                      Ukuran Font
                    </h2>
                  </div>
                  
                  <div class="p-6">
                    <div class="space-y-3">
                      {fontSizes.map((size) => (
                        <label class="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                          <div class="flex items-center gap-3">
                            <input
                              type="radio"
                              name="fontSize"
                              value={size.id}
                              checked={fontSize() === size.id}
                              onChange={() => setFontSize(size.id)}
                              class="text-slate-600 focus:ring-slate-500"
                            />
                            <span class="font-medium text-slate-800 dark:text-slate-100">
                              {size.name}
                            </span>
                          </div>
                          <span class={`${size.sample} text-slate-600 dark:text-slate-400`}>
                            Contoh teks
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interface Options */}
                <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                  <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                      <span>⚡</span>
                      Preferensi Interface
                    </h2>
                  </div>
                  
                  <div class="divide-y divide-slate-200 dark:divide-slate-700">
                    <div class="p-6">
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-slate-800 dark:text-slate-100">Mode Kompak</h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            Mengurangi spacing untuk menampilkan lebih banyak konten
                          </p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            class="sr-only peer"
                            checked={compactMode()}
                            onChange={(e) => setCompactMode(e.target.checked)}
                          />
                          <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                    </div>

                    <div class="p-6">
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-slate-800 dark:text-slate-100">Animasi</h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            Mengaktifkan animasi dan transisi
                          </p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            class="sr-only peer"
                            checked={animations()}
                            onChange={(e) => setAnimations(e.target.checked)}
                          />
                          <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                    </div>

                    <div class="p-6">
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-slate-800 dark:text-slate-100">Tampilkan Avatar</h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            Menampilkan foto profil di navigasi
                          </p>
                        </div>
                        <label class="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            class="sr-only peer"
                            checked={showAvatars()}
                            onChange={(e) => setShowAvatars(e.target.checked)}
                          />
                          <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                        </label>
                      </div>
                    </div>

                    <div class="p-6">
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-slate-800 dark:text-slate-100">Sidebar</h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            Preferensi tampilan sidebar
                          </p>
                        </div>
                        <select
                          value={sidebar()}
                          onChange={(e) => setSidebar(e.target.value)}
                          class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white"
                        >
                          <option value="expanded">Diperluas</option>
                          <option value="collapsed">Tertutup</option>
                          <option value="auto">Otomatis</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Panel */}
              <div class="lg:col-span-1">
                <div class="sticky top-8">
                  <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                      <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <span>👁️</span>
                        Preview
                      </h3>
                    </div>
                    
                    {/* Mock Interface Preview */}
                    <div class="p-4 bg-slate-50 dark:bg-slate-700/50">
                      <div class="space-y-3">
                        {/* Mock Header */}
                        <div class={`${previewClasses()} p-3 rounded-lg text-white`}>
                          <div class="flex items-center justify-between">
                            <div class="flex items-center gap-2">
                              <Show when={showAvatars()} fallback={<div class="w-6 h-6 bg-white/20 rounded-full"></div>}>
                                <div class="w-6 h-6 bg-white/30 rounded-full flex items-center justify-center text-xs">
                                  {currentUser.name.charAt(0)}
                                </div>
                              </Show>
                              <span class={`${fontSize() === 'small' ? 'text-sm' : fontSize() === 'large' ? 'text-lg' : 'text-base'} font-medium`}>
                                Dashboard
                              </span>
                            </div>
                            <div class="w-4 h-4 bg-white/20 rounded"></div>
                          </div>
                        </div>
                        
                        {/* Mock Content */}
                        <div class={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 ${compactMode() ? 'p-2' : 'p-3'}`}>
                          <div class={`${fontSize() === 'small' ? 'text-xs' : fontSize() === 'large' ? 'text-base' : 'text-sm'} font-medium text-slate-800 dark:text-slate-100 mb-2`}>
                            Kartu Contoh
                          </div>
                          <div class={`space-y-${compactMode() ? '1' : '2'}`}>
                            <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded"></div>
                            <div class="h-2 bg-slate-200 dark:bg-slate-600 rounded w-3/4"></div>
                          </div>
                        </div>
                        
                        {/* Mock Stats */}
                        <div class="grid grid-cols-2 gap-2">
                          <div class={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 ${compactMode() ? 'p-2' : 'p-3'}`}>
                            <div class={`${fontSize() === 'small' ? 'text-lg' : fontSize() === 'large' ? 'text-2xl' : 'text-xl'} font-bold text-slate-800 dark:text-slate-100`}>
                              42
                            </div>
                            <div class={`${fontSize() === 'small' ? 'text-xs' : fontSize() === 'large' ? 'text-sm' : 'text-xs'} text-slate-600 dark:text-slate-400`}>
                              Total
                            </div>
                          </div>
                          <div class={`bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-600 ${compactMode() ? 'p-2' : 'p-3'}`}>
                            <div class={`${fontSize() === 'small' ? 'text-lg' : fontSize() === 'large' ? 'text-2xl' : 'text-xl'} font-bold text-slate-800 dark:text-slate-100`}>
                              +12%
                            </div>
                            <div class={`${fontSize() === 'small' ? 'text-xs' : fontSize() === 'large' ? 'text-sm' : 'text-xs'} text-slate-600 dark:text-slate-400`}>
                              Trend
                            </div>
                          </div>
                        </div>
                        
                        {/* Mock Button */}
                        <button class={`w-full ${previewClasses()} text-white rounded-lg ${compactMode() ? 'py-2 text-sm' : 'py-3'} font-medium ${animations() ? 'transform hover:scale-105 transition-all' : ''}`}>
                          Tombol Contoh
                        </button>
                      </div>
                    </div>
                    
                    <div class="p-4 bg-slate-100 dark:bg-slate-700/50">
                      <p class={`text-center ${fontSize() === 'small' ? 'text-xs' : fontSize() === 'large' ? 'text-sm' : 'text-xs'} text-slate-600 dark:text-slate-400`}>
                        Preview akan berubah sesuai pengaturan Anda
                      </p>
                    </div>
                  </div>
                  
                  {/* Reset Button */}
                  <div class="mt-6">
                    <button
                      onClick={() => {
                        setTheme("system");
                        setPrimaryColor("slate");
                        setFontSize("medium");
                        setCompactMode(false);
                        setAnimations(true);
                        setShowAvatars(true);
                        setSidebar("expanded");
                      }}
                      class="w-full px-4 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors border border-slate-300 dark:border-slate-600"
                    >
                      🔄 Reset ke Default
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div class="mt-8 flex justify-center">
              <button
                onClick={handleSave}
                disabled={isSaving()}
                class="px-8 py-3 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg flex items-center gap-3"
              >
                <Show when={isSaving()} fallback={<span>💾</span>}>
                  <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                </Show>
                <span class="font-medium">
                  {isSaving() ? "Menyimpan..." : "Simpan Pengaturan"}
                </span>
              </button>
            </div>

            {/* Tips */}
            <div class="mt-8 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
              <div class="flex items-start gap-3">
                <span class="text-2xl">💡</span>
                <div>
                  <h3 class="font-semibold text-amber-800 dark:text-amber-200 mb-2">Tips Pengaturan Tampilan</h3>
                  <ul class="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li>• Gunakan tema sistem untuk mengikuti preferensi perangkat</li>
                    <li>• Mode kompak cocok untuk layar kecil atau menampilkan lebih banyak data</li>
                    <li>• Nonaktifkan animasi jika menggunakan perangkat dengan performa rendah</li>
                    <li>• Pilih warna yang kontras dengan latar belakang untuk aksesibilitas</li>
                  </ul>
                </div>
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