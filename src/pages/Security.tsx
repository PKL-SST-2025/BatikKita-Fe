import { createSignal, onMount, Show, For } from "solid-js";
import { useAuth } from "../store/AuthContext";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Security() {
  const { user } = useAuth();
  const currentUser = user();
  const [animateIn, setAnimateIn] = createSignal(false);
  
  // Security settings state
  const [currentPassword, setCurrentPassword] = createSignal("");
  const [newPassword, setNewPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [twoFactorEnabled, setTwoFactorEnabled] = createSignal(false);
  const [loginAlerts, setLoginAlerts] = createSignal(true);
  const [sessionTimeout, setSessionTimeout] = createSignal("30");
  
  const [isChangingPassword, setIsChangingPassword] = createSignal(false);
  const [showSuccess, setShowSuccess] = createSignal(false);
  const [showError, setShowError] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  
  const [showQRCode, setShowQRCode] = createSignal(false);
  const [verificationCode, setVerificationCode] = createSignal("");

  const handlePasswordChange = async (e: Event) => {
    e.preventDefault();
    
    if (newPassword() !== confirmPassword()) {
      setErrorMessage("Password baru dan konfirmasi tidak cocok");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    if (newPassword().length < 8) {
      setErrorMessage("Password minimal 8 karakter");
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    
    setIsChangingPassword(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsChangingPassword(false);
    setShowSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleTwoFactorToggle = () => {
    if (!twoFactorEnabled()) {
      setShowQRCode(true);
    } else {
      setTwoFactorEnabled(false);
    }
  };

  const confirmTwoFactor = () => {
    if (verificationCode().length === 6) {
      setTwoFactorEnabled(true);
      setShowQRCode(false);
      setVerificationCode("");
    }
  };

  const loginSessions = [
    {
      device: "Chrome di Windows",
      location: "Purwokerto, Indonesia",
      time: "Sekarang",
      current: true,
      icon: "💻"
    },
    {
      device: "Mobile Safari",
      location: "Purwokerto, Indonesia",
      time: "2 jam yang lalu",
      current: false,
      icon: "📱"
    },
    {
      device: "Firefox di Windows",
      location: "Jakarta, Indonesia",
      time: "1 hari yang lalu",
      current: false,
      icon: "🖥️"
    }
  ];

  const recentActivity = [
    {
      action: "Login berhasil",
      time: "2 menit yang lalu",
      ip: "192.168.1.100",
      icon: "✅"
    },
    {
      action: "Perubahan password",
      time: "3 hari yang lalu",
      ip: "192.168.1.100",
      icon: "🔑"
    },
    {
      action: "Login gagal",
      time: "1 minggu yang lalu",
      ip: "203.142.4.22",
      icon: "❌"
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
              Anda perlu login untuk mengatur keamanan
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
                    <span class="text-5xl">🔐</span>
                    Keamanan
                  </h1>
                  <p class="text-slate-200">Kelola keamanan akun Anda</p>
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
            {/* Success/Error Messages */}
            <Show when={showSuccess()}>
              <div class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">✅</span>
                  <div>
                    <p class="font-semibold text-emerald-800 dark:text-emerald-200">Berhasil</p>
                    <p class="text-sm text-emerald-600 dark:text-emerald-400">Pengaturan keamanan telah diperbarui</p>
                  </div>
                </div>
              </div>
            </Show>

            <Show when={showError()}>
              <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div class="flex items-center gap-3">
                  <span class="text-2xl">❌</span>
                  <div>
                    <p class="font-semibold text-red-800 dark:text-red-200">Error</p>
                    <p class="text-sm text-red-600 dark:text-red-400">{errorMessage()}</p>
                  </div>
                </div>
              </div>
            </Show>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Password Change */}
              <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <span>🔑</span>
                    Ubah Password
                  </h2>
                </div>
                
                <form onSubmit={handlePasswordChange} class="p-6 space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password Saat Ini
                    </label>
                    <input
                      type="password"
                      value={currentPassword()}
                      onInput={(e) => setCurrentPassword(e.target.value)}
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Password Baru
                    </label>
                    <input
                      type="password"
                      value={newPassword()}
                      onInput={(e) => setNewPassword(e.target.value)}
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Konfirmasi Password Baru
                    </label>
                    <input
                      type="password"
                      value={confirmPassword()}
                      onInput={(e) => setConfirmPassword(e.target.value)}
                      class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={isChangingPassword()}
                    class="w-full px-4 py-2 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-lg hover:from-slate-600 hover:to-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    <Show when={isChangingPassword()} fallback={<span>🔄</span>}>
                      <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    </Show>
                    {isChangingPassword() ? "Mengubah..." : "Ubah Password"}
                  </button>
                </form>
              </div>

              {/* Two-Factor Authentication */}
              <div class="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                  <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                    <span>🛡️</span>
                    Autentikasi Dua Faktor
                  </h2>
                </div>
                
                <div class="p-6">
                  <div class="flex items-center justify-between mb-4">
                    <div>
                      <p class="font-medium text-slate-800 dark:text-slate-100">
                        2FA {twoFactorEnabled() ? "Aktif" : "Tidak Aktif"}
                      </p>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        Tambahan keamanan untuk akun Anda
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        checked={twoFactorEnabled()}
                        onChange={handleTwoFactorToggle}
                      />
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                    </label>
                  </div>
                  
                  <Show when={showQRCode()}>
                    <div class="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                      <p class="text-sm text-slate-600 dark:text-slate-400 mb-3">
                        Scan QR code dengan aplikasi authenticator:
                      </p>
                      <div class="bg-white p-4 rounded-lg mb-4 flex justify-center">
                        <div class="w-32 h-32 bg-slate-200 rounded-lg flex items-center justify-center">
                          <span class="text-4xl">📱</span>
                        </div>
                      </div>
                      <div class="space-y-3">
                        <input
                          type="text"
                          placeholder="Masukkan kode 6 digit"
                          value={verificationCode()}
                          onInput={(e) => setVerificationCode(e.target.value)}
                          class="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white text-center"
                          maxlength="6"
                        />
                        <div class="flex gap-2">
                          <button
                            onClick={confirmTwoFactor}
                            disabled={verificationCode().length !== 6}
                            class="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            Konfirmasi
                          </button>
                          <button
                            onClick={() => setShowQRCode(false)}
                            class="flex-1 px-4 py-2 bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-400 dark:hover:bg-slate-500 transition-colors"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </div>
                  </Show>
                </div>
              </div>
            </div>

            {/* Security Settings */}
            <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <span>⚙️</span>
                  Pengaturan Keamanan
                </h2>
              </div>
              
              <div class="divide-y divide-slate-200 dark:divide-slate-700">
                <div class="p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-slate-800 dark:text-slate-100">Alert Login</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        Notifikasi saat ada login dari perangkat baru
                      </p>
                    </div>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        class="sr-only peer"
                        checked={loginAlerts()}
                        onChange={(e) => setLoginAlerts(e.target.checked)}
                      />
                      <div class="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-600 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>
                    </label>
                  </div>
                </div>
                
                <div class="p-6">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-medium text-slate-800 dark:text-slate-100">Session Timeout</h3>
                      <p class="text-sm text-slate-600 dark:text-slate-400">
                        Logout otomatis setelah tidak aktif
                      </p>
                    </div>
                    <select
                      value={sessionTimeout()}
                      onChange={(e) => setSessionTimeout(e.target.value)}
                      class="px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 dark:bg-slate-700 dark:text-white"
                    >
                      <option value="15">15 menit</option>
                      <option value="30">30 menit</option>
                      <option value="60">1 jam</option>
                      <option value="120">2 jam</option>
                      <option value="never">Tidak pernah</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Active Sessions */}
            <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <span>🖥️</span>
                  Sesi Aktif
                </h2>
              </div>
              
              <div class="divide-y divide-slate-200 dark:divide-slate-700">
                <For each={loginSessions}>
                  {(session) => (
                  <div class="p-6">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-4">
                        <span class="text-3xl">{session.icon}</span>
                        <div>
                          <h3 class="font-medium text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            {session.device}
                            <Show when={session.current}>
                              <span class="px-2 py-1 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-200 text-xs rounded-full">
                                Saat ini
                              </span>
                            </Show>
                          </h3>
                          <p class="text-sm text-slate-600 dark:text-slate-400">
                            {session.location} • {session.time}
                          </p>
                        </div>
                      </div>
                      <Show when={!session.current}>
                        <button class="px-3 py-1 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors text-sm">
                          Logout
                        </button>
                      </Show>
                    </div>
                  </div>
                )}
                </For>
              </div>
            </div>

            {/* Recent Activity */}
            <div class="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
              <div class="p-6 border-b border-slate-200 dark:border-slate-700">
                <h2 class="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
                  <span>📋</span>
                  Aktivitas Terbaru
                </h2>
              </div>
              
              <div class="divide-y divide-slate-200 dark:divide-slate-700">
                <For each={recentActivity}>
                  {(activity) => (
                  <div class="p-6">
                    <div class="flex items-center gap-4">
                      <span class="text-2xl">{activity.icon}</span>
                      <div class="flex-1">
                        <h3 class="font-medium text-slate-800 dark:text-slate-100">
                          {activity.action}
                        </h3>
                        <p class="text-sm text-slate-600 dark:text-slate-400">
                          {activity.time} • IP: {activity.ip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                </For>
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