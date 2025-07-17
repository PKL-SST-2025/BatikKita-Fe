import { apiClient } from '../utils/api';
import type { ApiResponse } from '../utils/api';

// Cart Types
export interface CartItem {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: {
    id: number;
    name: string;
    price: number;
    discount_price?: number;
    images: Array<{ image_url: string; is_primary: boolean }>;
    stock_quantity: number;
  };
}

export interface CartSummary {
  items: CartItem[];
  total_items: number;
  subtotal: number;
  total_discount: number;
  total_amount: number;
}

export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface UpdateCartRequest {
  quantity: number;
}

// Cart Service
export class CartService {
  // Get user's cart
  static async getCart(): Promise<ApiResponse<CartSummary>> {
    return apiClient.get<CartSummary>('/cart');
  }

  // Add item to cart
  static async addToCart(item: AddToCartRequest): Promise<ApiResponse<CartItem>> {
    return apiClient.post<CartItem>('/cart', item);
  }

  // Update cart item quantity
  static async updateCartItem(itemId: number, data: UpdateCartRequest): Promise<ApiResponse<CartItem>> {
    return apiClient.put<CartItem>(`/cart/${itemId}`, data);
  }

  // Remove item from cart
  static async removeFromCart(itemId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/cart/${itemId}`);
  }

  // Clear entire cart
  static async clearCart(): Promise<ApiResponse<null>> {
    return apiClient.delete<null>('/cart');
  }

  // Get cart item count
  static async getCartCount(): Promise<number> {
    try {
      const response = await this.getCart();
      return response.data?.total_items || 0;
    } catch (error) {
      return 0;
    }
  }
}
