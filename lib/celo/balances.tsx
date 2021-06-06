import { ContractKit } from "@celo/contractkit";

export const getCELOBalance = async (kit: ContractKit, address: string) => {
  const goldToken = await kit.contracts.getGoldToken();
  const goldTokenBalance = await goldToken.balanceOf(address);
  return goldTokenBalance;
};

export const getNonVotingLockedGold = async (
  kit: ContractKit,
  address: string
) => {
  const lockedGold = await kit.contracts.getLockedGold();
  const nonVotingLockedGold = await lockedGold.getAccountNonvotingLockedGold(
    address
  );

  return nonVotingLockedGold;
};

export const getVotingCelo = async (kit: ContractKit, address: string) => {
  const lockedGold = await kit.contracts.getLockedGold();
  const totalLockedGold = await lockedGold.getAccountTotalLockedGold(address);
  const nonVotingLockedGold = await lockedGold.getAccountNonvotingLockedGold(
    address
  );

  return totalLockedGold.minus(nonVotingLockedGold).abs();
};
