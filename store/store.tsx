import create from "zustand";
import BigNumber from "bignumber.js";

type UserBalancesType = {
  totalCelo: BigNumber;
  unlockedCelo: BigNumber;
  nonVotingLockedCelo: BigNumber;
  votingLockedCelo: BigNumber;
  unlockingCelo: BigNumber;
  withdrawableCelo: BigNumber;
};

interface StoreState {
  user: string;
  userBalances: UserBalancesType;
  network: string;
  hasActivatableVotes: boolean;
  setHasActivatableVotes(has: boolean): void;
  setUser(user: string): void;
  setNetwork(network: string): void;
  setTotalCelo(totalCelo: BigNumber): void;
  setUnlockedCelo(unlockedCelo: BigNumber): void;
  setNonVotingLockedCelo(nonVotingLockedCelo: BigNumber): void;
  setVotingLockedCelo(votingLockedCelo: BigNumber): void;
  setUnlockingCelo(unlockingCelo: BigNumber): void;
  setWithdrawableCelo(withdrawableCelo: BigNumber): void;
}

const useStore = create<StoreState>((set) => ({
  user: "",
  setUser: (user: string) => set((state) => ({ ...state, user: user })),

  network: "",
  setNetwork: (network: string) =>
    set((state) => ({ ...state, network: network })),
  hasActivatableVotes: false,
  setHasActivatableVotes: (has: boolean) =>
    set((state) => ({ ...state, hasActivatableVotes: has })),
  userBalances: {
    totalCelo: new BigNumber(0),
    unlockedCelo: new BigNumber(0),
    nonVotingLockedCelo: new BigNumber(0),
    votingLockedCelo: new BigNumber(0),
    unlockingCelo: new BigNumber(0),
    withdrawableCelo: new BigNumber(0),
  },

  setTotalCelo: (totalCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, totalCelo },
    })),
  setUnlockedCelo: (unlockedCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, unlockedCelo },
    })),
  setNonVotingLockedCelo: (nonVotingLockedCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, nonVotingLockedCelo },
    })),
  setVotingLockedCelo: (votingLockedCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, votingLockedCelo },
    })),
  setUnlockingCelo: (unlockingCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, unlockingCelo },
    })),
  setWithdrawableCelo: (withdrawableCelo: BigNumber) =>
    set((state) => ({
      ...state,
      userBalances: { ...state.userBalances, withdrawableCelo },
    })),
}));

export default useStore;
