import { createSignal, Show, For } from "solid-js";
import { useNavigate } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Checkout() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = createSignal({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    paymentMethod: "credit-card"
  });

  const [isLoading, setIsLoading] = createSignal(false);

  // Mock cart items - replace with actual cart data if needed
  const cartItems = [
    {
      id: 1,
      name: "Batik Mega Mendung",
      price: 350000,
      quantity: 1,
      image: "/images/batik1.jpg"
    },
    {
      id: 2,
      name: "Batik Kawung",
      price: 425000,
      quantity: 2,
      image: "/images/batik2.jpg"
    }
  ];

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = 25000;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Process checkout
      console.log("Checkout data:", formData());
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to success page
      navigate("/checkout/success");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR'
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div class="container mx-auto px-4 py-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>
          
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Checkout Form */}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Informasi Pengiriman
              </h2>
              
              <form onSubmit={handleSubmit} class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Depan
                    </label>
                    <input
                      type="text"
                      value={formData().firstName}
                      onInput={(e) => handleInputChange('firstName', e.target.value)}
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      disabled={isLoading()}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Nama Belakang
                    </label>
                    <input
                      type="text"
                      value={formData().lastName}
                      onInput={(e) => handleInputChange('lastName', e.target.value)}
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      disabled={isLoading()}
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData().email}
                    onInput={(e) => handleInputChange('email', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={isLoading()}
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    value={formData().phone}
                    onInput={(e) => handleInputChange('phone', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={isLoading()}
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alamat
                  </label>
                  <textarea
                    value={formData().address}
                    onInput={(e) => handleInputChange('address', e.target.value)}
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                    disabled={isLoading()}
                  ></textarea>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kota
                    </label>
                    <input
                      type="text"
                      value={formData().city}
                      onInput={(e) => handleInputChange('city', e.target.value)}
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      disabled={isLoading()}
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Kode Pos
                    </label>
                    <input
                      type="text"
                      value={formData().postalCode}
                      onInput={(e) => handleInputChange('postalCode', e.target.value)}
                      class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      required
                      disabled={isLoading()}
                    />
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Metode Pembayaran
                  </label>
                  <select
                    value={formData().paymentMethod}
                    onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    disabled={isLoading()}
                  >
                    <option value="credit-card">Kartu Kredit</option>
                    <option value="bank-transfer">Transfer Bank</option>
                    <option value="e-wallet">E-Wallet</option>
                    <option value="cod">Bayar di Tempat</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isLoading()}
                  class="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Show when={isLoading()} fallback={<span>💳</span>}>
                    <div class="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </Show>
                  {isLoading() ? "Memproses..." : "Proses Pembayaran"}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
              <h2 class="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Ringkasan Pesanan
              </h2>
              
              <div class="space-y-4 mb-6">
                <For each={cartItems}>
                  {(item: any) => (
                    <div class="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        class="w-16 h-16 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/images/placeholder.jpg";
                        }}
                      />
                      <div class="flex-1">
                        <h3 class="font-medium text-gray-900 dark:text-white">
                          {item.name}
                        </h3>
                        <p class="text-gray-600 dark:text-gray-400">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span class="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  )}
                </For>
              </div>

              <div class="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Ongkir</span>
                  <span>{formatCurrency(shipping)}</span>
                </div>
                <div class="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>Pajak (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div class="border-t border-gray-200 dark:border-gray-600 pt-3">
                  <div class="flex justify-between text-lg font-bold text-gray-900 dark:text-white">
                    <span>Total</span>
                    <span class="text-blue-600 dark:text-blue-400">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div class="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
                <div class="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <div class="flex items-center gap-1">
                    <span>🔒</span>
                    <span>Pembayaran Aman</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>🚚</span>
                    <span>Pengiriman Cepat</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <span>↩️</span>
                    <span>Garansi Kembali</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}