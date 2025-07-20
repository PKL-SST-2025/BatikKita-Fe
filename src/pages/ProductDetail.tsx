import { createSignal, createEffect, Show, For } from "solid-js";
import { useParams, useNavigate } from "@solidjs/router";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useCart } from "../store/CartContext";
import { useFavorites } from "../store/FavoriteContext";
import { useAuth } from "../store/AuthContext";

// Type definitions
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice: number;
  description: string;
  longDescription: string;
  image: string;
  additionalImages: string[];
  category: string;
  tags: string[];
  sizes: string[];
  colors: string[];
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  care: string[];
}

interface Review {
  id: number;
  user: string;
  rating: number;
  comment: string;
  date: string;
  verified: boolean;
}

// Enhanced product data with more details
const products: Product[] = [
  {
    id: 1,
    name: "Batik Mega Mendung",
    price: 150000,
    originalPrice: 200000,
    description: "Material: Katun Premium\nProses: Tulis Tangan\nAsal: Cirebon, Jawa Barat",
    longDescription: "Batik Mega Mendung adalah salah satu motif batik paling ikonik dari Cirebon. Motif awan yang berlapis-lapis melambangkan kesabaran, ketenangan, dan kebijaksanaan. Dibuat dengan teknik tulis tangan tradisional oleh pengrajin berpengalaman.",
    image: "/images/batik-1.jpg",
    additionalImages: ["/images/MegaMendung.jpg", "/images/MegaMendung1.jpg"],
    category: "Premium Collection",
    tags: ["Tradisional", "Tulis", "Cirebon"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Biru Klasik", "Biru Navy", "Hitam"],
    stock: 15,
    rating: 4.8,
    reviews: 124,
    features: [
      "100% Katun Premium",
      "Pewarna Alami",
      "Tahan Lama",
      "Nyaman Dipakai"
    ],
    care: [
      "Cuci dengan tangan",
      "Gunakan deterjen lembut",
      "Jangan diperas terlalu keras",
      "Setrika suhu sedang"
    ]
  },
  {
    id: 2,
    name: "Batik Kawung",
    price: 923000,
    originalPrice: 1200000,
    description: "Material: Sutra Premium\nProses: Kombinasi Tulis & Cap\nAsal: Yogyakarta",
    longDescription: "Motif Kawung merupakan salah satu motif batik tertua di Indonesia. Bentuk geometrisnya yang sempurna melambangkan kesempurnaan dan keteraturan. Batik ini dibuat dengan kombinasi teknik tulis dan cap untuk hasil yang ekslusif.",
    image: "/images/batik-5.jpg",
    additionalImages: ["/images/batik2.jpg", "/images/batik1.jpg", "/images/batik3.jpg"],
    category: "Exclusive Collection",
    tags: ["Keraton", "Premium", "Yogyakarta"],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Coklat Sogan", "Hitam Elegan"],
    stock: 8,
    rating: 4.9,
    reviews: 89,
    features: [
      "Sutra Premium Import",
      "Motif Eksklusif",
      "Limited Edition",
      "Sertifikat Keaslian"
    ],
    care: [
      "Dry clean only",
      "Simpan di tempat kering",
      "Hindari sinar matahari langsung",
      "Gunakan hanger berkualitas"
    ]
  },
  {
    id: 3,
    name: "Batik Parang",
    price: 189000,
    originalPrice: 250000,
    description: "Material: Katun Primisima\nProses: Cap Premium\nAsal: Solo, Jawa Tengah",
    longDescription: "Batik Parang adalah motif klasik yang melambangkan kekuatan dan keberanian. Garis diagonal yang tegas mencerminkan ombak samudra yang tak pernah berhenti bergerak, filosofi untuk terus maju dalam kehidupan.",
    image: "/images/batik2.jpg",
    additionalImages: ["/images/batik3.jpg", "/images/batik1.jpg", "/images/batik2.jpg"],
    category: "Classic Collection",
    tags: ["Klasik", "Solo", "Cap"],
    sizes: ["M", "L", "XL", "XXL"],
    colors: ["Coklat Klasik", "Biru Indigo", "Hijau Pandan"],
    stock: 20,
    rating: 4.7,
    reviews: 156,
    features: [
      "Katun Primisima Halus",
      "Warna Tidak Luntur",
      "Motif Presisi",
      "Harga Terjangkau"
    ],
    care: [
      "Cuci dengan mesin (gentle)",
      "Suhu air maksimal 30°C",
      "Jemur terbalik",
      "Setrika bagian dalam"
    ]
  },
];

// Review data
const productReviews: Record<number, Review[]> = {
  1: [
    { id: 1, user: "Andi S.", rating: 5, comment: "Kualitas luar biasa! Batiknya halus dan motifnya sangat detail.", date: "2024-01-15", verified: true },
    { id: 2, user: "Siti R.", rating: 4, comment: "Bagus banget, cuma agak kebesaran sedikit. Next order size S aja.", date: "2024-01-10", verified: true },
    { id: 3, user: "Budi P.", rating: 5, comment: "Pelayanan cepat, batik original. Recommended seller!", date: "2024-01-08", verified: false },
  ],
  2: [
    { id: 1, user: "Maya L.", rating: 5, comment: "Sutra premium beneran! Worth the price.", date: "2024-01-12", verified: true },
    { id: 2, user: "Rudi T.", rating: 5, comment: "Exclusive banget, cocok untuk acara formal.", date: "2024-01-05", verified: true },
  ],
  3: [
    { id: 1, user: "Dewi K.", rating: 4, comment: "Motif parangnya rapi, harga worth it.", date: "2024-01-18", verified: true },
    { id: 2, user: "Ahmad F.", rating: 5, comment: "Katun primisima nya adem, enak dipakai.", date: "2024-01-14", verified: false },
  ],
};

export default function ProductDetail() {
  const [quantity, setQuantity] = createSignal(1);
  const [selectedSize, setSelectedSize] = createSignal("");
  const [selectedColor, setSelectedColor] = createSignal("");
  const [activeTab, setActiveTab] = createSignal("description");
  const [showZoom, setShowZoom] = createSignal(false);
  const [zoomPosition, setZoomPosition] = createSignal({ x: 0, y: 0 });
  const [showSizeGuide, setShowSizeGuide] = createSignal(false);
  const [showShareMenu, setShowShareMenu] = createSignal(false);
  const [currentImageIndex, setCurrentImageIndex] = createSignal(0);
  const [showLoginPrompt, setShowLoginPrompt] = createSignal(false);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === parseInt(id));
  const { addToCart } = useCart();
  const { toggleFavorite, isFavorite } = useFavorites();
  const { isAuthenticated } = useAuth();

  const allImages = product ? [product.image, ...product.additionalImages] : [];
  const [selectedImage, setSelectedImage] = createSignal(allImages[0] || "");

  // Calculate discount percentage
  const discountPercentage = product ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  // Image zoom handler
  const handleMouseMove = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Auto-rotate images
  createEffect(() => {
    const interval = setInterval(() => {
      if (!showZoom()) {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
        setSelectedImage(allImages[currentImageIndex()]);
      }
    }, 5000);
    return () => clearInterval(interval);
  });

  if (!product) {
    return (
      <>
        <Navbar />
        <div class="min-h-screen flex items-center justify-center">
          <div class="text-center">
            <div class="text-6xl mb-4">🛍️</div>
            <h2 class="text-2xl font-bold mb-2">Produk tidak ditemukan</h2>
            <p class="text-gray-600 mb-4">Maaf, produk yang Anda cari tidak tersedia.</p>
            <a href="/products" class="text-blue-600 hover:underline">Kembali ke katalog</a>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const handleAddToCart = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!selectedSize()) {
      showNotification("❗ Silakan pilih ukuran terlebih dahulu");
      return;
    }
    if (!selectedColor()) {
      showNotification("❗ Silakan pilih warna terlebih dahulu");
      return;
    }
    
    try {
      await addToCart(product.id, quantity());
      
      // Show success animation
      const button = document.querySelector('.add-to-cart-btn');
      if (button) {
        button.classList.add('animate-bounce');
        setTimeout(() => button.classList.remove('animate-bounce'), 1000);
      }
      
      // Show notification
      showNotification("🛒 Produk berhasil ditambahkan ke keranjang!");
    } catch (error: any) {
      showNotification("❌ " + (error.message || "Gagal menambahkan ke keranjang"));
    }
  };

  const handleBuyNow = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!selectedSize()) {
      showNotification("❗ Silakan pilih ukuran terlebih dahulu");
      return;
    }
    if (!selectedColor()) {
      showNotification("❗ Silakan pilih warna terlebih dahulu");
      return;
    }
    
    try {
      // Add to cart first
      await addToCart(product.id, quantity());
      
      // Show loading notification
      showNotification("🛒 Menambahkan ke keranjang...");
      
      // Navigate to cart after a short delay
      setTimeout(() => {
        navigate("/cart");
      }, 1000);
    } catch (error: any) {
      showNotification("❌ " + (error.message || "Gagal menambahkan ke keranjang"));
    }
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed top-24 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
    notification.textContent = message;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = `Check out ${product.name} - Batik Nusantara`;
    
    const shareUrls: Record<string, string | (() => void)> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      copy: () => {
        navigator.clipboard.writeText(url);
        showNotification("Link berhasil disalin! 📋");
      }
    };
    
    if (platform === 'copy') {
      (shareUrls.copy as () => void)();
    } else {
      window.open(shareUrls[platform] as string, '_blank');
    }
    setShowShareMenu(false);
  };

  const handleToggleFavorite = async () => {
    // Check authentication first
    if (!isAuthenticated()) {
      setShowLoginPrompt(true);
      return;
    }
    
    if (!product) return;

    try {
      const result = await toggleFavorite(product.id);
      showNotification(result.message);
    } catch (error: any) {
      console.error('Toggle favorite error:', error);
      showNotification("❌ Gagal mengupdate favorit");
    }
  };  return (
    <>
      <Navbar />
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-20 pb-16">
        {/* Breadcrumb */}
        <div class="max-w-7xl mx-auto px-4 md:px-12 py-4">
          <nav class="flex items-center space-x-2 text-sm text-gray-600">
            <a href="/" class="hover:text-gray-900">Home</a>
            <span>/</span>
            <a href="/products" class="hover:text-gray-900">Products</a>
            <span>/</span>
            <span class="text-gray-900 font-medium">{product.name}</span>
          </nav>
        </div>

        <div class="max-w-7xl mx-auto px-4 md:px-12">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Gallery */}
            <div class="space-y-4">
              {/* Main Image with Zoom */}
              <div 
                class="relative overflow-hidden rounded-2xl shadow-xl bg-gray-100 cursor-zoom-in"
                onMouseEnter={() => setShowZoom(true)}
                onMouseLeave={() => setShowZoom(false)}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={selectedImage()}
                  alt={product.name}
                  class="w-full h-[600px] object-cover transition-transform duration-300"
                  classList={{ "scale-150": showZoom() }}
                  style={{
                    "transform-origin": `${zoomPosition().x}% ${zoomPosition().y}%`
                  }}
                />
                
                {/* Discount Badge */}
                <Show when={discountPercentage > 0}>
                  <div class="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                    -{discountPercentage}%
                  </div>
                </Show>

                {/* Image Counter */}
                <div class="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {allImages.indexOf(selectedImage()) + 1} / {allImages.length}
                </div>
              </div>

              {/* Thumbnail Gallery */}
              <div class="grid grid-cols-4 gap-3">
                <For each={allImages}>
                  {(img, index) => (
                    <button
                      onClick={() => {
                        setSelectedImage(img);
                        setCurrentImageIndex(index());
                      }}
                      class="relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105"
                      classList={{
                        "ring-2 ring-black": selectedImage() === img,
                        "opacity-70": selectedImage() !== img,
                      }}
                    >
                      <img
                        src={img}
                        alt={`${product.name} ${index() + 1}`}
                        class="w-full h-24 object-cover"
                      />
                    </button>
                  )}
                </For>
              </div>
            </div>

            {/* Product Info */}
            <div class="space-y-6">
              {/* Header */}
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                    {product.category}
                  </span>
                  <Show when={product.stock < 10}>
                    <span class="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                      Stok Terbatas!
                    </span>
                  </Show>
                </div>
                
                <h1 class="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                {/* Rating */}
                <div class="flex items-center gap-4 mb-4">
                  <div class="flex items-center gap-1">
                    <For each={[...Array(5)]}>
                      {(_, i) => (
                        <svg class="w-5 h-5 fill-current" classList={{
                          "text-yellow-400": i() < Math.floor(product.rating),
                          "text-gray-300": i() >= Math.floor(product.rating)
                        }} viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                        </svg>
                      )}
                    </For>
                    <span class="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} ulasan)
                    </span>
                  </div>
                  <button class="text-sm text-blue-600 hover:underline">
                    Lihat semua ulasan
                  </button>
                </div>

                {/* Price */}
                <div class="flex items-baseline gap-3 mb-6">
                  <span class="text-3xl font-bold text-gray-900">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  <Show when={product.originalPrice > product.price}>
                    <span class="text-xl text-gray-500 line-through">
                      Rp {product.originalPrice.toLocaleString('id-ID')}
                    </span>
                  </Show>
                </div>

                {/* Tags */}
                <div class="flex flex-wrap gap-2 mb-6">
                  <For each={product.tags}>
                    {(tag) => (
                      <span class="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                        #{tag}
                      </span>
                    )}
                  </For>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-semibold">Ukuran</h3>
                  <button 
                    onClick={() => setShowSizeGuide(true)}
                    class="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    Panduan Ukuran
                  </button>
                </div>
                <div class="grid grid-cols-5 gap-2">
                  <For each={product.sizes}>
                    {(size) => (
                      <button
                        onClick={() => setSelectedSize(size)}
                        class="py-3 border-2 rounded-lg font-medium transition-all duration-200 hover:border-gray-400"
                        classList={{
                          "border-black bg-black text-white": selectedSize() === size,
                          "border-gray-300": selectedSize() !== size,
                        }}
                      >
                        {size}
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* Color Selection */}
              <div>
                <h3 class="text-lg font-semibold mb-3">Warna</h3>
                <div class="flex flex-wrap gap-2">
                  <For each={product.colors}>
                    {(color) => (
                      <button
                        onClick={() => setSelectedColor(color)}
                        class="px-4 py-2 border-2 rounded-lg font-medium transition-all duration-200 hover:border-gray-400"
                        classList={{
                          "border-black bg-black text-white": selectedColor() === color,
                          "border-gray-300": selectedColor() !== color,
                        }}
                      >
                        {color}
                      </button>
                    )}
                  </For>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <div class="flex items-center border-2 border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity() - 1))}
                      class="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    </button>
                    <input
                      type="text"
                      value={quantity()}
                      class="w-16 text-center font-medium"
                      readOnly
                    />
                    <button
                      onClick={() => setQuantity(quantity() + 1)}
                      class="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    </button>
                  </div>
                  
                  <span class="text-sm text-gray-600">
                    Stok: <strong>{product.stock}</strong> tersedia
                  </span>
                </div>

                {/* Action Buttons */}
                <div class="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    class="add-to-cart-btn flex-1 bg-black text-white py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-3"
                  >
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Tambah ke Keranjang
                  </button>
                  
                  <button
                    onClick={handleToggleFavorite}
                    class="px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300"
                    classList={{
                      "text-red-500 border-red-500": product && isFavorite(product.id),
                    }}
                  >
                    <svg class="w-6 h-6" fill={product && isFavorite(product.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                    </svg>
                  </button>
                  
                  <div class="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu())}
                      class="px-6 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-all duration-300"
                    >
                      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.062 18 14.518 18 14c0-.482.114-.938.316-1.342M8.684 10.658C8.886 11.062 9 11.518 9 12c0 .482-.114.938-.316 1.342m9.632-2.684a3 3 0 110 2.684M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    
                    <Show when={showShareMenu()}>
                      <div class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                        <button
                          onClick={() => handleShare('whatsapp')}
                          class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('facebook')}
                          class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare('copy')}
                          class="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                        >
                          Salin Link
                        </button>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Buy Now */}
                <button 
                  onClick={handleBuyNow}
                  class="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  Beli Sekarang
                </button>
              </div>

              {/* Trust Badges */}
              <div class="grid grid-cols-3 gap-4 py-6 border-t border-gray-200">
                <div class="text-center">
                  <div class="text-2xl mb-1">🚚</div>
                  <p class="text-sm text-gray-600">Gratis Ongkir</p>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">✅</div>
                  <p class="text-sm text-gray-600">Original 100%</p>
                </div>
                <div class="text-center">
                  <div class="text-2xl mb-1">↩️</div>
                  <p class="text-sm text-gray-600">7 Hari Retur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Information Tabs */}
          <div class="mt-16">
            <div class="border-b border-gray-200">
              <div class="flex gap-8">
                <button
                  onClick={() => setActiveTab("description")}
                  class="py-4 px-2 border-b-2 font-medium transition-colors"
                  classList={{
                    "border-black text-black": activeTab() === "description",
                    "border-transparent text-gray-500 hover:text-gray-700": activeTab() !== "description"
                  }}
                >
                  Deskripsi
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  class="py-4 px-2 border-b-2 font-medium transition-colors"
                  classList={{
                    "border-black text-black": activeTab() === "features",
                    "border-transparent text-gray-500 hover:text-gray-700": activeTab() !== "features"
                  }}
                >
                  Fitur & Spesifikasi
                </button>
                <button
                  onClick={() => setActiveTab("care")}
                  class="py-4 px-2 border-b-2 font-medium transition-colors"
                  classList={{
                    "border-black text-black": activeTab() === "care",
                    "border-transparent text-gray-500 hover:text-gray-700": activeTab() !== "care"
                  }}
                >
                  Cara Perawatan
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  class="py-4 px-2 border-b-2 font-medium transition-colors"
                  classList={{
                    "border-black text-black": activeTab() === "reviews",
                    "border-transparent text-gray-500 hover:text-gray-700": activeTab() !== "reviews"
                  }}
                >
                  Ulasan ({product.reviews})
                </button>
              </div>
            </div>

            <div class="py-8">
              <Show when={activeTab() === "description"}>
                <div class="prose max-w-none">
                  <p class="text-gray-700 leading-relaxed mb-4">{product.longDescription}</p>
                  <div class="bg-gray-50 p-6 rounded-lg mt-6">
                    <h3 class="font-semibold mb-3">Informasi Produk:</h3>
                    <pre class="text-gray-700 whitespace-pre-wrap">{product.description}</pre>
                  </div>
                </div>
              </Show>

              <Show when={activeTab() === "features"}>
                <div class="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                      Keunggulan Produk
                    </h3>
                    <ul class="space-y-3">
                      <For each={product.features}>
                        {(feature) => (
                          <li class="flex items-start gap-3">
                            <svg class="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                            </svg>
                            <span class="text-gray-700">{feature}</span>
                          </li>
                        )}
                      </For>
                    </ul>
                  </div>
                  
                  <div class="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                    <h3 class="font-semibold text-lg mb-4">Spesifikasi Teknis</h3>
                    <dl class="space-y-3">
                      <div class="flex justify-between">
                        <dt class="text-gray-600">SKU</dt>
                        <dd class="font-medium">BTK-{product.id.toString().padStart(4, '0')}</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600">Berat</dt>
                        <dd class="font-medium">250 gram</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600">Dimensi</dt>
                        <dd class="font-medium">2.5m x 1.15m</dd>
                      </div>
                      <div class="flex justify-between">
                        <dt class="text-gray-600">Garansi</dt>
                        <dd class="font-medium">1 Tahun</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </Show>

              <Show when={activeTab() === "care"}>
                <div class="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 class="font-semibold text-lg mb-4 flex items-center gap-2">
                      <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                      </svg>
                      Panduan Perawatan
                    </h3>
                    <ol class="space-y-3">
                      <For each={product.care}>
                        {(care, index) => (
                          <li class="flex items-start gap-3">
                            <span class="bg-blue-100 text-blue-800 text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
                              {index() + 1}
                            </span>
                            <span class="text-gray-700">{care}</span>
                          </li>
                        )}
                      </For>
                    </ol>
                  </div>
                  
                  <div class="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                      <svg class="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                      </svg>
                      Perhatian Khusus
                    </h3>
                    <ul class="space-y-2 text-sm text-gray-700">
                      <li>• Hindari pemutih atau bahan kimia keras</li>
                      <li>• Jangan rendam terlalu lama</li>
                      <li>• Simpan di tempat sejuk dan kering</li>
                      <li>• Gantung dengan hanger berbahan lembut</li>
                    </ul>
                  </div>
                </div>
              </Show>

              <Show when={activeTab() === "reviews"}>
                <div class="space-y-6">
                  {/* Review Summary */}
                  <div class="bg-gray-50 rounded-xl p-6">
                    <div class="grid md:grid-cols-3 gap-6">
                      <div class="text-center">
                        <div class="text-4xl font-bold text-gray-900">{product.rating}</div>
                        <div class="flex justify-center my-2">
                          <For each={[...Array(5)]}>
                            {(_, ) => (
                              <svg class="w-5 h-5 fill-current text-yellow-400" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                            )}
                          </For>
                        </div>
                        <p class="text-sm text-gray-600">{product.reviews} ulasan</p>
                      </div>
                      
                      <div class="col-span-2 space-y-2">
                        <For each={[5, 4, 3, 2, 1]}>
                          {(stars) => (
                            <div class="flex items-center gap-2">
                              <span class="text-sm text-gray-600 w-3">{stars}</span>
                              <svg class="w-4 h-4 fill-current text-yellow-400" viewBox="0 0 20 20">
                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                              </svg>
                              <div class="flex-1 bg-gray-200 rounded-full h-2">
                                <div 
                                  class="bg-yellow-400 h-2 rounded-full"
                                  style={{width: `${stars === 5 ? 70 : stars === 4 ? 20 : stars === 3 ? 5 : 3}%`}}
                                />
                              </div>
                              <span class="text-sm text-gray-600 w-10">
                                {stars === 5 ? '70%' : stars === 4 ? '20%' : stars === 3 ? '5%' : '3%'}
                              </span>
                            </div>
                          )}
                        </For>
                      </div>
                    </div>
                  </div>

                  {/* Individual Reviews */}
                  <div class="space-y-4">
                    <For each={productReviews[product.id] || []}>
                      {(review) => (
                        <div class="bg-white border border-gray-200 rounded-lg p-6">
                          <div class="flex items-start justify-between mb-3">
                            <div>
                              <div class="flex items-center gap-2">
                                <h4 class="font-semibold">{review.user}</h4>
                                <Show when={review.verified}>
                                  <span class="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                                    </svg>
                                    Terverifikasi
                                  </span>
                                </Show>
                              </div>
                              <div class="flex items-center gap-1 my-1">
                                <For each={[...Array(5)]}>
                                  {(_, i) => (
                                    <svg class="w-4 h-4 fill-current" classList={{
                                      "text-yellow-400": i() < review.rating,
                                      "text-gray-300": i() >= review.rating
                                    }} viewBox="0 0 20 20">
                                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                                    </svg>
                                  )}
                                </For>
                              </div>
                            </div>
                            <span class="text-sm text-gray-500">{review.date}</span>
                          </div>
                          <p class="text-gray-700">{review.comment}</p>
                          <div class="mt-3 flex gap-4">
                            <button class="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/>
                              </svg>
                              Membantu
                            </button>
                            <button class="text-sm text-gray-500 hover:text-gray-700">
                              Laporkan
                            </button>
                          </div>
                        </div>
                      )}
                    </For>
                  </div>

                  {/* Write Review Button */}
                  <button class="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    Tulis Ulasan
                  </button>
                </div>
              </Show>
            </div>
          </div>

          {/* Related Products */}
          <div class="mt-16">
            <h2 class="text-2xl font-bold mb-6">Produk Serupa</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              <For each={products.filter(p => p.id !== product.id).slice(0, 4)}>
                {(relatedProduct) => (
                  <a href={`/product/${relatedProduct.id}`} class="group">
                    <div class="relative overflow-hidden rounded-lg mb-3">
                      <img 
                        src={relatedProduct.image} 
                        alt={relatedProduct.name}
                        class="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Show when={relatedProduct.originalPrice > relatedProduct.price}>
                        <div class="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                          -{Math.round((1 - relatedProduct.price / relatedProduct.originalPrice) * 100)}%
                        </div>
                      </Show>
                    </div>
                    <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <p class="text-sm text-gray-600 mt-1">
                      Rp {relatedProduct.price.toLocaleString('id-ID')}
                    </p>
                  </a>
                )}
              </For>
            </div>
          </div>
        </div>
      </div>

      {/* Size Guide Modal */}
      <Show when={showSizeGuide()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-xl font-bold">Panduan Ukuran</h3>
                <button 
                  onClick={() => setShowSizeGuide(false)}
                  class="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              
              <div class="overflow-x-auto">
                <table class="w-full border-collapse">
                  <thead>
                    <tr class="bg-gray-100">
                      <th class="border p-3 text-left">Ukuran</th>
                      <th class="border p-3 text-left">Lebar Dada (cm)</th>
                      <th class="border p-3 text-left">Panjang (cm)</th>
                      <th class="border p-3 text-left">Lebar Bahu (cm)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="border p-3">S</td>
                      <td class="border p-3">48</td>
                      <td class="border p-3">68</td>
                      <td class="border p-3">42</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border p-3">M</td>
                      <td class="border p-3">50</td>
                      <td class="border p-3">70</td>
                      <td class="border p-3">44</td>
                    </tr>
                    <tr>
                      <td class="border p-3">L</td>
                      <td class="border p-3">52</td>
                      <td class="border p-3">72</td>
                      <td class="border p-3">46</td>
                    </tr>
                    <tr class="bg-gray-50">
                      <td class="border p-3">XL</td>
                      <td class="border p-3">54</td>
                      <td class="border p-3">74</td>
                      <td class="border p-3">48</td>
                    </tr>
                    <tr>
                      <td class="border p-3">XXL</td>
                      <td class="border p-3">56</td>
                      <td class="border p-3">76</td>
                      <td class="border p-3">50</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 class="font-semibold mb-2">Tips Memilih Ukuran:</h4>
                <ul class="text-sm text-gray-700 space-y-1">
                  <li>• Ukur lingkar dada Anda pada bagian terlebar</li>
                  <li>• Jika hasil ukur berada di antara dua ukuran, pilih ukuran yang lebih besar</li>
                  <li>• Untuk model loose fit, pertimbangkan naik 1 ukuran</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Show>

      {/* Login Prompt Modal */}
      <Show when={showLoginPrompt()}>
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-xl max-w-md w-full p-6">
            <div class="text-center">
              <div class="text-4xl mb-4">🔐</div>
              <h3 class="text-xl font-bold mb-2">Login Diperlukan</h3>
              <p class="text-gray-600 mb-6">
                Silakan login terlebih dahulu untuk menambahkan produk ke keranjang atau favorit Anda.
              </p>
              <div class="flex gap-3">
                <button
                  onClick={() => setShowLoginPrompt(false)}
                  class="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <a
                  href="/login"
                  class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                >
                  Login
                </a>
              </div>
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
        
        .cursor-zoom-in {
          cursor: zoom-in;
        }
      `}</style>

      <Footer />
    </>
  );
}