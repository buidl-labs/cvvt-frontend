import create from "zustand";
import BigNumber from "bignumber.js";

type UserBalancesType = {
  totalCelo: any;
  unlockedCelo: any;
  nonVotingLockedCelo: any;
  votingLockedCelo: any;
  unlockingCelo: any;
  withdrawableCelo: any;
};

interface StoreState {
  user: string;
  userBalances: UserBalancesType;
  network: string;
  setUser(user: string): void;
  setNetwork(network: string): void;
  setUserBalances(
    totalCelo: any,
    unlockedCelo: any,
    nonVotingLockedCelo: any,
    votingLockedCelo: any
  ): void;
}

const useStore = create<StoreState>((set) => ({
  user: "",
  setUser: (user: string) => set((state) => ({ ...state, user: user })),
  network: "",
  setNetwork: (network: string) =>
    set((state) => ({ ...state, network: network })),
  userBalances: {
    totalCelo: new BigNumber(0),
    unlockedCelo: new BigNumber(0),
    nonVotingLockedCelo: new BigNumber(0),
    votingLockedCelo: new BigNumber(0),
    unlockingCelo: new BigNumber(0),
    withdrawableCelo: new BigNumber(0),
  },
  setUserBalances: (
    totalCelo: any,
    unlockedCelo: any,
    nonVotingLockedCelo: any,
    votingLockedCelo: any
  ) =>
    set((state) => ({
      ...state,
      userBalances: {
        ...state.userBalances,
        totalCelo,
        unlockedCelo,
        votingLockedCelo,
        nonVotingLockedCelo,
      },
    })),
}));

export default useStore;
