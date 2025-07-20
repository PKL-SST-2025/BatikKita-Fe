import { createSignal, createContext, useContext, createEffect } from "solid-js";
import { useAuth } from "./AuthContext";
import type { JSX } from "solid-js/jsx-runtime";
import { FavoriteService, type FavoriteProduct } from "../services/favoriteService";

export { type FavoriteProduct };

export interface FavoriteContextValue {
  favorites: () => FavoriteProduct[];
  loading: () => boolean;
  addToFavorites: (productId: number) => Promise<void>;
  removeFromFavorites: (productId: number) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<{ isFavorite: boolean; message: string }>;
  isFavorite: (productId: number) => boolean;
  favoriteCount: () => number;
  refreshFavorites: () => Promise<void>;
}

const FavoriteContext = createContext<FavoriteContextValue | undefined>(undefined);

export function FavoriteProvider(props: { children: JSX.Element }) {
  const [favorites, setFavorites] = createSignal<FavoriteProduct[]>([]);
  const [loading, setLoading] = createSignal(false);
  const auth = useAuth();

  // Load favorites when user is authenticated
  createEffect(async () => {
    if (auth.isAuthenticated()) {
      await refreshFavorites();
    } else {
      setFavorites([]);
    }
  });

  const refreshFavorites = async () => {
    if (!auth.isAuthenticated()) return;
    
    try {
      setLoading(true);
      const response = await FavoriteService.getFavorites();
      if (response.success && response.data) {
        setFavorites(response.data);
      }
    } catch (error) {
      console.error('Failed to load favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: number) => {
    console.log('addToFavorites called', { isAuthenticated: auth.isAuthenticated(), productId });
    
    if (!auth.isAuthenticated()) {
      console.log('Not authenticated, throwing error');
      throw new Error('Please login to add favorites');
    }

    try {
      setLoading(true);
      console.log('Calling FavoriteService.addToFavorites');
      const response = await FavoriteService.addToFavorites(productId);
      console.log('FavoriteService response:', response);
      if (response.success) {
        await refreshFavorites();
      } else {
        throw new Error(response.message || 'Failed to add to favorites');
      }
    } catch (error) {
      console.error('Failed to add to favorites:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    if (!auth.isAuthenticated()) return;

    try {
      setLoading(true);
      const response = await FavoriteService.removeFromFavorites(productId);
      if (response.success) {
        await refreshFavorites();
      } else {
        throw new Error(response.message || 'Failed to remove from favorites');
      }
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (productId: number): Promise<{ isFavorite: boolean; message: string }> => {
    if (!auth.isAuthenticated()) {
      throw new Error('Please login to manage favorites');
    }

    const isCurrentlyFavorite = isFavorite(productId);
    
    try {
      if (isCurrentlyFavorite) {
        await removeFromFavorites(productId);
        return { isFavorite: false, message: 'Produk dihapus dari favorit' };
      } else {
        await addToFavorites(productId);
        return { isFavorite: true, message: 'Produk ditambahkan ke favorit' };
      }
    } catch (error) {
      throw error;
    }
  };

  const isFavorite = (productId: number): boolean => {
    return favorites().some(fav => fav.product_id === productId);
  };

  const favoriteCount = (): number => {
    return favorites().length;
  };

  const contextValue: FavoriteContextValue = {
    favorites,
    loading,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    isFavorite,
    favoriteCount,
    refreshFavorites
  };

  return (
    <FavoriteContext.Provider value={contextValue}>
      {props.children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) throw new Error("useFavorites must be used within a FavoriteProvider");
  return context;
}
