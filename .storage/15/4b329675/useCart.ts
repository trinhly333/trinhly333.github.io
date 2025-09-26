import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DiscountCode } from './useDiscountCodes';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface AppliedDiscount {
  code: string;
  name: string;
  discountAmount: number;
  discountType: 'fixed' | 'percentage';
}

interface CartState {
  items: CartItem[];
  quickBuyItem: CartItem | null;
  appliedDiscount: AppliedDiscount | null;
  isOpen: boolean;
  animatingItemId: string | null;
  flyingItem: { image: string; startX: number; startY: number } | null;
  addItem: (item: Omit<CartItem, 'quantity'>, buttonElement?: HTMLElement) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setQuickBuyItem: (item: CartItem) => void;
  clearQuickBuy: () => void;
  toggleCart: () => void;
  setAnimatingItem: (id: string | null) => void;
  setFlyingItem: (item: { image: string; startX: number; startY: number } | null) => void;
  applyDiscount: (discount: AppliedDiscount) => void;
  removeDiscount: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      quickBuyItem: null,
      appliedDiscount: null,
      isOpen: false,
      animatingItemId: null,
      flyingItem: null,
      
      addItem: (item, buttonElement) => {
        const { items } = get();
        const existingItem = items.find((i) => i.id === item.id);
        
        if (existingItem) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: 1 }] });
        }

        // CRITICAL FIX: Fly-to-cart animation
        if (buttonElement && item.image) {
          const buttonRect = buttonElement.getBoundingClientRect();
          set({
            flyingItem: {
              image: item.image,
              startX: buttonRect.left + buttonRect.width / 2,
              startY: buttonRect.top + buttonRect.height / 2
            }
          });
          
          // Remove flying item after animation
          setTimeout(() => {
            set({ flyingItem: null });
          }, 800);
        }

        // Set animating item for success feedback
        set({ animatingItemId: item.id });
        setTimeout(() => {
          set({ animatingItemId: null });
        }, 2000);
      },
      
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
        
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: quantity <= 0
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        })),
        
      clearCart: () => set({ items: [], appliedDiscount: null }),
      
      setQuickBuyItem: (item: CartItem) => set({ quickBuyItem: item }),
      
      clearQuickBuy: () => set({ quickBuyItem: null }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      
      setAnimatingItem: (id) => set({ animatingItemId: id }),
      
      setFlyingItem: (item) => set({ flyingItem: item }),

      applyDiscount: (discount: AppliedDiscount) => set({ appliedDiscount: discount }),

      removeDiscount: () => set({ appliedDiscount: null }),
    }),
    {
      name: 'cart-storage',
    }
  )
);

// Helper functions
export const getTotalItems = () => {
  const { items } = useCart.getState();
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const getSubtotal = () => {
  const { items } = useCart.getState();
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

export const getTotalPrice = () => {
  const { items, appliedDiscount } = useCart.getState();
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  
  if (appliedDiscount) {
    return Math.max(0, subtotal - appliedDiscount.discountAmount);
  }
  
  return subtotal;
};

export const getDiscountAmount = () => {
  const { appliedDiscount } = useCart.getState();
  return appliedDiscount ? appliedDiscount.discountAmount : 0;
};