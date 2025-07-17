import { createSignal } from "solid-js";
import { useFavorites, type FavoriteProduct } from "../store/FavoriteContext";
import { useAuth } from "../store/AuthContext";

interface FavoriteButtonProps {
  product: FavoriteProduct | { id: string | number; [key: string]: any };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteButton(props: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = createSignal(false);

  // Helper function to get product ID
  const getProductId = () => {
    if ('product_id' in props.product) {
      return props.product.product_id;
    }
    return typeof props.product.id === 'string' ? parseInt(props.product.id.replace(/\D/g, '')) || 1 : props.product.id;
  };

  const handleToggleFavorite = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check if user is logged in
    if (!user()) {
      // Create a more elegant login prompt
      showLoginPrompt();
      return;
    }
    
    setIsAnimating(true);
    
    const productId = getProductId();
    if (isFavorite(productId)) {
      removeFromFavorites(productId);
    } else {
      addToFavorites(productId);
    }
    
    // Reset animation after 300ms
    setTimeout(() => setIsAnimating(false), 300);
  };

  const showLoginPrompt = () => {
    // Create elegant modal-like notification
    const modal = document.createElement("div");
    modal.className = "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm";
    modal.innerHTML = `
      <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-scale-in">
        <div class="text-center">
          <div class="text-6xl mb-4">❤️</div>
          <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Login Diperlukan</h3>
          <p class="text-gray-600 dark:text-gray-300 mb-6">Silakan login terlebih dahulu untuk menambahkan produk ke favorit Anda</p>
          <div class="flex gap-3 justify-center">
            <button onclick="this.closest('.fixed').remove()" class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Batal
            </button>
            <a href="/login" class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              Login Sekarang
            </a>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Remove on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    });
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    }, 10000);
  };

  const sizeClasses = {
    sm: "w-8 h-8 text-lg",
    md: "w-10 h-10 text-xl",
    lg: "w-12 h-12 text-2xl"
  };

  const size = props.size || "md";

  return (
    <button
      onClick={handleToggleFavorite}
      class={`${sizeClasses[size]} ${props.className || ""} 
        relative flex items-center justify-center rounded-full 
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
        shadow-lg hover:shadow-xl 
        transition-all duration-300 transform hover:scale-110
        ${isAnimating() ? "animate-pulse scale-125" : ""}
        ${isFavorite(getProductId()) ? "text-red-500" : "text-gray-400 hover:text-red-400"}`}
      title={isFavorite(getProductId()) ? "Hapus dari favorit" : "Tambah ke favorit"}
    >
      <svg 
        class={`w-5 h-5 transition-all duration-300 ${
          isFavorite(getProductId()) ? "fill-current" : "fill-none"
        }`} 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          stroke-linecap="round" 
          stroke-linejoin="round" 
          stroke-width="2" 
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
        />
      </svg>
      
      {/* Ripple effect */}
      {isAnimating() && (
        <div class="absolute inset-0 rounded-full bg-red-400 opacity-30 animate-ping"></div>
      )}
      
      {/* Add CSS for modal animation */}
      <style>{`
        @keyframes scale-in {
          0% { opacity: 0; transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </button>
  );
}
