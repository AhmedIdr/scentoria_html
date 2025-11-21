import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleDrawer: (isOpen?: boolean) => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

      addItem: (product) => set((state) => {
        const existingItem = state.items.find((item) => item.id === product.id);
        if (existingItem) {
          return {
            items: state.items.map((item) =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
            isDrawerOpen: true,
          };
        }
        return { items: [...state.items, { ...product, quantity: 1 }], isDrawerOpen: true };
      }),

      removeItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id)
      })),

      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        )
      })),

      clearCart: () => set({ items: [] }),

      toggleDrawer: (isOpen) => set((state) => ({
        isDrawerOpen: isOpen !== undefined ? isOpen : !state.isDrawerOpen
      })),

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'scentoria-cart-storage',
      partializing: (state) => ({ items: state.items }),
    }
  )
);