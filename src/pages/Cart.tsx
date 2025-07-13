import { createSignal } from "solid-js";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Cart() {
  const [items, setItems] = createSignal([
    { id: 1, name: "Batik Mega Mendung", price: 150000, quantity: 2 },
    { id: 2, name: "Batik Kawung", price: 180000, quantity: 1 },
  ]);

  const totalPrice = () =>
    items().reduce((sum, item) => sum + item.price * item.quantity, 0);

  const updateQuantity = (id: number, newQty: number) => {
    setItems(
      items().map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setItems(items().filter((item) => item.id !== id));
  };

  return (
    <>
      <Navbar />

      <div class="relative min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
        <div class="container mx-auto px-6 py-20 relative z-10">
          <h1 class="text-3xl font-bold text-gray-800 dark:text-white mb-10">
            Shopping Cart &gt; Pembayaran &gt; Order Complete
          </h1>

          {items().length === 0 ? (
            <p class="text-center text-gray-600 dark:text-gray-400">
              Keranjang belanja kosong.
            </p>
          ) : (
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Left: Cart Items */}
              <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 overflow-x-auto">
                <table class="min-w-full text-sm divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-100 dark:bg-gray-700 text-left text-xs uppercase text-gray-600 dark:text-gray-300">
                    <tr>
                      <th class="px-4 py-3">Produk</th>
                      <th class="px-4 py-3">Harga</th>
                      <th class="px-4 py-3 text-center">Jumlah</th>
                      <th class="px-4 py-3 text-right">Subtotal</th>
                      <th class="px-4 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items().map((item) => (
                      <tr class="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                        <td class="px-4 py-4 font-medium">{item.name}</td>
                        <td class="px-4 py-4">Rp {item.price.toLocaleString()}</td>
                        <td class="px-4 py-4 text-center">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onInput={(e) =>
                              updateQuantity(
                                item.id,
                                parseInt(e.currentTarget.value)
                              )
                            }
                            class="w-16 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-center"
                          />
                        </td>
                        <td class="px-4 py-4 text-right">
                          Rp {(item.price * item.quantity).toLocaleString()}
                        </td>
                        <td class="px-4 py-4 text-center">
                          <button
                            onClick={() => removeItem(item.id)}
                            class="text-red-600 hover:underline"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Right: Summary */}
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl ring-1 ring-gray-200 dark:ring-gray-700 p-6 space-y-6">
                <h2 class="text-xl font-bold text-gray-800 dark:text-white">
                  Total Keranjang Belanja
                </h2>

                <div class="flex justify-between text-gray-700 dark:text-gray-300">
                  <span>Subtotal</span>
                  <span>Rp {totalPrice().toLocaleString()}</span>
                </div>

                <div>
                  <p class="text-sm text-gray-600 dark:text-gray-400 mb-1 font-semibold">
                    PENGIRIMAN
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Masukkan alamat Anda untuk melihat opsi pengiriman. Hitung biaya pengiriman.
                  </p>
                </div>

                <div class="flex justify-between text-lg font-bold text-gray-800 dark:text-white border-t pt-4">
                  <span>Total</span>
                  <span>Rp {totalPrice().toLocaleString()}</span>
                </div>

                <a
                  href="/checkout"
                  class="block text-center bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition-all"
                >
                  LANJUTKAN KE CHECKOUT
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
