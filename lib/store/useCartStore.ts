import { create } from "zustand"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
}

interface CartStore {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  getCartTotal: () => number
}

export const useCartStore = create<CartStore>((set, get) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  items: [],
  addItem: (item) =>
    set((state) => {
      const existingItem = state.items.find((i) => i.id === item.id)
      if (existingItem) {
        return {
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
          isOpen: true,
        }
      }
      return { items: [...state.items, item], isOpen: true }
    }),
  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((i) => i.id !== id),
    })),
  updateQuantity: (id, quantity) =>
    set((state) => ({
      items: quantity > 0 
        ? state.items.map((i) => (i.id === id ? { ...i, quantity } : i))
        : state.items.filter((i) => i.id !== id),
    })),
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0)
  },
}))
