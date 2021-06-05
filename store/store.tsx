import create from "zustand";

interface StoreState {
  user: string;
  setUser(user: string): void;
}

const useStore = create<StoreState>((set) => ({
  user: "",
  setUser: (user: string) => set((state) => ({ ...state, user: user })),
}));

export default useStore;
