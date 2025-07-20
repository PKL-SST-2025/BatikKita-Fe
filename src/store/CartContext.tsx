import { createSignal, createContext, useContext } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";
import { CartService } from "../services/cartService";
import type { CartItem } from "../services/cartService";

export interface CartContextValue {
  cartItems: () => CartItem[];
  loading: () => boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider(props: { children: JSX.Element }) {
  const [cartItems, setCartItems] = createSignal<CartItem[]>([]);
  const [loading, setLoading] = createSignal(false);

  const refreshCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.getCart();
      if (response.success && response.data) {
        setCartItems(response.data.items);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load cart on mount
  const initializeCart = async () => {
    await refreshCart();
  };

  // Initialize cart
  initializeCart();

  const addToCart = async (productId: number, quantity: number = 1) => {
    try {
      setLoading(true);
      const response = await CartService.addToCart({ product_id: productId, quantity });
      if (response.success) {
        await refreshCart();
      } else {
        throw new Error(response.message || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    try {
      setLoading(true);
      const response = await CartService.updateCartItem(productId, { quantity });
      if (response.success) {
        await refreshCart();
      } else {
        throw new Error(response.message || 'Failed to update cart item');
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      setLoading(true);
      const response = await CartService.removeFromCart(productId);
      if (response.success) {
        await refreshCart();
      } else {
        throw new Error(response.message || 'Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await CartService.clearCart();
      if (response.success) {
        setCartItems([]);
      } else {
        throw new Error(response.message || 'Failed to clear cart');
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems().reduce((total, item) => {
      const price = item.product.discount_price || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  };

  const getCartCount = () => {
    return cartItems().reduce((count, item) => count + item.quantity, 0);
  };

  const contextValue: CartContextValue = {
    cartItems,
    loading,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartTotal,
    getCartCount,
    refreshCart
  };

  return (
    <CartContext.Provider value={contextValue}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
