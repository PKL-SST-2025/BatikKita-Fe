import { createContext, useContext, createSignal } from "solid-js";
import type { JSX } from "solid-js/jsx-runtime";

// Tipe data untuk item dalam keranjang
export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

// Buat konteks
const CartContext = createContext<{
  cart: () => CartItem[];
  addToCart: (item: CartItem) => void;
  updateCart: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}>();

export function CartProvider(props: { children: JSX.Element }) {
  const [cart, setCart] = createSignal<CartItem[]>([]);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      // Cek jika item sudah ada, update quantity
      const exists = prev.find((p) => p.id === item.id);
      if (exists) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + item.quantity } : p
        );
      }
      return [...prev, item];
    });
  };

  const updateCart = (id: number, quantity: number) => {
    setCart((prev) =>
      prev.map((p) => (p.id === id ? { ...p, quantity } : p))
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCart, removeFromCart }}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext)!;
}