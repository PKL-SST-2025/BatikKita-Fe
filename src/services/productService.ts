import { apiClient } from '../utils/api';
import type { ApiResponse, PaginatedResponse } from '../utils/api';

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  short_description: string;
  price: number;
  discount_price?: number;
  sku: string;
  stock_quantity: number;
  category: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  images: ProductImage[];
  features: ProductFeature[];
  reviews: ProductReview[];
  average_rating?: number;
  review_count?: number;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  alt_text?: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ProductFeature {
  id: number;
  product_id: number;
  feature_name: string;
  feature_value: string;
}

export interface ProductReview {
  id: number;
  product_id: number;
  user_id: number;
  rating: number;
  title?: string;
  comment?: string;
  is_verified_purchase: boolean;
  created_at: string;
  updated_at: string;
  user: {
    first_name: string;
    last_name: string;
  };
}

export interface ProductFilters {
  category?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  search?: string;
  sort_by?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'created_desc';
  page?: number;
  per_page?: number;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  short_description: string;
  price: number;
  discount_price?: number;
  sku: string;
  stock_quantity: number;
  category: string;
  brand?: string;
  weight?: number;
  dimensions?: string;
  is_featured?: boolean;
}

// Product Service
export class ProductService {
  // Get all products with filters and pagination
  static async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    const params: Record<string, string | number> = {};
    
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params[key] = value;
        }
      });
    }

    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        searchParams.append(key, value.toString());
      });
    }
    
    const url = searchParams.toString() 
      ? `/products?${searchParams.toString()}`
      : '/products';
    
    // Backend now returns ApiResponse format
    const response = await apiClient.get<Product[]>(url);
    
    // Transform the response to match PaginatedResponse format
    const products = response.data || [];
    return {
      data: products,
      pagination: {
        page: 1,
        per_page: products.length,
        total: products.length,
        total_pages: 1,
        has_next: false,
        has_prev: false
      },
      success: response.success,
      message: response.message
    };
  }

  // Get single product by ID
  static async getProduct(id: number): Promise<ApiResponse<Product>> {
    return apiClient.get<Product>(`/products/${id}`);
  }

  // Create new product (Admin only)
  static async createProduct(productData: CreateProductRequest): Promise<ApiResponse<Product>> {
    return apiClient.post<Product>('/products', productData);
  }

  // Update product (Admin only)
  static async updateProduct(id: number, productData: Partial<CreateProductRequest>): Promise<ApiResponse<Product>> {
    return apiClient.put<Product>(`/products/${id}`, productData);
  }

  // Delete product (Admin only)
  static async deleteProduct(id: number): Promise<ApiResponse<null>> {
    return apiClient.delete<null>(`/products/${id}`);
  }

  // Get product reviews
  static async getProductReviews(productId: number, page = 1, perPage = 10): Promise<PaginatedResponse<ProductReview>> {
    return apiClient.getPaginated<ProductReview>(`/products/${productId}/reviews`, {
      page,
      per_page: perPage
    });
  }

  // Add product review
  static async addReview(productId: number, reviewData: {
    rating: number;
    title?: string;
    comment?: string;
  }): Promise<ApiResponse<ProductReview>> {
    return apiClient.post<ProductReview>(`/products/${productId}/reviews`, reviewData);
  }

  // Get featured products
  static async getFeaturedProducts(): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ is_featured: true, per_page: 8 });
  }

  // Search products
  static async searchProducts(query: string, page = 1): Promise<PaginatedResponse<Product>> {
    return this.getProducts({ search: query, page, per_page: 12 });
  }
}
