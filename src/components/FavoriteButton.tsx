import { createSignal, Show } from "solid-js";
import { useFavorites, type FavoriteProduct } from "../store/FavoriteContext";
import { useAuth } from "../store/AuthContext";

interface FavoriteButtonProps {
  product: FavoriteProduct | { id: string | number; [key: string]: any };
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function FavoriteButton(props: FavoriteButtonProps) {
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuth();
  const [isAnimating, setIsAnimating] = createSignal(false);
  const [showLoginModal, setShowLoginModal] = createSignal(false);

  // Helper function to get product ID
  const getProductId = () => {
    if ('product_id' in props.product) {
      return props.product.product_id;
    }
    return typeof props.product.id === 'string' ? parseInt(props.product.id.replace(/\D/g, '')) || 1 : props.product.id;
  };

  const handleToggleFavorite = async (e: Event) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      
      console.log('=== FAVORITE BUTTON CLICKED ===');
      console.log('User:', user());
      console.log('Is authenticated:', isAuthenticated());
      
      // Check if user is authenticated - try both methods
      const userExists = !!user();
      const authCheck = isAuthenticated();
      
      console.log('userExists:', userExists);
      console.log('authCheck:', authCheck);
      
      if (!authCheck || !userExists) {
        console.log('🚫 User not authenticated, showing login prompt');
        setShowLoginModal(true);
        return;
      }
      
      console.log('✅ User authenticated, proceeding with favorite toggle');
      setIsAnimating(true);
      
      try {
        const productId = getProductId();
        console.log('Product ID:', productId);
        if (isFavorite(productId)) {
          console.log('Removing from favorites');
          await removeFromFavorites(productId);
        } else {
          console.log('Adding to favorites');
          await addToFavorites(productId);
        }
      } catch (favoriteError) {
        console.error('❌ Failed to toggle favorite:', favoriteError);
        alert('Failed to update favorites: ' + (favoriteError instanceof Error ? favoriteError.message : String(favoriteError)));
      } finally {
        // Reset animation after 300ms
        setTimeout(() => setIsAnimating(false), 300);
      }
    } catch (outerError) {
      console.error('❌ Outer error in handleToggleFavorite:', outerError);
      alert('An error occurred: ' + (outerError instanceof Error ? outerError.message : String(outerError)));
    }
  };

  const sizeClasses = {
    sm: "w-8 h-8 p-2",
    md: "w-10 h-10 p-2.5",
    lg: "w-12 h-12 p-3"
  };

  const size = props.size || "md";

  return (
    <>
      <button
        onClick={handleToggleFavorite}
        class={`${sizeClasses[size]} ${props.className || ""} 
          relative flex items-center justify-center rounded-full 
          transition-all duration-300 group hover:scale-110
          ${isAnimating() ? "animate-pulse scale-125" : ""}
          ${isFavorite(getProductId()) 
            ? "bg-red-50 text-red-500" 
            : "bg-gray-100 hover:bg-red-50 text-gray-600 hover:text-red-500"
          }`}
        title={isFavorite(getProductId()) ? "Hapus dari favorit" : "Tambah ke favorit"}
      >
        <svg 
          class={`w-5 h-5 transition-colors duration-300 ${
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
      </button>

      {/* Login Modal */}
      <Show when={showLoginModal()}>
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setShowLoginModal(false)}>
          <div class="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div class="text-center">
              <div class="text-6xl mb-4">❤️</div>
              <h3 class="text-2xl font-bold text-gray-800 dark:text-white mb-2">Login Diperlukan</h3>
              <p class="text-gray-600 dark:text-gray-300 mb-6">Silakan login terlebih dahulu untuk menambahkan produk ke favorit Anda</p>
              <div class="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowLoginModal(false)}
                  class="px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                >
                  Batal
                </button>
                <a 
                  href="/login" 
                  class="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                >
                  Login Sekarang
                </a>
              </div>
            </div>
          </div>
        </div>
      </Show>

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
    </>
  );
}
