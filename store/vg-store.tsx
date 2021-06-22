import create from "zustand";

interface StoreState {
  user: string;
  network: string;
  setUser(user: string): void;
  setNetwork(network: string): void;
}

const useStore = create<StoreState>((set) => ({
  user: "",
  setUser: (user: string) => set((state) => ({ ...state, user: user })),

  network: "",
  setNetwork: (network: string) =>
    set((state) => ({ ...state, network: network })),
}));

export default useStore;
