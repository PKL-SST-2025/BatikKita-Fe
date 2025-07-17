import { apiClient } from '../utils/api';
import type { ApiResponse } from '../utils/api';

// Favorite Types
export interface FavoriteProduct {
  id: number;
  user_id: number;
  product_id: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number;
    images: Array<{ image_url: string; is_primary: boolean }>;
    category: string;
    is_active: boolean;
  };
}

export interface AddToFavoritesRequest {
  product_id: number;
}

// Favorites Service
export class FavoriteService {
  // Get user's favorite products
  static async getFavorites(): Promise<ApiResponse<FavoriteProduct[]>> {
    return apiClient.get<FavoriteProduct[]>('/favorites');
  }

  // Add product to favorites
  static async addToFavorites(productId: number): Promise<ApiResponse<FavoriteProduct>> {
    return apiClient.post<FavoriteProduct>('/favorites', { product_id: productId });
  }

  // Remove product from favorites
  static async removeFromFavorites(productId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/favorites/${productId}`);
  }

  // Check if product is in favorites
  static async isFavorite(productId: number): Promise<boolean> {
    try {
      const response = await this.getFavorites();
      return response.data?.some(fav => fav.product_id === productId) || false;
    } catch (error) {
      return false;
    }
  }

  // Toggle favorite status
  static async toggleFavorite(productId: number): Promise<{ isFavorite: boolean; message: string }> {
    try {
      const isFav = await this.isFavorite(productId);
      
      if (isFav) {
        await this.removeFromFavorites(productId);
        return { isFavorite: false, message: 'Removed from favorites' };
      } else {
        await this.addToFavorites(productId);
        return { isFavorite: true, message: 'Added to favorites' };
      }
    } catch (error) {
      throw new Error('Failed to update favorites');
    }
  }
}
