import { ContractKit } from "@celo/contractkit";
import { BigNumber } from "bignumber.js";
import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";
import { GroupVote } from "@celo/contractkit/lib/wrappers/Election";
import { ValidatorGroup } from "@celo/contractkit/lib/wrappers/Validators";

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

type FetchPendingWithdrawalsResult = {
  totalCeloUnlocking: BigNumber;
  totalCeloWithdrawable: BigNumber;
  pendingWithdrawals: PendingWithdrawal[];
};

export async function fetchPendingWithdrawals(
  kit: ContractKit,
  address: string
): Promise<FetchPendingWithdrawalsResult> {
  const lockedGold = await kit.contracts.getLockedGold();
  const pendingWithdrawals: PendingWithdrawal[] =
    await lockedGold.getPendingWithdrawals(address);

  let totalCeloUnlocking = new BigNumber(0);
  let totalCeloWithdrawable = new BigNumber(0);

  const currentTime = Math.round(new Date().getTime() / 1000);
  for (let i = 0; i < pendingWithdrawals.length; i++) {
    const currentWithdrawal = pendingWithdrawals[i];

    if (currentWithdrawal.time.isLessThan(currentTime)) {
      totalCeloWithdrawable = totalCeloWithdrawable.plus(
        currentWithdrawal.value
      );
    } else {
      totalCeloUnlocking = totalCeloUnlocking.plus(currentWithdrawal.value);
    }
  }

  return { totalCeloUnlocking, totalCeloWithdrawable, pendingWithdrawals };
}

export const getVotingSummary = async (
  kit: ContractKit,
  address: string
): Promise<GroupVote[]> => {
  let groupVotes: GroupVote[] = [];
  const elections = await kit.contracts.getElection();
  const groupsVotedByAccount: string[] =
    await elections.getGroupsVotedForByAccount(address);

  for (let vg of groupsVotedByAccount) {
    const groupVote: GroupVote = await elections.getVotesForGroupByAccount(
      address,
      vg
    );
    groupVotes.push(groupVote);
  }

  return groupVotes;
};

export const getVGName = async (
  kit: ContractKit,
  groupAddress: string
): Promise<string> => {
  const validators = await kit.contracts.getValidators();
  const group: ValidatorGroup = await validators.getValidatorGroup(
    groupAddress,
    false
  );
  return group.name;
};

export const hasActivatablePendingVotes = async (
  kit: ContractKit,
  address: string
): Promise<boolean> => {
  const elections = await kit.contracts.getElection();
  return await elections.hasActivatablePendingVotes(address);
};
