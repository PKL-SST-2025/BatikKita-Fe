import { createSignal, createEffect, Show, For } from "solid-js";
import { A } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../store/CartContext";

// Type definitions
interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  province: string;
  postalCode: string;
  isDefault?: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'bank' | 'ewallet' | 'retail' | 'cod';
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
  color?: string;
}

// Sample cart items (in real app, get from cart context)
const cartItems: CartItem[] = [
  {
    id: 1,
    name: "Batik Mega Mendung",
    price: 150000,
    quantity: 2,
    image: "/images/batik-1.jpg",
    size: "L",
    color: "Biru Klasik"
  },
  {
    id: 2,
    name: "Batik Kawung",
    price: 180000,
    quantity: 1,
    image: "/images/batik-5.jpg",
    size: "M",
    color: "Coklat Sogan"
  }
];

// Payment methods
const paymentMethods: PaymentMethod[] = [
  // Bank Transfer
  { id: 'bca', name: 'BCA Virtual Account', icon: '🏦', description: 'Bayar melalui ATM, m-Banking, atau Internet Banking', category: 'bank' },
  { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '🏦', description: 'Bayar melalui ATM, m-Banking, atau Internet Banking', category: 'bank' },
  { id: 'bni', name: 'BNI Virtual Account', icon: '🏦', description: 'Bayar melalui ATM, m-Banking, atau Internet Banking', category: 'bank' },
  
  // E-Wallets
  { id: 'gopay', name: 'GoPay', icon: '💳', description: 'Bayar langsung dari aplikasi Gojek', category: 'ewallet' },
  { id: 'ovo', name: 'OVO', icon: '💳', description: 'Bayar langsung dari aplikasi OVO', category: 'ewallet' },
  { id: 'dana', name: 'DANA', icon: '💳', description: 'Bayar langsung dari aplikasi DANA', category: 'ewallet' },
  { id: 'shopeepay', name: 'ShopeePay', icon: '💳', description: 'Bayar langsung dari aplikasi Shopee', category: 'ewallet' },
  
  // Retail
  { id: 'indomaret', name: 'Indomaret', icon: '🏪', description: 'Bayar di gerai Indomaret terdekat', category: 'retail' },
  { id: 'alfamart', name: 'Alfamart', icon: '🏪', description: 'Bayar di gerai Alfamart/Alfamidi terdekat', category: 'retail' },
  
  // COD
  { id: 'cod', name: 'Cash on Delivery', icon: '💵', description: 'Bayar saat barang sampai', category: 'cod' }
];

