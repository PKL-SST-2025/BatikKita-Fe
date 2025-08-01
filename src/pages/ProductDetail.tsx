import { createResource, Show, createSignal, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FavoriteButton from "../components/FavoriteButton";

interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

interface ProductFeature {
  id: number;
  product_id: number;
  feature_name: string;
  feature_value: string;
}

interface Product {
  id: number;
  name: string;
  price: string;
  description: string;
  category: string;
  stock: number;
  material: string;
  origin: string;
  care_instructions: string;
  available: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  features: ProductFeature[];
  reviews: any[];
}

async function fetchProduct(productId: string): Promise<Product> {
  console.log("🔥 Fetching product with ID:", productId);
  
  if (!productId) {
    throw new Error("ID produk tidak valid");
  }

  const response = await fetch(`http://127.0.0.1:8080/api/products/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
    credentials: 'omit',
  });
  
  console.log("📡 Response received:", response.status, response.ok);
  
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log("📦 API Response:", data);
  
  if (data.success && data.data) {
    console.log("✅ Product data loaded:", data.data);
    return data.data;
  } else {
    throw new Error(data.message || "Produk tidak ditemukan");
  }
}

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Local state for UI interactions
  const [selectedImageIndex, setSelectedImageIndex] = createSignal(0);
  const [quantity, setQuantity] = createSignal(1);
  const [showShareMenu, setShowShareMenu] = createSignal(false);
  const [selectedSize, setSelectedSize] = createSignal("");
  const [selectedColor, setSelectedColor] = createSignal("");
  const [activeTab, setActiveTab] = createSignal("description");
  const [showSizeGuide, setShowSizeGuide] = createSignal(false);

  // Available options
  const availableSizes = ["S", "M", "L", "XL", "XXL"];
  const availableColors = [
    { name: "Coklat Klasik", value: "brown", hex: "#8B4513" },
    { name: "Biru Indigo", value: "indigo", hex: "#4B0082" },
    { name: "Merah Maroon", value: "maroon", hex: "#800000" },
    { name: "Hijau Tua", value: "green", hex: "#006400" },
    { name: "Ungu Tua", value: "purple", hex: "#663399" }
  ];

  // Size chart data
  const sizeChart = [
    { 
      size: "S", 
      chest: "88-92", 
      waist: "68-72", 
      length: "68", 
      shoulder: "42",
      description: "Cocok untuk berat badan 45-55 kg" 
    },
    { 
      size: "M", 
      chest: "93-97", 
      waist: "73-77", 
      length: "70", 
      shoulder: "44",
      description: "Cocok untuk berat badan 55-65 kg" 
    },
    { 
      size: "L", 
      chest: "98-102", 
      waist: "78-82", 
      length: "72", 
      shoulder: "46",
      description: "Cocok untuk berat badan 65-75 kg" 
    },
    { 
      size: "XL", 
      chest: "103-107", 
      waist: "83-87", 
      length: "74", 
      shoulder: "48",
      description: "Cocok untuk berat badan 75-85 kg" 
    },
    { 
      size: "XXL", 
      chest: "108-112", 
      waist: "88-92", 
      length: "76", 
      shoulder: "50",
      description: "Cocok untuk berat badan 85-95 kg" 
    }
  ];

  // Care instructions
  const careInstructions = [
    "Cuci dengan air dingin (suhu maksimal 30°C)",
    "Gunakan deterjen khusus batik atau deterjen lembut",
    "Jangan gunakan pemutih atau bahan kimia keras",
    "Jemur di tempat teduh, jangan langsung terkena sinar matahari",
    "Setrika dengan suhu sedang, hindari bagian motif langsung",
    "Simpan di tempat kering dan beri kamper untuk mencegah ngengat"
  ];

  // Use createResource for better data fetching
  const [product] = createResource(
    () => id,
    fetchProduct
  );

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log("Adding to cart:", { productId: id, quantity: quantity() });
    alert(`Added ${quantity()} item(s) to cart!`);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this amazing batik: ${product()?.name}`;
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <>
      <Navbar />
      <Show
        when={!product.loading}
        fallback={
          <div class="min-h-screen flex items-center justify-center bg-gray-50">
            <div class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
              <p class="text-gray-600 text-lg">Memuat produk...</p>
              <p class="text-sm text-gray-400 mt-2">Loading product ID: {id}</p>
            </div>
          </div>
        }
      >
        <Show
          when={product() && !product.error}
          fallback={
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
              <div class="text-center max-w-md mx-auto p-8">
                <div class="text-red-500 text-6xl mb-4">⚠️</div>
                <h2 class="text-2xl font-bold text-gray-800 mb-2">Terjadi Kesalahan</h2>
                <p class="text-gray-600 mb-6">{product.error?.message || "Gagal memuat produk"}</p>
                <button 
                  onClick={() => navigate("/produk")}
                  class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Kembali ke Produk
                </button>
              </div>
            </div>
          }
        >
          <div class="min-h-screen bg-gray-50">
            {/* Hero Section with Breadcrumb */}
            <div class="bg-white border-b border-gray-200 py-8">
              <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <nav class="text-sm breadcrumbs mb-4">
                  <ul class="flex items-center space-x-2 text-gray-600">
                    <li><a href="/produk" class="hover:text-purple-600 transition-colors">Produk</a></li>
                    <li><span class="mx-2">›</span></li>
                    <li class="text-purple-600 font-medium">{product()!.category}</li>
                  </ul>
                </nav>
              </div>
            </div>

            {/* Main Product Section */}
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div class="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
                  
                  {/* Image Gallery */}
                  <div class="space-y-4">
                    {/* Main Image */}
                    <div class="relative aspect-square rounded-xl overflow-hidden bg-gray-100 group">
                      <Show 
                        when={product()!.images && product()!.images.length > 0}
                        fallback={
                          <div class="w-full h-full flex items-center justify-center bg-gray-200">
                            <span class="text-gray-400 text-lg">No Image Available</span>
                          </div>
                        }
                      >
                        <img
                          src={
                            selectedImageIndex() < product()!.images.length 
                              ? product()!.images[selectedImageIndex()].image_url
                              : selectedImageIndex() === product()!.images.length
                                ? "/images/MegaMendung.jpg"
                                : "/images/MegaMendung1.jpg"
                          }
                          alt={
                            selectedImageIndex() < product()!.images.length 
                              ? (product()!.images[selectedImageIndex()].alt_text || product()!.name)
                              : selectedImageIndex() === product()!.images.length
                                ? "Batik Mega Mendung Klasik"
                                : "Batik Mega Mendung Modern"
                          }
                          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </Show>
                      
                      {/* Zoom Icon */}
                      <div class="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Thumbnail Images */}
                    <Show when={product()!.images && product()!.images.length > 0}>
                      <div class="grid grid-cols-4 gap-3">
                        {/* Original Product Images */}
                        {product()!.images.map((image: ProductImage, index: number) => (
                          <button
                            onClick={() => setSelectedImageIndex(index)}
                            class={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              selectedImageIndex() === index 
                                ? 'border-purple-500 ring-2 ring-purple-200' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <img
                              src={image.image_url}
                              alt={image.alt_text || product()!.name}
                              class="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                        
                        {/* Additional Mega Mendung Images */}
                        <button
                          onClick={() => setSelectedImageIndex(product()!.images.length)}
                          class={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex() === product()!.images.length 
                              ? 'border-purple-500 ring-2 ring-purple-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src="/images/MegaMendung.jpg"
                            alt="Batik Mega Mendung Klasik"
                            class="w-full h-full object-cover"
                          />
                        </button>
                        
                        <button
                          onClick={() => setSelectedImageIndex(product()!.images.length + 1)}
                          class={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImageIndex() === product()!.images.length + 1 
                              ? 'border-purple-500 ring-2 ring-purple-200' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <img
                            src="/images/MegaMendung1.jpg"
                            alt="Batik Mega Mendung Modern"
                            class="w-full h-full object-cover"
                          />
                        </button>
                      </div>
                    </Show>

                    {/* Quick Info Cards Below Main Image */}
                    <div class="grid grid-cols-2 gap-4 mt-6">
                      <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div>
                            <h4 class="font-semibold text-gray-800 text-sm">Kualitas Premium</h4>
                            <p class="text-xs text-gray-600">100% Handmade Original</p>
                          </div>
                        </div>
                      </div>
                      <div class="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-100">
                        <div class="flex items-center space-x-3">
                          <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
                            </svg>
                          </div>
                          <div>
                            <h4 class="font-semibold text-gray-800 text-sm">Gratis Ongkir</h4>
                            <p class="text-xs text-gray-600">Pengiriman Jakarta</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Batik Heritage Info */}
                    <div class="bg-gradient-to-r from-amber-50 to-orange-50 p-5 rounded-xl border border-amber-100 mt-4">
                      <div class="flex items-start space-x-4">
                        <div class="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                        </div>
                        <div>
                          <h4 class="font-bold text-amber-800 mb-2">📜 Warisan Budaya Indonesia</h4>
                          <p class="text-sm text-amber-700 leading-relaxed">
                            Motif <strong>Mega Mendung</strong> berasal dari Cirebon dengan filosofi mendalam tentang kesabaran 
                            dan ketabahan dalam menghadapi tantangan hidup. Setiap gradasi warna memiliki makna spiritual yang unik.
                          </p>
                          <div class="flex items-center space-x-4 mt-3 text-xs text-amber-600">
                            <div class="flex items-center space-x-1">
                              <span>🏛️</span>
                              <span>Keraton Cirebon</span>
                            </div>
                            <div class="flex items-center space-x-1">
                              <span>📅</span>
                              <span>Abad ke-15</span>
                            </div>
                            <div class="flex items-center space-x-1">
                              <span>🎨</span>
                              <span>Motif Tradisional</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Size Guide Preview */}
                    <div class="bg-white border-2 border-purple-100 p-5 rounded-xl mt-4">
                      <div class="flex items-center justify-between mb-4">
                        <h4 class="font-bold text-gray-800 flex items-center space-x-2">
                          <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Preview Ukuran</span>
                        </h4>
                        <button 
                          onClick={() => setShowSizeGuide(true)}
                          class="text-purple-600 hover:text-purple-700 text-sm font-medium underline"
                        >
                          Lihat Semua →
                        </button>
                      </div>
                      <div class="grid grid-cols-3 gap-3">
                        <div class="text-center p-3 bg-gray-50 rounded-lg">
                          <div class="font-bold text-purple-600 text-lg">M</div>
                          <div class="text-xs text-gray-600 mt-1">93-97 cm</div>
                          <div class="text-xs text-gray-500">55-65 kg</div>
                        </div>
                        <div class="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div class="font-bold text-purple-600 text-lg">L</div>
                          <div class="text-xs text-gray-600 mt-1">98-102 cm</div>
                          <div class="text-xs text-gray-500">65-75 kg</div>
                        </div>
                        <div class="text-center p-3 bg-gray-50 rounded-lg">
                          <div class="font-bold text-purple-600 text-lg">XL</div>
                          <div class="text-xs text-gray-600 mt-1">103-107 cm</div>
                          <div class="text-xs text-gray-500">75-85 kg</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div class="space-y-6">
                    {/* Header */}
                    <div>
                      <div class="flex items-start justify-between mb-2">
                        <h1 class="text-3xl font-bold text-gray-900 leading-tight">{product()!.name}</h1>
                        <div class="flex items-center space-x-2">
                          {/* Favorite Button */}
                          <FavoriteButton 
                            product={product()!} 
                            size="lg"
                            className="p-3 hover:scale-110 transition-transform"
                          />
                          
                          {/* Share Button */}
                          <div class="relative">
                            <button
                              onClick={() => setShowShareMenu(!showShareMenu())}
                              class="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                            >
                              <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                              </svg>
                            </button>
                            
                            {/* Share Menu */}
                            <Show when={showShareMenu()}>
                              <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10">
                                <div class="py-1">
                                  <button onClick={() => handleShare('whatsapp')} class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span class="mr-3">📱</span> WhatsApp
                                  </button>
                                  <button onClick={() => handleShare('facebook')} class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span class="mr-3">📘</span> Facebook
                                  </button>
                                  <button onClick={() => handleShare('twitter')} class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span class="mr-3">🐦</span> Twitter
                                  </button>
                                  <button onClick={() => handleShare('copy')} class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                    <span class="mr-3">📋</span> Copy Link
                                  </button>
                                </div>
                              </div>
                            </Show>
                          </div>
                        </div>
                      </div>
                      
                      <div class="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                        <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
                          {product()!.category}
                        </span>
                        <div class="flex items-center">
                          <span class="text-yellow-400 mr-1">⭐</span>
                          <span>4.8 (125 reviews)</span>
                        </div>
                      </div>
                    </div>

                    {/* Price */}
                    <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-xl">
                      <div class="text-3xl font-bold text-purple-600 mb-2">
                        Rp {parseFloat(product()!.price).toLocaleString('id-ID')}
                      </div>
                      <div class="flex items-center text-sm text-gray-600">
                        <span class="mr-4">💳 Tersedia cicilan 0%</span>
                        <span>🚚 Gratis ongkir Jakarta</span>
                      </div>
                    </div>

                    {/* Stock Status */}
                    <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div class="flex items-center">
                        <div class={`w-3 h-3 rounded-full mr-2 ${product()!.available && product()!.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span class="font-medium">
                          {product()!.available && product()!.stock > 0 ? 'Tersedia' : 'Stok Habis'}
                        </span>
                      </div>
                      <span class="text-gray-600">Stok: {product()!.stock}</span>
                    </div>

                    {/* Size Selector */}
                    <div class="space-y-3">
                      <h3 class="font-medium text-gray-700">Pilih Ukuran:</h3>
                      <div class="flex flex-wrap gap-2">
                        <For each={availableSizes}>
                          {(size) => (
                            <button
                              onClick={() => setSelectedSize(size)}
                              class={`px-4 py-2 border rounded-lg font-medium transition-all ${
                                selectedSize() === size
                                  ? 'border-purple-500 bg-purple-50 text-purple-700'
                                  : 'border-gray-300 hover:border-gray-400 text-gray-700'
                              }`}
                            >
                              {size}
                            </button>
                          )}
                        </For>
                      </div>
                      <div class="text-sm text-gray-500">
                        <button 
                          onClick={() => setShowSizeGuide(true)}
                          class="underline hover:text-purple-600 flex items-center space-x-1"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Panduan Ukuran</span>
                        </button>
                      </div>
                    </div>

                    {/* Color Selector */}
                    <div class="space-y-3">
                      <h3 class="font-medium text-gray-700">Pilih Warna:</h3>
                      <div class="flex flex-wrap gap-3">
                        <For each={availableColors}>
                          {(color) => (
                            <button
                              onClick={() => setSelectedColor(color.value)}
                              class={`relative group flex items-center space-x-2 px-3 py-2 border rounded-lg transition-all ${
                                selectedColor() === color.value
                                  ? 'border-purple-500 bg-purple-50'
                                  : 'border-gray-300 hover:border-gray-400'
                              }`}
                            >
                              <div
                                class="w-5 h-5 rounded-full border border-gray-300"
                                style={`background-color: ${color.hex}`}
                              ></div>
                              <span class="text-sm font-medium">{color.name}</span>
                              <Show when={selectedColor() === color.value}>
                                <div class="absolute -top-1 -right-1 w-3 h-3 bg-purple-500 rounded-full"></div>
                              </Show>
                            </button>
                          )}
                        </For>
                      </div>
                    </div>

                    {/* Quantity Selector & Add to Cart */}
                    <div class="space-y-4">
                      <div class="flex items-center space-x-4">
                        <span class="font-medium text-gray-700">Jumlah:</span>
                        <div class="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity() - 1))}
                            disabled={quantity() <= 1}
                            class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                            </svg>
                          </button>
                          <span class="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity()}</span>
                          <button
                            onClick={() => setQuantity(Math.min(product()!.stock, quantity() + 1))}
                            disabled={quantity() >= product()!.stock}
                            class="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={handleAddToCart}
                          disabled={!product()!.available || product()!.stock === 0}
                          class="flex-1 bg-purple-600 text-white px-6 py-4 rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 2.5M7 13l2.5 2.5" />
                          </svg>
                          <span>Tambah ke Keranjang</span>
                        </button>
                        
                        <button
                          onClick={() => navigate("/checkout", { state: { product: product(), quantity: quantity() } })}
                          disabled={!product()!.available || product()!.stock === 0}
                          class="flex-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Beli Sekarang</span>
                        </button>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div class="grid grid-cols-2 gap-4 text-sm">
                      <div class="space-y-2">
                        <div class="flex justify-between">
                          <span class="text-gray-600">Material:</span>
                          <span class="font-medium">{product()!.material}</span>
                        </div>
                        <div class="flex justify-between">
                          <span class="text-gray-600">Asal:</span>
                          <span class="font-medium">{product()!.origin}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Information Tabs */}
                <div class="border-t">
                  <div class="sticky top-0 bg-white z-10 border-b">
                    <div class="flex space-x-8 px-8 py-4">
                      <button
                        onClick={() => setActiveTab("description")}
                        class={`pb-2 border-b-2 font-medium transition-colors ${
                          activeTab() === "description" 
                            ? "border-purple-500 text-purple-600" 
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Deskripsi
                      </button>
                      <button
                        onClick={() => setActiveTab("care")}
                        class={`pb-2 border-b-2 font-medium transition-colors ${
                          activeTab() === "care" 
                            ? "border-purple-500 text-purple-600" 
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Cara Perawatan
                      </button>
                      <button
                        onClick={() => setActiveTab("specifications")}
                        class={`pb-2 border-b-2 font-medium transition-colors ${
                          activeTab() === "specifications" 
                            ? "border-purple-500 text-purple-600" 
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Spesifikasi
                      </button>
                      <button
                        onClick={() => setActiveTab("gallery")}
                        class={`pb-2 border-b-2 font-medium transition-colors ${
                          activeTab() === "gallery" 
                            ? "border-purple-500 text-purple-600" 
                            : "border-transparent text-gray-600 hover:text-gray-900"
                        }`}
                      >
                        Galeri
                      </button>
                    </div>
                  </div>

                  <div class="p-8">
                    {/* Description Tab */}
                    <Show when={activeTab() === "description"}>
                      <div class="max-w-4xl">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Deskripsi Produk</h3>
                        <div class="prose prose-lg text-gray-700 leading-relaxed">
                          <p>{product()!.description}</p>
                          
                          <div class="mt-8 grid md:grid-cols-2 gap-6">
                            <div class="bg-gray-50 p-6 rounded-lg">
                              <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                                <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                Material
                              </h4>
                              <p class="text-gray-700">{product()!.material}</p>
                            </div>
                            <div class="bg-gray-50 p-6 rounded-lg">
                              <h4 class="font-semibold text-gray-900 mb-3 flex items-center">
                                <span class="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                Asal Daerah
                              </h4>
                              <p class="text-gray-700">{product()!.origin}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Show>

                    {/* Care Instructions Tab */}
                    <Show when={activeTab() === "care"}>
                      <div class="max-w-4xl">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Cara Perawatan Batik</h3>
                        <div class="grid md:grid-cols-2 gap-8">
                          <div>
                            <div class="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6">
                              <p class="text-blue-800 font-medium">
                                💡 Tips: Perawatan yang tepat akan menjaga kualitas dan keindahan batik Anda dalam jangka panjang.
                              </p>
                            </div>
                            <ul class="space-y-4">
                              <For each={careInstructions}>
                                {(instruction, index) => (
                                  <li class="flex items-start space-x-3">
                                    <div class="flex-shrink-0 w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-sm font-semibold mt-1">
                                      {index() + 1}
                                    </div>
                                    <p class="text-gray-700 leading-relaxed">{instruction}</p>
                                  </li>
                                )}
                              </For>
                            </ul>
                          </div>
                          <div class="space-y-6">
                            <div class="bg-red-50 border border-red-200 rounded-lg p-6">
                              <h4 class="font-semibold text-red-800 mb-3 flex items-center">
                                ⚠️ Hal yang Harus Dihindari
                              </h4>
                              <ul class="text-red-700 space-y-2 text-sm">
                                <li>• Jangan menggunakan pemutih atau deterjen keras</li>
                                <li>• Hindari pemerasan yang terlalu kuat</li>
                                <li>• Jangan menjemur langsung di bawah sinar matahari</li>
                                <li>• Hindari penyetrikaan langsung pada motif</li>
                              </ul>
                            </div>
                            <div class="bg-green-50 border border-green-200 rounded-lg p-6">
                              <h4 class="font-semibold text-green-800 mb-3 flex items-center">
                                ✅ Tips Penyimpanan
                              </h4>
                              <ul class="text-green-700 space-y-2 text-sm">
                                <li>• Simpan di lemari yang kering dan berventilasi</li>
                                <li>• Gunakan gantungan atau lipat dengan hati-hati</li>
                                <li>• Beri kamper untuk mencegah ngengat</li>
                                <li>• Hindari tempat yang lembab</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Show>

                    {/* Specifications Tab */}
                    <Show when={activeTab() === "specifications"}>
                      <div class="max-w-4xl">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Spesifikasi Produk</h3>
                        <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div class="grid grid-cols-1 md:grid-cols-2 gap-0">
                            <div class="bg-gray-50 p-4 border-b md:border-b-0 md:border-r border-gray-200">
                              <h4 class="font-semibold text-gray-800 mb-4">Informasi Dasar</h4>
                              <div class="space-y-3">
                                <div class="flex justify-between">
                                  <span class="text-gray-600">Material:</span>
                                  <span class="font-medium text-gray-900">{product()!.material}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-gray-600">Kategori:</span>
                                  <span class="font-medium text-gray-900">{product()!.category}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-gray-600">Asal Daerah:</span>
                                  <span class="font-medium text-gray-900">{product()!.origin}</span>
                                </div>
                                <div class="flex justify-between">
                                  <span class="text-gray-600">Stok:</span>
                                  <span class="font-medium text-gray-900">{product()!.stock} pcs</span>
                                </div>
                              </div>
                            </div>
                            <div class="p-4">
                              <h4 class="font-semibold text-gray-800 mb-4">Detail Ukuran</h4>
                              <div class="space-y-3 mb-6">
                                <For each={sizeChart.slice(0, 3)}>
                                  {(size) => (
                                    <div class="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                      <div class="flex items-center space-x-3">
                                        <div class="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                                          {size.size}
                                        </div>
                                        <div>
                                          <div class="font-medium text-gray-800">Ukuran {size.size}</div>
                                          <div class="text-xs text-gray-600">{size.description}</div>
                                        </div>
                                      </div>
                                      <div class="text-right">
                                        <div class="text-sm text-gray-600">Dada: {size.chest} cm</div>
                                        <div class="text-sm text-gray-600">Panjang: {size.length} cm</div>
                                      </div>
                                    </div>
                                  )}
                                </For>
                                <button
                                  onClick={() => setShowSizeGuide(true)}
                                  class="w-full text-purple-600 hover:text-purple-700 text-sm font-medium py-2 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors"
                                >
                                  Lihat Panduan Ukuran Lengkap →
                                </button>
                              </div>
                              
                              <h4 class="font-semibold text-gray-800 mb-4">Warna Tersedia</h4>
                              <div class="flex flex-wrap gap-2">
                                <For each={availableColors}>
                                  {(color) => (
                                    <div class="flex items-center space-x-2 px-3 py-1 bg-gray-50 rounded-full border">
                                      <div
                                        class="w-4 h-4 rounded-full border border-gray-300"
                                        style={`background-color: ${color.hex}`}
                                      ></div>
                                      <span class="text-sm text-gray-700">{color.name}</span>
                                    </div>
                                  )}
                                </For>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Show when={product()!.features && product()!.features.length > 0}>
                          <div class="mt-8">
                            <h4 class="text-lg font-semibold text-gray-900 mb-4">Fitur Khusus</h4>
                            <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
                              <For each={product()!.features}>
                                {(feature: ProductFeature) => (
                                  <div class="flex justify-between items-center px-6 py-4 border-b border-gray-100 last:border-b-0">
                                    <span class="font-medium text-gray-700">{feature.feature_name}</span>
                                    <span class="text-gray-600 bg-gray-50 px-3 py-1 rounded-full text-sm">{feature.feature_value}</span>
                                  </div>
                                )}
                              </For>
                            </div>
                          </div>
                        </Show>
                      </div>
                    </Show>

                    {/* Gallery Tab */}
                    <Show when={activeTab() === "gallery"}>
                      <div class="max-w-6xl">
                        <h3 class="text-2xl font-bold text-gray-900 mb-6">Galeri Produk</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {/* Original Product Images */}
                          <For each={product()!.images}>
                            {(image) => (
                              <div class="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                                <img
                                  src={image.image_url}
                                  alt={image.alt_text || product()!.name}
                                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                  <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button class="bg-white bg-opacity-90 p-2 rounded-full">
                                      <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </For>
                          
                          {/* Additional Mega Mendung Images */}
                          <div class="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                            <img
                              src="/images/MegaMendung.jpg"
                              alt="Batik Mega Mendung Klasik"
                              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="bg-white bg-opacity-90 p-2 rounded-full">
                                  <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                          
                          <div class="group relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
                            <img
                              src="/images/MegaMendung1.jpg"
                              alt="Batik Mega Mendung Modern"
                              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                              <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                                <button class="bg-white bg-opacity-90 p-2 rounded-full">
                                  <svg class="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div class="mt-8 text-center">
                          <p class="text-gray-600 mb-4">Ingin melihat detail motif lebih jelas?</p>
                          <button class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                            Hubungi Kami untuk Foto Detail
                          </button>
                        </div>
                      </div>
                    </Show>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </Show>
      </Show>

      {/* Size Guide Modal */}
      <Show when={showSizeGuide()}>
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div class="sticky top-0 bg-white border-b px-6 py-4 rounded-t-2xl">
              <div class="flex items-center justify-between">
                <h2 class="text-2xl font-bold text-gray-900">Panduan Ukuran Batik</h2>
                <button
                  onClick={() => setShowSizeGuide(false)}
                  class="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div class="p-6 space-y-6">
              {/* Size Chart Table */}
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Tabel Ukuran (dalam cm)</h3>
                <div class="overflow-x-auto">
                  <table class="w-full border-collapse border border-gray-300 rounded-lg overflow-hidden">
                    <thead>
                      <tr class="bg-purple-50">
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Ukuran</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Lingkar Dada</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Lingkar Pinggang</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Panjang Baju</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Lebar Bahu</th>
                        <th class="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-900">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody>
                      <For each={sizeChart}>
                        {(size, index) => (
                          <tr class={index() % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td class="border border-gray-300 px-4 py-3 font-semibold text-purple-600">{size.size}</td>
                            <td class="border border-gray-300 px-4 py-3 text-gray-700">{size.chest}</td>
                            <td class="border border-gray-300 px-4 py-3 text-gray-700">{size.waist}</td>
                            <td class="border border-gray-300 px-4 py-3 text-gray-700">{size.length}</td>
                            <td class="border border-gray-300 px-4 py-3 text-gray-700">{size.shoulder}</td>
                            <td class="border border-gray-300 px-4 py-3 text-sm text-gray-600">{size.description}</td>
                          </tr>
                        )}
                      </For>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* How to Measure Guide */}
              <div class="grid md:grid-cols-2 gap-6">
                <div class="bg-blue-50 p-6 rounded-lg">
                  <h4 class="font-semibold text-blue-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Cara Mengukur Tubuh
                  </h4>
                  <ul class="space-y-3 text-blue-800 text-sm">
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">1.</span>
                      <div>
                        <strong>Lingkar Dada:</strong> Ukur bagian terlebar dari dada, di bawah ketiak
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">2.</span>
                      <div>
                        <strong>Lingkar Pinggang:</strong> Ukur bagian terkecil dari pinggang
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">3.</span>
                      <div>
                        <strong>Panjang Baju:</strong> Ukur dari bahu tertinggi hingga panjang yang diinginkan
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">4.</span>
                      <div>
                        <strong>Lebar Bahu:</strong> Ukur dari ujung bahu kiri ke ujung bahu kanan
                      </div>
                    </li>
                  </ul>
                </div>

                <div class="bg-green-50 p-6 rounded-lg">
                  <h4 class="font-semibold text-green-900 mb-4 flex items-center">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Tips Memilih Ukuran
                  </h4>
                  <ul class="space-y-3 text-green-800 text-sm">
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">•</span>
                      <div>
                        Pilih ukuran yang lebih besar jika Anda ragu antara dua ukuran
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">•</span>
                      <div>
                        Batik umumnya memiliki potongan yang longgar dan nyaman
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">•</span>
                      <div>
                        Perhatikan jenis kain - kain katun lebih fleksibel daripada sutra
                      </div>
                    </li>
                    <li class="flex items-start">
                      <span class="font-semibold mr-2">•</span>
                      <div>
                        Hubungi customer service jika masih bingung memilih ukuran
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Model Reference */}
              <div class="bg-gray-50 p-6 rounded-lg">
                <h4 class="font-semibold text-gray-900 mb-4">Referensi Model</h4>
                <div class="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                  <For each={sizeChart}>
                    {(size) => (
                      <div class="bg-white p-4 rounded-lg border">
                        <div class="text-2xl font-bold text-purple-600 mb-2">{size.size}</div>
                        <div class="text-sm text-gray-600">
                          <div>Dada: {size.chest}</div>
                          <div>Pinggang: {size.waist}</div>
                          <div class="mt-2 text-xs text-purple-600 font-medium">
                            {size.description}
                          </div>
                        </div>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Action Buttons */}
              <div class="flex justify-center space-x-4 pt-4">
                <button
                  onClick={() => setShowSizeGuide(false)}
                  class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Tutup
                </button>
                <button class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Tanya Customer Service</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Show>

      <Footer />
    </>
  );
}

export default ProductDetailPage;
