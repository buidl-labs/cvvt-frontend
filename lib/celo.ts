import { ContractKit } from "@celo/contractkit";
import { BigNumber } from "bignumber.js";
import { PendingWithdrawal } from "@celo/contractkit/lib/wrappers/LockedGold";
import { GroupVote } from "@celo/contractkit/lib/wrappers/Election";
import { ValidatorGroup } from "@celo/contractkit/lib/wrappers/Validators";
import { EpochReward } from "./types";

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

export const fetchEpochRewards = async (
  kit: ContractKit,
  address: string
): Promise<EpochReward[]> => {
  const validators = await kit.contracts.getValidators();
  const epochSize = (await validators.getEpochSize()).toNumber();
  const blockN = await kit.web3.eth.getBlockNumber();
  const epochNow = getEpochFromBlock(blockN, epochSize);

  const unitsPerEpoch = await fetchUnitsPerEpoch(kit, [address], epochNow);
  const groupSet = new Set();
  unitsPerEpoch.forEach((v) => v.forEach((units, k) => groupSet.add(k)));
  const groups = Array.from(groupSet.values());
  if (groups.length == 0) return []; // no rewards

  const unitsByGroup = await fetchGroupUnitsPerEpoch(kit, groups, epochNow);

  const rewardsByGroup = await fetchGroupRewardsPerEpoch(kit, groups);

  const byEpoch = new Map();
  unitsPerEpoch.forEach((unitsPerG, epoch) => {
    let asGold = byEpoch.get(epoch) || new BigNumber(0);
    unitsPerG.forEach((units, group) => {
      const unitsTotal = unitsByGroup.get(group)?.get(epoch);
      const rewardTotal = rewardsByGroup.get(group)?.get(epoch);
      if (rewardTotal) {
        const delta = rewardTotal
          .multipliedBy(units)
          .dividedToIntegerBy(unitsTotal);
        asGold = asGold.plus(delta);
      }
    });
    if (asGold.gt(0)) {
      byEpoch.set(epoch, asGold);
    }
  });

  return Array.from(byEpoch.entries()).map(([epoch, v]) => ({
    epoch: epoch,
    reward: v,
  }));
};

export function getEpochFromBlock(block, epochSize) {
  if (block == 0) return 0;

  let epochNumber = Math.floor(block / epochSize);
  if (block % epochSize == 0) {
    return epochNumber;
  } else {
    return epochNumber + 1;
  }
}

async function fetchUnitsPerEpoch(kit, addresses, epochNow) {
  const validators = await kit.contracts.getValidators();
  const epochSize = (await validators.getEpochSize()).toNumber();
  const electionDirect = await kit._web3Contracts.getElection();

  const activateEvents = await electionDirect.getPastEvents(
    "ValidatorGroupVoteActivated",
    { fromBlock: 0, filter: { account: addresses } }
  );
  const revokeEvents = await electionDirect.getPastEvents(
    "ValidatorGroupActiveVoteRevoked",
    { fromBlock: 0, filter: { account: addresses } }
  );

  const unitsPerEpoch = new Map();
  for (const event of activateEvents) {
    const group = event.returnValues.group;
    const epochFirst = getEpochFromBlock(event.blockNumber, epochSize);
    const units = new BigNumber(event.returnValues.units);

    for (let epoch = epochFirst; epoch < epochNow; epoch += 1) {
      let unitsPerG = unitsPerEpoch.get(epoch);
      if (!unitsPerG) {
        unitsPerG = new Map();
        unitsPerEpoch.set(epoch, unitsPerG);
      }
      unitsPerG.set(group, units.plus(unitsPerG.get(group) || 0));
    }
  }

  for (const event of revokeEvents) {
    const group = event.returnValues.group;
    const epochFirst = getEpochFromBlock(event.blockNumber, epochSize);
    const units = new BigNumber(event.returnValues.units);
    for (let epoch = epochFirst; epoch < epochNow; epoch += 1) {
      let unitsPerG = unitsPerEpoch.get(epoch);
      if (!unitsPerG) {
        unitsPerG = new Map();
        unitsPerEpoch.set(epoch, unitsPerG);
      }
      const unitsNew = unitsPerG.get(group)?.minus(units);
      if (unitsNew.lt(0)) {
        throw new Error(`units must never be negative: ${group} ${epoch}`);
      } else if (unitsNew.eq(0)) {
        unitsPerG.delete(group);
        if (unitsPerG.size === 0) {
          unitsPerEpoch.delete(epoch);
        }
      } else {
        unitsPerG.set(group, unitsNew);
      }
    }
  }
  return unitsPerEpoch;
}

async function fetchGroupUnitsPerEpoch(kit, groups, epochNow) {
  const validators = await kit.contracts.getValidators();
  const epochSize = (await validators.getEpochSize()).toNumber();
  const electionDirect = await kit._web3Contracts.getElection();

  const activateEvents = await electionDirect.getPastEvents(
    "ValidatorGroupVoteActivated",
    { fromBlock: 0, filter: { group: groups } }
  );
  const revokeEvents = await electionDirect.getPastEvents(
    "ValidatorGroupActiveVoteRevoked",
    { fromBlock: 0, filter: { group: groups } }
  );
  const unitsByGroup = new Map();

  for (const event of activateEvents) {
    const group = event.returnValues.group;
    const epochFirst = getEpochFromBlock(event.blockNumber, epochSize);
    const units = new BigNumber(event.returnValues.units);

    let unitsPerEpoch = unitsByGroup.get(group);
    if (!unitsPerEpoch) {
      unitsPerEpoch = new Map();
      unitsByGroup.set(group, unitsPerEpoch);
    }
    for (let epoch = epochFirst; epoch < epochNow; epoch += 1) {
      unitsPerEpoch.set(epoch, units.plus(unitsPerEpoch.get(epoch) || 0));
    }
  }

  for (const event of revokeEvents) {
    const group = event.returnValues.group;
    const epochFirst = getEpochFromBlock(event.blockNumber, epochSize);
    const units = new BigNumber(event.returnValues.units);

    const unitsPerEpoch = unitsByGroup.get(group);
    for (let epoch = epochFirst; epoch < epochNow; epoch += 1) {
      const unitsNew = unitsPerEpoch.get(epoch)?.minus(units);
      if (unitsNew.lt(0)) {
        throw new Error(`units must never be negative: ${group} ${epoch}`);
      } else if (unitsNew.eq(0)) {
        unitsPerEpoch.delete(epoch);
        if (unitsPerEpoch.size === 0) {
          unitsByGroup.delete(group);
        }
      } else {
        unitsPerEpoch.set(epoch, unitsNew);
      }
    }
  }
  return unitsByGroup;
}

async function fetchGroupRewardsPerEpoch(kit, groups) {
  const validators = await kit.contracts.getValidators();
  const epochSize = (await validators.getEpochSize()).toNumber();
  const electionDirect = await kit._web3Contracts.getElection();

  const events = await electionDirect.getPastEvents(
    "EpochRewardsDistributedToVoters",
    { fromBlock: 0, filter: { group: groups } }
  );

  const r = new Map();

  for (const event of events) {
    const group = event.returnValues.group;
    const epoch = getEpochFromBlock(event.blockNumber, epochSize);
    const value = new BigNumber(event.returnValues.value);
    let perEpoch = r.get(group);
    if (!perEpoch) {
      perEpoch = new Map();
      r.set(group, perEpoch);
    }
    perEpoch.set(epoch, value.plus(perEpoch.get(epoch) || 0));
  }
  return r;
}
