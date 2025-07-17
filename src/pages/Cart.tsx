import { createSignal, createEffect, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../store/CartContext";

// Type definitions for coupon codes
interface CouponCode {
  code: string;
  discount: number;
  type: 'percentage' | 'fixed';
  minPurchase?: number;
}

// Sample coupon codes
const availableCoupons: CouponCode[] = [
  { code: 'WELCOME10', discount: 10, type: 'percentage' },
  { code: 'BATIK50K', discount: 50000, type: 'fixed', minPurchase: 500000 },
  { code: 'FREESHIP', discount: 100, type: 'percentage', minPurchase: 300000 }
];

export default function Cart() {
  const { cartItems, updateCartItem, removeFromCart, clearCart } = useCart();

  const [selectedShipping, setSelectedShipping] = createSignal("regular");
  const [couponCode, setCouponCode] = createSignal("");
  const [appliedCoupon, setAppliedCoupon] = createSignal<CouponCode | null>(null);
  const [showCouponError, setShowCouponError] = createSignal(false);
  const [selectedItems, setSelectedItems] = createSignal<number[]>([]);
  const [showSaveModal, setShowSaveModal] = createSignal(false);
  const [savedForLater, setSavedForLater] = createSignal<any[]>([]);
  const [estimatedDelivery, setEstimatedDelivery] = createSignal("");

  // Shipping options
  const shippingOptions = [
    { id: "regular", name: "Regular (3-5 hari)", price: 15000, days: 5 },
    { id: "express", name: "Express (1-2 hari)", price: 30000, days: 2 },
    { id: "instant", name: "Instant (Hari ini)", price: 50000, days: 0 }
  ];

  // Calculate shipping cost
  const shippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === selectedShipping());
    return option?.price || 0;
  };

  // Calculate estimated delivery
  createEffect(() => {
    const option = shippingOptions.find(opt => opt.id === selectedShipping());
    if (option) {
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + option.days);
      const options: Intl.DateTimeFormatOptions = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      };
      setEstimatedDelivery(deliveryDate.toLocaleDateString('id-ID', options));
    }
  });

  // Calculate subtotal
  const subtotal = () =>
    cartItems().reduce((sum: number, item: any) => {
      const price = item.product.discount_price || item.product.price;
      return sum + price * item.quantity;
    }, 0);

  // Calculate discount
  const discountAmount = () => {
    if (!appliedCoupon()) return 0;
    
    if (appliedCoupon()!.type === 'percentage') {
      return subtotal() * (appliedCoupon()!.discount / 100);
    }
    return appliedCoupon()!.discount;
  };

  // Calculate total
  const totalPrice = () => subtotal() + shippingCost() - discountAmount();

  // Calculate total savings
  const totalSavings = () => {
    const itemSavings = cartItems().reduce((sum: number, item: any) => {
      const originalPrice = item.product.price;
      const currentPrice = item.product.discount_price || item.product.price;
      const originalTotal = originalPrice * item.quantity;
      const currentTotal = currentPrice * item.quantity;
      return sum + (originalTotal - currentTotal);
    }, 0);
    return itemSavings + discountAmount();
  };

  // Update quantity with animation
  const updateQuantity = (id: number, newQty: number) => {
    if (newQty < 1) return;
    
    const item = cartItems().find((i: any) => i.id === id);
    if (item && item.product.stock_quantity && newQty > item.product.stock_quantity) {
      showNotification(`Stok terbatas! Hanya tersedia ${item.product.stock_quantity} item`, 'warning');
      return;
    }

    updateCartItem(id, newQty);
    
    // Animate the update
    const row = document.querySelector(`[data-item-id="${id}"]`);
    if (row) {
      row.classList.add('animate-pulse');
      setTimeout(() => row.classList.remove('animate-pulse'), 1000);
    }
  };

  // Remove item with animation
  const removeItem = (id: number) => {
    const row = document.querySelector(`[data-item-id="${id}"]`);
    if (row) {
      row.classList.add('animate-fade-out');
      setTimeout(() => {
        removeFromCart(id);
        showNotification('Produk dihapus dari keranjang', 'info');
      }, 300);
    }
  };

  // Save for later
  const saveForLater = (id: number) => {
    const item = cartItems().find((i: any) => i.id === id);
    if (item) {
      setSavedForLater([...savedForLater(), item]);
      removeItem(id);
      showNotification('Produk disimpan untuk nanti', 'success');
    }
  };

  // Move to cart from saved
  const moveToCart = (id: number) => {
    const item = savedForLater().find((i: any) => i.id === id);
    if (item) {
      // Add to cart through the cart service
      // This would need to be implemented properly with the actual add to cart function
      setSavedForLater(savedForLater().filter((i: any) => i.id !== id));
      showNotification('Produk dipindahkan ke keranjang', 'success');
    }
  };

  // Apply coupon code
  const applyCoupon = () => {
    const coupon = availableCoupons.find(
      c => c.code.toUpperCase() === couponCode().toUpperCase()
    );
    
    if (coupon) {
      if (coupon.minPurchase && subtotal() < coupon.minPurchase) {
        showNotification(
          `Pembelian minimum Rp ${coupon.minPurchase.toLocaleString('id-ID')} untuk kupon ini`,
          'warning'
        );
        return;
      }
      
      setAppliedCoupon(coupon);
      showNotification('Kupon berhasil diterapkan!', 'success');
      setCouponCode('');
    } else {
      setShowCouponError(true);
      setTimeout(() => setShowCouponError(false), 3000);
    }
  };

  // Remove coupon
  const removeCoupon = () => {
    setAppliedCoupon(null);
    showNotification('Kupon dihapus', 'info');
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'warning' | 'info' = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500';
    notification.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`;
    
    const icon = type === 'success' ? '✓' : type === 'warning' ? '⚠️' : 'ℹ️';
    notification.innerHTML = `<span class="text-lg">${icon}</span> ${message}`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Select/deselect items
  const toggleSelectItem = (id: number) => {
    if (selectedItems().includes(id)) {
      setSelectedItems(selectedItems().filter(i => i !== id));
    } else {
      setSelectedItems([...selectedItems(), id]);
    }
  };

  // Select all items
  const selectAllItems = () => {
    if (selectedItems().length === cartItems().length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems().map((i: any) => i.id));
    }
  };

  // Delete selected items
  const deleteSelectedItems = () => {
    if (selectedItems().length === 0) return;
    
    if (confirm(`Hapus ${selectedItems().length} produk yang dipilih?`)) {
      selectedItems().forEach(id => removeItem(id));
      setSelectedItems([]);
    }
  };

  return (
    <>
      <Navbar />

      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 pb-16">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header with Progress Steps */}
          <div class="mb-8">
            <div class="flex items-center justify-between mb-6">
              <h1 class="text-3xl font-bold text-gray-900">Keranjang Belanja</h1>
              <Show when={cartItems().length > 0}>
                <button
                  onClick={() => clearCart()}
                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  Kosongkan Keranjang
                </button>
              </Show>
            </div>
            
            {/* Progress Steps */}
            <div class="flex items-center justify-center mb-8">
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <span class="ml-2 text-sm font-medium">Keranjang</span>
                </div>
                <div class="w-16 h-0.5 bg-gray-300"></div>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span class="ml-2 text-sm text-gray-600">Checkout</span>
                </div>
                <div class="w-16 h-0.5 bg-gray-300"></div>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <span class="ml-2 text-sm text-gray-600">Selesai</span>
                </div>
              </div>
            </div>
          </div>

          <Show when={cartItems().length === 0}>
            <div class="text-center py-16 bg-white rounded-xl shadow-sm">
              <div class="text-6xl mb-4">🛒</div>
              <h2 class="text-2xl font-bold text-gray-900 mb-2">Keranjang Anda Kosong</h2>
              <p class="text-gray-600 mb-6">Yuk mulai belanja dan temukan batik favorit Anda!</p>
              <A href="/products" class="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16l-4-4m0 0l4-4m-4 4h18"/>
                </svg>
                Mulai Belanja
              </A>
            </div>
          </Show>

          <Show when={cartItems().length > 0}>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Cart Items */}
              <div class="lg:col-span-2 space-y-4">
                {/* Select All Bar */}
                <div class="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems().length === cartItems().length}
                      onChange={selectAllItems}
                      class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span class="font-medium">Pilih Semua ({cartItems().length} produk)</span>
                  </div>
                  <Show when={selectedItems().length > 0}>
                    <button
                      onClick={deleteSelectedItems}
                      class="text-red-600 hover:text-red-700 font-medium text-sm"
                    >
                      Hapus ({selectedItems().length})
                    </button>
                  </Show>
                </div>

                {/* Cart Items */}
                <div class="space-y-4">
                  <For each={cartItems()}>
                    {(item) => (
                      <div 
                        data-item-id={item.id}
                        class="bg-white rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md"
                      >
                        <div class="flex gap-4">
                          <input
                            type="checkbox"
                            checked={selectedItems().includes(item.id)}
                            onChange={() => toggleSelectItem(item.id)}
                            class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-8"
                          />
                          
                          <div class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img 
                              src={item.product.images?.[0]?.image_url || '/images/placeholder.jpg'} 
                              alt={item.product.name}
                              class="w-full h-full object-cover"
                            />
                          </div>
                          
                          <div class="flex-1">
                            <div class="flex justify-between items-start mb-2">
                              <div>
                                <h3 class="font-semibold text-gray-900">{item.product.name}</h3>
                                <Show when={item.product.stock_quantity && item.product.stock_quantity < 10}>
                                  <p class="text-sm text-red-600 mt-1">
                                    Stok terbatas! Tersisa {item.product.stock_quantity} item
                                  </p>
                                </Show>
                              </div>
                              
                              <div class="text-right">
                                <Show when={item.product.discount_price && item.product.price > item.product.discount_price}>
                                  <p class="text-sm text-gray-500 line-through">
                                    Rp {item.product.price.toLocaleString('id-ID')}
                                  </p>
                                </Show>
                                <p class="font-semibold text-gray-900">
                                  Rp {(item.product.discount_price || item.product.price).toLocaleString('id-ID')}
                                </p>
                                <Show when={item.product.discount_price && item.product.price > item.product.discount_price}>
                                  <p class="text-sm text-green-600">
                                    Hemat {Math.round((1 - item.product.discount_price! / item.product.price) * 100)}%
                                  </p>
                                </Show>
                              </div>
                            </div>
                            
                            <div class="flex items-center justify-between">
                              <div class="flex items-center gap-4">
                                {/* Quantity Selector */}
                                <div class="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                                    </svg>
                                  </button>
                                  <input
                                    type="number"
                                    min="1"
                                    max={item.product.stock_quantity || 999}
                                    value={item.quantity}
                                    onInput={(e) =>
                                      updateQuantity(
                                        item.id,
                                        parseInt(e.currentTarget.value) || 1
                                      )
                                    }
                                    class="w-12 text-center border-x border-gray-300 py-1"
                                  />
                                  <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    class="px-3 py-1 hover:bg-gray-100 transition-colors"
                                  >
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                                    </svg>
                                  </button>
                                </div>
                                
                                {/* Action Buttons */}
                                <button
                                  onClick={() => saveForLater(item.id)}
                                  class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                  Simpan untuk nanti
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  class="text-sm text-red-600 hover:text-red-700 font-medium"
                                >
                                  Hapus
                                </button>
                              </div>
                              
                              {/* Subtotal */}
                              <div class="text-right">
                                <p class="text-sm text-gray-600">Subtotal</p>
                                <p class="font-bold text-lg text-gray-900">
                                  Rp {((item.product.discount_price || item.product.price) * item.quantity).toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>

                {/* Saved for Later */}
                <Show when={savedForLater().length > 0}>
                  <div class="mt-8">
                    <h2 class="text-xl font-bold text-gray-900 mb-4">
                      Disimpan untuk Nanti ({savedForLater().length})
                    </h2>
                    <div class="space-y-4">
                      <For each={savedForLater()}>
                        {(item) => (
                          <div class="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                            <div class="flex items-center gap-4">
                              <div class="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden">
                                <img 
                                  src={item.image || '/images/placeholder.jpg'} 
                                  alt={item.name}
                                  class="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <h4 class="font-medium text-gray-900">{item.name}</h4>
                                <p class="text-sm text-gray-600">
                                  Rp {item.price.toLocaleString('id-ID')}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => moveToCart(item.id)}
                              class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                              Pindah ke Keranjang
                            </button>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>

              {/* Right: Order Summary */}
              <div class="lg:col-span-1">
                <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24 space-y-6">
                  <h2 class="text-xl font-bold text-gray-900">Ringkasan Pesanan</h2>

                  {/* Coupon Code */}
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">
                      Kode Kupon
                    </label>
                    <div class="flex gap-2">
                      <input
                        type="text"
                        value={couponCode()}
                        onInput={(e) => setCouponCode(e.currentTarget.value)}
                        placeholder="Masukkan kode"
                        class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        classList={{
                          "border-red-500": showCouponError()
                        }}
                      />
                      <button
                        onClick={applyCoupon}
                        disabled={!couponCode()}
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                      >
                        Terapkan
                      </button>
                    </div>
                    <Show when={showCouponError()}>
                      <p class="text-sm text-red-600 mt-1">Kode kupon tidak valid</p>
                    </Show>
                    <Show when={appliedCoupon()}>
                      <div class="mt-2 flex items-center justify-between bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                        <span>
                          Kupon "{appliedCoupon()!.code}" diterapkan
                        </span>
                        <button
                          onClick={removeCoupon}
                          class="text-red-600 hover:text-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    </Show>
                    <div class="mt-2 text-xs text-gray-500">
                      Coba: WELCOME10, BATIK50K, FREESHIP
                    </div>
                  </div>

                  {/* Shipping Options */}
                  <div>
                    <label class="text-sm font-medium text-gray-700 mb-2 block">
                      Metode Pengiriman
                    </label>
                    <div class="space-y-2">
                      <For each={shippingOptions}>
                        {(option) => (
                          <label class="flex items-center justify-between p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                            classList={{
                              "border-blue-500 bg-blue-50": selectedShipping() === option.id,
                              "border-gray-300": selectedShipping() !== option.id
                            }}
                          >
                            <div class="flex items-center gap-3">
                              <input
                                type="radio"
                                name="shipping"
                                value={option.id}
                                checked={selectedShipping() === option.id}
                                onChange={(e) => setSelectedShipping(e.currentTarget.value)}
                                class="text-blue-600 focus:ring-blue-500"
                              />
                              <div>
                                <p class="font-medium text-gray-900">{option.name}</p>
                                <Show when={selectedShipping() === option.id && estimatedDelivery()}>
                                  <p class="text-xs text-gray-600">
                                    Estimasi tiba: {estimatedDelivery()}
                                  </p>
                                </Show>
                              </div>
                            </div>
                            <span class="font-medium text-gray-900">
                              Rp {option.price.toLocaleString('id-ID')}
                            </span>
                          </label>
                        )}
                      </For>
                    </div>
                  </div>

                  {/* Price Breakdown */}
                  <div class="space-y-3 border-t pt-4">
                    <div class="flex justify-between text-gray-700">
                      <span>Subtotal ({cartItems().length} produk)</span>
                      <span>Rp {subtotal().toLocaleString('id-ID')}</span>
                    </div>
                    
                    <Show when={appliedCoupon()}>
                      <div class="flex justify-between text-green-600">
                        <span>Diskon Kupon</span>
                        <span>-Rp {discountAmount().toLocaleString('id-ID')}</span>
                      </div>
                    </Show>
                    
                    <div class="flex justify-between text-gray-700">
                      <span>Ongkos Kirim</span>
                      <span>Rp {shippingCost().toLocaleString('id-ID')}</span>
                    </div>
                    
                    <Show when={totalSavings() > 0}>
                      <div class="bg-green-50 text-green-700 px-3 py-2 rounded-lg text-sm">
                        <div class="flex items-center justify-between">
                          <span class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                            </svg>
                            Total Hemat
                          </span>
                          <span class="font-semibold">
                            Rp {totalSavings().toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                    </Show>
                    
                    <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                      <span>Total Pembayaran</span>
                      <span>Rp {totalPrice().toLocaleString('id-ID')}</span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <A
                    href="/checkout"
                    class="block w-full text-center bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105"
                  >
                    Lanjutkan ke Checkout
                  </A>

                  {/* Security Badges */}
                  <div class="flex items-center justify-center gap-4 pt-4 border-t">
                    <div class="flex items-center gap-1 text-gray-600">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                      </svg>
                      <span class="text-xs">Pembayaran Aman</span>
                    </div>
                    <div class="flex items-center gap-1 text-gray-600">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z"/>
                      </svg>
                      <span class="text-xs">SSL Encrypted</span>
                    </div>
                  </div>

                  {/* Promo Banner */}
                  <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 rounded-lg text-center">
                    <p class="text-sm font-medium mb-1">Gratis Ongkir!</p>
                    <p class="text-xs">Untuk pembelian di atas Rp 500.000</p>
                  </div>
                </div>
              </div>
            </div>
          </Show>

          {/* Recently Viewed Section */}
          <Show when={cartItems().length > 0}>
            <div class="mt-16">
              <h2 class="text-2xl font-bold text-gray-900 mb-6">Produk yang Baru Dilihat</h2>
              <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                <For each={[1, 2, 3, 4, 5]}>
                  {(i) => (
                    <a href={`/product/${i}`} class="group">
                      <div class="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                        <div class="aspect-square bg-gray-100 overflow-hidden">
                          <img 
                            src={`/images/batik-${i}.jpg`} 
                            alt={`Batik ${i}`}
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        </div>
                        <div class="p-3">
                          <h3 class="text-sm font-medium text-gray-900 line-clamp-1">
                            Batik Premium {i}
                          </h3>
                          <p class="text-sm text-gray-600 mt-1">
                            Rp {(150000 + i * 30000).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    </a>
                  )}
                </For>
              </div>
            </div>
          </Show>

          {/* Features Section */}
          <div class="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="text-center">
              <div class="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Kualitas Terjamin</h3>
              <p class="text-sm text-gray-600">
                Semua produk batik kami dijamin original dan berkualitas tinggi
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Harga Terbaik</h3>
              <p class="text-sm text-gray-600">
                Dapatkan harga terbaik dengan berbagai promo menarik setiap hari
              </p>
            </div>
            
            <div class="text-center">
              <div class="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
              </div>
              <h3 class="font-semibold text-gray-900 mb-2">Pembayaran Aman</h3>
              <p class="text-sm text-gray-600">
                Transaksi aman dengan enkripsi SSL dan berbagai metode pembayaran
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Cart Summary on Mobile */}
      <Show when={cartItems().length > 0}>
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 lg:hidden">
          <div class="flex items-center justify-between mb-3">
            <div>
              <p class="text-sm text-gray-600">Total Pembayaran</p>
              <p class="text-lg font-bold text-gray-900">
                Rp {totalPrice().toLocaleString('id-ID')}
              </p>
            </div>
            <A
              href="/checkout"
              class="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Checkout ({cartItems().length})
            </A>
          </div>
        </div>
      </Show>

      {/* Save Modal */}
      <Show when={showSaveModal()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <h3 class="text-xl font-bold text-gray-900 mb-4">Simpan Keranjang?</h3>
            <p class="text-gray-600 mb-6">
              Simpan keranjang belanja Anda untuk melanjutkan belanja nanti
            </p>
            <div class="flex gap-3">
              <button
                onClick={() => setShowSaveModal(false)}
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  // Save cart logic here
                  showNotification('Keranjang berhasil disimpan!', 'success');
                  setShowSaveModal(false);
                }}
                class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      </Show>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes fade-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-20px);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-fade-out {
          animation: fade-out 0.3s ease-out forwards;
        }
        
        .line-clamp-1 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
        }
      `}</style>

      <Footer />
    </>
  );
}