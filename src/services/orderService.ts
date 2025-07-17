import { apiClient } from '../utils/api';
import type { ApiResponse, PaginatedResponse } from '../utils/api';

// Order Types
export interface Order {
  id: number;
  user_id: number;
  order_number: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address_id?: number;
  billing_address_id?: number;
  notes?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  shipping_address?: UserAddress;
  billing_address?: UserAddress;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  product: {
    id: number;
    name: string;
    images: Array<{ image_url: string; is_primary: boolean }>;
  };
}

export interface UserAddress {
  id: number;
  user_id: number;
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface CheckoutRequest {
  shipping_address_id: number;
  billing_address_id?: number;
  payment_method: string;
  notes?: string;
}

export interface OrderFilters {
  status?: string;
  page?: number;
  per_page?: number;
}

// Order Service
export class OrderService {
  // Create new order (checkout)
  static async checkout(checkoutData: CheckoutRequest): Promise<ApiResponse<Order>> {
    return apiClient.post<Order>('/checkout', checkoutData);
  }

  // Get user's orders
  static async getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    const params: Record<string, string | number> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    return apiClient.getPaginated<Order>('/orders', params);
  }

  // Get single order by ID
  static async getOrder(orderId: number): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/${orderId}`);
  }

  // Update order status (Admin only)
  static async updateOrderStatus(orderId: number, status: string): Promise<ApiResponse<Order>> {
    return apiClient.put<Order>(`/orders/${orderId}/status`, { status });
  }

  // Get order by order number
  static async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order>> {
    return apiClient.get<Order>(`/orders/number/${orderNumber}`);
  }
}

// User Address Service
export class AddressService {
  // Get user addresses
  static async getAddresses(): Promise<ApiResponse<UserAddress[]>> {
    return apiClient.get<UserAddress[]>('/user/addresses');
  }

  // Add new address
  static async addAddress(addressData: Omit<UserAddress, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<UserAddress>> {
    return apiClient.post<UserAddress>('/user/addresses', addressData);
  }

  // Update address
  static async updateAddress(addressId: number, addressData: Partial<UserAddress>): Promise<ApiResponse<UserAddress>> {
    return apiClient.put<UserAddress>(`/user/addresses/${addressId}`, addressData);
  }

  // Delete address
  static async deleteAddress(addressId: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/user/addresses/${addressId}`);
  }

  // Get default address
  static async getDefaultAddress(): Promise<UserAddress | null> {
    try {
      const response = await this.getAddresses();
      return response.data?.find(addr => addr.is_default) || null;
    } catch (error) {
      return null;
    }
  }
}
