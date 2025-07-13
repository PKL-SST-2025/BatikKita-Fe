import { createSignal } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Checkout() {
  const [name, setName] = createSignal("");
  const [address, setAddress] = createSignal("");
  const [city, setCity] = createSignal("");
  const [postalCode, setPostalCode] = createSignal("");
  const [paymentMethod, setPaymentMethod] = createSignal("bank_transfer");

  const totalAmount = 510000;

  const handleCheckout = (e: Event) => {
    e.preventDefault();
    console.log("Checkout data:", {
      name: name(),
      address: address(),
      city: city(),
      postalCode: postalCode(),
      paymentMethod: paymentMethod(),
    });
    alert("Pesanan telah dikonfirmasi!");
  };

  return (
    <div class="flex flex-col min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500 relative overflow-hidden">
      <Navbar />

      {/* ✨ Glow Background */}
      <div class="absolute -top-36 -left-36 w-96 h-96 bg-purple-400 opacity-25 blur-3xl rounded-full animate-float pointer-events-none z-0" />
      <div class="absolute bottom-[-6rem] -right-36 w-96 h-96 bg-blue-500 opacity-20 blur-3xl rounded-full animate-float pointer-events-none z-0" />

      <main class="relative z-10 flex-grow container mx-auto px-6 py-20">
        <h1 class="text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Checkout
        </h1>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* 🧾 Form Checkout */}
          <form
            onSubmit={handleCheckout}
            class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-8 space-y-6"
          >
            <div>
              <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={name()}
                onInput={(e) => setName(e.currentTarget.value)}
                required
                placeholder="Contoh: Ahmad Fadli"
                class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Alamat Lengkap
              </label>
              <textarea
                value={address()}
                onInput={(e) => setAddress(e.currentTarget.value)}
                required
                rows={3}
                placeholder="Jl. Batik Raya No. 10"
                class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div class="flex flex-col md:flex-row gap-4">
              <div class="flex-1">
                <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Kota
                </label>
                <input
                  type="text"
                  value={city()}
                  onInput={(e) => setCity(e.currentTarget.value)}
                  required
                  class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
              <div class="flex-1">
                <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                  Kode Pos
                </label>
                <input
                  type="text"
                  value={postalCode()}
                  onInput={(e) => setPostalCode(e.currentTarget.value)}
                  required
                  class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label class="block mb-1 font-semibold text-gray-700 dark:text-gray-300">
                Metode Pembayaran
              </label>
              <select
                value={paymentMethod()}
                onChange={(e) => setPaymentMethod(e.currentTarget.value)}
                class="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
              >
                <option value="bank_transfer">Transfer Bank</option>
                <option value="cod">Cash on Delivery (COD)</option>
              </select>
            </div>

            <button
              type="submit"
              class="w-full py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Konfirmasi Pesanan →
            </button>
          </form>

          {/* 💳 Ringkasan Pesanan */}
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-6 space-y-6">
            <h2 class="text-xl font-bold text-gray-800 dark:text-white">Ringkasan</h2>

            <div class="border-t border-gray-300 dark:border-gray-600 pt-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>Rp 500.000</span>
              </div>
              <div class="flex justify-between">
                <span>Ongkir</span>
                <span>Rp 10.000</span>
              </div>
              <div class="flex justify-between font-semibold text-lg pt-2 border-t border-gray-300 dark:border-gray-600">
                <span>Total</span>
                <span class="text-blue-600 dark:text-blue-400">
                  Rp {totalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <p class="text-xs text-gray-500 dark:text-gray-400">
              * Pastikan data Anda benar sebelum konfirmasi pesanan.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}