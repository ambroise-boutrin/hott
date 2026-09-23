import { create } from 'zustand';

interface AuthUIStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const useAuthUIStore = create<AuthUIStore>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
}));
