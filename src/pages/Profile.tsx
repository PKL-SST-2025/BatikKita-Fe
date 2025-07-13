import { createSignal, onMount } from "solid-js";
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

  const handlePhotoUpload = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        setProfilePhoto(base64);
        localStorage.setItem("profilePhoto", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    localStorage.removeItem("profilePhoto");
  };

  onMount(() => {
    setTimeout(() => setAnimateIn(true), 100);
  });

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div class="container mx-auto p-6 text-center min-h-[60vh] flex items-center justify-center">
          <p class="text-gray-700 dark:text-gray-300">
            Anda belum login. Silakan{" "}
            <a href="/login" class="text-blue-600 underline hover:text-blue-800">
              login
            </a>{" "}
            terlebih dahulu.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div
        class={`container mx-auto px-4 pt-20 min-h-[60vh] transform transition duration-700 ${
          animateIn() ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
      >
        <h1 class="text-3xl font-heading font-bold mb-6 text-center dark:text-white">
          Profil Saya
        </h1>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Kartu Pelengkap */}
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
            <h2 class="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              Informasi Tambahan
            </h2>
            <div class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
              <div class="flex justify-between">
                <span class="font-medium">Tanggal Bergabung</span>
                <span>10 Februari 2024</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">UMKM Dibina</span>
                <span>7 Mitra Aktif</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Performa Bulan Ini</span>
                <span>+14%</span>
              </div>
              <div class="flex justify-between">
                <span class="font-medium">Tema Tampilan</span>
                <span>Dark</span>
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-md font-medium mb-2 text-gray-800 dark:text-white">
                Akses Cepat
              </h3>
              <div class="flex flex-col space-y-2">
                <a
                  href="/umkm"
                  class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 text-sm text-center"
                >
                  Kelola UMKM
                </a>
                <a
                  href="/settings"
                  class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm text-center"
                >
                  Pengaturan Akun
                </a>
              </div>
            </div>
          </div>

          {/* Kartu Profil */}
          <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <div class="flex flex-col items-center">
              {profilePhoto() ? (
                <>
                  <img
                    src={profilePhoto()!}
                    alt="Profile"
                    class="w-32 h-32 rounded-full shadow-md object-cover mb-3 transition hover:scale-105"
                  />
                  <button
                    onClick={handleRemovePhoto}
                    class="text-sm text-red-500 hover:underline mb-4"
                  >
                    Hapus Foto
                  </button>
                </>
              ) : (
                <div class="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xl mb-4">
                  ?
                </div>
              )}

              <label class="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded transition mb-6">
                {profilePhoto() ? "Ganti Foto" : "Tambah Foto"}
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>

            <div class="space-y-4">
              <div>
                <label class="block font-medium text-gray-700 dark:text-gray-300">Nama</label>
                <p class="text-gray-900 dark:text-white">{currentUser.name}</p>
              </div>
              <div>
                <label class="block font-medium text-gray-700 dark:text-gray-300">Email</label>
                <p class="text-gray-900 dark:text-white">{currentUser.email}</p>
              </div>
            </div>

            <div class="mt-6 text-right">
              <button
                onClick={logout}
                class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}