// Provinces and cities data
const provinces = ['DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'Jawa Timur', 'Banten'];
const citiesByProvince: Record<string, string[]> = {
  'DKI Jakarta': ['Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara'],
  'Jawa Barat': ['Bandung', 'Bogor', 'Depok', 'Bekasi', 'Cirebon'],
  'Jawa Tengah': ['Semarang', 'Solo', 'Yogyakarta', 'Magelang', 'Purwokerto'],
  'Jawa Timur': ['Surabaya', 'Malang', 'Sidoarjo', 'Kediri', 'Jember'],
  'Banten': ['Tangerang', 'Tangerang Selatan', 'Serang', 'Cilegon', 'Pandeglang']
};

export default function Checkout() {
  // Form states
  const [name, setName] = createSignal("");
  const [phone, setPhone] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [address, setAddress] = createSignal("");
  const [province, setProvince] = createSignal("");
  const [city, setCity] = createSignal("");
  const [postalCode, setPostalCode] = createSignal("");
  const [notes, setNotes] = createSignal("");
  
  // Checkout states
  const [selectedPayment, setSelectedPayment] = createSignal("bca");
  const [selectedShipping, setSelectedShipping] = createSignal("regular");
  const [useInsurance, setUseInsurance] = createSignal(false);
  const [agreeToTerms, setAgreeToTerms] = createSignal(false);
  const [savedAddresses, setSavedAddresses] = createSignal<ShippingAddress[]>([]);
  const [showAddressModal, setShowAddressModal] = createSignal(false);
  const [currentStep, setCurrentStep] = createSignal(1);
  const [promoCode, setPromoCode] = createSignal("");
  const [promoDiscount, setPromoDiscount] = createSignal(0);
  const [isProcessing, setIsProcessing] = createSignal(false);

  // Available cities based on selected province
  const availableCities = () => citiesByProvince[province()] || [];

  // Shipping options
  const shippingOptions = [
    { id: 'regular', name: 'Regular (3-5 hari)', price: 15000, days: '3-5 hari' },
    { id: 'express', name: 'Express (1-2 hari)', price: 30000, days: '1-2 hari' },
    { id: 'instant', name: 'Same Day', price: 50000, days: 'Hari ini' }
  ];

  // Calculate totals
  const subtotal = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shippingCost = () => {
    const option = shippingOptions.find(opt => opt.id === selectedShipping());
    return option?.price || 0;
  };
  const insurancePrice = () => useInsurance() ? Math.round(subtotal() * 0.001) : 0;
  const totalAmount = () => subtotal() + shippingCost() + insurancePrice() - promoDiscount();

  // Validate phone number
  const validatePhone = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return cleaned.slice(0, 13);
    } else if (cleaned.startsWith('62')) {
      return cleaned.slice(0, 14);
    }
    return cleaned;
  };

  // Handle phone input
  const handlePhoneInput = (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const validated = validatePhone(input.value);
    setPhone(validated);
    input.value = validated;
  };

  // Apply promo code
  const applyPromoCode = () => {
    if (promoCode().toUpperCase() === 'BATIK10') {
      setPromoDiscount(subtotal() * 0.1);
      showNotification('Kode promo berhasil! Diskon 10% diterapkan', 'success');
    } else {
      showNotification('Kode promo tidak valid', 'error');
    }
  };

  // Show notification
  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const notification = document.createElement('div');
    const bgColor = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500';
    notification.className = `fixed top-24 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in flex items-center gap-2`;
    
    const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
    notification.innerHTML = `<span class="text-lg">${icon}</span> ${message}`;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  // Validate form
  const isFormValid = () => {
    return name() && phone() && email() && address() && 
           province() && city() && postalCode() && 
           agreeToTerms() && selectedPayment();
  };

  // Handle checkout
  const handleCheckout = async (e: Event) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      showNotification('Harap lengkapi semua data yang diperlukan', 'error');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const orderData = {
      customer: {
        name: name(),
        phone: phone(),
        email: email(),
        address: address(),
        city: city(),
        province: province(),
        postalCode: postalCode(),
        notes: notes()
      },
      items: cartItems,
      payment: selectedPayment(),
      shipping: selectedShipping(),
      insurance: useInsurance(),
      total: totalAmount()
    };
    
    console.log('Order data:', orderData);
    
    setIsProcessing(false);
    showNotification('Pesanan berhasil dibuat! Redirecting...', 'success');
    
    // Redirect to success page
    setTimeout(() => {
      window.location.href = '/order-success';
    }, 2000);
  };

  // Load saved addresses from localStorage
  createEffect(() => {
    const saved = localStorage.getItem('savedAddresses');
    if (saved) {
      setSavedAddresses(JSON.parse(saved));
    }
  });

  // Save address
  const saveCurrentAddress = () => {
    const newAddress: ShippingAddress = {
      name: name(),
      phone: phone(),
      email: email(),
      address: address(),
      city: city(),
      province: province(),
      postalCode: postalCode()
    };
    
    const updated = [...savedAddresses(), newAddress];
    setSavedAddresses(updated);
    localStorage.setItem('savedAddresses', JSON.stringify(updated));
    showNotification('Alamat berhasil disimpan', 'success');
  };

  // Use saved address
  const useSavedAddress = (addr: ShippingAddress) => {
    setName(addr.name);
    setPhone(addr.phone);
    setEmail(addr.email);
    setAddress(addr.address);
    setProvince(addr.province);
    setCity(addr.city);
    setPostalCode(addr.postalCode);
    setShowAddressModal(false);
  };

  return (
    <>
      <Navbar />

      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 pb-16">
        <div class="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header */}
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
            
            {/* Progress Steps */}
            <div class="flex items-center justify-center mb-8">
              <div class="flex items-center gap-4">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-bold">
                    ✓
                  </div>
                  <span class="ml-2 text-sm text-gray-600">Keranjang</span>
                </div>
                <div class="w-16 h-0.5 bg-gray-300"></div>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <span class="ml-2 text-sm font-medium">Checkout</span>
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

          <form onSubmit={handleCheckout} class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Shipping & Payment */}
            <div class="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div class="bg-white rounded-xl shadow-sm p-6">
                <div class="flex items-center justify-between mb-4">
                  <h2 class="text-xl font-bold text-gray-900">Alamat Pengiriman</h2>
                  <Show when={savedAddresses().length > 0}>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(true)}
                      class="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Pilih dari alamat tersimpan ({savedAddresses().length})
                    </button>
                  </Show>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lengkap <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name()}
                      onInput={(e) => setName(e.currentTarget.value)}
                      required
                      placeholder="John Doe"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      No. Handphone <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <span class="absolute left-3 top-2.5 text-gray-500">+62</span>
                      <input
                        type="tel"
                        value={phone()}
                        onInput={handlePhoneInput}
                        required
                        placeholder="812-3456-7890"
                        class="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email()}
                      onInput={(e) => setEmail(e.currentTarget.value)}
                      required
                      placeholder="john@example.com"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Lengkap <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      value={address()}
                      onInput={(e) => setAddress(e.currentTarget.value)}
                      required
                      rows={3}
                      placeholder="Jl. Batik Nusantara No. 123, RT 01/RW 02"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Provinsi <span class="text-red-500">*</span>
                    </label>
                    <select
                      value={province()}
                      onChange={(e) => {
                        setProvince(e.currentTarget.value);
                        setCity(''); // Reset city when province changes
                      }}
                      required
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="">Pilih Provinsi</option>
                      <For each={provinces}>
                        {(prov) => <option value={prov}>{prov}</option>}
                      </For>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kota/Kabupaten <span class="text-red-500">*</span>
                    </label>
                    <select
                      value={city()}
                      onChange={(e) => setCity(e.currentTarget.value)}
                      required
                      disabled={!province()}
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100"
                    >
                      <option value="">Pilih Kota</option>
                      <For each={availableCities()}>
                        {(ct) => <option value={ct}>{ct}</option>}
                      </For>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Kode Pos <span class="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={postalCode()}
                      onInput={(e) => setPostalCode(e.currentTarget.value)}
                      required
                      maxLength={5}
                      placeholder="12345"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-700 mb-1">
                      Catatan untuk Kurir (Opsional)
                    </label>
                    <input
                      type="text"
                      value={notes()}
                      onInput={(e) => setNotes(e.currentTarget.value)}
                      placeholder="Rumah warna biru, sebelah toko batik"
                      class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div class="md:col-span-2">
                    <button
                      type="button"
                      onClick={saveCurrentAddress}
                      disabled={!name() || !address() || !city()}
                      class="text-sm text-blue-600 hover:text-blue-700 font-medium disabled:text-gray-400"
                    >
                      💾 Simpan alamat ini untuk penggunaan selanjutnya
                    </button>
                  </div>
                </div>
              </div>

              {/* Shipping Method */}
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Metode Pengiriman</h2>
                
                <div class="space-y-3">
                  <For each={shippingOptions}>
                    {(option) => (
                      <label class="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
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
                            <p class="text-sm text-gray-600">Estimasi: {option.days}</p>
                          </div>
                        </div>
                        <span class="font-semibold text-gray-900">
                          Rp {option.price.toLocaleString('id-ID')}
                        </span>
                      </label>
                    )}
                  </For>
                </div>

                {/* Insurance Option */}
                <div class="mt-4 p-4 bg-yellow-50 rounded-lg">
                  <label class="flex items-center justify-between cursor-pointer">
                    <div class="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={useInsurance()}
                        onChange={(e) => setUseInsurance(e.currentTarget.checked)}
                        class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <div>
                        <p class="font-medium text-gray-900">Asuransi Pengiriman</p>
                        <p class="text-sm text-gray-600">Lindungi paket Anda dari kerusakan atau kehilangan</p>
                      </div>
                    </div>
                    <span class="font-medium text-gray-900">
                      Rp {insurancePrice().toLocaleString('id-ID')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Payment Method */}
              <div class="bg-white rounded-xl shadow-sm p-6">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Metode Pembayaran</h2>
                
                {/* Bank Transfer */}
                <div class="mb-6">
                  <h3 class="font-semibold text-gray-800 mb-3">Transfer Bank</h3>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <For each={paymentMethods.filter(p => p.category === 'bank')}>
                      {(method) => (
                        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                          classList={{
                            "border-blue-500 bg-blue-50": selectedPayment() === method.id,
                            "border-gray-300": selectedPayment() !== method.id
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment() === method.id}
                            onChange={(e) => setSelectedPayment(e.currentTarget.value)}
                            class="text-blue-600 focus:ring-blue-500"
                          />
                          <div class="ml-3 flex-1">
                            <p class="font-medium text-gray-900">{method.name}</p>
                            <p class="text-xs text-gray-600">{method.description}</p>
                          </div>
                          <span class="text-2xl ml-2">{method.icon}</span>
                        </label>
                      )}
                    </For>
                  </div>
                </div>

                {/* E-Wallets */}
                <div class="mb-6">
                  <h3 class="font-semibold text-gray-800 mb-3">E-Wallet</h3>
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <For each={paymentMethods.filter(p => p.category === 'ewallet')}>
                      {(method) => (
                        <label class="flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                          classList={{
                            "border-blue-500 bg-blue-50": selectedPayment() === method.id,
                            "border-gray-300": selectedPayment() !== method.id
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment() === method.id}
                            onChange={(e) => setSelectedPayment(e.currentTarget.value)}
                            class="text-blue-600 focus:ring-blue-500"
                          />
                          <span class="text-3xl my-2">{method.icon}</span>
                          <p class="text-sm font-medium text-gray-900 text-center">{method.name}</p>
                        </label>
                      )}
                    </For>
                  </div>
                </div>

                {/* Retail & COD */}
                <div>
                  <h3 class="font-semibold text-gray-800 mb-3">Lainnya</h3>
                  <div class="space-y-3">
                    <For each={paymentMethods.filter(p => p.category === 'retail' || p.category === 'cod')}>
                      {(method) => (
                        <label class="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-all"
                          classList={{
                            "border-blue-500 bg-blue-50": selectedPayment() === method.id,
                            "border-gray-300": selectedPayment() !== method.id
                          }}
                        >
                          <input
                            type="radio"
                            name="payment"
                            value={method.id}
                            checked={selectedPayment() === method.id}
                            onChange={(e) => setSelectedPayment(e.currentTarget.value)}
                            class="text-blue-600 focus:ring-blue-500"
                          />
                          <div class="ml-3 flex-1">
                            <p class="font-medium text-gray-900">{method.name}</p>
                            <p class="text-xs text-gray-600">{method.description}</p>
                          </div>
                          <span class="text-2xl ml-2">{method.icon}</span>
                        </label>
                      )}
                    </For>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div class="lg:col-span-1">
              <div class="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <h2 class="text-xl font-bold text-gray-900 mb-4">Ringkasan Pesanan</h2>
                
                {/* Cart Items */}
                <div class="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  <For each={cartItems}>
                    {(item) => (
                      <div class="flex gap-3 pb-3 border-b border-gray-200 last:border-0">
                        <div class="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img 
                            src={item.image || '/images/placeholder.jpg'} 
                            alt={item.name}
                            class="w-full h-full object-cover"
                          />
                        </div>
                        <div class="flex-1">
                          <h4 class="text-sm font-medium text-gray-900">{item.name}</h4>
                          <p class="text-xs text-gray-600">
                            {item.size && `Size: ${item.size}`}
                            {item.size && item.color && ' • '}
                            {item.color && `${item.color}`}
                          </p>
                          <p class="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <p class="text-sm font-medium text-gray-900">
                          Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                        </p>
                      </div>
                    )}
                  </For>
                </div>

                {/* Promo Code */}
                <div class="mb-6">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Kode Promo</label>
                  <div class="flex gap-2">
                    <input
                      type="text"
                      value={promoCode()}
                      onInput={(e) => setPromoCode(e.currentTarget.value)}
                      placeholder="Masukkan kode"
                      class="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={applyPromoCode}
                      disabled={!promoCode()}
                      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300"
                    >
                      Terapkan
                    </button>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">Coba: BATIK10</p>
                </div>

                {/* Price Breakdown */}
                <div class="space-y-3 border-t pt-4">
                  <div class="flex justify-between text-gray-700">
                    <span>Subtotal</span>
                    <span>Rp {subtotal().toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div class="flex justify-between text-gray-700">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingCost().toLocaleString('id-ID')}</span>
                  </div>
                  
                  <Show when={useInsurance()}>
                    <div class="flex justify-between text-gray-700">
                      <span>Asuransi</span>
                      <span>Rp {insurancePrice().toLocaleString('id-ID')}</span>
                    </div>
                  </Show>
                  
                  <Show when={promoDiscount() > 0}>
                    <div class="flex justify-between text-green-600">
                      <span>Diskon Promo</span>
                      <span>-Rp {promoDiscount().toLocaleString('id-ID')}</span>
                    </div>
                  </Show>
                  
                  <div class="flex justify-between text-lg font-bold text-gray-900 border-t pt-3">
                    <span>Total</span>
                    <span class="text-xl">Rp {totalAmount().toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Terms Agreement */}
                <div class="mt-6">
                  <label class="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreeToTerms()}
                      onChange={(e) => setAgreeToTerms(e.currentTarget.checked)}
                      class="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
                    />
                    <span class="text-sm text-gray-700">
                      Saya setuju dengan <a href="/terms" class="text-blue-600 hover:underline">Syarat & Ketentuan</a> dan <a href="/privacy" class="text-blue-600 hover:underline">Kebijakan Privasi</a>
                    </span>
                  </label>
                </div>

                {/* Checkout Button */}
                <button
                  type="submit"
                  disabled={!isFormValid() || isProcessing()}
                  class="w-full mt-6 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 disabled:bg-gray-300 disabled:scale-100 flex items-center justify-center gap-2"
                >
                  <Show when={isProcessing()} fallback="Konfirmasi Pesanan">
                    <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                    </svg>
                    Memproses...
                  </Show>
                </button>

                {/* Security Info */}
                <div class="mt-6 flex items-center justify-center gap-4 text-gray-600">
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                    </svg>
                    <span class="text-xs">Pembayaran Aman</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 016 0v2h2V7a5 5 0 00-5-5z"/>
                    </svg>
                    <span class="text-xs">SSL Encrypted</span>
                  </div>
                </div>
              </div>

              {/* Help Section */}
              <div class="mt-6 bg-blue-50 rounded-xl p-4">
                <h3 class="font-semibold text-gray-900 mb-2">Butuh Bantuan?</h3>
                <p class="text-sm text-gray-700 mb-3">Tim customer service kami siap membantu Anda</p>
                <div class="space-y-2">
                  <a href="https://wa.me/6281234567890" class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp: +62 812-3456-7890
                  </a>
                  <a href="mailto:support@batiknusantara.com" class="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    Email: support@batiknusantara.com
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Saved Addresses Modal */}
      <Show when={showAddressModal()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div class="p-6 border-b">
              <div class="flex items-center justify-between">
                <h3 class="text-xl font-bold text-gray-900">Alamat Tersimpan</h3>
                <button
                  onClick={() => setShowAddressModal(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div class="p-6 overflow-y-auto max-h-[60vh]">
              <div class="space-y-4">
                <For each={savedAddresses()}>
                  {(addr) => (
                    <div class="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => useSavedAddress(addr)}
                    >
                      <div class="flex items-start justify-between">
                        <div>
                          <h4 class="font-semibold text-gray-900">{addr.name}</h4>
                          <p class="text-sm text-gray-600 mt-1">{addr.phone}</p>
                          <p class="text-sm text-gray-600">{addr.address}</p>
                          <p class="text-sm text-gray-600">
                            {addr.city}, {addr.province} {addr.postalCode}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const updated = savedAddresses().filter(a => a !== addr);
                            setSavedAddresses(updated);
                            localStorage.setItem('savedAddresses', JSON.stringify(updated));
                          }}
                          class="text-red-600 hover:text-red-700 p-2"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </For>
              </div>
              
              <Show when={savedAddresses().length === 0}>
                <p class="text-center text-gray-500 py-8">Belum ada alamat tersimpan</p>
              </Show>
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
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      <Footer />
    </>
  );
}